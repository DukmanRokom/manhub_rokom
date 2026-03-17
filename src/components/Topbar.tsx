import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme as useMuiTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const DRAWER_WIDTH = 260;

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/kehadiran/rekap': 'Rekap Absensi',
  '/kehadiran/lembur': 'Pengajuan Lembur',
  '/keuangan/realisasi': 'Realisasi Anggaran',
  '/sdm/pegawai': 'Data Pegawai',
  '/sdm/kinerja': 'Laporan Kinerja',
  '/sdm/eotm': 'Employee of the Month',
  '/laporan': 'Laporan',
};

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const pageTitle = pageTitles[location.pathname] || 'MANHUB';
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Auth Context
  const { isLoggedIn, login, logout } = useAuth();
  
  // Local UI States
  const [openLogin, setOpenLogin] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginClick = () => {
    setOpenLogin(true);
    setError('');
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
    setUsername('');
    setPassword('');
  };

  const handleLoginSubmit = () => {
    const success = login(username, password);
    if (success) {
      handleCloseLogin();
    } else {
      setError('Username atau password salah');
    }
  };

  const handleLogoutClick = () => {
    setOpenLogoutConfirm(true);
  };

  const handleCloseLogoutConfirm = () => {
    setOpenLogoutConfirm(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setOpenLogoutConfirm(false);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        left: { md: DRAWER_WIDTH },
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        background: '#ffffff',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: 64 }}>
        {isMobile && (
          <IconButton
            edge="start"
            onClick={onToggleSidebar}
            sx={{ color: 'text.secondary' }}
            aria-label="toggle-sidebar"
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2, fontSize: '1rem' }}>
            {pageTitle}
          </Typography>
          {!isMobile && (
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1 }}>
              {dateStr}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isLoggedIn ? (
            <Box
              onClick={handleLogoutClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                pl: 1.5,
                pr: 0.5,
                py: 0.5,
                borderRadius: '50px',
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'error.light',
                  background: 'rgba(211,47,47,0.04)',
                },
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.2 }}>Admin Rokom</Typography>
                <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', lineHeight: 1 }}>Administrator</Typography>
              </Box>
              <Tooltip title="Klik untuk Logout">
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #2e7d32, #81c784)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  AR
                </Avatar>
              </Tooltip>
            </Box>
          ) : (
            <Button
              variant="outlined"
              size="small"
              onClick={handleLoginClick}
              sx={{
                borderRadius: '50px',
                px: 3,
                textTransform: 'none',
                fontWeight: 700,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  background: 'rgba(46,125,50,0.08)',
                  borderColor: 'primary.dark',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Login Dialog */}
      <Dialog open={openLogin} onClose={handleCloseLogin} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pt: 3 }}>
          Login MANHUB
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
            Masukkan kredensial Anda untuk mengakses fitur admin
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleLoginSubmit();
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseLogin} sx={{ color: 'text.secondary' }}>
            Batal
          </Button>
          <Button 
            onClick={handleLoginSubmit} 
            variant="contained" 
            disableElevation
            sx={{ px: 4, fontWeight: 700 }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutConfirm} onClose={handleCloseLogoutConfirm} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pt: 3 }}>
          Konfirmasi Logout
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.primary' }}>
            Apakah Anda yakin ingin logout?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center' }}>
          <Button onClick={handleCloseLogoutConfirm} variant="outlined" sx={{ px: 3 }}>
            Batal
          </Button>
          <Button 
            onClick={handleConfirmLogout} 
            variant="contained" 
            color="error"
            disableElevation
            sx={{ px: 3, fontWeight: 700 }}
          >
            Ya, Logout
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
