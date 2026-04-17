import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  Checkbox,
  Button,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import GroupsIcon from '@mui/icons-material/Groups';
import { googleSheetsService, PustakawanData } from '../services/googleSheets';

export default function KatalogIkiPustakawanPage() {
  const [data, setData] = useState<PustakawanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Marking/Selection state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Pagination – fixed 25 rows per page
  const [page, setPage] = useState(0);
  const rowsPerPage = 25;

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await googleSheetsService.fetchPustakawanData();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error loading Pustakawan data:', error);
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
      (item.jabatan || '').toLowerCase().includes(search) ||
      (item.rencanahasilkerja || '').toLowerCase().includes(search) ||
      (item.indikatorkinerjaindividu || '').toLowerCase().includes(search) ||
      (item.satuan || '').toLowerCase().includes(search)
    );
  });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = filteredData.map((item, idx) => String(item.id || idx));
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleResetSelection = () => {
    setSelectedItems([]);
  };

  const generatePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    
    // Get only selected data
    const selectedData = data.filter((item, idx) => {
      const itemId = String(item.id || idx);
      return selectedItems.includes(itemId);
    });

    if (selectedData.length === 0) return;

    const tableBody = selectedData.map((item, index) => [
      index + 1,
      item.jabatan || '-',
      item.rencanahasilkerja || '-',
      item.indikatorkinerjaindividu || '-',
      item.satuan || '-'
    ]);

    autoTable(doc, {
      startY: 100, // Leave space for header
      head: [['No', 'Jabatan / Jenjang', 'Rencana Hasil Kerja', 'Indikator Kinerja Individu', 'Satuan']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 169, 226], // Kemenkes Blue
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 110 },
        2: { cellWidth: 160 },
        3: { cellWidth: 180 },
        4: { cellWidth: 60 },
      },
      didDrawPage: (dataInfo) => {
        // Header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('KEMENTERIAN KESEHATAN', dataInfo.settings.margin.left, 40);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('BIRO KOMUNIKASI DAN INFORMASI PUBLIK', dataInfo.settings.margin.left, 55);
        
        doc.setLineWidth(2);
        doc.line(dataInfo.settings.margin.left, 65, doc.internal.pageSize.width - dataInfo.settings.margin.left, 65);

        // Footer
        const printDate = new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        const footerY = doc.internal.pageSize.height - 20;
        doc.text(`Dicetak pada: ${printDate}`, dataInfo.settings.margin.left, footerY);
        
        const pageNumberStr = `Halaman ${dataInfo.pageNumber}`;
        const pageNumberWidth = doc.getTextWidth(pageNumberStr);
        doc.text(pageNumberStr, doc.internal.pageSize.width - dataInfo.settings.margin.left - pageNumberWidth, footerY);
      },
    });

    doc.save('Katalog_IKI_Pustakawan.pdf');
  };

  const accentColor = '#3b82f6'; // Different accent color for Pustakawan
  const gradientBg = 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)';

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
              Pustakawan
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
          placeholder="Cari berdasarkan jabatan/jenjang, rencana hasil kerja, indikator, atau satuan…"
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

      {/* ── Selection Actions ── */}
      {selectedItems.length > 0 && (
        <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={generatePDF}
            sx={{
              bgcolor: '#1e40af',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: '#1e3a8a' }
            }}
          >
            Download PDF ({selectedItems.length} item)
          </Button>
          <Button
            variant="outlined"
            onClick={handleResetSelection}
            sx={{
              color: '#1e40af',
              borderColor: '#1e40af',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { borderColor: '#1e3a8a', bgcolor: alpha('#1e40af', 0.04) }
            }}
          >
            Reset Pilihan
          </Button>
        </Stack>
      )}

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
              <TableCell 
                sx={{ 
                  width: 50, 
                  bgcolor: '#f8fafc', 
                  borderBottom: `2px solid ${alpha(accentColor, 0.3)}` 
                }}
              >
                <Checkbox
                  color="primary"
                  indeterminate={selectedItems.length > 0 && selectedItems.length < filteredData.length}
                  checked={filteredData.length > 0 && selectedItems.length === filteredData.length}
                  onChange={handleSelectAll}
                  sx={{ color: '#1e40af', '&.Mui-checked': { color: '#1e40af' }, '&.MuiCheckbox-indeterminate': { color: '#1e40af' } }}
                />
              </TableCell>
              {[
                { label: 'No', width: 52 },
                { label: 'Jabatan / Jenjang', width: 220 },
                { label: 'Rencana Hasil Kerja', width: undefined },
                { label: 'Indikator Kinerja Individu', width: undefined },
                { label: 'Satuan', width: 120 },
              ].map((col) => (
                <TableCell
                  key={col.label}
                  sx={{
                    fontWeight: 700,
                    bgcolor: '#f8fafc',
                    color: '#1e40af',
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
              paginatedData.map((row, index) => {
                const globalIndex = data.findIndex(d => d === row);
                const rowId = String(row.id || globalIndex);
                const isSelected = selectedItems.includes(rowId);
                
                return (
                  <TableRow
                    key={rowId}
                    hover
                    selected={isSelected}
                    sx={{
                      '&:last-child td': { border: 0 },
                      '&:hover': { bgcolor: alpha(accentColor, 0.04) },
                      ...(isSelected && {
                        bgcolor: alpha('#1e40af', 0.08),
                        '&:hover': { bgcolor: alpha('#1e40af', 0.12) },
                      }),
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowId)}
                        sx={{ color: '#1e40af', '&.Mui-checked': { color: '#1e40af' } }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'text.disabled', fontSize: '0.82rem' }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.jabatan}
                      size="small"
                      sx={{
                        bgcolor: alpha(accentColor, 0.1),
                        color: '#1e40af',
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
                      maxWidth: 300,
                    }}
                  >
                    {row.rencanahasilkerja}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.85rem',
                      color: 'text.secondary',
                      lineHeight: 1.5,
                      maxWidth: 300,
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
                );
              })
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
