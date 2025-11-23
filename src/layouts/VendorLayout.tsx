// src/layouts/VendorLayout.tsx
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

export default function VendorLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Far7tna – Vendor
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              component={NavLink}
              to="/vendor/dashboard"
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/vendor/my-services"
            >
              My Services
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/vendor/my-products"
            >
              My Products
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/vendor/bookings"
            >
              Bookings
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/vendor/notifications"
            >
              Notifications
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
