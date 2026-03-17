import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Container,
  Paper,
  Tooltip,
  Avatar,
  Fab,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../contexts/AuthContext';
import { googleSheetsService, EotmData, convertDriveLink } from '../services/googleSheets';

export default function EotmPage() {
  const { isLoggedIn } = useAuth();
  const [data, setData] = useState<EotmData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<EotmData | null>(null);
  const [formData, setFormData] = useState<Omit<EotmData, 'id'>>({
    fotoUrl: '',
    periode: '',
    nama: '',
    jabatan: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await googleSheetsService.fetchEotmData();
      setData(result);
    } catch (error) {
      console.error('Error loading EOTM data:', error);
      setNotification({ open: true, message: 'Gagal memuat data dari Google Sheets', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ fotoUrl: '', periode: '', nama: '', jabatan: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (item: EotmData) => {
    setEditingItem(item);
    setFormData({
      fotoUrl: item.fotoUrl,
      periode: item.periode,
      nama: item.nama,
      jabatan: item.jabatan,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editingItem) {
        await googleSheetsService.updateEotmRow({ ...formData, id: editingItem.id });
        setNotification({ open: true, message: 'Data berhasil diperbarui', severity: 'success' });
      } else {
        await googleSheetsService.addEotmRow(formData);
        setNotification({ open: true, message: 'Data berhasil ditambahkan', severity: 'success' });
      }
      handleCloseDialog();
      // Delay reload slightly to allow Google Sheets to process
      setTimeout(loadData, 1000);
    } catch (error) {
      console.error('Error saving EOTM data:', error);
      setNotification({ open: true, message: 'Gagal menyimpan data', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await googleSheetsService.deleteEotmRow(id);
        setNotification({ open: true, message: 'Data berhasil dihapus', severity: 'success' });
        setTimeout(loadData, 1000);
      } catch (error) {
        console.error('Error deleting EOTM data:', error);
        setNotification({ open: true, message: 'Gagal menghapus data', severity: 'error' });
      }
    }
  };

  const formatPeriod = (period: string) => {
    if (!period) return '';
    // If it looks like an ISO date string
    if (period.includes('T') && period.includes(':')) {
      try {
        const date = new Date(period);
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
      } catch (e) {
        return period;
      }
    }
    return period;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
            Employee of the Month
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Apresiasi bagi pegawai dengan kinerja dan dedikasi terbaik setiap bulannya.
          </Typography>
        </Box>
        {isLoggedIn && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ px: 3, fontWeight: 700 }}
          >
            Tambah EOTM
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : data.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, background: 'rgba(0,184,172,0.03)', border: '1px dashed', borderColor: 'divider' }}>
          <StarIcon sx={{ fontSize: 60, color: 'divider', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Belum ada data Employee of the Month</Typography>
          {isLoggedIn && (
            <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpenAdd}>Tambah Data Pertama</Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {data.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                  '&:hover .actions': { opacity: 1 }
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '130%', overflow: 'hidden', background: '#f0f0f0' }}>
                  <CardMedia
                    component="img"
                    image={convertDriveLink(item.fotoUrl) || 'https://via.placeholder.com/300x400?text=No+Photo'}
                    alt={item.nama}
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top'
                    }}
                    onError={(e: any) => {
                      e.target.src = 'https://via.placeholder.com/300x400?text=Foto+Tidak+Ditemukan';
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(0,111,104,0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#fff',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      border: '1px solid rgba(255,255,255,0.2)',
                      zIndex: 1
                    }}
                  >
                    <StarIcon sx={{ fontSize: 14, color: '#FFD700' }} />
                    {formatPeriod(item.periode)}
                  </Box>

                  {isLoggedIn && (
                    <Box 
                      className="actions"
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12, 
                        display: 'flex', 
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        zIndex: 2
                      }}
                    >
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          sx={{ background: '#fff', '&:hover': { background: '#f5f5f5' } }} 
                          onClick={() => handleOpenEdit(item)}
                        >
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hapus">
                        <IconButton 
                          size="small" 
                          sx={{ background: '#fff', '&:hover': { background: '#f5f5f5' } }} 
                          onClick={() => handleDelete(item.id)}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, fontSize: '1rem', color: 'text.primary' }}>
                    {item.nama}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {item.jabatan}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* FAB for mobile add button */}
      {isLoggedIn && !loading && (
        <Fab 
          color="primary" 
          aria-label="add" 
          sx={{ position: 'fixed', bottom: 32, right: 32, display: { md: 'none' } }}
          onClick={handleOpenAdd}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingItem ? 'Edit Data EOTM' : 'Tambah Data EOTM'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nama Pegawai"
                fullWidth
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Jabatan"
                fullWidth
                value={formData.jabatan}
                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Periode (Contoh: Maret 2025)"
                fullWidth
                value={formData.periode}
                onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="URL Foto"
                fullWidth
                placeholder="https://..."
                value={formData.fotoUrl}
                onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 1, p: 2, background: 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Preview Foto:
                </Typography>
                <Avatar 
                  src={convertDriveLink(formData.fotoUrl)} 
                  variant="rounded" 
                  sx={{ width: 100, height: 130, mx: 'auto', border: '1px solid', borderColor: 'divider' }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">Batal</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={submitting || !formData.nama || !formData.periode}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ px: 4, fontWeight: 700 }}
          >
            {submitting ? 'Menyimpan...' : 'Simpan Data'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} sx={{ width: '100%', fontWeight: 600 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
