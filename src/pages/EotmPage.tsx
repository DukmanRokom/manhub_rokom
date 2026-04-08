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
import HowToVoteIcon from '@mui/icons-material/HowToVote';
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
  
  // Voting URL State
  const [voteUrl, setVoteUrl] = useState('https://docs.google.com/forms/d/e/1FAIpQLSdDzU8iZ-MTRubP-Lkxj_CvLAJx4EZY5tf3Wt4MxlZxAHGqaw/viewform?usp=publish-editor');
  const [editUrlDialogOpen, setEditUrlDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState(voteUrl);
  
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

    // Load Voting URL from Config
    try {
      const configs = await googleSheetsService.fetchConfigs();
      const voteConfig = configs.find(c => c.key === 'eotm_vote_url');
      if (voteConfig && voteConfig.value) {
        setVoteUrl(voteConfig.value);
        setUrlInput(voteConfig.value);
      }
    } catch (error) {
      console.error('Error loading config:', error);
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

  const handleOpenEditUrl = () => {
    setUrlInput(voteUrl);
    setEditUrlDialogOpen(true);
  };

  const handleSaveUrl = async () => {
    setSubmitting(true);
    try {
      await googleSheetsService.updateConfig('eotm_vote_url', urlInput);
      setVoteUrl(urlInput);
      setNotification({ open: true, message: 'URL Voting berhasil diperbarui', severity: 'success' });
      setEditUrlDialogOpen(false);
    } catch (error) {
      console.error('Error saving URL:', error);
      setNotification({ open: true, message: 'Gagal memperbarui URL Voting', severity: 'error' });
    } finally {
      setSubmitting(false);
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

      {/* Voting Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 5, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #006b63 0%, #00b8ac 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          boxShadow: '0 10px 30px rgba(0, 184, 172, 0.2)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              width: 50, 
              height: 50, 
              borderRadius: '15px', 
              background: 'rgba(255,255,255,0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <HowToVoteIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Ayo Berikan Suaramu!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Pilih rekan kerjamu yang paling menginspirasi bulan ini.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            href={voteUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<HowToVoteIcon />}
            sx={{
              background: '#fff',
              color: '#006b63',
              fontWeight: 800,
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              '&:hover': {
                background: '#e0fcf9',
              },
              flexGrow: 1
            }}
          >
            Vote di sini!
          </Button>
          {isLoggedIn && (
            <Tooltip title="Edit URL Voting">
              <IconButton 
                onClick={handleOpenEditUrl}
                sx={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  color: '#fff',
                  '&:hover': { background: 'rgba(255,255,255,0.2)' } 
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Paper>

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

      {/* Edit URL Dialog */}
      <Dialog open={editUrlDialogOpen} onClose={() => setEditUrlDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit URL Voting</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Masukkan URL Google Form atau platform voting lainnya.
            </Typography>
            <TextField
              fullWidth
              label="URL Voting"
              placeholder="https://docs.google.com/forms/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              variant="outlined"
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditUrlDialogOpen(false)} color="inherit">Batal</Button>
          <Button 
            onClick={handleSaveUrl} 
            variant="contained" 
            disabled={submitting || !urlInput}
            sx={{ px: 4, fontWeight: 700 }}
          >
            {submitting ? 'Menyimpan...' : 'Simpan URL'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
