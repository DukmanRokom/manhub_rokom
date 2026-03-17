import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import DateRangeIcon from '@mui/icons-material/DateRange';
import StorageIcon from '@mui/icons-material/Storage';
import LaunchIcon from '@mui/icons-material/Launch';
import { useState, useEffect, useMemo } from 'react';
import { attendanceService, AttendanceFile } from '../services/attendance';

// Sub-component for File Card
function FileCard({ file, isMaster = false }: { file: AttendanceFile, isMaster?: boolean }) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <PictureAsPdfIcon sx={{ color: '#ff4d4d' }} />;
      case 'spreadsheet': return <TableChartIcon sx={{ color: '#27ae60' }} />;
      default: return <DescriptionIcon sx={{ color: '#2980b9' }} />;
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%', 
        borderRadius: 6, 
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { 
          transform: 'translateY(-10px)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
          borderColor: '#60c0d0',
          '& .btn-arrow': { transform: 'translateX(3px) translateY(-3px)', opacity: 1 }
        },
        border: '1px solid',
        borderColor: isMaster ? '#00b8ac' : '#f1f5f9',
        background: isMaster ? 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)' : '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CardActionArea 
        onClick={() => window.open(file.driveUrl, '_blank')}
        sx={{ height: '100%', p: 1 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Avatar 
              variant="rounded"
              sx={{ 
                bgcolor: '#ffffff', 
                border: '1px solid #f1f5f9',
                width: 52,
                height: 52,
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
              }}
            >
              {getFileIcon(file.fileType)}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
              <Chip 
                label={file.fileType.toUpperCase()} 
                size="small" 
                sx={{ 
                  fontSize: '0.6rem', 
                  fontWeight: 900, 
                  height: 18,
                  bgcolor: file.fileType === 'pdf' ? '#fff1f2' : '#f0fdf4',
                  color: file.fileType === 'pdf' ? '#e11d48' : '#166534',
                }} 
              />
              {isMaster && (
                <Chip 
                  label="UTAMA" 
                  size="small" 
                  sx={{ 
                    fontSize: '0.6rem', 
                    fontWeight: 900, 
                    height: 18,
                    bgcolor: '#00b8ac',
                    color: '#fff',
                  }} 
                />
              )}
            </Box>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, lineHeight: 1.3, color: 'text.primary', minHeight: 48 }}>
            {file.name}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px dashed #e2e8f0' }}>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled', fontWeight: 600 }}>
                Update: {file.updatedAt}
              </Typography>
            </Box>
            <Box 
              className="btn-arrow"
              sx={{ 
                opacity: 0.3, 
                transition: 'all 0.3s ease',
                color: '#60c0d0'
              }}
            >
              <LaunchIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function RekapAbsensiPage() {
  const [files, setFiles] = useState<AttendanceFile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        console.log('Fetching attendance files...');
        const data = await attendanceService.fetchFiles();
        console.log('Received attendance data:', data);
        setFiles(data);
      } catch (err) {
        console.error('Failed to load attendance files:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    if (!Array.isArray(files)) return [];
    return files.filter(file => {
      try {
        const searchLower = (search || '').toLowerCase();
        return (
          (file.name || '').toLowerCase().includes(searchLower) ||
          (file.month || '').toLowerCase().includes(searchLower) ||
          (file.year || '').includes(search || '')
        );
      } catch (e) {
        return false;
      }
    });
  }, [files, search]);

  // Nested grouping: Year -> { utama, months }
  const groupedFiles = useMemo(() => {
    try {
      const groups: { [year: string]: { utama: AttendanceFile[], months: { [month: string]: AttendanceFile[] } } } = {};
      
      if (!filteredFiles || !Array.isArray(filteredFiles) || filteredFiles.length === 0) return {};

      filteredFiles.forEach(file => {
        if (!file) return;
        const year = String(file.year || 'Tidak Diketahui');
        const month = String(file.month || 'Lainnya');
        
        if (!groups[year]) {
          groups[year] = { utama: [], months: {} };
        }
        
        const isUtama = (month.toLowerCase().includes('utama')) || 
                        (file.name?.toLowerCase().includes('master')) ||
                        (file.name?.toLowerCase().includes('utama'));

        if (isUtama) {
          groups[year].utama.push(file);
        } else {
          if (!groups[year].months[month]) {
            groups[year].months[month] = [];
          }
          groups[year].months[month].push(file);
        }
      });

      // Sort years descending
      const result = Object.keys(groups).sort((a, b) => b.localeCompare(a)).reduce((yearAcc, year) => {
        const { utama, months } = groups[year];
        yearAcc[year] = {
          utama: utama,
          months: Object.keys(months).sort().reduce((monthAcc, month) => {
            monthAcc[month] = months[month];
            return monthAcc;
          }, {} as { [month: string]: AttendanceFile[] })
        };
        return yearAcc;
      }, {} as { [year: string]: { utama: AttendanceFile[], months: { [month: string]: AttendanceFile[] } } });
      
      console.log('Grouped files calculation complete:', result);
      return result;
    } catch (err) {
      console.error('Error grouping files:', err);
      return {};
    }
  }, [filteredFiles]);

  const stats = useMemo(() => {
    if (!Array.isArray(files)) return { total: 0, pdfCount: 0, sheetCount: 0, latestUpdate: '-' };
    return {
      total: files.length,
      pdfCount: files.filter(f => f.fileType === 'pdf').length,
      sheetCount: files.filter(f => f.fileType === 'spreadsheet').length,
      latestUpdate: files.reduce((latest, f) => {
        const fDate = (f.updatedAt || '').split(' ')[0]; // Take only the YYYY-MM-DD part
        return fDate > latest ? fDate : latest;
      }, '2000-01-01')
    };
  }, [files]);

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header & Description */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mb: 1, letterSpacing: '-1.5px' }}>
          Rekap Absensi
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 700, fontSize: '1.1rem', lineHeight: 1.6 }}>
          Pusat kendali laporan kehadiran. Data dikelompokkan secara cerdas untuk memudahkan monitoring dan akses cepat ke Google Drive.
        </Typography>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {[
          { icon: <StorageIcon />, label: 'Total File', val: stats.total, color: '#0ea5e9', bg: '#f0f9ff' },
          { icon: <FolderIcon />, label: 'Tahun Aktif', val: Object.keys(groupedFiles).length, color: '#10b981', bg: '#ecfdf5' },
          { icon: <DateRangeIcon />, label: 'Sync Terakhir', val: stats.latestUpdate, color: '#8b5cf6', bg: '#f5f3ff' },
        ].map((item, idx) => (
          <Grid item xs={12} sm={4} md={4} key={idx}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 5, 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1.5, 
                border: '1px solid #f1f5f9',
                backgroundColor: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <Avatar sx={{ bgcolor: item.bg, color: item.color, width: 48, height: 48 }}>
                {item.icon}
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {item.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {item.val}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Search & Action Bar */}
      <Grid container spacing={2} sx={{ mb: 6, alignItems: 'center' }}>
        <Grid item xs>
          <TextField
            placeholder="Cari file, bulan, atau tahun..."
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
              sx: { 
                borderRadius: 5, 
                backgroundColor: '#fff',
                height: 64,
                fontSize: '1.1rem',
                boxShadow: '0 4px 30px rgba(0,0,0,0.03)',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#60c0d0' },
              }
            }}
          />
        </Grid>
        <Grid item>
          <Tooltip title="Buka Folder Utama Google Drive">
            <IconButton 
              onClick={() => window.open('https://drive.google.com/drive/folders/1k734sBm4OOxoZaRBTMnEG5S93aNj6Aa8', '_blank')}
              sx={{ 
                backgroundColor: '#60c0d0', 
                color: '#fff', 
                borderRadius: 5,
                width: 64,
                height: 64,
                boxShadow: '0 8px 20px rgba(96, 192, 208, 0.3)',
                '&:hover': { backgroundColor: '#4caab8', transform: 'scale(1.05)' },
                transition: 'all 0.3s ease'
              }}
            >
              <LaunchIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography color="text.secondary">Menyelaraskan data...</Typography>
        </Box>
      ) : (
        Object.entries(groupedFiles).map(([year, { utama, months }]) => (
          <Box key={year} sx={{ mb: 10 }}>
            {/* Year Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 3 }}>
              <Typography variant="h2" sx={{ fontWeight: 950, color: '#00b8ac', letterSpacing: '-3px', opacity: 0.9 }}>
                {year}
              </Typography>
              <Divider sx={{ flexGrow: 1, borderBottomWidth: 3, borderColor: '#f1f5f9' }} />
            </Box>

            {/* Utama / Master Files Section */}
            {utama.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.disabled', mb: 2, display: 'block', ml: 1 }}>
                  DOKUMEN UTAMA / MASTER
                </Typography>
                <Grid container spacing={3}>
                  {utama.map((file) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                      <FileCard file={file} isMaster />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Monthly Folders */}
            {Object.entries(months).map(([month, monthFiles]) => (
              <Box key={month} sx={{ mb: 6, ml: { xs: 0, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#eff6ff', color: '#60c0d0', width: 32, height: 32 }}>
                    <FolderIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {month}
                  </Typography>
                  <Chip 
                    label={`${monthFiles.length} File`} 
                    size="small" 
                    sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: 'text.secondary', height: 20, fontSize: '0.65rem' }} 
                  />
                </Box>
                
                <Grid container spacing={3}>
                  {monthFiles.map((file) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                      <FileCard file={file} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        ))
      )}

      {!loading && filteredFiles.length === 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            textAlign: 'center', 
            py: 15, 
            borderRadius: 8, 
            border: '2px dashed #e2e8f0', 
            bgcolor: 'transparent' 
          }}
        >
          <SearchIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1 }}>
            Hening Sekali...
          </Typography>
          <Typography variant="body1" color="text.disabled">
            Kami tidak menemukan dokumen yang Anda cari. Coba kata kunci lain.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
