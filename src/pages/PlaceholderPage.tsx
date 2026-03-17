import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

interface PlaceholderPageProps {
  title: string;
  desc?: string;
}

export default function PlaceholderPage({ title, desc }: PlaceholderPageProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card sx={{ maxWidth: 480, width: '100%', textAlign: 'center', p: 2 }}>
        <CardContent>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #60c0d0, #b2ebe9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <ConstructionIcon sx={{ color: '#00b8ac', fontSize: 36 }} />
          </Box>
          <Chip label="Dalam Pengembangan" color="warning" size="small" sx={{ mb: 2, fontWeight: 700 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
            {title}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem', lineHeight: 1.7 }}>
            {desc || 'Halaman ini sedang dalam proses pengembangan. Tim teknis sedang mempersiapkan fitur ini untuk segera dapat digunakan.'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
