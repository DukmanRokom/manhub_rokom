import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentCheckIcon from '@mui/icons-material/AssignmentTurnedIn';
import SpeedIcon from '@mui/icons-material/Speed';

const MOCK_IKI = [
  { id: 1, kpi: 'Persentase penyelesaian laporan tepat waktu', target: 100, realisasi: 95, unit: '%' },
  { id: 2, kpi: 'Jumlah publikasi media per bulan', target: 20, realisasi: 18, unit: 'Konten' },
  { id: 3, kpi: 'Indeks kepuasan layanan internal', target: 4.5, realisasi: 4.2, unit: 'Skala 5' },
  { id: 4, kpi: 'Kecepatan respon pengaduan (menit)', target: 30, realisasi: 25, unit: 'Menit' },
];

export default function IkiPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: '#fff',
            display: 'flex'
          }}
        >
          <TrendingUpIcon fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Indikator Kinerja Individu (IKI)
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Monitoring capaian dan target kinerja pegawai secara periodik
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'primary.main' }}>
                <SpeedIcon />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total Capaian</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>92.5%</Typography>
              <Typography variant="caption" color="text.secondary">Meningkat 2% dari bulan lalu</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'success.main' }}>
                <AssignmentCheckIcon />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Target Tercapai</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>8/10</Typography>
              <Typography variant="caption" color="text.secondary">Indikator melampaui target</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'warning.main' }}>
                <EmojiEventsIcon />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Predikat</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>Baik</Typography>
              <Typography variant="caption" color="text.secondary">Sesuai ekspektasi pimpinan</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'info.main' }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'info.main', fontSize: '0.75rem' }}>!</Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Outstanding</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>2</Typography>
              <Typography variant="caption" color="text.secondary">Tugas menunggu divalidasi</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detail Table */}
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Detail Indikator Utama</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Indikator Kinerja</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Target</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Realisasi</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Progress</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_IKI.map((row) => {
              const progress = (row.realisasi / row.target) * 100;
              return (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{row.kpi}</TableCell>
                  <TableCell align="center">{row.target} {row.unit}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: 'primary.main' }}>{row.realisasi} {row.unit}</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress > 100 ? 100 : progress} 
                        sx={{ flexGrow: 1, height: 8, borderRadius: 5, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { borderRadius: 5 } }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 40 }}>{Math.round(progress)}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={progress >= 100 ? 'Selesai' : 'Proses'} 
                      color={progress >= 100 ? 'success' : 'warning'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
