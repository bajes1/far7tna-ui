import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api"; // عدّل المسار إذا ملف api.ts في مكان مختلف

// نفس الـ DTO تقريباً
type Category = {
  id: string;
  name: string;
  slug: string;
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
  onlyActive: boolean;
};

type CategoryFormState = {
  id?: string;
  name: string;
  slug: string;
  isActive: boolean;
};

const emptyForm: CategoryFormState = {
  name: "",
  slug: "",
  isActive: true,
};

// ====== API ======
async function fetchCategories(
  params: QueryParams
): Promise<PagedResult<Category>> {
  const res = await api.get<PagedResult<Category>>("/api/admin/categories", {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search || undefined,
      isActive: params.onlyActive ? true : undefined,
    },
  });
  return res.data;
}

export default function CategoriesPage() {
  const queryClient = useQueryClient();

  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    pageSize: 10,
    search: "",
    onlyActive: false,
  });

  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<PagedResult<Category>, Error>({
    queryKey: ["categories", queryParams],
    queryFn: () => fetchCategories(queryParams),
  });

  const saveMutation = useMutation({
    mutationFn: async (model: CategoryFormState) => {
      if (model.id) {
        await api.put(`/api/admin/categories/${model.id}`, model);
      } else {
        await api.post("/api/admin/categories", model);
      }
    },
    onSuccess: () => {
      setEditOpen(false);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleEdit = (c: Category) => {
    setForm({
      id: c.id,
      name: c.name,
      slug: c.slug,
      isActive: c.isActive,
    });
    setEditOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <Box p={3}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setForm(emptyForm);
            setEditOpen(true);
          }}
        >
          Add Category
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Search"
          size="small"
          value={queryParams.search}
          onChange={(e) =>
            setQueryParams((p) => ({ ...p, page: 1, search: e.target.value }))
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={queryParams.onlyActive}
              onChange={(e) =>
                setQueryParams((p) => ({
                  ...p,
                  page: 1,
                  onlyActive: e.target.checked,
                }))
              }
            />
          }
          label="Only active"
        />
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5}>Loading...</TableCell>
            </TableRow>
          )}
          {!isLoading &&
            items.map((c: Category) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.slug}</TableCell>
                <TableCell>{c.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {new Date(c.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEdit(c)}>
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
          {!isLoading && items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>No data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Typography mt={1} variant="body2">
        Total: {total}
      </Typography>

      {/* Add / Edit dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <DialogTitle>
          {form.id ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Name"
                fullWidth
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <TextField
                label="Slug"
                fullWidth
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isActive: e.target.checked }))
                    }
                  />
                }
                label="Active"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saveMutation.isPending}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
      >
        <DialogTitle>Delete category</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (deleteId) deleteMutation.mutate(deleteId);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
