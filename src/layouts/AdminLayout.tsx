// src/layouts/AdminLayout.tsx
import { Outlet, NavLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Stack,
  Container,
} from "@mui/material";

export default function AdminLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Far7tna – Admin
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              component={NavLink}
              to="/admin/dashboard"
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/admin/categories"
            >
              Categories
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/admin/vendors"
            >
              Vendors
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/admin/services"
            >
              Services
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/admin/users"
            >
              Users
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* هون بتظهر صفحات الأدمن الداخلية */}
        <Outlet />
      </Container>
    </Box>
  );
}
