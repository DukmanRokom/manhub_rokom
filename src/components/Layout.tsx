import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DRAWER_WIDTH = 260;

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f4f7f4' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        className="main-container"
        sx={{
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          margin: '24px',
        }}
      >
        <Topbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <Toolbar sx={{ minHeight: '64px !important' }} />
        <Box
          className="content-wrapper"
          sx={{
            flex: 1,
            width: '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
