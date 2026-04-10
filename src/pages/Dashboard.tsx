import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import EditIcon from '@mui/icons-material/Edit';
import PieChartIcon from '@mui/icons-material/PieChart';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { useState, useEffect, useMemo } from 'react';
import { googleSheetsService, BudgetData, EotmData, IpAsnData, convertDriveLink } from '../services/googleSheets';
import { useAuth } from '../contexts/AuthContext';
import SyncIcon from '@mui/icons-material/Sync';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { formatCurrency } from '../utils/format';
import bannerPeople from '../assets/banner_people.png';

const serviceCards = [
  {
    icon: AssignmentIcon,
    title: 'Dukungan Perencanaan dan Kinerja',
    items: [
      'Penyusunan dokumen perencanaan dan revisi DIPA/POK',
      'Fasilitasi Perjanjian penyusunan Kinerja, dan data kinerja',
    ],
    color: '#00b8ac',
    bg: '#f0fafa',
  },
  {
    icon: AccountBalanceWalletIcon,
    title: 'Dukungan Pengelolaan Keuangan dan Anggaran',
    items: [
      'Pengelolaan administrasi anggaran',
      'Pelaksanaan monitoring realisasi dan kinerja anggaran',
    ],
    color: '#1565c0',
    bg: '#e3f2fd',
  },
  {
    icon: PeopleAltIcon,
    title: 'Dukungan Kepegawaian dan SDM',
    items: [
      'Pengelolaan administrasi kepegawaian',
      'Fasilitasi pengembangan kompetensi',
    ],
    color: '#6a1b9a',
    bg: '#f3e5f5',
  },
  {
    icon: DescriptionIcon,
    title: 'Dukungan Tata Usaha dan Persuratan',
    items: [
      'Menyelenggarakan pengelolaan kearsipan',
      'Menyelenggarakan pengelolaan persuratan',
    ],
    color: '#e65100',
    bg: '#fff3e0',
  },
  {
    icon: HomeWorkIcon,
    title: 'Dukungan Pengelolaan BMN',
    items: [
      'Pencatatan dan pengamanan BMN secara Optimal',
      'Penyelenggaraan administrasi perkantoran dan pengelolaan urusan rumah tangga',
    ],
    color: '#00918a',
    bg: '#f0fafa',
  },
];

const statsData = [
  { label: 'Jumlah Pegawai', value: '98', icon: GroupsIcon, color: '#00b8ac', pct: 100 },
  { label: 'Jumlah ASN', value: '91', icon: PeopleAltIcon, color: '#1565c0', pct: (91 / 98) * 100 },
  { label: 'Jumlah Non ASN', value: '7', icon: SupportAgentIcon, color: '#e65100', pct: (7 / 98) * 100 },
];

