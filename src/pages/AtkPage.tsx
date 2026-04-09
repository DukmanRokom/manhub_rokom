import { useState, useEffect, useCallback, memo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { googleSheetsService, AtkMasterData, AtkRequest, AtkRequestItem } from '../services/googleSheets';

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

const EMPTY_ITEM: AtkRequestItem = { namabarang: '', kodebarang: '', jumlah: 1, satuan: '' };

// Separate component for each ATK item row for better state stability
const AtkItemRow = memo(({ 
  index, 
  item, 
  atkMaster, 
  onChange, 
  onRemove, 
  isLast, 
  onAdd 
}: { 
  index: number; 
  item: AtkRequestItem; 
  atkMaster: AtkMasterData[]; 
  onChange: (index: number, field: keyof AtkRequestItem, value: any) => void;
  onRemove: (index: number) => void;
  isLast: boolean;
  onAdd: () => void;
}) => {
  return (
    <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
      <Grid item xs={12} md={6}>
        <Autocomplete
          options={atkMaster}
          getOptionLabel={(option) => option.namabarang || ''}
          isOptionEqualToValue={(option, value) => 
            option.kodebarang === value.kodebarang || option.namabarang === value.namabarang
          }
          // Stability fix: compute value correctly and handle nulls
          value={atkMaster.find(m => 
            (m.kodebarang && m.kodebarang === item.kodebarang) || 
            (m.namabarang && m.namabarang === item.namabarang)
          ) || null}
          onChange={(_, newValue) => {
            onChange(index, 'namabarang', newValue?.namabarang || '');
            onChange(index, 'kodebarang', newValue?.kodebarang || '');
            onChange(index, 'satuan', newValue?.satuan || '');
          }}
          renderInput={(params) => (
            <TextField {...params} label={`Pilih Barang ${index + 1}`} required />
          )}
        />
      </Grid>
      <Grid item xs={4} md={2}>
        <TextField
          fullWidth
          label="Jumlah"
          type="number"
          value={item.jumlah}
          onChange={(e) => onChange(index, 'jumlah', Number(e.target.value))}
          required
          inputProps={{ min: 1 }}
        />
      </Grid>
      <Grid item xs={5} md={2}>
        <TextField
          fullWidth
          label="Satuan"
          value={item.satuan}
          disabled
          placeholder="Satuan"
          sx={{ bgcolor: '#f8fafc' }}
        />
      </Grid>
      <Grid item xs={3} md={2} sx={{ pt: '10px !important' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Hapus Baris">
            <IconButton 
              color="error" 
              onClick={() => onRemove(index)}
              // Don't disable if it's the only one, but logic prevents it
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {isLast && (
            <Tooltip title="Tambah Baris">
              <IconButton 
                color="primary" 
                onClick={onAdd}
                sx={{ border: '1px dashed primary.main' }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Grid>
    </Grid>
  );
});

export default function AtkPage() {
  const [atkMaster, setAtkMaster] = useState<AtkMasterData[]>([]);
  const [requests, setRequests] = useState<AtkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [namapemohon, setNamapemohon] = useState('');
  const [unitkerja, setUnitkerja] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [selectedItems, setSelectedItems] = useState<AtkRequestItem[]>([{ ...EMPTY_ITEM }]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [master, reqs] = await Promise.all([
        googleSheetsService.getAtkMaster(),
        googleSheetsService.getAtkRequests()
      ]);
      setAtkMaster(master || []);
      setRequests(reqs || []);
    } catch (error) {
      console.error('Failed to fetch ATK data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddItem = () => {
    setSelectedItems(prev => [...prev, { ...EMPTY_ITEM }]);
  };

  const handleRemoveItem = (index: number) => {
    if (selectedItems.length > 1) {
      setSelectedItems(prev => {
        const newItems = [...prev];
        newItems.splice(index, 1);
        return newItems;
      });
    } else {
      // Just clear the row if it's the last one
      setSelectedItems([{ ...EMPTY_ITEM }]);
    }
  };

  const handleItemChange = (index: number, field: keyof AtkRequestItem, value: any) => {
    setSelectedItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Filter out empty lines
      const validItems = selectedItems.filter(item => item.namabarang);
      if (validItems.length === 0) {
        setSnackbar({ open: true, message: 'Harap pilih minimal satu barang.', severity: 'error' });
        setSubmitting(false);
        return;
      }

      await googleSheetsService.submitAtkRequest({
        namapemohon,
        unitkerja,
        keterangan,
        items: validItems,
        // Fallbacks for older scripts
        namabarang: validItems[0].namabarang,
        kodebarang: validItems[0].kodebarang,
        jumlah: validItems[0].jumlah,
        satuan: validItems[0].satuan,
      });

      setSnackbar({ open: true, message: 'Permintaan ATK berhasil dikirim!', severity: 'success' });
      setKeterangan('');
      setSelectedItems([{ ...EMPTY_ITEM }]);
      fetchData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Gagal mengirim permintaan.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: '#fff', display: 'flex' }}>
            <AssignmentIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Permintaan ATK</Typography>
            <Typography variant="body2" color="text.secondary">Manajemen kebutuhan alat tulis kantor</Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '0.875rem', fontWeight: 600, mt: 0.5 }}>
              PIC : Zahrudin
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={fetchData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Nama Pemohon"
                      value={namapemohon}
                      onChange={(e) => setNamapemohon(e.target.value)}
                      required
                    >
                      {NAMA_PEMOHON.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Unit Kerja"
                      value={unitkerja}
                      onChange={(e) => setUnitkerja(e.target.value)}
                      required
                    >
                      {UNIT_KERJA.map((unit) => <MenuItem key={unit} value={unit}>{unit}</MenuItem>)}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, opacity: 0.7 }}>DAFTAR PESANAN</Typography>
                    {selectedItems.map((item, index) => (
                      <AtkItemRow
                        key={index}
                        index={index}
                        item={item}
                        atkMaster={atkMaster}
                        onChange={handleItemChange}
                        onRemove={handleRemoveItem}
                        onAdd={handleAddItem}
                        isLast={index === selectedItems.length - 1}
                      />
                    ))}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Keterangan / Tujuan Penggunaan"
                      multiline
                      rows={2}
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                      placeholder="Masukkan alasan permintaan (opsional)"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                      sx={{ py: 1.5, px: 6, borderRadius: 3, fontWeight: 800 }}
                    >
                      Kirim Pesanan
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Riwayat Terbaru</Typography>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Barang</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Qty</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Pemohon</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Waktu</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}><CircularProgress size={24} /></TableCell></TableRow>
                ) : requests.length === 0 ? (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}>Belum ada riwayat.</TableCell></TableRow>
                ) : (
                  [...requests].reverse().slice(0, 10).map((req, i) => (
                    <TableRow key={i} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{req.namabarang}</Typography>
                        <Typography variant="caption" color="text.secondary">{req.kodebarang}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{req.jumlah}</Typography>
                        <Typography variant="caption" color="text.secondary">{req.satuan}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{req.namapemohon}</Typography>
                        <Typography variant="caption" color="text.secondary">{req.unitkerja}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {req.timestamp?.toString().split('T')[0] || '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
