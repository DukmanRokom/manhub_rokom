import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HubIcon from '@mui/icons-material/Hub';
import { useNavigate, useLocation } from 'react-router-dom';
import { navItems, NavItem } from '../config/navConfig';

const DRAWER_WIDTH = 260;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = item.path ? location.pathname === item.path : false;
  const isParentOfSelected = item.children?.some(c => c.path === location.pathname);

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(prev => !prev);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        selected={isSelected || (!hasChildren && isParentOfSelected === true)}
        sx={{
          pl: depth === 0 ? 2 : 4,
          py: 1.1,
          borderRadius: '10px',
          mx: 1,
          my: '2px',
          color: isSelected ? 'primary.main' : isParentOfSelected ? 'primary.main' : 'text.primary',
          fontWeight: isSelected ? 700 : 500,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 40,
            color: isSelected ? 'primary.main' : isParentOfSelected ? 'primary.main' : 'text.secondary',
          }}
        >
          <item.icon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontSize: depth === 0 ? '0.875rem' : '0.82rem',
            fontWeight: isSelected || isParentOfSelected ? 700 : 500,
          }}
        />
        {hasChildren && (expanded ? <ExpandLess fontSize="small" sx={{ color: 'text.secondary' }} /> : <ExpandMore fontSize="small" sx={{ color: 'text.secondary' }} />)}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={expanded || !!isParentOfSelected} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children!.map(child => (
              <NavItemComponent key={child.label} item={child} depth={depth + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #ffffff 0%, #f0fafa 100%)',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          background: 'linear-gradient(135deg, #006b63 0%, #00b8ac 60%, #00cfc2 100%)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <HubIcon sx={{ color: '#fff', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: 0.5,
              fontSize: '1.05rem',
            }}
          >
            MANHUB
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: 0.3,
              lineHeight: 1,
            }}
          >
            Manajemen Support Hub
          </Typography>
        </Box>
      </Box>


      {/* Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5 }}>
        <List disablePadding>
          {navItems.map(item => (
            <NavItemComponent key={item.label} item={item} />
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled', textAlign: 'center', lineHeight: 1.5 }}>
          © 2026 Dukman - Biro Komunikasi dan Informasi Publik
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              position: 'fixed',
              height: '100vh',
              top: 0,
              left: 0,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
