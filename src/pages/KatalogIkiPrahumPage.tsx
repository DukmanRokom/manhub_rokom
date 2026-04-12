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
  Container,
  IconButton,
  Tooltip,
  TablePagination,
  Chip,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import GroupsIcon from '@mui/icons-material/Groups';
import { googleSheetsService, PrahumData } from '../services/googleSheets';

export default function KatalogIkiPrahumPage() {
  const [data, setData] = useState<PrahumData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination – fixed 25 rows per page
  const [page, setPage] = useState(0);
  const rowsPerPage = 25;

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await googleSheetsService.fetchPrahumData();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error loading Prahum data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const filteredData = data.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      (item.pranatahumas || '').toLowerCase().includes(search) ||
      (item.jabatan || '').toLowerCase().includes(search) ||
      (item.rencanahasilkerja || '').toLowerCase().includes(search) ||
      (item.indikatorkinerjaindividu || '').toLowerCase().includes(search) ||
      (item.satuan || '').toLowerCase().includes(search)
    );
  });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const accentColor = '#00b8ac';
  const gradientBg = 'linear-gradient(135deg, #006b63 0%, #00b8ac 100%)';

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ── Header ── */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, md: 4 },
          borderRadius: 4,
          background: gradientBg,
          boxShadow: `0 16px 40px -12px ${alpha(accentColor, 0.5)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
            }}
          >
            <GroupsIcon sx={{ color: '#fff', fontSize: 36 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: -0.5 }}
            >
              Katalog Indikator Kinerja
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, mt: 0.3 }}>
              Pranata Hubungan Masyarakat
            </Typography>
          </Box>
        </Box>

        <Tooltip title="Refresh Data">
          <IconButton
            onClick={loadData}
            disabled={loading}
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Search Bar ── */}
      <Paper
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Cari berdasarkan nama, jabatan/jenjang, rencana hasil kerja, indikator, atau satuan…"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: accentColor }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 3, bgcolor: '#f8fafc' },
          }}
        />
        {searchTerm && (
          <Chip
            label={`${filteredData.length} hasil`}
            size="small"
            sx={{
              bgcolor: alpha(accentColor, 0.12),
              color: accentColor,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          />
        )}
      </Paper>

      {/* ── Table ── */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {[
                { label: 'No', width: 52 },
                { label: 'Pranata Humas', width: 180 },
                { label: 'Jabatan / Jenjang', width: 180 },
                { label: 'Rencana Hasil Kerja', width: undefined },
                { label: 'Indikator Kinerja Individu', width: undefined },
                { label: 'Satuan', width: 120 },
              ].map((col) => (
                <TableCell
                  key={col.label}
                  sx={{
                    fontWeight: 700,
                    bgcolor: '#f0fafa',
                    color: '#006b63',
                    fontSize: '0.82rem',
                    letterSpacing: 0.3,
                    borderBottom: `2px solid ${alpha(accentColor, 0.3)}`,
                    width: col.width,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 12 }}>
                  <CircularProgress sx={{ color: accentColor }} />
                  <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                    Memuat data katalog…
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 12 }}>
                  <Typography color="text.secondary">
                    {searchTerm
                      ? 'Tidak ada data yang cocok dengan pencarian Anda.'
                      : 'Belum ada data tersedia.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row.id ?? index}
                  hover
                  sx={{
                    '&:last-child td': { border: 0 },
                    '&:hover': { bgcolor: alpha(accentColor, 0.04) },
                  }}
                >
                  <TableCell sx={{ color: 'text.disabled', fontSize: '0.82rem' }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {row.pranatahumas}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.jabatan}
                      size="small"
                      sx={{
                        bgcolor: alpha(accentColor, 0.1),
                        color: '#006b63',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 'auto',
                        maxWidth: 220,
                        '& .MuiChip-label': {
                          whiteSpace: 'normal',
                          lineHeight: 1.4,
                          py: 0.5,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.85rem',
                      color: 'text.primary',
                      lineHeight: 1.5,
                      maxWidth: 260,
                    }}
                  >
                    {row.rencanahasilkerja}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.85rem',
                      color: 'text.secondary',
                      lineHeight: 1.5,
                      maxWidth: 260,
                    }}
                  >
                    {row.indikatorkinerjaindividu}
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: accentColor,
                        fontStyle: 'italic',
                      }}
                    >
                      {row.satuan}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[25]}
          page={page}
          onPageChange={handleChangePage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} dari ${count} indikator`
          }
          sx={{ borderTop: `1px solid ${alpha(accentColor, 0.15)}` }}
        />
      </TableContainer>
    </Container>
  );
}
