// src/layouts/CustomerLayout.tsx
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

export default function CustomerLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Far7tna – Customer
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              component={NavLink}
              to="/customer/dashboard"
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/customer/my-bookings"
            >
              My Bookings
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/customer/my-reviews"
            >
              My Reviews
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/customer/profile"
            >
              Profile
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
