import { Box, Typography, Button, Grid, Card, CardContent, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const requiredInfos = [
  { id: 1, label: 'Nama Pegawai', desc: 'Nama lengkap Anda' },
  { id: 2, label: 'NIP', desc: 'Nomor Induk Pegawai' },
  { id: 3, label: 'Tanggal Lembur', desc: 'Tanggal pelaksanaan lembur' },
  { id: 4, label: 'Jam Lembur', desc: 'Jam mulai dan selesai' },
  { id: 5, label: 'Uraian Pekerjaan', desc: 'Deskripsi pekerjaan yang dilakukan' },
  { id: 6, label: 'Dokumen Pendukung', desc: 'File/bukti jika diperlukan' },
];

export default function LemburPage() {
  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <AccessTimeIcon sx={{ color: '#00b8ac', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Pengajuan Lembur
          </Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', maxWidth: 800 }}>
          Klik tombol di bawah untuk membuka form pengajuan lembur di Google Form. Data Anda akan tersimpan langsung di Google Sheet kami.
        </Typography>
      </Box>

      {/* Action Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<OpenInNewIcon />}
          sx={{
            py: 1.5,
            px: 4,
            fontWeight: 700,
            fontSize: '1rem',
          }}
          onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScppZAAlrHJI9I-KkcqZ6LkmeGjfAHLquIN8Z8KWGTV-nXoDg/viewform', '_blank')}
        >
          Buka Form Pengajuan Lembur
        </Button>
      </Box>

      {/* Info Alert */}
      <Box
        sx={{
          mb: 5,
          p: 2.5,
          borderRadius: 3,
          backgroundColor: '#f0f7ff',
          border: '1px solid #d0e3ff',
          display: 'flex',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <InfoOutlinedIcon sx={{ color: '#2b6cb0' }} />
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#2b6cb0', fontSize: '0.88rem', mb: 0.2 }}>
            Form akan dibuka di jendela baru
          </Typography>
          <Typography sx={{ color: '#4a5568', fontSize: '0.82rem' }}>
            Anda dapat mengisi dan mengirim form pengajuan lembur di Google Form. Semua data akan tersimpan secara otomatis di sistem kami.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Required Info Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
          <Typography sx={{ fontSize: '1.1rem' }}>📋</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Informasi yang Diperlukan dalam Form:
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {requiredInfos.map((info) => (
            <Grid item xs={12} md={6} key={info.id}>
              <Card
                elevation={0}
                sx={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  '&:hover': { transform: 'none', boxShadow: 'none' }
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      backgroundColor: '#e6fffa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, color: '#00b8ac', fontSize: '0.85rem' }}>
                      {info.id}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'text.primary' }}>
                      {info.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                      {info.desc}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
