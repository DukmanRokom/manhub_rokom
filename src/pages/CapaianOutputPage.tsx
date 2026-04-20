import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FilterListIcon from '@mui/icons-material/FilterList';
import SyncIcon from '@mui/icons-material/Sync';
import { googleSheetsService, CapaianOutputData } from '../services/googleSheets';

const MONTHS = [
  { id: 'jan', label: 'Januari' },
  { id: 'feb', label: 'Februari' },
  { id: 'mar', label: 'Maret' },
  { id: 'apr', label: 'April' },
  { id: 'mei', label: 'Mei' },
  { id: 'jun', label: 'Juni' },
  { id: 'jul', label: 'Juli' },
  { id: 'agu', label: 'Agustus' },
  { id: 'sep', label: 'September' },
  { id: 'okt', label: 'Oktober' },
  { id: 'nov', label: 'November' },
  { id: 'des', label: 'Desember' },
];

export default function CapaianOutputPage() {
  const [data, setData] = useState<CapaianOutputData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const remoteData = await googleSheetsService.fetchCapaianOutput();
      
      if (remoteData.length === 0) {
        setError('Data kosong atau gagal terhubung ke Google Sheets. Pastikan data di spreadsheet sudah terisi.');
        setData([]);
      } else {
        setData(remoteData);
        setError(null);
      }
    } catch (err) {
      setError('Gagal mengambil data. Pastikan koneksi internet stabil dan Apps Script sudah benar.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const teams = useMemo(() => {
    const uniqueTeams = Array.from(new Set(data.filter(i => !i.isHeader && i.timKerja).map(i => i.timKerja)));
    return uniqueTeams.sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const searchTarget = `${item.kode} ${item.komponen} ${item.timKerja} ${item.keterangan}`.toLowerCase();
      const matchesSearch = searchTarget.includes(search.toLowerCase());
      const matchesTeam = !teamFilter || item.timKerja === teamFilter || item.isHeader;
      return matchesSearch && matchesTeam;
    });
  }, [data, search, teamFilter]);

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              backgroundColor: 'rgba(0, 184, 172, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUpIcon sx={{ color: '#00b8ac', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              Realisasi Capaian Output
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Monitoring progres kegiatan dan capaian kinerja 2026
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<SyncIcon />}
          onClick={loadData}
          disabled={loading}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Refresh Data
        </Button>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Cari kegiatan, kode, atau tim..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: '300px', backgroundColor: '#fff' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          label="Filter Tim Kerja"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ minWidth: '220px', backgroundColor: '#fff' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        >
          <option value="">Semua Tim</option>
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </TextField>
      </Box>

      {/* Table Container */}
      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
          border: '1px solid #e0f2f1', 
          borderRadius: 3, 
          overflow: 'auto',
          backgroundColor: '#fff',
          maxHeight: 'calc(100vh - 280px)'
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, backgroundColor: '#f0fafa', py: 2, minWidth: 120 }}>Mata Anggaran</TableCell>
              <TableCell sx={{ fontWeight: 800, backgroundColor: '#f0fafa', py: 2, minWidth: 250 }}>Komponen Kegiatan</TableCell>
              <TableCell sx={{ fontWeight: 800, backgroundColor: '#f0fafa', py: 2, minWidth: 120 }}>Target</TableCell>
              <TableCell sx={{ fontWeight: 800, backgroundColor: '#f0fafa', py: 2, minWidth: 180 }}>Tim Kerja</TableCell>
              <TableCell sx={{ fontWeight: 800, backgroundColor: '#f0fafa', py: 2, minWidth: 200 }}>Keterangan</TableCell>
              {MONTHS.map(m => (
                <TableCell key={m.id} align="left" sx={{ fontWeight: 800, backgroundColor: '#f0fafa', py: 2, minWidth: 250 }}>
                  {m.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={MONTHS.length + 5} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={30} sx={{ color: '#00b8ac' }} />
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>Sedang menyinkronkan data...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={MONTHS.length + 5} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" sx={{ color: 'text.disabled' }}>Data tidak ditemukan</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, idx) => (
                <TableRow 
                  key={`${item.kode}-${idx}`} 
                  sx={{ 
                    '&:hover': { backgroundColor: '#f0fafa' },
                    backgroundColor: item.isHeader ? 'rgba(0, 184, 172, 0.08)' : (idx % 2 === 0 ? '#fafafa' : '#fff')
                  }}
                >
                  <TableCell sx={{ fontWeight: item.isHeader ? 700 : 500, color: item.isHeader ? '#006b63' : 'inherit', fontSize: '0.8rem' }}>
                    {item.kode}
                  </TableCell>
                  <TableCell sx={{ fontWeight: item.isHeader ? 800 : 400, color: item.isHeader ? '#006b63' : 'inherit', fontSize: '0.85rem' }}>
                    {item.komponen}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary' }}>
                    {item.target}
                  </TableCell>
                  <TableCell>
                    {item.timKerja && (
                      <Chip 
                        label={item.timKerja} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.65rem', 
                          fontWeight: 700, 
                          backgroundColor: 'rgba(0, 184, 172, 0.1)', 
                          color: '#006b63',
                          border: '1px solid rgba(0, 184, 172, 0.2)'
                        }} 
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary', verticalAlign: 'top', py: 1.5 }}>
                    {item.keterangan}
                  </TableCell>
                  {MONTHS.map(m => (
                    <TableCell 
                      key={m.id} 
                      align="left" 
                      sx={{ 
                        fontSize: '0.75rem', 
                        verticalAlign: 'top', 
                        py: 1.5,
                        whiteSpace: 'pre-wrap', // Preserve newlines from spreadsheet
                        lineHeight: 1.5,
                        maxWidth: 400
                      }}
                    >
                      {item.realisasi[m.id] ? (
                        <Box>
                          {item.realisasi[m.id]}
                        </Box>
                      ) : (
                        item.isHeader ? '' : '-'
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Info */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 500 }}>
            * Baris berwarna hijau muda merupakan Mata Anggaran / Kategori Utama.
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            * Klik Refresh untuk memperbarui data dari Google Sheets.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
