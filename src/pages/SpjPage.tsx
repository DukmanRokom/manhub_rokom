import { useState, useEffect } from 'react';
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
  CircularProgress,
  Chip,
  Container,
  IconButton,
  Tooltip,
  TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { googleSheetsService, SpjData } from '../services/googleSheets';

export default function SpjPage() {
  const [data, setData] = useState<SpjData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await googleSheetsService.fetchSpjData();
      if (Array.isArray(result)) {
        // Reverse to show the latest (bottom of sheet) first
        setData([...result].reverse());
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error loading SPJ data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = Array.isArray(data) ? data.filter(item => {
    const search = searchTerm.toLowerCase();
    return (
      (item.pelaksana || '').toLowerCase().includes(search) ||
      (item.untukpembayaran || '').toLowerCase().includes(search) ||
      (item.statusberkas || '').toLowerCase().includes(search)
    );
  }) : [];

  // Paginated selection
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusColor = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('selesai') || s.includes('cair') || s.includes('ok')) return 'success';
    if (s.includes('proses') || s.includes('jalan')) return 'info';
    if (s.includes('revisi') || s.includes('ulang')) return 'warning';
    if (s.includes('tolak') || s.includes('batal')) return 'error';
    return 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'primary.main', color: '#fff', display: 'flex' }}>
            <AccountBalanceWalletIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
              SPJ
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Surat Pertanggung Jawaban - Biro Komunikasi dan Informasi Publik
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton onClick={loadData} disabled={loading} sx={{ bgcolor: 'rgba(0,184,172,0.1)', '&:hover': { bgcolor: 'rgba(0,184,172,0.2)' } }}>
            <RefreshIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper sx={{ mb: 4, p: 2, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Cari berdasarkan pelaksana, rincian pembayaran, atau status..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); // Reset to first page on search
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 3, bgcolor: '#f8fafc' }
          }}
        />
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Untuk Pembayaran</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Lokasi</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Tanggal</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Pelaksana</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }} align="center">Status Berkas</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>Keterangan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <CircularProgress color="primary" />
                  <Typography sx={{ mt: 2, color: 'text.secondary' }}>Memuat data SPJ...</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Typography color="text.secondary">
                    {searchTerm ? 'Tidak ada data yang cocok dengan pencarian Anda.' : 'Belum ada data SPJ atau URL belum dikonfigurasi.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600, maxWidth: 300, wordBreak: 'break-word' }}>{row.untukpembayaran}</TableCell>
                  <TableCell sx={{ maxWidth: 150, wordBreak: 'break-word' }}>{row.lokasi}</TableCell>
                  <TableCell sx={{ maxWidth: 120, wordBreak: 'break-word' }}>{row.tanggal}</TableCell>
                  <TableCell sx={{ fontWeight: 500, maxWidth: 180, wordBreak: 'break-word' }}>{row.pelaksana}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.statusberkas}
                      color={getStatusColor(row.statusberkas)}
                      size="small"
                      sx={{ fontWeight: 700, px: 1 }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', maxWidth: 200, wordBreak: 'break-word' }}>{row.keterangan}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[15, 30, 50, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Data per halaman:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
        />
      </TableContainer>
    </Container>
  );
}
