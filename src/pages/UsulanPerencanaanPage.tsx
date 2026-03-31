import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Container,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LaunchIcon from '@mui/icons-material/Launch';
import { googleSheetsService, PerencanaanData } from '../services/googleSheets';

export default function UsulanPerencanaanPage() {
  const [data, setData] = useState<PerencanaanData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await googleSheetsService.fetchPerencanaanData();
      // Sort by year descending
      setData([...result].sort((a, b) => b.tahun.localeCompare(a.tahun)));
    } catch (error) {
      console.error('Error loading planning data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'primary.main', color: '#fff', display: 'flex' }}>
            <AssignmentIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Usulan Perencanaan
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Perencanaan Anggaran - Biro Komunikasi dan Informasi Publik
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton onClick={loadData} disabled={loading} sx={{ bgcolor: 'rgba(0,184,172,0.1)', '&:hover': { bgcolor: 'rgba(0,184,172,0.2)' } }}>
            <RefreshIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
          <CircularProgress color="primary" />
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>Memuat data perencanaan...</Typography>
        </Box>
      ) : data.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#f8fafc', borderRadius: 4 }}>
          <Typography color="text.secondary">
            Belum ada data usulan perencanaan atau URL belum dikonfigurasi.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {data.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card 
                sx={{ 
                  borderRadius: 4, 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0,184,172,0.1)' 
                  }
                }}
              >
                <CardActionArea onClick={() => window.open(item.url, '_blank')} sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography 
                      variant="overline" 
                      sx={{ 
                        fontWeight: 700, 
                        color: 'primary.main', 
                        letterSpacing: 2,
                        mb: 1,
                        display: 'block'
                      }}
                    >
                      TAHUN ANGGARAN
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
                      {item.tahun}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Lihat Detail Usulan
                      </Typography>
                      <LaunchIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
