import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { useEffect } from 'react';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import MapIcon from '@mui/icons-material/Map';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import { googleSheetsService, VehicleRequest } from '../services/googleSheets';

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

const KENDARAAN = [
  'Isuzu Panther', 'Mitsubishi Xpander', 'Toyota Avanza'
];

const INITIAL_STATE: VehicleRequest = {
  namapemohon: '',
  unitkerja: '',
  kendaraan: '',
  tanggalpeminjaman: '',
  tanggalkembali: '',
  jammulaipeminjaman: '',
  estimasijamkembali: '',
  ruteperjalanandinas: '',
  agendakegiatan: '',
};

export default function KendaraanDinasPage() {
  const [formData, setFormData] = useState<VehicleRequest>(INITIAL_STATE);
  const [requests, setRequests] = useState<VehicleRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchRequests = async () => {
    setFetching(true);
    try {
      const data = await googleSheetsService.getVehicleRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await googleSheetsService.submitVehicleRequest(formData);
      setSnackbar({ open: true, message: 'Formulir peminjaman berhasil dikirim!', severity: 'success' });
      setFormData(INITIAL_STATE);
    } catch (error) {
      setSnackbar({ open: true, message: 'Gagal mengirim formulir. Silakan coba lagi.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #006b63 0%, #00b8ac 100%)',
            color: '#fff',
            display: 'flex'
          }}
        >
          <DirectionsCarIcon fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Peminjaman Kendaraan Dinas
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Formulir permohonan penggunaan kendaraan dinas operasional
          </Typography>
          <Typography sx={{ color: 'primary.main', fontSize: '0.875rem', fontWeight: 600, mt: 0.5 }}>
            PIC : Abdul Suryadi
          </Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid #eef2f6' }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Section: Identitas */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" /> Identitas Pemohon
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Nama Pemohon"
                  name="namapemohon"
                  value={formData.namapemohon}
                  onChange={handleChange}
                  required
                  placeholder="Pilih Nama"
                >
                  {NAMA_PEMOHON.map(name => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Unit Kerja"
                  name="unitkerja"
                  value={formData.unitkerja}
                  onChange={handleChange}
                  required
                >
                  {UNIT_KERJA.map(unit => (
                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Section: Kendaraan */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, mt: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsCarIcon fontSize="small" /> Detail Kendaraan
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Kendaraan"
                  name="kendaraan"
                  value={formData.kendaraan}
                  onChange={handleChange}
                  required
                >
                  {KENDARAAN.map(car => (
                    <MenuItem key={car} value={car}>{car}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Section: Waktu */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, mt: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon fontSize="small" /> Waktu Peminjaman
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tanggal Peminjaman"
                  name="tanggalpeminjaman"
                  type="date"
                  value={formData.tanggalpeminjaman}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tanggal Kembali"
                  name="tanggalkembali"
                  type="date"
                  value={formData.tanggalkembali}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Jam Mulai"
                  name="jammulaipeminjaman"
                  type="time"
                  value={formData.jammulaipeminjaman}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Estimasi Jam Kembali"
                  name="estimasijamkembali"
                  type="time"
                  value={formData.estimasijamkembali}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Section: Tujuan */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, mt: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapIcon fontSize="small" /> Tujuan & Agenda
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Rute Perjalanan Dinas"
                  name="ruteperjalanandinas"
                  value={formData.ruteperjalanandinas}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Kantor Kemenkes - Bandara Soekarno Hatta - Pulang"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Agenda Kegiatan"
                  name="agendakegiatan"
                  value={formData.agendakegiatan}
                  onChange={handleChange}
                  required
                  placeholder="Jelaskan maksud dan tujuan peminjaman kendaraan"
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 8px 16px rgba(0, 184, 172, 0.25)',
                    '&:hover': {
                      boxShadow: '0 12px 20px rgba(0, 184, 172, 0.35)',
                    }
                  }}
                >
                  {loading ? 'Mengirim...' : 'Kirim Permohonan'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Recent Requests Section */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Daftar Peminjaman Terbaru
            </Typography>
            <Chip label="Live Data" size="small" color="success" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
          </Box>
          <Button 
            startIcon={fetching ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />} 
            onClick={fetchRequests}
            disabled={fetching}
            size="small"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Refresh
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eef2f6', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Nama Pemohon</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Unit Kerja</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Kendaraan</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Waktu Perjalanan</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Agenda</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetching && requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>Memuat data...</Typography>
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Belum ada data peminjaman.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.namapemohon}</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{row.unitkerja}</TableCell>
                    <TableCell>
                       <Chip label={row.kendaraan} size="small" sx={{ fontWeight: 500, backgroundColor: '#e6fffa', color: '#006b63' }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{row.tanggalpeminjaman} - {row.tanggalkembali}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.jammulaipeminjaman} s/d {row.estimasijamkembali}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {row.agendakegiatan}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
