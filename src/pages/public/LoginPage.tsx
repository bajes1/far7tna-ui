// src/pages/public/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { api } from "../../lib/api";
import type { AuthResult } from "../../auth/authStore";
import { setAuth } from "../../auth/authStore";


export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post<AuthResult>("/api/auth/login", {
        email,
        password,
      });

      const result = res.data;
      setAuth(result);

      const role = result.user.role?.toLowerCase();

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "vendor") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Invalid email or password.";
      setError(typeof msg === "string" ? msg : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={1}>
          Far7tna – Login
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          سجل دخولك للوحة التحكم حسب نوع الحساب (Admin / Vendor / Customer)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, py: 1.2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={22} />
            ) : (
              "Login"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
