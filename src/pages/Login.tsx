import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('admin@far7tna.local')
  const [password,setPassword]=useState('Admin@123')
  const [error,setError]=useState<string|null>(null)
  const {login}=useAuth()
  const nav=useNavigate()
  const loc:any=useLocation()

  async function onSubmit(e:React.FormEvent){
    e.preventDefault()
    try{
      await login(email,password)
      nav(loc.state?.from?.pathname || '/admin/categories', {replace:true})
    }catch(err:any){ setError(err?.response?.data || 'Login failed') }
  }

  return(
    <Stack minHeight="80vh" alignItems="center" justifyContent="center">
      <Card sx={{width:400}}>
        <CardContent>
          <Typography variant="h6" mb={2}>Sign in</Typography>
          <form onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
              <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
              {error && <Typography color="error">{error}</Typography>}
              <Button variant="contained" type="submit">Login</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Stack>
  )
}
