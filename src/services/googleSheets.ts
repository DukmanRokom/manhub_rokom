const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzB680czLYiEsvsb4G1ES4SrGId2hWNNr-TlPtlR9Bhx9-roA-v_rqGvQgybdPRPXVkWg/exec';
const CAPUT_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzy6UMw3II2Rarcr1-Dn5FSA90sSwS3mY-_DUC0wLjykO8wHsCouNmEewMw2vo2JgZkPQ/exec';
const SPJ_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwOFkrFOPEOQEg4krZJv30GG7T7HA-5C4fa7h23iTkWFn_OBrIKoVpc0mlnz7p70loj/exec';
const PERENCANAAN_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw9y_qL1QshwVaH9SEHbA1tUwvGWP5fYXbxGmLnLnCX9QS2iZ4XrDwlHEn_zr4oQsIB/exec';
// ← Ganti dengan URL Apps Script Google Sheet Pranata Humas setelah deploy
const PRAHUM_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzWw1NkcVO3zAxGJ2juRJQlvglYvqbI9Ap_Av557P_XkAb9vY2xPROb-CcEEj0WI7xL/exec';
const PUSTAKAWAN_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw8y4lopbkmn_pptqOMmt7TpxojiQ0HRsdlxgFX_gT7dR99eviOPH9eXSFTg03YxLAcLg/exec';
const HIBAH_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyCqebC4SUOJVO94egU-Uz0INl-dtFCndvdBaHCDCNlkgrTGUZ7HdExYfOxUZXJvFaOvA/exec';

export interface PrahumData {
  id: number;
  pranatahumas: string;
  jabatan: string;
  rencanahasilkerja: string;
  indikatorkinerjaindividu: string;
  satuan: string;
}

export interface PustakawanData {
  id: number;
  jabatan: string;
  rencanahasilkerja: string;
  indikatorkinerjaindividu: string;
  satuan: string;
}

export interface PerencanaanData {
  id: number;
  tahun: string;
  url: string;
}

export interface BudgetData {
  id: number;
  kegiatan: string;
  anggaran: number;
  realisasi: number;
}

export interface EotmData {
  id: number;
  fotoUrl: string;
  periode: string;
  nama: string;
  jabatan: string;
}

export interface VehicleRequest {
  timestamp?: string;
  namapemohon: string;
  unitkerja: string;
  kendaraan: string;
  tanggalpeminjaman: string;
  tanggalkembali: string;
  jammulaipeminjaman: string;
  estimasijamkembali: string;
  ruteperjalanandinas: string;
  agendakegiatan: string;
}

export interface EmployeeData {
  nama: string;
  jabatan: string;
  timkerja: string;
}

export interface RoomBooking {
  ruangan: string;
  namapemohon: string;
  unitkerja: string;
  tanggal: string;
  jammulai: string;
  jamselesai: string;
  agenda: string;
}

export interface AtkMasterData {
  no: number;
  kodebarang: string;
  namabarang: string;
  satuan: string;
}

export interface AtkRequest {
  timestamp?: string;
  namapemohon: string;
  unitkerja: string;
  namabarang: string;
  kodebarang: string;
  jumlah: number;
  satuan: string;
  keterangan: string;
  items?: AtkRequestItem[]; // Added for bulk support
}

export interface AtkRequestItem {
  namabarang: string;
  kodebarang: string;
  jumlah: number;
  satuan: string;
}

export interface CapaianOutputData {
  kode: string;
  komponen: string;
  target: string;
  timKerja: string;
  keterangan: string;
  realisasi: { [key: string]: string | undefined };
  isHeader?: boolean;
}

export interface LakipData {
  id: number;
  tahun: string;
  nama: string;
  url: string;
}

export interface SpjData {
  untukpembayaran: string;
  lokasi: string;
  tanggal: string;
  pelaksana: string;
  statusberkas: string;
  keterangan: string;
}

export interface IpAsnData {
  id: number;
  score: number;
  periode: string;
}

export interface ConfigData {
  key: string;
  value: string;
}

export interface HibahData {
  no: number;
  sumberDana: string;
  jenisSumberDana: string;
  komponenKegiatan: string;
  '2026': number;
  '2027': number;
  '2028': number;
  '2029': number;
  '2030': number;
  '2031': number;
  pic: string;
}

