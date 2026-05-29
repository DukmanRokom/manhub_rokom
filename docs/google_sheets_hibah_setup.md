# Panduan Setup Google Sheets & Google Apps Script - Modul Hibah

Ikuti langkah-langkah di bawah ini untuk menghubungkan sub halaman **Hibah** di aplikasi Manhub dengan data Google Sheet Anda.

---

## 1. Persiapan Google Sheet

1. Buat sebuah spreadsheet baru di Google Sheets.
2. Ubah nama tab (sheet) pertama menjadi **`hibah`** (menggunakan huruf kecil semua).
3. Buat baris pertama (Header) berisi kolom-kolom berikut persis seperti di bawah ini:

| No | Sumber Dana | Jenis Sumber Dana | Komponen Kegiatan | 2026 | 2027 | 2028 | 2029 | 2030 | 2031 | PIC |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Bank Dunia | Luar Negeri | Renovasi Lab Kesehatan | 500000000 | 250000000 | 0 | 0 | 0 | 0 | Tim IT |

> [!IMPORTANT]
> Pastikan nama tab adalah **`hibah`** agar script dapat menemukan lembar kerja Anda dengan benar.

---

## 2. Pemasangan Google Apps Script

1. Di Google Sheets Anda, buka menu **Extensions** > **Apps Script** (Ekstensi > Apps Script).
2. Hapus semua kode default di editor, lalu salin dan tempelkan kode berikut:

```javascript
// ==========================================
// GOOGLE APPS SCRIPT FOR HIBAH MODULE (v1.0)
// ==========================================

// PENTING: Ganti ID di bawah ini dengan ID spreadsheet Anda.
// Anda dapat melihat ID spreadsheet pada URL: https://docs.google.com/spreadsheets/d/[ID_SPREADSHEET_ANDA]/edit
const SPREADSHEET_ID = 'MASUKKAN_ID_SPREADSHEET_ANDA_DI_SINI';

function doGet(e) {
  try {
    const action = e.parameter.action;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    if (action === 'getHibah') return getHibahData(ss);
    
    return errorResponse('Aksi tidak valid: ' + action);
  } catch (err) {
    return errorResponse('Error doGet: ' + err.toString());
  }
}

function doPost(e) {
  return errorResponse('POST tidak didukung untuk modul ini.');
}

// Fungsi pembantu pencarian sheet secara robust (tidak sensitif huruf besar/kecil & spasi)
function getSheetRobust(ss, name) {
  const target = name.toLowerCase().trim();
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    const sheetName = sheets[i].getName().toLowerCase().trim();
    if (sheetName === target) return sheets[i];
  }
  return null;
}

function getHibahData(ss) {
  const sheet = getSheetRobust(ss, 'hibah');
  if (!sheet) {
    const available = ss.getSheets().map(s => s.getName()).join(', ');
    return errorResponse(`Sheet "hibah" tidak ditemukan. Tersedia: [${available}]`);
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return successResponse([]);
  
  // Ambil header asli di baris pertama
  const headers = data[0].map(h => h.toString().trim());
  const rows = data.slice(1);
  
  const result = rows.map((row) => {
    let obj = {};
    headers.forEach((header, i) => {
      if (header) {
        obj[header] = row[i];
      }
    });
    return obj;
  });
  
  return successResponse(result);
}

function successResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(msg) {
  return ContentService.createTextOutput(JSON.stringify({ error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Ganti `'MASUKKAN_ID_SPREADSHEET_ANDA_DI_SINI'` dengan ID spreadsheet Anda.
4. Klik tombol **Save** (ikon disket) untuk menyimpan proyek.

---

## 3. Publikasikan Apps Script Sebagai Web App

Aplikasi Manhub membutuhkan URL Web App publik untuk mengambil data. Ikuti langkah ini:

1. Di dalam editor Apps Script, klik tombol **Deploy** di kanan atas > pilih **New deployment**.
2. Klik ikon gir (Select type) > pilih **Web app**.
3. Atur konfigurasi berikut:
   - **Description**: `Manhub Hibah Service`
   - **Execute as**: `Me (email_anda@gmail.com)`
   - **Who has access**: `Anyone` (PENTING! Agar aplikasi dapat mengakses data)
4. Klik **Deploy**.
5. Jika diminta otorisasi, klik **Authorize Access**, pilih akun Google Anda, klik **Advanced** > **Go to ... (unsafe)**, lalu pilih **Allow**.
6. Setelah berhasil, Anda akan mendapatkan **Web App URL**. Salin URL tersebut.
   - Contoh URL: `https://script.google.com/macros/s/AKfycb.../exec`

---

## 4. Hubungkan Ke Aplikasi Manhub

1. Buka file `src/services/googleSheets.ts` di folder proyek Anda.
2. Cari konstanta `HIBAH_SHEET_URL` di bagian atas file:
   ```typescript
   const HIBAH_SHEET_URL = 'PASTE_YOUR_HIBAH_SHEET_URL_HERE';
   ```
3. Ubah nilainya menjadi URL Web App yang sudah Anda salin:
   ```typescript
   const HIBAH_SHEET_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
4. Simpan file. Halaman "Hibah" sekarang terhubung dengan spreadsheet Anda!
