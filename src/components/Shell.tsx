import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Shell(){
  const {user,logout}=useAuth()
  const nav=useNavigate()
  return(
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow:1}}>Far7tna Admin</Typography>
          <Button color="inherit" component={Link} to="/admin/categories">Categories</Button>
          {user? <Button color="inherit" onClick={()=>{logout();nav('/login')}}>Logout</Button>
               : <Button color="inherit" component={Link} to="/login">Login</Button>}
        </Toolbar>
      </AppBar>
      <Container sx={{py:3}}><Outlet/></Container>
    </Box>
  )
}
