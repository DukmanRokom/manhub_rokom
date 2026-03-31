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
  Fab,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../contexts/AuthContext';
import { googleSheetsService, LakipData, convertDriveLink } from '../services/googleSheets';

export default function LakipPage() {
  const { isLoggedIn } = useAuth();
  const [data, setData] = useState<LakipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<LakipData | null>(null);
  const [formData, setFormData] = useState<Omit<LakipData, 'id'>>({
    tahun: '',
    nama: '',
    url: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await googleSheetsService.fetchLakipData();
      setData(result.sort((a, b) => b.tahun.localeCompare(a.tahun)));
    } catch (error) {
      console.error('Error loading LAKIP data:', error);
      setNotification({ open: true, message: 'Gagal memuat data LAKIP', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ tahun: new Date().getFullYear().toString(), nama: '', url: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (item: LakipData) => {
    setEditingItem(item);
    setFormData({
      tahun: item.tahun,
      nama: item.nama,
      url: item.url,
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
        await googleSheetsService.updateLakipRow({ ...formData, id: editingItem.id });
        setNotification({ open: true, message: 'Laporan berhasil diperbarui', severity: 'success' });
      } else {
        await googleSheetsService.addLakipRow(formData);
        setNotification({ open: true, message: 'Laporan berhasil ditambahkan', severity: 'success' });
      }
      handleCloseDialog();
      setTimeout(loadData, 1000);
    } catch (error) {
      console.error('Error saving LAKIP data:', error);
      setNotification({ open: true, message: 'Gagal menyimpan laporan', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await googleSheetsService.deleteLakipRow(id);
        setNotification({ open: true, message: 'Laporan berhasil dihapus', severity: 'success' });
        setTimeout(loadData, 1000);
      } catch (error) {
        console.error('Error deleting LAKIP data:', error);
        setNotification({ open: true, message: 'Gagal menghapus laporan', severity: 'error' });
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
            LAKIP
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Laporan Akuntabilitas Kinerja Instansi Pemerintah per tahun.
          </Typography>
        </Box>
        {isLoggedIn && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ px: 3, fontWeight: 700 }}
          >
            Tambah Laporan
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : data.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, background: 'rgba(0,184,172,0.03)', border: '1px dashed', borderColor: 'divider' }}>
          <PictureAsPdfIcon sx={{ fontSize: 60, color: 'divider', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Belum ada laporan LAKIP</Typography>
          {isLoggedIn && (
            <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpenAdd}>Tambah Laporan Pertama</Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
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
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  },
                  '&:hover .actions': { opacity: 1 },
                  '&:hover .overlay': { opacity: 1 }
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '141%', overflow: 'hidden', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.url && item.url.includes('drive.google.com') ? (
                    <CardMedia
                      component="img"
                      image={convertDriveLink(item.url)}
                      alt={item.nama}
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback Icon / State */}
                  <Box 
                    className="fallback"
                    sx={{ 
                      display: item.url && item.url.includes('drive.google.com') ? 'none' : 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 0,
                      background: '#f8fafb'
                    }}
                  >
                    <Box
                      component="img"
                      src="/src/assets/lakip_fallback.png"
                      alt="Lakip"
                      sx={{ 
                        width: '70%',
                        height: 'auto',
                        mb: 1,
                        opacity: 0.8
                      }}
                      onError={(e: any) => {
                        e.target.src = 'https://via.placeholder.com/300x424?text=LAKIP';
                      }}
                    />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 900, 
                        color: 'primary.main',
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        position: 'absolute',
                        bottom: '25%',
                        background: 'rgba(255,255,255,0.7)',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      LAKIP
                    </Typography>
                  </Box>
                  
                  {/* Overlay on hover */}
                  <Box 
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0,107,99,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      zIndex: 1
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      component="a"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        borderRadius: '20px',
                        background: '#fff',
                        color: 'primary.main',
                        '&:hover': { background: '#f5f5f5' }
                      }}
                    >
                      Buka PDF
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(4px)',
                      color: 'primary.main',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      border: '1px solid rgba(0,0,0,0.05)',
                      zIndex: 2
                    }}
                  >
                    {item.tahun}
                  </Box>

                  {isLoggedIn && (
                    <Box 
                      className="actions"
                      sx={{ 
                        position: 'absolute', 
                        bottom: 12, 
                        right: 12, 
                        display: 'flex', 
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        zIndex: 3
                      }}
                    >
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          sx={{ background: '#fff', '&:hover': { background: '#f5f5f5' }, boxShadow: 2 }} 
                          onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }}
                        >
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hapus">
                        <IconButton 
                          size="small" 
                          sx={{ background: '#fff', '&:hover': { background: '#f5f5f5' }, boxShadow: 2 }} 
                          onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3, color: 'text.primary', minHeight: '2.6em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.nama}
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
          {editingItem ? 'Edit Laporan LAKIP' : 'Tambah Laporan LAKIP'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Tahun"
                fullWidth
                type="number"
                value={formData.tahun}
                onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nama Laporan"
                fullWidth
                placeholder="Contoh: Lakip Perwakilan Tahun 2024"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="URL Google Drive PDF"
                fullWidth
                placeholder="https://drive.google.com/..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">Batal</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={submitting || !formData.nama || !formData.url || !formData.tahun}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ px: 4, fontWeight: 700 }}
          >
            {submitting ? 'Menyimpan...' : 'Simpan Laporan'}
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
