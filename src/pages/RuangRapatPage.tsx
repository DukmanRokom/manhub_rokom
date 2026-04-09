import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RefreshIcon from '@mui/icons-material/Refresh';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import SendIcon from '@mui/icons-material/Send';
import { googleSheetsService, RoomBooking } from '../services/googleSheets';

const RUANGAN_LIST = [
  { id: 'naranta', name: 'Ruang Naranta', capacity: '20 Orang', color: '#1a73e8' },
  { id: '104a', name: 'Ruang 104 A', capacity: '10 Orang', color: '#d93025' },
  { id: '104b', name: 'Ruang 104 B', capacity: '15 Orang', color: '#188038' },
];

const NAMA_PEMOHON = [
  'ABDUL SURYADI', 'ACHMAD SYAUKI', 'AJI MUHAWARMAN, ST, MKM', 'ALDI RAHMANDA PUTRA',
  'ALDO PUTRA MEIZAHNI', 'ANDINI PURWISIWI, S.I.Kom', 'ARIESHA WIDIPUSPITA, S.IP',
  'AWALLOKITA MAYANGSARI, SKM', 'AYU ISWATI HANDAYANI, SST.Pa', 'BENY HARI NUGROHO, S.E.',
  'BIMOSAKTI SABILI MEDITERANIO, S.S.I.', 'CHASTITY YIZLIA PHILADELVIA, S.I.Kom.',
  'CHIARA SOTYA INDHIRA, S.Kom', 'DANANG TRIYOGOJATMIKO, S.Kom',
  'DANIEL OBERTONDINO SIMANJUNTAK, S.I.Kom.', 'DARU MAHENDRAS WARA, S.E.',
  'DEDE LUKMAN HAKIM, S.Sos', 'DELTA FITRIANA, SE', 'DESI HANGGONO RARASATI, S.IP.',
  'DEWI JANNATI AMINAH NUR, S.I.Kom', 'DODI SUKMANA, S.I.Kom', 'DWI HANDRIYANI, S.Sos, MKM',
  'DWI SARI RACHMAWATI, S.Hum, M.Hum', 'EKA PURNAMASARI, S.Si', 'EKO BUDIHARJO',
  'ENDANG TRI WIDIYASTUTI, A.Md', 'ERNAWATI', 'EVAWANTI ANGGRISTIANNA WARSITO, S.T',
  'FERLIYANDA, S.Kom', 'FERRI SATRIYANI DOMESTIK, SKM', 'GALIH PERMANA, SE, MKM',
  'GIRI INAYAH ABDULLAH, S.Sos, MKM', 'HENDY YUDISTIRA, S.I.Kom',
  'IIN FATMAH HALIMATUS SA\'DIYAH, SKM', 'IKA FEBRYANA, A.Md. Keb.', 'IKA SURYANI, A.md.',
  'INRI DENNA, S.Sos, MAHCM', 'ISMIYATUN', 'JENI HELEN CHRONIKA SITORUS, SH',
  'JHOSUA VALENTINO SIMANJUNTAK, S.S.I.', 'JOHAN SAFARI, SKM, MPH.', 'JUNI WIDIYASTUTI, SKM. MPA',
  'JUPRI WAHYUDIN, A.Md', 'KARTIKA INDRA SUSILOWATI, S.Kom', 'KHALIL GIBRAN ASTARENGGA, ST',
  'LELEN EFRITA, SE', 'LILI KARTIKA SARI HRP, A.Md.Keb', 'LUAY, S.Sos', 'MARTIN GINTING',
  'MAULIANA ASRI, S.Sos', 'MOCHAMAD AGUNG WAHYUDIN, S.Kom', 'MOCHAMAD NUR PRASETYO',
  'MOHAMAD IRSYAD, S.E.', 'MUHAMAD HATA', 'MUHAMMAD LUTFHI WALIYUDDIN, S.TP.', 'MULI YADI, S.E',
  'MURSILAWATI, S.I.Kom', 'MUSTIKA FATMAWATI, S.I.P', 'NANI INDRIANA, SKM., MKM', 'NIDA KHAIRANI',
  'NOVELIA VERONICA PUTRI, A.Md.', 'NURFATA ALIEM PRABOWO, S.Kom', 'NURUZ ZAMAN, SHI', 'NUSIRWAN, SS',
  'OKTO RUSDIANTO, ST', 'PRASTIWI HANDAYANI, SKM, MKM', 'PRAWITO, SKM, MM', 'QONITA RIZKA MARLI, S.Sos',
  'RAGIL ROMLY, S.I.Kom. M.I.Kom', 'REIZA MUHAMMAD IQBAL, A.Md', 'RESTY KIANTINI, SKM, M.Kes',
  'RICKI HAMDANI, S.E', 'RIFANY, S.Sos', 'RINA WAHYU WIJAYANI, SE, MKM', 'SAHEFUL HIDAYAT, S.Sos',
  'SANTY KOMALASARI, S.Kom, MKM', 'SATRIA LOKA WIDJAYA, S.Kom.I.', 'SUBKHAN, S.Pd, MM', 'SUKAJI, S.M',
  'SUKMAWATI, S.E.', 'SUMARDIONO, SE', 'TEGUH MARTONO, S.Sos', 'TRI SEPTI SUPRIHATINI, SE',
  'UTAMI WIDYASIH, A.Md', 'WAYANG MAS JENDRA, S.Sn', 'WIDYA P.SAKUL, S.Kom', 'WILLY RICARDO',
  'WINNE WIDIANTINI, SKM, MKM', 'YASMEEN AFIFAH, S.I.Kom.', 'YESI MAIZURESTI, S.E', 'ZAHRUDIN'
];

