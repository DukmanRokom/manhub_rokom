import { googleSheetsService } from './googleSheets';

export interface AttendanceFile {
  id: string;
  name: string;
  month: string;
  year: string;
  driveUrl: string;
  fileType: 'pdf' | 'spreadsheet' | 'document';
  updatedAt: string;
}

export const attendanceService = {
  async fetchFiles(): Promise<AttendanceFile[]> {
    try {
      const data = await googleSheetsService.fetchAttendanceData();
      
      // Safety check: ensure data is an array
      if (!Array.isArray(data)) {
        console.error('Attendance data is not an array:', data);
        return [];
      }

      return data.map((item: any) => {
        // Safe mapping with fallbacks
        const id = String(item?.id || item?.ID || Math.random().toString(36).substr(2, 9));
        const name = String(item?.name || item?.Name || 'Dokumen Tanpa Nama');
        const rawMonth = String(item?.month || item?.Month || 'Lainnya');
        // Handle ISO date strings from Google Sheets (e.g., 2025-12-31T17:00:00.000Z)
        let month = rawMonth;
        if (rawMonth.includes('T') && !isNaN(Date.parse(rawMonth))) {
          const dateObj = new Date(rawMonth);
          const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
          const monthIndex = dateObj.getMonth();
          month = `${String(monthIndex + 1).padStart(2, '0')} - ${months[monthIndex]}`;
        } else {
          month = rawMonth.includes('-') ? rawMonth.replace('-', ' - ') : rawMonth;
        }

        const year = String(item?.year || item?.Year || 'Data Lama');
        const driveUrl = String(item?.driveUrl || item?.DriveURL || item?.Link || '#');
        const rawFileType = String(item?.fileType || item?.FileType || 'pdf').toLowerCase();
        const fileType = rawFileType.includes('sheet') ? 'spreadsheet' : 'pdf';
        const rawUpdatedAt = String(item?.updatedAt || item?.UpdatedAt || item?.Date || '-');
        // Format YYYY-MM-DD if it's a long date string
        const updatedAt = (rawUpdatedAt.includes('T') && !isNaN(Date.parse(rawUpdatedAt))) 
          ? new Date(rawUpdatedAt).toISOString().split('T')[0] 
          : rawUpdatedAt;

        return { id, name, month, year, driveUrl, fileType, updatedAt };
      });
    } catch (err) {
      console.error('Failed to fetch from Google Sheets:', err);
      return [];
    }
  }
};
