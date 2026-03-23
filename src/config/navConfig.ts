import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BadgeIcon from '@mui/icons-material/Badge';
import SummarizeIcon from '@mui/icons-material/Summarize';
import BarChartIcon from '@mui/icons-material/BarChart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import StarIcon from '@mui/icons-material/Star';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InfoIcon from '@mui/icons-material/Info';
import { SvgIconComponent } from '@mui/icons-material';

export interface NavItem {
  label: string;
  path?: string;
  icon: SvgIconComponent;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: DashboardIcon,
  },
  {
    label: 'Kepegawaian',
    icon: BadgeIcon,
    children: [
      { label: 'Rekap Absensi', path: '/kehadiran/rekap', icon: AccessTimeIcon },
      { label: 'Pengajuan Lembur', path: '/kehadiran/lembur', icon: AssignmentIcon },
      { label: 'Data Pegawai', path: '/sdm/pegawai', icon: BadgeIcon },
      { label: 'Laporan Kinerja', path: '/sdm/kinerja', icon: SummarizeIcon },
      { label: 'Employee of the Month', path: '/sdm/eotm', icon: StarIcon },
    ],
  },
  {
    label: 'Keuangan',
    icon: AccountBalanceWalletIcon,
    children: [
      { label: 'Realisasi Anggaran', path: '/keuangan/realisasi', icon: BarChartIcon },
    ],
  },
  {
    label: 'MONEV',
    icon: AnalyticsIcon,
    children: [
      { label: 'Laporan Bulanan', path: '/monev/laporan-bulanan', icon: SummarizeIcon },
    ],
  },
  {
    label: 'BMN & Kerumahtanggaan',
    icon: HomeWorkIcon,
    children: [
      { label: 'Kendaraan Dinas', path: '/bmn/kendaraan', icon: DirectionsCarIcon },
    ],
  },
  {
    label: 'Laporan',
    path: '/laporan',
    icon: BarChartIcon,
  },
  {
    label: 'About',
    path: '/about',
    icon: InfoIcon,
  },
];