const UNIT_KERJA = [
  'Timker Pengelolaan Perpustakaan', 'Timker Hubungan Media dan Kelembagaan',
  'Timker Penguatan Pelayanan Publik', 'Timker Pelayanan Informasi dan Pengaduan Masyarakat',
  'Timker Komunikasi Internal dan Kehumasan', 'Timker Strategi Komunikasi',
  'Timker Peliputan dan Dokumentasi', 'Timker Publikasi Media', 'Timker Dukungan Manajemen'
];

const INITIAL_FORM_STATE: RoomBooking = {
  ruangan: '',
  namapemohon: '',
  unitkerja: '',
  tanggal: new Date().toISOString().split('T')[0],
  jammulai: '',
  jamselesai: '',
  agenda: '',
};

export default function RuangRapatPage() {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(new Date());
  const [form, setForm] = useState<RoomBooking>(INITIAL_FORM_STATE);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await googleSheetsService.getRoomBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch room bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Auto-update status every minute (re-render)
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await googleSheetsService.submitRoomBooking(form);
      setSnackbar({ open: true, message: 'Permohonan berhasil dikirim!', severity: 'success' });
      setForm(INITIAL_FORM_STATE);
      fetchBookings();
    } catch (error) {
      setSnackbar({ open: true, message: 'Gagal mengirim permohonan.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const todayStr = `${y}-${m}-${d}`;

  // Helper to convert HH:mm or HH.mm to total minutes for safe comparison
  const timeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const cleanTime = timeStr.replace('.', ':');
    const [hours, minutes] = cleanTime.split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  };

  const isToday = (dateStr: string) => {
    if (!dateStr) return false;
    const cleanDate = dateStr.split('T')[0]; // Handle possible ISO strings
    if (cleanDate.includes('-')) return cleanDate === todayStr;
    if (cleanDate.includes('/')) {
      const parts = cleanDate.split('/');
      const formatted = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      return formatted === todayStr;
    }
    return false;
  };

  const todayBookings = bookings.filter(b => isToday(b.tanggal));

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)',
              color: '#fff',
              display: 'flex'
            }}
          >
            <MeetingRoomIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Peminjaman Ruang Rapat
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              Monitoring penggunaan ruang rapat Biro Komunikasi dan Pelayanan Publik
            </Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '0.875rem', fontWeight: 600, mt: 0.5 }}>
              PIC : Zahrudin
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={fetchBookings}
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Room Status Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {RUANGAN_LIST.map((room) => {
          // Robust hour/minute extraction regardless of browser locale
          const nowHours = now.getHours();
          const nowMinutes = now.getMinutes();
          const currentTotalMinutes = nowHours * 60 + nowMinutes;
          
          const isBookedNow = todayBookings.some(b => {
             if (b.ruangan !== room.name) return false;
             
             const startMinutes = timeToMinutes(b.jammulai);
             const endMinutes = timeToMinutes(b.jamselesai);
             
             // Check if current time is within range
             return currentTotalMinutes >= startMinutes && currentTotalMinutes < endMinutes;
          });

          return (
            <Grid item xs={12} md={4} key={room.id}>
              <Card sx={{ borderRadius: 4, borderTop: `6px solid ${room.color}`, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>{room.name}</Typography>
                    <Chip
                      label={isBookedNow ? "Sedang Digunakan" : "Tersedia"}
                      color={isBookedNow ? "error" : "success"}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
                    <GroupsIcon fontSize="small" />
                    <Typography variant="body2">Kapasitas: {room.capacity}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Lokasi: Lantai 1, Gedung Ahdiyatma
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Booking Form Card */}
      <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', mb: 6, overflow: 'visible' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: 'primary.main' }}>
            Formulir Permohonan Ruangan
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Pilih Ruangan"
                  value={form.ruangan}
                  onChange={(e) => setForm({ ...form, ruangan: e.target.value })}
                  required
                >
                  {RUANGAN_LIST.map((room) => (
                    <MenuItem key={room.id} value={room.name}>{room.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Nama Pemohon"
                  value={form.namapemohon}
                  onChange={(e) => setForm({ ...form, namapemohon: e.target.value })}
                  required
                >
                  {NAMA_PEMOHON.map((name) => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Unit Kerja"
                  value={form.unitkerja}
                  onChange={(e) => setForm({ ...form, unitkerja: e.target.value })}
                  required
                >
                  {UNIT_KERJA.map((unit) => (
                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Tanggal Rapat"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="time"
                  label="Jam Mulai"
                  value={form.jammulai}
                  onChange={(e) => setForm({ ...form, jammulai: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="time"
                  label="Jam Selesai"
                  value={form.jamselesai}
                  onChange={(e) => setForm({ ...form, jamselesai: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Agenda Kegiatan"
                  value={form.agenda}
                  onChange={(e) => setForm({ ...form, agenda: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, textTransform: 'none', fontSize: '1rem' }}
                >
                  {submitting ? 'Mengirim...' : 'Kirim Permohonan'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Today's Bookings */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon color="primary" /> Peminjaman Hari Ini
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : todayBookings.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
            <Typography sx={{ color: 'text.secondary' }}>Tidak ada jadwal rapat untuk hari ini.</Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {todayBookings.map((b, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e2e8f0' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>{b.ruangan}</Typography>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>{b.agenda}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: '0.9rem' }} />
                      <Typography variant="caption">{b.jammulai} - {b.jamselesai}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>Pemohon: {b.namapemohon} ({b.unitkerja})</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* All Bookings Table */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
          Riwayat Peminjaman Lengkap
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Ruangan</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Waktu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Pemohon</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Agenda</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center"><CircularProgress size={24} /></TableCell></TableRow>
              ) : bookings.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center">Belum ada data peminjaman.</TableCell></TableRow>
              ) : (
                [...bookings].reverse().slice(0, 10).map((b, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{b.ruangan}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{b.tanggal}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{b.jammulai} - {b.jamselesai}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{b.namapemohon}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{b.unitkerja}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 250 }}>{b.agenda}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Feedback Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          variant="filled" 
          sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
