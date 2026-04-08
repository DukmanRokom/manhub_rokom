import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Container,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LaunchIcon from '@mui/icons-material/Launch';

const REVISI_DATA = [
  {
    tahun: '2025',
    url: 'https://drive.google.com/drive/folders/1bpLW5L1sQJiTbrYaU-QCyrfwjObt8_f1',
  },
  {
    tahun: '2026',
    url: 'https://drive.google.com/drive/folders/1AMC8nIt02m5JAhN03J6c86R0sAne-PvZ',
  },
];

export default function UsulanRevisiPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'primary.main', color: '#fff', display: 'flex' }}>
          <AssignmentIcon fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Usulan Revisi DIPA
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Perencanaan Anggaran - Biro Komunikasi dan Informasi Publik
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {REVISI_DATA.map((item) => (
          <Grid item xs={12} sm={6} key={item.tahun}>
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
                <CardContent sx={{ p: 6, textAlign: 'center' }}>
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
                  <Typography variant="h2" sx={{ fontWeight: 900, mb: 3 }}>
                    {item.tahun}
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: 1.5, 
                      color: 'text.primary',
                      background: 'rgba(0,184,172,0.08)',
                      py: 1.5,
                      px: 3,
                      borderRadius: '12px',
                      width: 'fit-content',
                      mx: 'auto'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Buka Folder Drive
                    </Typography>
                    <LaunchIcon sx={{ fontSize: 20 }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
