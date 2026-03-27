import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  alpha,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function KatalogIkiPage() {
  const categories = [
    {
      title: 'Humas',
      subtitle: 'Pranata Humas',
      description: 'Katalog indikator kinerja untuk jabatan fungsional Pranata Hubungan Masyarakat.',
      icon: GroupsIcon,
      color: '#00b8ac',
      bg: 'linear-gradient(135deg, #006b63 0%, #00b8ac 100%)',
    },
    {
      title: 'Pustakawan',
      subtitle: 'Pustakawan Ahli',
      description: 'Katalog indikator kinerja untuk jabatan fungsional Pustakawan.',
      icon: LibraryBooksIcon,
      color: '#1565c0',
      bg: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            mb: 1,
            letterSpacing: -0.5,
          }}
        >
          Katalog Indikator Kinerja
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600 }}>
          Pilih kategori jabatan fungsional untuk melihat daftar indikator kinerja yang tersedia.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {categories.map((cat) => (
          <Grid item xs={12} md={6} key={cat.title}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: `0 12px 24px -10px ${alpha(cat.color, 0.3)}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 40px -12px ${alpha(cat.color, 0.4)}`,
                },
              }}
            >
              <CardActionArea sx={{ height: '100%', p: 1 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '24px',
                      background: cat.bg,
                      mb: 3,
                      boxShadow: `0 8px 16px ${alpha(cat.color, 0.3)}`,
                    }}
                  >
                    <cat.icon sx={{ color: '#fff', fontSize: 40 }} />
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}
                  >
                    {cat.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: cat.color,
                      mb: 2,
                      display: 'block',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.8rem',
                    }}
                  >
                    {cat.subtitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6, minHeight: 48 }}
                  >
                    {cat.description}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: cat.color,
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    Lihat Katalog <ArrowForwardIcon sx={{ fontSize: 18 }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
