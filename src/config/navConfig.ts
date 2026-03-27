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
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
    label: 'BMN & Kerumahtanggaan',
    icon: HomeWorkIcon,
    children: [
      { label: 'Kendaraan Dinas', path: '/bmn/kendaraan', icon: DirectionsCarIcon },
      { label: 'Ruang Rapat', path: '/bmn/ruangan', icon: MeetingRoomIcon },
      { label: 'Permintaan ATK', path: '/bmn/atk', icon: AssignmentIcon },
    ],
  },
  {
    label: 'Kepegawaian',
    icon: BadgeIcon,
    children: [
      { label: 'Rekap Absensi', path: '/kehadiran/rekap', icon: AccessTimeIcon },
      { label: 'Pengajuan Lembur', path: '/kehadiran/lembur', icon: AssignmentIcon },
      { label: 'Data Pegawai', path: '/sdm/pegawai', icon: BadgeIcon },
      { label: 'Katalog Indikator Kinerja', path: '/sdm/katalog-iki', icon: MenuBookIcon },
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
      { label: 'Capaian Output', path: '/monev/capaian-output', icon: TrendingUpIcon },
      { label: 'Laporan Bulanan', path: '/monev/laporan-bulanan', icon: SummarizeIcon },
    ],
  },
];
