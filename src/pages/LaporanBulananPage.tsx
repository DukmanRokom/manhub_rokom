import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  Divider,
} from '@mui/material';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import LaunchIcon from '@mui/icons-material/Launch';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PublicIcon from '@mui/icons-material/Public';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ForumIcon from '@mui/icons-material/Forum';
import CampaignIcon from '@mui/icons-material/Campaign';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import GroupsIcon from '@mui/icons-material/Groups';

const timkerList = [
  {
    title: 'Timker Pengelolaan Perpustakaan',
    url: 'https://drive.google.com/drive/folders/18sP8-yFbtzsRlbIHGR4IXfGkijMbJbTK?usp=sharing',
    icon: <LibraryBooksIcon />,
    color: '#3498db',
    desc: 'Pengelolaan aset informasi dan literasi perpustakaan kantor.'
  },
  {
    title: 'Timker Hubungan Media dan Kelembagaan',
    url: 'https://drive.google.com/drive/folders/1dp99d-iuNRToFJta-5WjXvNTjkU7yT9C?usp=sharing',
    icon: <PublicIcon />,
    color: '#e67e22',
    desc: 'Koordinasi hubungan eksternal dengan media dan institusi mitra.'
  },
  {
    title: 'Timker Penguatan Pelayanan Publik',
    url: 'https://drive.google.com/drive/folders/1jl7Upxfap2MUJggc-adA9W2A1PYgTG_U?usp=sharing',
    icon: <SupervisorAccountIcon />,
    color: '#2ecc71',
    desc: 'Peningkatan standar dan kualitas layanan publik instansi.'
  },
  {
    title: 'Timker Pelayanan Informasi dan Pengaduan Masyarakat',
    url: 'https://drive.google.com/drive/folders/18EsrdtJOwpf5Q9uZ587fEaaEUAtoAMYn?usp=sharing',
    icon: <ForumIcon />,
    color: '#e74c3c',
    desc: 'Pusat pengelolaan informasi publik dan respon pengaduan.'
  },
  {
    title: 'Timker Komunikasi Internal dan Kehumasan',
    url: 'https://drive.google.com/drive/folders/1R_U_4hg5044gvI8HI9zwg3bUhQqii039?usp=sharing',
    icon: <GroupsIcon />,
    color: '#9b59b6',
    desc: 'Membangun sinergi internal dan citra kehumasan yang solid.'
  },
  {
    title: 'Timker Strategi Komunikasi',
    url: 'https://drive.google.com/drive/folders/1eOIAuHs2x_I8eKDSowevqaHNJqMuRnvM?usp=sharing',
    icon: <CampaignIcon />,
    color: '#f1c40f',
    desc: 'Perencanaan dan eksekusi strategi komunikasi publik terpadu.'
  },
  {
    title: 'Timker Peliputan dan Dokumentasi',
    url: 'https://drive.google.com/drive/folders/1RRwUEoiruoLzTuE-NjuJs9cgHeDvz3qg?usp=sharing',
    icon: <PhotoCameraIcon />,
    color: '#1abc9c',
    desc: 'Dokumentasi visual dan peliputan kegiatan prioritas.'
  },
  {
    title: 'Timker Publikasi Media',
    url: 'https://drive.google.com/drive/folders/1O9XuOYuGFtGr4npwQBSuNKv2qWBYV25r?usp=sharing',
    icon: <NewspaperIcon />,
    color: '#34495e',
    desc: 'Pengemasan konten dan publikasi di berbagai kanal media.'
  },
];

function TimkerCard({ timker }: { timker: typeof timkerList[0] }) {
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%', 
        borderRadius: 6, 
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { 
          transform: 'translateY(-10px)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
          borderColor: timker.color,
          '& .btn-launch': { backgroundColor: timker.color, color: '#fff', opacity: 1 }
        },
        border: '1px solid #f1f5f9',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CardActionArea 
        onClick={() => window.open(timker.url, '_blank')}
        sx={{ height: '100%', p: 1 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Avatar 
              variant="rounded"
              sx={{ 
                bgcolor: `${timker.color}15`, 
                color: timker.color,
                width: 56,
                height: 56,
                borderRadius: 4
              }}
            >
              {timker.icon}
            </Avatar>
            <Box 
              className="btn-launch"
              sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                color: '#94a3b8',
                transition: 'all 0.3s ease',
                opacity: 0.5
              }}
            >
              <LaunchIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.3, color: 'text.primary', minHeight: 60 }}>
            {timker.title}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6, minHeight: 40 }}>
            {timker.desc}
          </Typography>

          <Box sx={{ pt: 2, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderSpecialIcon sx={{ fontSize: 16, color: timker.color }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', letterSpacing: '0.5px' }}>
              GOOGLE DRIVE FOLDER
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function LaporanBulananPage() {
  return (
    <Box sx={{ pb: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mb: 1, letterSpacing: '-1.5px' }}>
          Laporan Bulanan
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 800, fontSize: '1.1rem', lineHeight: 1.6 }}>
          Pusat pemantauan laporan kinerja bulanan dari setiap Tim Kerja (Timker). Klik pada kartu untuk mengakses dokumen langsung di Google Drive.
        </Typography>
      </Box>

      <Divider sx={{ mb: 6, borderColor: '#f1f5f9' }} />

      {/* Grid */}
      <Grid container spacing={4}>
        {timkerList.map((timker, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <TimkerCard timker={timker} />
          </Grid>
        ))}
      </Grid>

      {/* Footer Info */}
      <Paper 
        elevation={0}
        sx={{ 
          mt: 8, 
          p: 4, 
          borderRadius: 6, 
          bgcolor: '#f8fafc', 
          border: '1px dashed #e2e8f0',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Butuh bantuan terkait akses folder? Hubungi Sekretariat Tim MONEV.
        </Typography>
      </Paper>
    </Box>
  );
}