export const MOCK_HIBAH_DATA: HibahData[] = [
  {
    no: 1,
    sumberDana: 'World Bank',
    jenisSumberDana: 'Luar Negeri',
    komponenKegiatan: 'Penguatan Sistem Informasi Kesehatan Nasional (Sisnakes)',
    '2026': 1500000000,
    '2027': 2000000000,
    '2028': 1800000000,
    '2029': 1200000000,
    '2030': 1000000000,
    '2031': 500000000,
    pic: 'Tim Kerja Data dan Informasi'
  },
  {
    no: 2,
    sumberDana: 'APBN (Rupiah Murni)',
    jenisSumberDana: 'Dalam Negeri',
    komponenKegiatan: 'Sosialisasi dan Kampanye Germas Terpadu',
    '2026': 800000000,
    '2027': 850000000,
    '2028': 900000000,
    '2029': 950000000,
    '2030': 1000000000,
    '2031': 1050000000,
    pic: 'Tim Kerja Hubungan Masyarakat'
  },
  {
    no: 3,
    sumberDana: 'WHO (World Health Organization)',
    jenisSumberDana: 'Luar Negeri',
    komponenKegiatan: 'Bantuan Teknis Penanggulangan Penyakit Menular Menular',
    '2026': 500000000,
    '2027': 600000000,
    '2028': 400000000,
    '2029': 300000000,
    '2030': 200000000,
    '2031': 100000000,
    pic: 'Tim Kerja Hubungan Luar Negeri'
  },
  {
    no: 4,
    sumberDana: 'USAID',
    jenisSumberDana: 'Luar Negeri',
    komponenKegiatan: 'Peningkatan Kapasitas SDM Pustakawan Kesehatan',
    '2026': 1200000000,
    '2027': 1100000000,
    '2028': 950000000,
    '2029': 800000000,
    '2030': 600000000,
    '2031': 400000000,
    pic: 'Tim Kerja Perpustakaan'
  },
  {
    no: 5,
    sumberDana: 'Hibah Daerah DKI Jakarta',
    jenisSumberDana: 'Dalam Negeri',
    komponenKegiatan: 'Koordinasi Pelayanan Kesehatan Terintegrasi Daerah Penyangga',
    '2026': 300000000,
    '2027': 350000000,
    '2028': 300000000,
    '2029': 250000000,
    '2030': 200000000,
    '2031': 150000000,
    pic: 'Tim Kerja Fasilitasi Pelayanan'
  },
  {
    no: 6,
    sumberDana: 'Global Fund',
    jenisSumberDana: 'Luar Negeri',
    komponenKegiatan: 'Pengadaan Sarana Pendukung Laboratorium Rujukan Nasional',
    '2026': 3500000000,
    '2027': 4000000000,
    '2028': 3000000000,
    '2029': 2500000000,
    '2030': 2000000000,
    '2031': 1000000000,
    pic: 'Tim Kerja Layanan BMN'
  }
];

/**
 * Converts a standard Google Drive sharing link to a direct download/view link
 * so it can be used in <img> tags.
 */
export const convertDriveLink = (url: string): string => {
  if (!url) return '';
  const cleanUrl = url.trim();
  if (cleanUrl.includes('drive.google.com')) {
    let fileId = '';

    // Pattern 1: /file/d/[ID]/view
    const matchD = cleanUrl.match(/\/d\/([^/?]+)/);
    if (matchD && matchD[1]) {
      fileId = matchD[1];
    } else {
      // Pattern 2: id=[ID]
      const matchId = cleanUrl.match(/[?&]id=([^&]+)/);
      if (matchId && matchId[1]) {
        fileId = matchId[1];
      }
    }

    if (fileId) {
      // sz=w600 is for width, sz=s1000 is for max dimension. 
      // Sometimes sz=w600 is more reliable for quick loading.
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
    }
  }
  return url;
};

/**
 * Formats a Google Sheets time string (e.g., "1899-12-30T02:00:00.000Z")
 * to a simple "HH:mm" format.
 */
