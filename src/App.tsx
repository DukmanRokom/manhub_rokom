import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';
import LemburPage from './pages/LemburPage';
import RealisasiAnggaranPage from './pages/RealisasiAnggaranPage';
import RekapAbsensiPage from './pages/RekapAbsensiPage';
import LaporanBulananPage from './pages/LaporanBulananPage';
import EotmPage from './pages/EotmPage';
import KendaraanDinasPage from './pages/KendaraanDinasPage';
import DataPegawaiPage from './pages/DataPegawaiPage';
import CapaianOutputPage from './pages/CapaianOutputPage';
import KatalogIkiPage from './pages/KatalogIkiPage';
import KatalogIkiPrahumPage from './pages/KatalogIkiPrahumPage';
import KatalogIkiPustakawanPage from './pages/KatalogIkiPustakawanPage';
import AtkPage from './pages/AtkPage';
import RuangRapatPage from './pages/RuangRapatPage';
import LakipPage from './pages/LakipPage';
import SpjPage from './pages/SpjPage';
import UsulanPerencanaanPage from './pages/UsulanPerencanaanPage';
import UsulanRevisiPage from './pages/UsulanRevisiPage';
import DiagnosticPage from './pages/DiagnosticPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="kehadiran/rekap" element={<RekapAbsensiPage />} />
              <Route path="kehadiran/lembur" element={<LemburPage />} />
              <Route path="keuangan/realisasi" element={<RealisasiAnggaranPage />} />
              <Route path="keuangan/reimburse" element={<PlaceholderPage title="Pengajuan Reimbursement" desc="Proses pengajuan klaim pengeluaran dinas dan operasional kantor." />} />
              <Route path="monev/laporan-bulanan" element={<LaporanBulananPage />} />
              <Route path="monev/capaian-output" element={<CapaianOutputPage />} />
              <Route path="monev/lakip" element={<LakipPage />} />
              <Route path="sdm/pegawai" element={<DataPegawaiPage />} />
              <Route path="sdm/katalog-iki" element={<KatalogIkiPage />} />
              <Route path="sdm/katalog-iki/prahum" element={<KatalogIkiPrahumPage />} />
              <Route path="sdm/katalog-iki/pustakawan" element={<KatalogIkiPustakawanPage />} />
              <Route path="sdm/eotm" element={<EotmPage />} />
              <Route path="bmn/kendaraan" element={<KendaraanDinasPage />} />
              <Route path="bmn/ruangan" element={<RuangRapatPage />} />
              <Route path="bmn/atk" element={<AtkPage />} />
              <Route path="keuangan/spj" element={<SpjPage />} />
              <Route path="perencanaan/usulan" element={<UsulanPerencanaanPage />} />
              <Route path="perencanaan/revisi" element={<UsulanRevisiPage />} />
              <Route path="diagnostic" element={<DiagnosticPage />} />
              <Route path="pengaturan" element={<PlaceholderPage title="Pengaturan" desc="Konfigurasi akun, notifikasi, dan preferensi aplikasi." />} />
              <Route path="bantuan" element={<PlaceholderPage title="Pusat Bantuan" desc="Panduan penggunaan, FAQ, dan kontak helpdesk teknis." />} />
              <Route path="*" element={<PlaceholderPage title="Halaman Tidak Ditemukan" desc="URL yang Anda akses tidak tersedia. Silakan kembali ke dashboard." />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
