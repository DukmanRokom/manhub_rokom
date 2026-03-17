import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  LinearProgress,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import SyncIcon from '@mui/icons-material/Sync';
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
import { googleSheetsService, BudgetData } from '../services/googleSheets';
import { formatCurrency } from '../utils/format';

export default function RealisasiAnggaranPage() {
  const [data, setData] = useState<BudgetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const remoteData = await googleSheetsService.fetchData();
      setData(remoteData);
      setError(null);
    } catch (err) {
      setError('Gagal mengambil data dari Google Sheets. Pastikan koneksi internet aktif.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = data.filter(item => 
    item.kegiatan?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = useMemo(() => {
    const totalAnggaran = data.reduce((sum, item) => sum + (item.anggaran || 0), 0);
    const totalRealisasi = data.reduce((sum, item) => sum + (item.realisasi || 0), 0);
    const avgPercent = totalAnggaran > 0 ? (totalRealisasi / totalAnggaran) * 100 : 0;
    return { totalAnggaran, totalRealisasi, avgPercent };
  }, [data]);



  // Format data for Recharts - Horizontal Stacked Bar
  const chartData = useMemo(() => {
    return data.map(item => {
      const percentRealisasi = item.anggaran > 0 ? (item.realisasi / item.anggaran) * 100 : 0;
      const percentSisa = Math.max(0, 100 - percentRealisasi);
      
      return {
        name: item.kegiatan, // No truncation as requested
        fullName: item.kegiatan,
        Realisasi: percentRealisasi,
        Sisa: percentSisa,
        AnggaranAbs: item.anggaran,
        RealisasiAbs: item.realisasi,
      };
    });
  }, [data]);

  // Dynamic height based on number of items
  const chartHeight = Math.max(350, data.length * 60);

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BarChartIcon sx={{ color: '#00b8ac', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Realisasi Anggaran
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<SyncIcon />} 
            onClick={loadData}
            disabled={loading}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Visualization Card */}
      <Card sx={{ mb: 4, borderRadius: 3, backgroundColor: '#f0fafa', boxShadow: 'none', border: '1px solid #60c0d0', position: 'relative' }}>
        {loading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(240, 250, 250, 0.7)', zIndex: 2 }}>
            <CircularProgress color="primary" />
          </Box>
        )}
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
            <BarChartIcon sx={{ color: '#00b8ac', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Visualisasi Realisasi Anggaran
            </Typography>
          </Box>
          
          <Box sx={{ height: chartHeight, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                layout="vertical" 
                margin={{ top: 20, right: 60, left: 30, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tickFormatter={(v) => `${v}%`} 
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#333', fontWeight: 600 }}
                  width={250} // Increased width to prevent cutting
                />
                <RechartsTooltip 
                  formatter={(_value: any, name: string, props: any) => {
                    if (name === 'Alokasi') return [formatCurrency(props.payload.AnggaranAbs - props.payload.RealisasiAbs), 'Sisa Anggaran'];
                    return [formatCurrency(props.payload.RealisasiAbs), 'Realisasi'];
                  }}
                  labelFormatter={(label, payload: any[]) => payload[0]?.payload?.fullName || label}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" height={36} align="right" />
                <Bar 
                  dataKey="Realisasi" 
                  name="Realisasi"
                  stackId="a" 
                  fill="#00b8ac" // Theme Teal
                  barSize={32}
                >
                  <LabelList 
                    dataKey="Realisasi" 
                    position="bottom" 
                    formatter={(v: number) => v > 5 ? `${v.toFixed(0)}%` : ''} 
                    style={{ fontSize: 10, fill: '#fff', fontWeight: 700 }}
                    offset={-18}
                  />
                </Bar>
                <Bar 
                  dataKey="Sisa" 
                  name="Alokasi"
                  stackId="a" 
                  fill="#60c0d0" // Light Theme Teal
                  radius={[0, 4, 4, 0]} 
                  barSize={32}
                >
                  <LabelList 
                    dataKey="Sisa" 
                    position="insideRight" 
                    formatter={(v: number) => v > 5 ? `Sisa: ${v.toFixed(0)}%` : ''} 
                    style={{ fontSize: 10, fill: '#006b63', fontWeight: 600 }}
                    offset={10}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Search and Table Section */}
      <TextField
        fullWidth
        placeholder="Cari kegiatan..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, backgroundColor: '#fff' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 2, mb: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Kegiatan</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Anggaran (Rp)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Realisasi (Rp)</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Persentase</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => {
              const percent = item.anggaran > 0 ? (item.realisasi / item.anggaran) * 100 : 0;
              return (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontSize: '0.85rem' }}>{item.kegiatan}</TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.85rem' }}>{formatCurrency(item.anggaran)}</TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.85rem' }}>{formatCurrency(item.realisasi)}</TableCell>
                  <TableCell sx={{ width: 180 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={percent} 
                        sx={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: '#f1f5f9' }} 
                      />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#00b8ac', minWidth: 45 }}>
                        {percent.toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Stats Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#60c0d0', border: 'none', boxShadow: 'none' }}>
            <CardContent>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                Total Anggaran
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#00b8ac' }}>
                {formatCurrency(stats.totalAnggaran)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#f0f7ff', border: 'none', boxShadow: 'none' }}>
            <CardContent>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                Total Realisasi
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2b6cb0' }}>
                {formatCurrency(stats.totalRealisasi)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#fffbe6', border: 'none', boxShadow: 'none' }}>
            <CardContent>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                Rata-rata Persentase
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#b2a100' }}>
                {stats.avgPercent.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