export const formatTime = (timeStr: string | number | undefined): string => {
  if (!timeStr) return '';
  if (typeof timeStr === 'number') {
    // Convert Excel fractional day back to hours and minutes
    const totalMinutes = Math.round(timeStr * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  if (typeof timeStr === 'string' && timeStr.includes('T')) {
    const date = new Date(timeStr);
    if (!isNaN(date.getTime())) {
      const h = date.getHours().toString().padStart(2, '0');
      const m = date.getMinutes().toString().padStart(2, '0');
      return `${h}:${m}`;
    }
  }

  return timeStr.toString();
};

const formatDate = (dateStr: any): string => {
  if (!dateStr) return '';
  const str = dateStr.toString();
  if (str.includes('T')) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  return str;
};

export const googleSheetsService = {
  async fetchAttendanceData(): Promise<any[]> {
    const ATTENDANCE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw1hUO8tdzWB73IVBbi2D7MuacKIFXej7-0o-LLW5cGKk_KdeS9_gnnVxmXwCG65P_w/exec?action=attendance';
    const response = await fetch(ATTENDANCE_SHEET_URL);
    return await response.json();
  },

  async fetchData(): Promise<BudgetData[]> {
    try {
      const response = await fetch(`${SHEET_URL}?action=getBudget`);
      const data = await response.json();
      return data.map((item: any) => ({
        id: Number(item.id || item.ID || 0),
        kegiatan: item.kegiatan || item.Kegiatan || '',
        anggaran: Number(item.anggaran || item.Anggaran || 0),
        realisasi: Number(item.realisasi || item.Realisasi || 0),
      }));
    } catch (err) {
      console.error('Error fetching budget data:', err);
      return [];
    }
  },

  async addRow(item: BudgetData): Promise<void> {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addBudget',
        ...item
      }),
    });
  },

  async deleteRow(id: number): Promise<void> {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'deleteBudget',
        id: id
      }),
    });
  },

  async fetchEotmData(): Promise<EotmData[]> {
    try {
      // Add a timestamp to bypass browser cache
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${SHEET_URL}?action=getEotm${cacheBuster}`);
      const text = await resp.text();

      try {
        const data = JSON.parse(text);
        if (data.error) {
          console.error('Apps Script Error:', data.error);
          return [];
        }
        return data
          .filter((item: any) => item.nama || item.Nama) // Filter out empty rows
          .map((item: any) => {
            // Apps Script v3 currently lowercases all headers, so check both cases
            const rawUrl = (item.fotoUrl || item.fotourl || '').toString().trim();
            const rawPeriode = (item.periode || item.Periode || '').toString().trim();
            const rawNama = (item.nama || item.Nama || '').toString().trim();
            const rawJabatan = (item.jabatan || item.Jabatan || '').toString().trim();
            const rawId = item.id || item.ID || 0;

            return {
              id: Number(rawId),
              fotoUrl: rawUrl,
              periode: rawPeriode,
              nama: rawNama,
              jabatan: rawJabatan,
            };
          }).reverse().slice(0, 10);
      } catch (e) {
        console.error('Invalid JSON from Google Sheets. Raw response:', text);
        return [];
      }
    } catch (err) {
      console.error('Network Error:', err);
      return [];
    }
  },

  async addEotmRow(item: Omit<EotmData, 'id'>): Promise<void> {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addEotm',
        ...item
      }),
    });
  },

  async updateEotmRow(item: EotmData): Promise<void> {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateEotm',
        ...item
      }),
    });
  },

  async deleteEotmRow(id: number): Promise<void> {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'deleteEotm',
        id: id
      }),
    });
  },

  async submitVehicleRequest(item: VehicleRequest): Promise<void> {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addVehicleRequest',
        ...item,
        timestamp: new Date().toISOString(),
        Timestamp: new Date().toISOString() // Try both cases for compatibility
      }),
    });
  },

  async getVehicleRequests(): Promise<VehicleRequest[]> {
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${SHEET_URL}?action=getVehicleRequests${cacheBuster}`);
      const data = await resp.json();
      return data.map((item: any) => ({
        namapemohon: item.namapemohon || '',
        unitkerja: item.unitkerja || '',
        kendaraan: item.kendaraan || '',
        tanggalpeminjaman: formatDate(item.tanggalpeminjaman),
        tanggalkembali: formatDate(item.tanggalkembali),
        jammulaipeminjaman: formatTime(item.jammulaipeminjaman),
        estimasijamkembali: formatTime(item.estimasijamkembali),
        ruteperjalanandinas: item.ruteperjalanandinas || '',
        agendakegiatan: item.agendakegiatan || '',
      }));
    } catch (err) {
      console.error('Error fetching vehicle requests:', err);
      return [];
    }
  },

  async getEmployees(): Promise<EmployeeData[]> {
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${SHEET_URL}?action=getPegawai${cacheBuster}`);
      const data = await resp.json();
      return data.map((item: any) => ({
        nama: item.nama || '',
        jabatan: item.jabatan || '',
        timkerja: item.timkerja || '',
      }));
    } catch (err) {
      console.error('Error fetching employees:', err);
      return [];
    }
  },

  async getRoomBookings(): Promise<RoomBooking[]> {
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${SHEET_URL}?action=getRoomBookings${cacheBuster}`);
      const data = await resp.json();
      return data.map((item: any) => ({
        ruangan: item.ruangan || '',
        namapemohon: item.namapemohon || '',
        unitkerja: item.unitkerja || '',
        tanggal: formatDate(item.tanggal),
        jammulai: formatTime(item.jammulai),
        jamselesai: formatTime(item.jamselesai),
        agenda: item.agenda || '',
      }));
    } catch (err) {
      console.error('Error fetching room bookings:', err);
      return [];
    }
  },

  async submitRoomBooking(item: RoomBooking): Promise<void> {
    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addRoomBooking',
          ...item,
          timestamp: new Date().toISOString(),
          Timestamp: new Date().toISOString() // Try both cases for compatibility
        }),
      });
    } catch (err) {
      console.error('Error submitting room booking:', err);
      throw err;
    }
  },

  async getAtkMaster(): Promise<AtkMasterData[]> {
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${SHEET_URL}?action=getAtkMaster${cacheBuster}`);
      const data = await resp.json();
      return data.map((item: any) => ({
        no: Number(item.no || item['no.'] || 0),
        kodebarang: (item.kodebarang || '').toString().trim(),
        namabarang: (item.namabarang || '').toString().trim(),
        satuan: (item.satuan || '').toString().trim(),
      }));
    } catch (err) {
      console.error('Error fetching ATK master:', err);
      return [];
    }
  },

  async submitAtkRequest(item: AtkRequest): Promise<void> {
    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addAtkRequest',
          ...item,
          timestamp: new Date().toISOString(),
          Timestamp: new Date().toISOString() // Try both cases for compatibility
        }),
      });
    } catch (err) {
      console.error('Error submitting ATK request:', err);
      throw err;
    }
  },

  async getAtkRequests(): Promise<AtkRequest[]> {
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${SHEET_URL}?action=getAtkRequests${cacheBuster}`);
      const data = await resp.json();
      return data.map((item: any) => ({
        timestamp: item.timestamp || '',
        namapemohon: item.namapemohon || '',
        unitkerja: item.unitkerja || '',
        namabarang: item.namabarang || '',
        kodebarang: item.kodebarang || '',
        jumlah: Number(item.jumlah || 0),
        satuan: item.satuan || '',
        keterangan: item.keterangan || '',
      }));
    } catch (err) {
      console.error('Error fetching ATK requests:', err);
      return [];
    }
  },

  async fetchCapaianOutput(): Promise<CapaianOutputData[]> {
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${CAPUT_SHEET_URL}?action=getCapaianOutput${cacheBuster}`);
      const data = await resp.json();

      if (!Array.isArray(data)) return [];

      return data.map((item: any) => {
        // Robust mapping for varying header cases from Apps Script
        const getVal = (keys: string[]) => {
          for (const key of keys) {
            if (item[key] !== undefined) return item[key];
            if (item[key.toLowerCase()] !== undefined) return item[key.toLowerCase()];
          }
          return '';
        };

        return {
          kode: String(getVal(['kode', 'Kode', 'Mata Anggaran'])).trim(),
          komponen: String(getVal(['komponen', 'Komponen', 'Komponen Kegiatan'])).trim(),
          target: String(getVal(['target', 'Target'])).trim(),
          timKerja: String(getVal(['timkerja', 'timKerja', 'Tim Kerja', 'Tim'])).trim(),
          keterangan: String(getVal(['keterangan', 'Keterangan'])).trim(),
          realisasi: {
            jan: getVal(['januari', 'jan', 'Januari']),
            feb: getVal(['februari', 'feb', 'Februari']),
            mar: getVal(['maret', 'mar', 'Maret']),
            apr: getVal(['april', 'apr', 'April']),
            mei: getVal(['mei', 'Mei']),
            jun: getVal(['juni', 'jun', 'Juni']),
            jul: getVal(['juli', 'jul', 'Juli']),
            agu: getVal(['agustus', 'agu', 'Agustus']),
            sep: getVal(['september', 'sep', 'September']),
            okt: getVal(['oktober', 'okt', 'Oktober']),
            nov: getVal(['november', 'nov', 'November']),
            des: getVal(['desember', 'des', 'Desember']),
          },
          isHeader: item.isheader === true || item.isHeader === true || String(item.kode || '').length <= 10 && !item.komponen,
        };
      });
    } catch (err) {
      console.error('Error fetching Capaian Output data:', err);
      return [];
    }
  },

  async fetchLakipData(): Promise<LakipData[]> {
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${SHEET_URL}?action=getLakip${cacheBuster}`);
      const data = await resp.json();
      return data.map((item: any) => ({
        id: Number(item.id || item.ID || 0),
        tahun: (item.tahun || item.Tahun || '').toString().trim(),
        nama: (item.nama || item.Nama || '').toString().trim(),
        url: (item.url || item.URL || '').toString().trim(),
      })).filter((item: any) => item.nama !== '');
    } catch (err) {
      console.error('Error fetching Lakip data:', err);
      return [];
    }
  },

  async addLakipRow(item: Omit<LakipData, 'id'>): Promise<void> {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addLakip',
        ...item
      }),
    });
  },

  async updateLakipRow(item: LakipData): Promise<void> {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateLakip',
        ...item
      }),
    });
  },

  async deleteLakipRow(id: number): Promise<void> {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'deleteLakip',
        id: id
      }),
    });
  },

  async fetchSpjData(): Promise<SpjData[]> {
    if (!SPJ_SHEET_URL) return [];
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${SPJ_SHEET_URL}?action=getSpj${cacheBuster}`);
      const text = await resp.text();

      try {
        const data = JSON.parse(text);
        if (!Array.isArray(data)) {
          console.error('SPJ Data is not an array:', data);
          return [];
        }
        return data.map((item: any) => ({
          untukpembayaran: (item.untukpembayaran || '').toString(),
          lokasi: (item.lokasi || '').toString(),
          tanggal: (item.tanggal || '').toString(),
          pelaksana: (item.pelaksana || '').toString(),
          statusberkas: (item.statusberkas || '').toString(),
          keterangan: (item.keterangan || '').toString(),
        }));
      } catch (e) {
        console.error('Invalid JSON from SPJ endpoint. Raw:', text);
        return [];
      }
    } catch (err) {
      console.error('Network error fetching SPJ data:', err);
      return [];
    }
  },

  async fetchPerencanaanData(): Promise<PerencanaanData[]> {
    if (!PERENCANAAN_SHEET_URL) return [];
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${PERENCANAAN_SHEET_URL}?action=getPerencanaan${cacheBuster}`);
      const text = await resp.text();

      try {
        const data = JSON.parse(text);
        if (!Array.isArray(data)) return [];
        return data.map((item: any) => ({
          id: Number(item.id) || 0,
          tahun: (item.tahun || '').toString(),
          url: (item.url || '').toString(),
        }));
      } catch (e) {
        console.error('Invalid JSON from Perencanaan endpoint');
        return [];
      }
    } catch (err) {
      console.error('Error fetching Perencanaan data:', err);
      return [];
    }
  },

  async fetchIpAsnData(): Promise<IpAsnData[]> {
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${SHEET_URL}?action=getIpAsn${cacheBuster}`);
      const data = await resp.json();
      return data.map((item: any) => ({
        id: Number(item.id || 0),
        score: Number(item.score || 0),
        periode: (item.periode || '').toString().trim(),
      }));
    } catch (err) {
      console.error('Error fetching IP ASN data:', err);
      return [];
    }
  },

  async updateIpAsnData(item: IpAsnData): Promise<void> {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateIpAsn',
        ...item
      }),
    });
  },

  async fetchConfigs(): Promise<ConfigData[]> {
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${SHEET_URL}?action=getConfigs${cacheBuster}`);
      const data = await resp.json();
      return data.map((item: any) => ({
        key: (item.key || '').toString().trim(),
        value: (item.value || '').toString().trim(),
      }));
    } catch (err) {
      console.error('Error fetching configs:', err);
      return [];
    }
  },

  async updateConfig(key: string, value: string): Promise<void> {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateConfig',
        key,
        value
      }),
    });
  },

  async fetchPrahumData(): Promise<PrahumData[]> {
    if (!PRAHUM_SHEET_URL || PRAHUM_SHEET_URL.startsWith('PASTE_')) return [];
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${PRAHUM_SHEET_URL}?action=getPrahum${cacheBuster}`);
      const text = await resp.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) return [];
      return data.map((item: any, idx: number) => ({
        id: Number(item.id || item.Id || item.ID || idx + 1),
        pranatahumas: (item.pranatahumas || item['pranata humas'] || item['Pranata Humas'] || '').toString().trim(),
        jabatan: (item['jabatanjenjang'] || item.jabatan || item['jabatan/jenjang'] || item['Jabatan/Jenjang'] || '').toString().trim(),
        rencanahasilkerja: (item.rencanahasilkerja || item['rencana hasil kerja'] || item['Rencana Hasil Kerja'] || '').toString().trim(),
        indikatorkinerjaindividu: (item.indikatorkinerjaindividu || item['indikator kinerja individu'] || item['Indikator Kinerja Individu'] || '').toString().trim(),
        satuan: (item.satuan || item.Satuan || '').toString().trim(),
      }));
    } catch (err) {
      console.error('Error fetching Prahum data:', err);
      return [];
    }
  },

  async fetchPustakawanData(): Promise<PustakawanData[]> {
    if (!PUSTAKAWAN_SHEET_URL || PUSTAKAWAN_SHEET_URL.startsWith('PASTE_')) return [];
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${PUSTAKAWAN_SHEET_URL}?action=getPustakawan${cacheBuster}`);
      const text = await resp.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) return [];
      return data.map((item: any, idx: number) => ({
        id: Number(item.id || item.Id || item.ID || idx + 1),
        jabatan: (item['jabatanjenjang'] || item.jabatan || item['jabatan/jenjang'] || item['Jabatan/Jenjang'] || '').toString().trim(),
        rencanahasilkerja: (item.rencanahasilkerja || item['rencana hasil kerja'] || item['Rencana Hasil Kerja'] || '').toString().trim(),
        indikatorkinerjaindividu: (item.indikatorkinerjaindividu || item['indikator kinerja individu'] || item['Indikator Kinerja Individu'] || '').toString().trim(),
        satuan: (item.satuan || item.Satuan || '').toString().trim(),
      }));
    } catch (err) {
      console.error('Error fetching Pustakawan data:', err);
      return [];
    }
  },

  async fetchHibahData(): Promise<HibahData[]> {
    if (!HIBAH_SHEET_URL || HIBAH_SHEET_URL.startsWith('PASTE_')) {
      return MOCK_HIBAH_DATA;
    }
    try {
      const cacheBuster = `&t=${Date.now()}`;
      const resp = await fetch(`${HIBAH_SHEET_URL}?action=getHibah${cacheBuster}`);
      const text = await resp.text();

      if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
        throw new Error('Respon Apps Script berupa HTML. Pastikan Web App dideploy dengan akses "Anyone" dan Anda telah melakukan otorisasi.');
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Gagal mengurai respon JSON dari Apps Script.');
      }

      if (data && data.error) {
        throw new Error(data.error);
      }

      if (!Array.isArray(data)) {
        throw new Error('Respon Apps Script bukan berupa array data.');
      }

      return data.map((item: any, idx: number) => {
        const getVal = (keys: string[]) => {
          for (const key of keys) {
            if (item[key] !== undefined) return item[key];
            const cleanKey = key.toLowerCase().replace(/\s+/g, '');
            if (item[cleanKey] !== undefined) return item[cleanKey];
          }
          return '';
        };

        const getNum = (keys: string[]) => {
          const val = getVal(keys);
          if (val === undefined || val === null || val === '') return 0;
          const parsed = Number(val.toString().replace(/[^0-9.-]/g, ''));
          return isNaN(parsed) ? 0 : parsed;
        };

        return {
          no: getNum(['no', 'No', 'no.']) || idx + 1,
          sumberDana: String(getVal(['sumber dana', 'sumberdana', 'sumber_dana', 'Sumber Dana', 'SumberDana'])).trim(),
          jenisSumberDana: String(getVal(['jenis sumber dana', 'jenissumberdana', 'jenis_sumber_dana', 'Jenis Sumber Dana', 'JenisSumberDana'])).trim(),
          komponenKegiatan: String(getVal(['komponen kegiatan', 'komponenkegiatan', 'komponen_kegiatan', 'Komponen Kegiatan', 'KomponenKegiatan'])).trim(),
          '2026': getNum(['2026']),
          '2027': getNum(['2027']),
          '2028': getNum(['2028']),
          '2029': getNum(['2029']),
          '2030': getNum(['2030']),
          '2031': getNum(['2031']),
          pic: String(getVal(['pic', 'Pic', 'PIC'])).trim(),
        };
      });
    } catch (err: any) {
      console.error('Error fetching Hibah data:', err);
      throw err;
    }
  },
};
