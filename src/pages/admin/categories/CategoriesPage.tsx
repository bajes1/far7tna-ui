import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
};

type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

type QueryParams = {
  page: number;
  pageSize: number;
  search: string;
  onlyActive: boolean | null;
};

async function fetchCategories(params: QueryParams) {
  const res = await api.get<PagedResult<Category>>("/api/admin/categories", {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search || undefined,
      isActive: params.onlyActive === null ? undefined : params.onlyActive,
    },
  });
  return res.data;
}

type CategoryFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
};

const emptyForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
};

export default function CategoriesPage() {
  const queryClient = useQueryClient();

  // ======== local filters / pagination state ========
  const [page, setPage] = useState(0); // zero-based لمكون TablePagination
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [onlyActive, setOnlyActive] = useState<boolean | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryFormState | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const queryParams = useMemo<QueryParams>(
    () => ({
      page: page + 1, // API غالباً 1-based
      pageSize,
      search,
      onlyActive,
    }),
    [page, pageSize, search, onlyActive]
  );

  // ======== queries ========
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["categories", queryParams],
    queryFn: () => fetchCategories(queryParams),
    keepPreviousData: true,
  });

  // ======== mutations ========
  const createMutation = useMutation({
    mutationFn: (payload: Omit<CategoryFormState, "id">) =>
      api.post("/api/admin/categories", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CategoryFormState) =>
      api.put(`/api/admin/categories/${payload.id}`, {
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        isActive: payload.isActive,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // ======== handlers ========
  const handleOpenCreate = () => {
    setEditing({ ...emptyForm });
    setDialogOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditing({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      isActive: c.isActive,
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!editing) return;

    const payload: CategoryFormState = editing;

    if (!payload.name.trim()) return;

    if (payload.id) {
      await updateMutation.mutateAsync(payload);
    } else {
      const { id, ...createPayload } = payload;
      await createMutation.mutateAsync(createPayload);
    }

    handleDialogClose();
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  // ======== render ========
  const paged = data ?? {
    items: [] as Category[],
    total: 0,
    page: page + 1,
    pageSize,
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Categories
      </Typography>

      {/* filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Search"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ maxWidth: 300 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={onlyActive === true}
                indeterminate={onlyActive === null}
                onChange={(_, checked) =>
                  setOnlyActive(checked ? true : null)
                }
              />
            }
            label={
              onlyActive === null
                ? "All"
                : onlyActive
                ? "Active only"
                : "Inactive only"
            }
          />
          <Box flexGrow={1} />
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={handleOpenCreate}
          >
            Add Category
          </Button>
        </Stack>
      </Paper>

      {/* table */}
      <Paper>
        {isLoading ? (
          <Box p={3} textAlign="center">
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box p={3} color="error.main">
            {(error as any)?.message ?? "Failed to load categories"}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paged.items.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.slug}</TableCell>
                      <TableCell>{c.description}</TableCell>
                      <TableCell>{c.isActive ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(c)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteId(c.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                  {paged.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={paged.total}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20, 50]}
            />
          </>
        )}

        {isFetching && !isLoading && (
          <Box px={2} pb={1}>
            <Typography variant="caption" color="text.secondary">
              Updating…
            </Typography>
          </Box>
        )}
      </Paper>

      {/* add / edit dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editing?.id ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={editing?.name ?? ""}
              onChange={(e) =>
                setEditing((old) =>
                  old ? { ...old, name: e.target.value } : old
                )
              }
              fullWidth
            />
            <TextField
              label="Slug"
              value={editing?.slug ?? ""}
              onChange={(e) =>
                setEditing((old) =>
                  old ? { ...old, slug: e.target.value } : old
                )
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={editing?.description ?? ""}
              onChange={(e) =>
                setEditing((old) =>
                  old ? { ...old, description: e.target.value } : old
                )
              }
              fullWidth
              multiline
              minRows={2}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editing?.isActive ?? true}
                  onChange={(_, checked) =>
                    setEditing((old) =>
                      old ? { ...old, isActive: checked } : old
                    )
                  }
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* delete confirm (بسيطة بدون Dialog منفصل) */}
      {deleteId && (
        <Dialog
          open={true}
          onClose={() => setDeleteId(null)}
        >
          <DialogTitle>Delete category?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isLoading}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
