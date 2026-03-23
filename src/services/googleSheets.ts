// Use ONE URL for everything. This is the latest URL you provided.
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwwaD4yRWht0rjUOaJSHJEMpZqhK4cDXJmvKA6AzD-vSVhN0U2sNL0h220Yeus_xgH5Bw/exec';

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
      // The 'thumbnail' endpoint is the most reliable for embedding Drive images 
      // without hitting 'file too large' or 'virus scan' interstitials.
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }
  return url;
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
            // Apps Script v3 currently lowercases all headers
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
          });
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
        ...item
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
        tanggalpeminjaman: item.tanggalpeminjaman || '',
        tanggalkembali: item.tanggalkembali || '',
        jammulaipeminjaman: item.jammulaipeminjaman || '',
        estimasijamkembali: item.estimasijamkembali || '',
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
        tanggal: item.tanggal || '',
        jammulai: item.jammulai || '',
        jamselesai: item.jamselesai || '',
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
          ...item
        }),
      });
    } catch (err) {
      console.error('Error submitting room booking:', err);
      throw err;
    }
  }
};
