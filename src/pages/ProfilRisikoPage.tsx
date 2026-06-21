import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  TablePagination,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Popover,
  Stack,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { googleSheetsService, RiskData } from '../services/googleSheets';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilRisikoPage() {
  const { isLoggedIn } = useAuth();
  const [data, setData] = useState<RiskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTingkatSebelum, setFilterTingkatSebelum] = useState('');
  const [filterTingkatSetelah, setFilterTingkatSetelah] = useState('');
  const [filterKesimpulan, setFilterKesimpulan] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  const openFilter = Boolean(filterAnchorEl);
  const filterId = openFilter ? 'filter-popover' : undefined;

  const activeFiltersCount = (filterTingkatSebelum ? 1 : 0) + (filterTingkatSetelah ? 1 : 0) + (filterKesimpulan ? 1 : 0);

  const loadData = async () => {
    try {
      setLoading(true);
      const remote = await googleSheetsService.fetchRiskData();
      setData(remote);
      setError(null);
    } catch (err: any) {
      setError(`Gagal memuat data risiko: ${err.message || err}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const tingkatSebelumOptions = useMemo(() => {
    const opts = new Set(data.map(r => r.tingkatRisikoSebelum).filter(Boolean));
    return Array.from(opts).sort();
  }, [data]);

  const tingkatSetelahOptions = useMemo(() => {
    const opts = new Set(data.map(r => r.tingkatRisikoSetelah).filter(Boolean));
    return Array.from(opts).sort();
  }, [data]);

  const kesimpulanOptions = useMemo(() => {
    const opts = new Set(data.map(r => r.kesimpulan).filter(Boolean));
    return Array.from(opts).sort();
  }, [data]);

  const filtered = useMemo(() => {
    let result = data;

    if (filterTingkatSebelum) {
      result = result.filter(r => r.tingkatRisikoSebelum === filterTingkatSebelum);
    }
    if (filterTingkatSetelah) {
      result = result.filter(r => r.tingkatRisikoSetelah === filterTingkatSetelah);
    }
    if (filterKesimpulan) {
      result = result.filter(r => r.kesimpulan === filterKesimpulan);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          (r.uraianRisiko && r.uraianRisiko.toLowerCase().includes(term)) ||
          (r.kodeRisiko && r.kodeRisiko.toLowerCase().includes(term)) ||
          (r.tingkatRisikoSebelum && r.tingkatRisikoSebelum.toLowerCase().includes(term)) ||
          (r.uraianRencana && r.uraianRencana.toLowerCase().includes(term)) ||
          (r.tingkatRisikoSetelah && r.tingkatRisikoSetelah.toLowerCase().includes(term)) ||
          (r.kesimpulan && r.kesimpulan.toLowerCase().includes(term))
      );
    }
    return result;
  }, [data, searchTerm, filterTingkatSebelum, filterTingkatSetelah, filterKesimpulan]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const accentColor = '#00b8ac';
  const gradientBg = 'linear-gradient(135deg, #007a72 0%, #00b8ac 100%)';

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      {/* Banner */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: gradientBg,
          boxShadow: `0 12px 30px -10px ${alpha(accentColor, 0.4)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          position: 'relative',
          overflow: 'hidden',
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
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
            Profil Risiko
          </Typography>
        </Box>
        {isLoggedIn && (
          <Button
            variant="contained"
            startIcon={<OpenInNewIcon />}
            href="https://docs.google.com/spreadsheets/d/1KZHet5j0RvmDdDoP-7eIiwBynu-gLzXZDBEqFfIFN1Q/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              zIndex: 1,
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              boxShadow: 'none',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                boxShadow: 'none',
              }
            }}
          >
            Buka Google Sheet
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          sx={{ maxWidth: 400 }}
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Cari..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        <Badge badgeContent={activeFiltersCount} color="primary">
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{
              borderColor: alpha(accentColor, 0.5),
              color: accentColor,
              '&:hover': {
                borderColor: accentColor,
                bgcolor: alpha(accentColor, 0.05),
              }
            }}
          >
            Filter
          </Button>
        </Badge>
      </Box>

      <Popover
        id={filterId}
        open={openFilter}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { borderRadius: 3, mt: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }
        }}
      >
        <Box sx={{ p: 2.5, width: 320 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
            Filter Data
          </Typography>
          <Stack spacing={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Tingkat Sblm. Pengendalian</InputLabel>
              <Select
                value={filterTingkatSebelum}
                label="Tingkat Sblm. Pengendalian"
                onChange={(e) => { setFilterTingkatSebelum(e.target.value); setPage(0); }}
              >
                <MenuItem value=""><em>Semua</em></MenuItem>
                {tingkatSebelumOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Tingkat Stlh. Pengendalian</InputLabel>
              <Select
                value={filterTingkatSetelah}
                label="Tingkat Stlh. Pengendalian"
                onChange={(e) => { setFilterTingkatSetelah(e.target.value); setPage(0); }}
              >
                <MenuItem value=""><em>Semua</em></MenuItem>
                {tingkatSetelahOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Kesimpulan Efektifitas</InputLabel>
              <Select
                value={filterKesimpulan}
                label="Kesimpulan Efektifitas"
                onChange={(e) => { setFilterKesimpulan(e.target.value); setPage(0); }}
              >
                <MenuItem value=""><em>Semua</em></MenuItem>
                {kesimpulanOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {(activeFiltersCount > 0) && (
              <Button 
                variant="text" 
                color="error" 
                size="small" 
                fullWidth
                onClick={() => {
                  setFilterTingkatSebelum('');
                  setFilterTingkatSetelah('');
                  setFilterKesimpulan('');
                  setPage(0);
                }}
              >
                Reset Filter
              </Button>
            )}
          </Stack>
        </Box>
      </Popover>

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {[
                { label: 'No', align: 'center', width: 50 },
                { label: 'Uraian Risiko', align: 'left' },
                { label: 'Kode Risiko', align: 'center' },
                { label: 'Tingkat Risiko Sebelum Pengendalian', align: 'center' },
                { label: 'Uraian Rencana Penanganan Risiko', align: 'left' },
                { label: 'Tingkat Risiko Setelah Pengendalian', align: 'center' },
                { label: 'Kesimpulan Efektifitas', align: 'center' },
              ].map((col) => (
                <TableCell
                  key={col.label}
                  align={col.align as any}
                  sx={{
                    fontWeight: 700,
                    bgcolor: '#f0fafa',
                    color: '#006b63',
                    fontSize: '0.85rem',
                    borderBottom: `2px solid ${alpha(accentColor, 0.25)}`,
                    width: col.width,
                    py: 2,
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
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tidak ada data risiko.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, idx) => (
                <TableRow key={idx} hover sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: alpha(accentColor, 0.03) }, transition: 'background-color 0.2s' }}>
                  <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {page * rowsPerPage + idx + 1}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.82rem' }}>{row.uraianRisiko || '-'} </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.82rem' }}>{row.kodeRisiko || '-'} </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.82rem' }}>{row.tingkatRisikoSebelum || '-'} </TableCell>
                  <TableCell sx={{ fontSize: '0.82rem' }}>{row.uraianRencana || '-'} </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.82rem' }}>{row.tingkatRisikoSetelah || '-'} </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.82rem' }}>{row.kesimpulan || '-'} </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}
