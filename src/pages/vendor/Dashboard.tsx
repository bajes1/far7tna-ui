import { Card, CardContent, Grid, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Vendor Dashboard</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card><CardContent><Typography>My Services</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card><CardContent><Typography>Bookings</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card><CardContent><Typography>Notifications</Typography></CardContent></Card>
      </Grid>
    </Grid>
  );
}
