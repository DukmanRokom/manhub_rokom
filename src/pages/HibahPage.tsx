import { useState, useMemo, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  CircularProgress,
  InputAdornment,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  TablePagination,
  Chip,
  alpha,
  Stack,
  useTheme as useMuiTheme,
  useMediaQuery,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import SyncIcon from '@mui/icons-material/Sync';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { googleSheetsService, HibahData, MOCK_HIBAH_DATA } from '../services/googleSheets';
import { formatCurrency } from '../utils/format';

export default function HibahPage() {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { isLoggedIn } = useAuth();

  const [data, setData] = useState<HibahData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSumberDana, setFilterSumberDana] = useState('');
  const [filterJenisSumberDana, setFilterJenisSumberDana] = useState('');
  const [filterPic, setFilterPic] = useState('');

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadData = async () => {
    try {
      setLoading(true);
      const remoteData = await googleSheetsService.fetchHibahData();
      setData(remoteData);
      setError(null);
    } catch (err: any) {
      setError(`Gagal memuat data dari Google Sheets: ${err.message || err.toString()}. Menampilkan data simulasi.`);
      setData(MOCK_HIBAH_DATA);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterSumberDana('');
    setFilterJenisSumberDana('');
    setFilterPic('');
    setPage(0);
  };

  // Get Unique Filter Options dynamically from original data
  const filterOptions = useMemo(() => {
    const sumberDanaSet = new Set<string>();
    const jenisSumberDanaSet = new Set<string>();
    const picSet = new Set<string>();

    data.forEach((item) => {
      if (item.sumberDana) sumberDanaSet.add(item.sumberDana);
      if (item.jenisSumberDana) jenisSumberDanaSet.add(item.jenisSumberDana);
      if (item.pic) picSet.add(item.pic);
    });

    return {
      sumberDana: Array.from(sumberDanaSet).sort(),
      jenisSumberDana: Array.from(jenisSumberDanaSet).sort(),
      pic: Array.from(picSet).sort(),
    };
  }, [data]);

  // Filter Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        (item.sumberDana || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.jenisSumberDana || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.komponenKegiatan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.pic || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSumberDana = filterSumberDana === '' || item.sumberDana === filterSumberDana;
      const matchesJenisSumberDana =
        filterJenisSumberDana === '' || item.jenisSumberDana === filterJenisSumberDana;
      const matchesPic = filterPic === '' || item.pic === filterPic;

      return matchesSearch && matchesSumberDana && matchesJenisSumberDana && matchesPic;
    });
  }, [data, searchTerm, filterSumberDana, filterJenisSumberDana, filterPic]);

  // Pagination Change
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Dashboard Stats based on filtered data
  const stats = useMemo(() => {
    let totalAlokasi = 0;
    const uniqueSources = new Set<string>();
    const uniquePics = new Set<string>();

    filteredData.forEach((item) => {
      totalAlokasi +=
        (item['2026'] || 0) +
        (item['2027'] || 0) +
        (item['2028'] || 0) +
        (item['2029'] || 0) +
        (item['2030'] || 0) +
        (item['2031'] || 0);

      if (item.sumberDana) uniqueSources.add(item.sumberDana);
      if (item.pic) uniquePics.add(item.pic);
    });

    return {
      totalAlokasi,
      totalKegiatan: filteredData.length,
      sumberDanaCount: uniqueSources.size,
      picCount: uniquePics.size,
    };
  }, [filteredData]);

  // Chart Data: Cumulative allocation per year
  const chartData = useMemo(() => {
    const years = ['2026', '2027', '2028', '2029', '2030', '2031'];
    return years.map((year) => {
      const totalForYear = filteredData.reduce((sum, item) => {
        const val = item[year as '2026' | '2027' | '2028' | '2029' | '2030' | '2031'];
        return sum + (Number(val) || 0);
      }, 0);

      return {
        year,
        'Nilai Anggaran': totalForYear,
      };
    });
  }, [filteredData]);

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF('l', 'pt', 'a4'); // Landscape format because table is wide

    const tableBody = filteredData.map((item, index) => [
      index + 1,
      item.sumberDana || '-',
      item.jenisSumberDana || '-',
      item.komponenKegiatan || '-',
      formatCurrency(item['2026'] || 0),
      formatCurrency(item['2027'] || 0),
      formatCurrency(item['2028'] || 0),
      formatCurrency(item['2029'] || 0),
      formatCurrency(item['2030'] || 0),
      formatCurrency(item['2031'] || 0),
      item.pic || '-',
    ]);

    autoTable(doc, {
      startY: 90,
      head: [
        [
          'No',
          'Sumber Dana',
          'Jenis Sumber',
          'Komponen Kegiatan',
          '2026',
          '2027',
          '2028',
          '2029',
          '2030',
          '2031',
          'PIC',
        ],
      ],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 107, 99], // Deep Teal matching theme (#006b63)
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
      },
      styles: {
        fontSize: 8,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'center' },
        1: { cellWidth: 70 },
        2: { cellWidth: 70 },
        3: { cellWidth: 180 },
        4: { cellWidth: 65, halign: 'right' },
        5: { cellWidth: 65, halign: 'right' },
        6: { cellWidth: 65, halign: 'right' },
        7: { cellWidth: 65, halign: 'right' },
        8: { cellWidth: 65, halign: 'right' },
        9: { cellWidth: 65, halign: 'right' },
        10: { cellWidth: 80 },
      },
      didDrawPage: (dataInfo) => {
        // Document Header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('KEMENTERIAN KESEHATAN REPUBLIK INDONESIA', dataInfo.settings.margin.left, 35);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(
          'BIRO KOMUNIKASI DAN INFORMASI PUBLIK - DAFTAR PERENCANAAN ANGGARAN HIBAH',
          dataInfo.settings.margin.left,
          50
        );

        doc.setLineWidth(1.5);
        doc.setDrawColor(0, 184, 172); // Teal Accent color (#00b8ac)
        doc.line(
          dataInfo.settings.margin.left,
          58,
          doc.internal.pageSize.width - dataInfo.settings.margin.left,
          58
        );

        // Document Footer
        const printDate = new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        const footerY = doc.internal.pageSize.height - 20;
        doc.text(`Dicetak melalui MANHUB pada: ${printDate}`, dataInfo.settings.margin.left, footerY);

        const pageStr = `Halaman ${dataInfo.pageNumber}`;
        const pageWidth = doc.getTextWidth(pageStr);
        doc.text(pageStr, doc.internal.pageSize.width - dataInfo.settings.margin.left - pageWidth, footerY);
      },
    });

    doc.save('Rencana_Anggaran_Hibah.pdf');
  };

  const accentColor = '#00b8ac';
  const gradientBg = 'linear-gradient(135deg, #007a72 0%, #00b8ac 100%)';

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      {/* ── Banner Header ── */}
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
            background: 'rgba(255, 255, 255, 0.05)',
            pointerEvents: 'none',
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, zIndex: 1 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
            }}
          >
            <AccountBalanceIcon sx={{ color: '#fff', fontSize: 36 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: -0.5 }}
            >
              Perencanaan Anggaran Hibah
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, mt: 0.3 }}>
              Daftar Rencana Penerimaan dan Komponen Kegiatan Hibah 2026 - 2031
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ zIndex: 1 }}>
          {isLoggedIn && (
            <Button
              variant="contained"
              onClick={exportPDF}
              disabled={loading || filteredData.length === 0}
              startIcon={<FileDownloadIcon />}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: 'none',
                },
              }}
            >
              Export PDF
            </Button>
          )}
          <Tooltip title="Singkronisasi Google Sheet">
            <IconButton
              onClick={loadData}
              disabled={loading}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.22)' },
              }}
            >
              <SyncIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 3, fontWeight: 500 }}>
          {error}
        </Alert>
      )}

      {/* ── Stats Summary Cards ── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderLeft: `5px solid ${accentColor}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                  TOTAL PROYEKSI ANGGARAN
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {formatCurrency(stats.totalAlokasi)}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bg: alpha(accentColor, 0.1), borderRadius: '12px', display: 'flex' }}>
                <AccountBalanceIcon sx={{ color: accentColor, fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderLeft: '5px solid #2b6cb0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                  KOMPONEN KEGIATAN
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {stats.totalKegiatan} Kegiatan
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bg: 'rgba(43, 108, 176, 0.1)', borderRadius: '12px', display: 'flex' }}>
                <AssignmentIcon sx={{ color: '#2b6cb0', fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderLeft: '5px solid #b2f5ea',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                  SUMBER DANA HIBAH
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {stats.sumberDanaCount} Sumber
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bg: 'rgba(0, 184, 172, 0.08)', borderRadius: '12px', display: 'flex' }}>
                <CategoryIcon sx={{ color: '#007a72', fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderLeft: '5px solid #e11d48',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                  PIC TERLIBAT
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {stats.picCount} Tim Kerja
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bg: 'rgba(225, 29, 72, 0.1)', borderRadius: '12px', display: 'flex' }}>
                <GroupIcon sx={{ color: '#e11d48', fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Visualization and Filters ── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Recharts Allocation Trend */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Tren Alokasi Anggaran Hibah (2026 - 2031)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Grafik akumulasi nilai anggaran hibah per tahun (berdasarkan filter aktif)
              </Typography>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, py: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <Box sx={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAnggaran" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={accentColor} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      tickFormatter={(v) => {
                        if (v >= 1e9) return `${(v / 1e9).toFixed(1)}M`;
                        if (v >= 1e6) return `${(v / 1e6).toFixed(0)}Jt`;
                        return v;
                      }}
                    />
                    <RechartsTooltip
                      formatter={(value: number) => [formatCurrency(value), 'Total Anggaran']}
                      labelFormatter={(label) => `Tahun Anggaran ${label}`}
                      contentStyle={{
                        borderRadius: 10,
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        fontFamily: 'Inter',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Nilai Anggaran"
                      stroke={accentColor}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorAnggaran)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Filter Controls Panel */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="h6" fontWeight={700}>
                Penyaringan Data (Filter)
              </Typography>
              {(searchTerm || filterSumberDana || filterJenisSumberDana || filterPic) && (
                <Button
                  size="small"
                  onClick={handleResetFilters}
                  startIcon={<FilterAltOffIcon />}
                  sx={{ color: '#e11d48', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  Reset Filter
                </Button>
              )}
            </Box>

            <Grid container spacing={2}>
              {/* Text Search */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Cari kegiatan, sumber dana, PIC..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2.5, bgcolor: '#f8fafc' },
                  }}
                />
              </Grid>

              {/* Sumber Dana Select */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="sumber-dana-select-label">Sumber Dana</InputLabel>
                  <Select
                    labelId="sumber-dana-select-label"
                    value={filterSumberDana}
                    label="Sumber Dana"
                    onChange={(e) => {
                      setFilterSumberDana(e.target.value);
                      setPage(0);
                    }}
                    sx={{ borderRadius: 2.5, bgcolor: '#f8fafc' }}
                  >
                    <MenuItem value="">Semua Sumber Dana</MenuItem>
                    {filterOptions.sumberDana.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Jenis Sumber Dana Select */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="jenis-sumber-select-label">Jenis Sumber</InputLabel>
                  <Select
                    labelId="jenis-sumber-select-label"
                    value={filterJenisSumberDana}
                    label="Jenis Sumber"
                    onChange={(e) => {
                      setFilterJenisSumberDana(e.target.value);
                      setPage(0);
                    }}
                    sx={{ borderRadius: 2.5, bgcolor: '#f8fafc' }}
                  >
                    <MenuItem value="">Semua Jenis</MenuItem>
                    {filterOptions.jenisSumberDana.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* PIC Select */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="pic-select-label">PIC</InputLabel>
                  <Select
                    labelId="pic-select-label"
                    value={filterPic}
                    label="PIC"
                    onChange={(e) => {
                      setFilterPic(e.target.value);
                      setPage(0);
                    }}
                    sx={{ borderRadius: 2.5, bgcolor: '#f8fafc' }}
                  >
                    <MenuItem value="">Semua PIC</MenuItem>
                    {filterOptions.pic.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Filter Summary Count */}
            <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Ditemukan:
              </Typography>
              <Chip
                label={`${filteredData.length} dari ${data.length} Kegiatan`}
                size="small"
                sx={{
                  bgcolor: alpha(accentColor, 0.1),
                  color: '#007a72',
                  fontWeight: 700,
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* ── Main Data Table ── */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {[
                { label: 'No', align: 'center', width: 50 },
                { label: 'Sumber Dana', align: 'left', width: 130 },
                { label: 'Jenis Sumber', align: 'left', width: 110 },
                { label: 'Komponen Kegiatan', align: 'left', width: undefined },
                { label: '2026', align: 'right', width: 110 },
                { label: '2027', align: 'right', width: 110 },
                { label: '2028', align: 'right', width: 110 },
                { label: '2029', align: 'right', width: 110 },
                { label: '2030', align: 'right', width: 110 },
                { label: '2031', align: 'right', width: 110 },
                { label: 'PIC', align: 'left', width: 150 },
              ].map((col) => (
                <TableCell
                  key={col.label}
                  align={col.align as any}
                  sx={{
                    fontWeight: 700,
                    bgcolor: '#f0fafa',
                    color: '#006b63',
                    fontSize: '0.8rem',
                    borderBottom: `2px solid ${alpha(accentColor, 0.25)}`,
                    width: col.width,
                    whiteSpace: 'nowrap',
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
                <TableCell colSpan={11} align="center" sx={{ py: 12 }}>
                  <CircularProgress color="primary" />
                  <Typography sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}>
                    Mengunduh data anggaran hibah...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 12 }}>
                  <Typography color="text.secondary" fontWeight={500}>
                    {searchTerm || filterSumberDana || filterJenisSumberDana || filterPic
                      ? 'Tidak ada kegiatan yang sesuai dengan kriteria filter.'
                      : 'Data kosong. Silakan sinkronkan atau periksa koneksi Google Sheets Anda.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const globalIndex = page * rowsPerPage + index + 1;

                return (
                  <TableRow
                    key={row.no || index}
                    hover
                    sx={{
                      '&:last-child td': { border: 0 },
                      '&:hover': { bgcolor: alpha(accentColor, 0.03) },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {globalIndex}
                    </TableCell>

                    <TableCell sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary' }}>
                      {row.sumberDana || '-'}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={row.jenisSumberDana || 'Luar Negeri'}
                        size="small"
                        sx={{
                          bgcolor:
                            row.jenisSumberDana?.toLowerCase() === 'luar negeri'
                              ? 'rgba(43, 108, 176, 0.08)'
                              : 'rgba(0, 184, 172, 0.08)',
                          color:
                            row.jenisSumberDana?.toLowerCase() === 'luar negeri'
                              ? '#2b6cb0'
                              : '#007a72',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          height: 20,
                        }}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        minWidth: 200,
                        color: 'text.primary',
                      }}
                    >
                      {row.komponenKegiatan || '-'}
                    </TableCell>

                    {[2026, 2027, 2028, 2029, 2030, 2031].map((year) => {
                      const amount = row[year.toString() as '2026' | '2027' | '2028' | '2029' | '2030' | '2031'] || 0;
                      return (
                        <TableCell
                          key={year}
                          align="right"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            color: amount > 0 ? 'text.primary' : 'text.disabled',
                          }}
                        >
                          {amount > 0 ? formatCurrency(amount) : '-'}
                        </TableCell>
                      );
                    })}

                    <TableCell>
                      <Chip
                        label={row.pic || 'Belum Ditentukan'}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(226, 232, 240, 0.6)',
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: 'auto',
                          maxHeight: 40,
                          '& .MuiChip-label': {
                            whiteSpace: 'normal',
                            lineHeight: 1.2,
                            py: 0.5,
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Baris per halaman:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count}`}
          sx={{ borderTop: '1px solid #e2e8f0' }}
        />
      </TableContainer>
    </Box>
  );
}
