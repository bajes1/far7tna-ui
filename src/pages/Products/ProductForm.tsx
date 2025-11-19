import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { http } from '../../api/http';
import { useTranslation } from 'react-i18next';


export default function ProductForm(){
  const { t } = useTranslation(); const { id } = useParams(); const nav = useNavigate(); const isEdit = Boolean(id);
  const [name, setName] = useState(''); const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0); const [stock, setStock] = useState<number>(0); const [vendorId, setVendorId] = useState<string>('');
  useEffect(()=>{ (async ()=>{
    const vs = await http.get('/vendor/search', { params: { page:1, pageSize:50 } }); const first = vs.data.data?.[0]?.id || ''; setVendorId(first);
    if (isEdit){ const { data } = await http.get(`/product/${id}`); const p = data.data; setName(p.name); setDescription(p.description || ''); setPrice(p.price); setStock(p.stock); setVendorId(p.vendorId); }
  })(); }, [id]);
  const submit = async () => { const dto = { id: id || crypto.randomUUID(), name, description, price, stock, vendorId }; if (isEdit) await http.put(`/product/${id}`, dto); else await http.post('/product', dto); nav('/products'); };
  return (<Stack alignItems='center'>
    <Card sx={{ maxWidth: 640, width: '100%' }}><CardContent>
      <Typography variant='h5' gutterBottom>{isEdit ? t('edit') : t('add')} {t('products')}</Typography>
      <Stack spacing={2}>
        <TextField label={t('name')} value={name} onChange={e=>setName(e.target.value)} />
        <TextField label='Description' value={description} onChange={e=>setDescription(e.target.value)} />
        <TextField label={t('price')} type='number' value={price} onChange={e=>setPrice(parseFloat(e.target.value))} />
        <TextField label={t('stock')} type='number' value={stock} onChange={e=>setStock(parseInt(e.target.value))} />
        <TextField label={t('vendor')} value={vendorId} onChange={e=>setVendorId(e.target.value)} />
        <Button variant='contained' onClick={submit}>{t('save')}</Button>
      </Stack>
    </CardContent></Card>
  </Stack>);
}