export default function Dashboard() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<BudgetData[]>([]);
  const [eotmData, setEotmData] = useState<EotmData[]>([]);
  const [ipAsnData, setIpAsnData] = useState<IpAsnData | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ score: '', periode: '' });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadData = async () => {
    setLoading(true);
    
    // Load Budget Data
    try {
      const budgetResult = await googleSheetsService.fetchData();
      setData(budgetResult || []);
    } catch (err) {
      console.error('Failed to fetch budget data:', err);
    }

    // Load EOTM Data
    try {
      const eotmResult = await googleSheetsService.fetchEotmData();
      setEotmData(eotmResult || []);
    } catch (err) {
      console.error('Failed to fetch EOTM data:', err);
    }

    // Load IP ASN Data
    try {
      const ipAsnResult = await googleSheetsService.fetchIpAsnData();
      if (ipAsnResult && ipAsnResult.length > 0) {
        setIpAsnData(ipAsnResult[0]);
      }
    } catch (err) {
      console.error('Failed to fetch IP ASN data:', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatPeriod = (period: string) => {
    if (!period) return '';
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

  const handleOpenEdit = () => {
    setEditFormData({
      score: ipAsnData?.score.toString() || '',
      periode: ipAsnData?.periode || ''
    });
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
  };

  const handleSaveIpAsn = async () => {
    setSubmitting(true);
    try {
      await googleSheetsService.updateIpAsnData({
        id: ipAsnData?.id || 1,
        score: parseFloat(editFormData.score) || 0,
        periode: editFormData.periode
      });
      setNotification({ open: true, message: 'Data IP ASN berhasil diperbarui', severity: 'success' });
      setEditDialogOpen(false);
      // Wait a bit and reload
      setTimeout(loadData, 1000);
    } catch (err) {
      console.error('Error saving IP ASN data:', err);
      setNotification({ open: true, message: 'Gagal memperbarui data', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };


  const chartData = useMemo(() => {
    return data.map(item => {
      const percentRealisasi = item.anggaran > 0 ? (item.realisasi / item.anggaran) * 100 : 0;
      const percentSisa = Math.max(0, 100 - percentRealisasi);
      
      return {
        name: item.kegiatan, // No truncation
        fullName: item.kegiatan,
        Realisasi: percentRealisasi,
        Sisa: percentSisa,
        AnggaranAbs: item.anggaran,
        RealisasiAbs: item.realisasi,
      };
    });
  }, [data]);

  return (
    <Box>
      {/* ─── HERO SECTION ─── */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #006b63 0%, #00b8ac 40%, #00a89d 70%, #00cfc2 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -40,
            right: 80,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={5}>
            <Chip
              label="Portal Layanan Aktif"
              size="small"
              sx={{
                mb: 1.5,
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.7rem',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            />
            <Typography
              variant="h4"
              sx={{
                color: '#fff',
                fontWeight: 800,
                mb: 2,
                lineHeight: 1.2,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              Selamat Datang di MANHUB 👋
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '0.9rem', md: '1rem' },
                mb: 4,
                maxWidth: 600,
                lineHeight: 1.7,
              }}
            >
              Platform terpadu manajemen administrasi dan layanan perkantoran Tim Kerja Dukungan Manajemen Biro Komunikasi dan Informasi Publik, Kementerian Kesehatan RI.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<AccessTimeIcon />}
                onClick={() => navigate('/kehadiran/rekap')}
                sx={{
                  background: '#fff',
                  color: '#00b8ac',
                  px: 3,
                  fontWeight: 700,
                  '&:hover': {
                    background: '#e0fcf9',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  },
                }}
                id="btn-rekap-absensi"
              >
                Rekap Absensi
              </Button>
              <Button
                variant="outlined"
                startIcon={<DescriptionIcon />}
                onClick={() => navigate('/kehadiran/lembur')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.6)',
                  color: '#fff',
                  px: 3,
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: '#fff',
                    background: 'rgba(255,255,255,0.1)',
                  },
                }}
                id="btn-ajukan-lembur"
              >
                Ajukan Lembur
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            <Box
              component="img"
              src={bannerPeople}
              alt="Manhub Team"
              sx={{
                width: '100%',
                maxWidth: 750,
                height: 'auto',
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.2)) drop-shadow(0 0 15px rgba(255,255,255,0.2))',
                animation: 'float 6s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0) scale(1)' },
                  '50%': { transform: 'translateY(-15px) scale(1.02)' },
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* ─── IP ASN CARD ─── */}
      <Card
        sx={{
          mb: 4,
          p: 0,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 25px rgba(21, 101, 192, 0.25)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <CardContent sx={{ p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <PieChartIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    IP ASN Biro Komunikasi dan Informasi Publik
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                    Indeks Profesionalitas ASN - {ipAsnData?.periode || '-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center', gap: 3 }}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, letterSpacing: 1 }}>
                  Skor Indeks
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1 }}>
                  {ipAsnData?.score || '0'}
                </Typography>
              </Box>
              {isLoggedIn && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleOpenEdit}
                  sx={{
                    background: '#fff',
                    color: '#1565c0',
                    fontWeight: 700,
                    borderRadius: '10px',
                    px: 2,
                    '&:hover': {
                      background: '#f0f0f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  Edit IP ASN
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── STATS CARDS ─── */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {statsData.map((stat) => (
          <Grid item xs={12} md={4} key={stat.label}>
            <Card
              sx={{
                p: 0,
                overflow: 'hidden',
                cursor: 'default',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <CardContent sx={{ pb: '12px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color, lineHeight: 1, fontSize: '1.6rem' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      background: `${stat.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <stat.icon sx={{ color: stat.color, fontSize: 20 }} />
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stat.pct}
                  sx={{
                    height: 4,
                    borderRadius: 4,
                    backgroundColor: `${stat.color}18`,
                    '& .MuiLinearProgress-bar': {
                      background: stat.color,
                      borderRadius: 4,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ─── SERVICE CARDS + EMPLOYEE OF MONTH ─── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Service Cards */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
            Tugas &amp; Fungsi Layanan
          </Typography>
          <Grid container spacing={2}>
            {serviceCards.map((card) => (
              <Grid item xs={12} sm={6} md={12} lg={6} key={card.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    background: '#fff',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      borderColor: card.color,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '16px',
                        background: card.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <card.icon sx={{ color: card.color, fontSize: 24 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary', lineHeight: 1.3 }}>
                        {card.title}
                      </Typography>
                      <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                        {card.items.map((item, idx) => (
                          <Box 
                            component="li" 
                            key={idx} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'flex-start', 
                              gap: 1, 
                              mb: idx === card.items.length - 1 ? 0 : 1 
                            }}
                          >
                            <Box 
                              sx={{ 
                                width: 4, 
                                height: 4, 
                                borderRadius: '50%', 
                                background: card.color, 
                                mt: 1,
                                flexShrink: 0 
                              }} 
                            />
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.4 }}>
                              {item}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Employee of the Month */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
            Pegawai Terbaik Bulan Ini
          </Typography>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #006b63 0%, #00b8ac 50%, #00a89d 100%)',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -20,
                left: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
              }}
            />
            <CardContent sx={{ position: 'relative', zIndex: 1, height: '100%', minHeight: 320 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                  Employee of the Month – {formatPeriod(eotmData[0]?.periode) || 'Maret 2025'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1 }}>
                <Avatar
                  src={convertDriveLink(eotmData[0]?.fotoUrl)}
                  imgProps={{
                    onError: (e: any) => {
                      e.target.src = 'https://via.placeholder.com/150?text=' + (eotmData[0]?.nama?.charAt(0) || 'E');
                    }
                  }}
                  sx={{
                    width: 90,
                    height: 90,
                    mb: 2,
                    background: 'linear-gradient(135deg, #4dd0c9, #80dedc)',
                    fontSize: '2rem',
                    fontWeight: 800,
                    border: '3px solid rgba(255,255,255,0.4)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  }}
                >
                  {eotmData[0]?.nama?.charAt(0) || 'E'}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', textAlign: 'center', mb: 0.5 }}>
                  {eotmData[0]?.nama || 'Belum Ada Data'}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', textAlign: 'center', mb: 2 }}>
                  {eotmData[0]?.jabatan || 'Silakan lengkapi di halaman SDM'}
                </Typography>

                <Divider sx={{ width: '100%', borderColor: 'rgba(255,255,255,0.15)', mb: 2 }} />

                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  onClick={() => navigate('/sdm/eotm')}
                  sx={{
                    mt: 1,
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#fff',
                      background: 'rgba(255,255,255,0.1)',
                    },
                  }}
                  id="btn-lihat-profil-eotm"
                >
                  Lihat Selengkapnya
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ─── BUDGET CHART LIVE ─── */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: '#fff',
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
              Realisasi Anggaran Live
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              Monitoring real-time Anggaran vs Realisasi via Google Sheets
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button 
              size="small" 
              startIcon={<SyncIcon />} 
              onClick={loadData}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              Refresh
            </Button>
            <Chip
              label="Data Live"
              size="small"
              sx={{ background: '#60c0d0', color: '#00b8ac', fontWeight: 700, fontSize: '0.68rem' }}
            />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            <Box sx={{ height: Math.max(400, data.length * 100), width: '100%', mb: 4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData} 
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis 
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    tick={(props: any) => {
                      const { x, y, payload } = props;
                      const text = payload.value || '';
                      
                      // Simple wrapping logic
                      const words = text.split(' ');
                      const lines: string[] = [];
                      let currentLine = '';
                      
                      words.forEach((word: string) => {
                        if ((currentLine + word).length > 25) {
                          lines.push(currentLine.trim());
                          currentLine = word + ' ';
                        } else {
                          currentLine += word + ' ';
                        }
                      });
                      lines.push(currentLine.trim());
                      
                      // Max 4 lines as requested
                      const displayLines = lines.slice(0, 4);
                      
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text 
                            x={0} 
                            y={0} 
                            dy={-(displayLines.length - 1) * 6} 
                            textAnchor="end" 
                            fill="#666" 
                            style={{ fontSize: 10, fontWeight: 700 }}
                          >
                            {displayLines.map((line, index) => (
                              <tspan x={-10} dy={index === 0 ? 0 : 12} key={index}>
                                {line}
                              </tspan>
                            ))}
                          </text>
                        </g>
                      );
                    }}
                    width={180}
                  />
                  <RechartsTooltip 
                    formatter={(_value: any, name: string, props: any) => {
                      if (name === 'Alokasi') return [formatCurrency(props.payload.AnggaranAbs - props.payload.RealisasiAbs), 'Sisa Anggaran'];
                      return [formatCurrency(props.payload.RealisasiAbs), 'Realisasi'];
                    }}
                    labelFormatter={(label, payload: any[]) => payload[0]?.payload?.fullName || label}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
                  />
                  <Legend verticalAlign="top" height={36} align="right" />
                  <Bar dataKey="Realisasi" name="Realisasi" stackId="a" fill="#00b8ac" barSize={25}>
                    <LabelList 
                      dataKey="Realisasi" 
                      position="bottom" 
                      formatter={(v: number) => v > 10 ? `${v.toFixed(0)}%` : ''} 
                      style={{ fontSize: 9, fill: '#fff', fontWeight: 700 }}
                      offset={-14}
                    />
                  </Bar>
                  <Bar dataKey="Sisa" name="Alokasi" stackId="a" fill="#60c0d0" radius={[0, 4, 4, 0]} barSize={25}>
                    <LabelList 
                      dataKey="Sisa" 
                      position="insideRight" 
                      formatter={(v: number) => v > 10 ? `${v.toFixed(0)}%` : ''} 
                      style={{ fontSize: 9, fill: '#006b63', fontWeight: 600 }}
                      offset={10}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, px: 1 }}>
              Rincian Kegiatan:
            </Typography>
            
            <TableContainer component={Box} sx={{ border: '1px solid #f1f5f9', borderRadius: 2, mb: 2 }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Kegiatan</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Anggaran</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Realisasi</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 5).map((item) => {
                    const percent = item.anggaran > 0 ? (item.realisasi / item.anggaran) * 100 : 0;
                    return (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.kegiatan}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatCurrency(item.anggaran)}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatCurrency(item.realisasi)}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#00b8ac' }}>
                          {percent.toFixed(0)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => navigate('/keuangan/realisasi')}
                endIcon={<ArrowForwardIcon />}
                sx={{ fontSize: '0.75rem' }}
              >
                Lihat Selengkapnya & Detail
              </Button>
            </Box>
          </>
        )}

        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            background: '#f0fafa',
            border: '1px solid #60c0d0',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#60c0d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUpIcon sx={{ color: '#00b8ac', fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.5 }}>
            <strong style={{ color: '#00b8ac' }}>Status:</strong> Data tersinkronisasi otomatis dengan Google Sheets. Gunakan tombol Refresh untuk pembaruan manual.
          </Typography>
        </Box>
      </Paper>

      {/* ─── EDIT IP ASN DIALOG ─── */}
      <Dialog open={editDialogOpen} onClose={handleCloseEdit} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Update IP ASN</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Skor IP ASN"
              type="number"
              fullWidth
              value={editFormData.score}
              onChange={(e) => setEditFormData({ ...editFormData, score: e.target.value })}
              helperText="Contoh: 85.5"
            />
            <TextField
              label="Periode"
              fullWidth
              value={editFormData.periode}
              onChange={(e) => setEditFormData({ ...editFormData, periode: e.target.value })}
              helperText="Contoh: Triwulan I 2024"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseEdit} color="inherit" sx={{ fontWeight: 600 }}>Batal</Button>
          <Button 
            onClick={handleSaveIpAsn} 
            variant="contained" 
            disabled={submitting || !editFormData.score || !editFormData.periode}
            sx={{ px: 3, fontWeight: 700 }}
          >
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} sx={{ width: '100%', fontWeight: 600 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

