# FINAL Google Sheets & Apps Script Setup (v3 - Ultra Robust)

Gunakan script ini jika Anda masih mendapatkan error "Sheet tidak ditemukan". Script ini akan mencari nama tab tanpa memperdulikan spasi atau huruf besar/kecil.

## 1. Persiapan Sheet
Pastikan tab Anda bernama **`Budget`** dan **`EOTM`**.

---

## 2. Universal Apps Script (Versi Stabil v3)

```javascript
const SPREADSHEET_ID = '1FrxJ4ajv90hLhyxRO-sp3m3oXFZJUMElYd7Ax4Suixg'; // ID Sudah diperbarui

function doGet(e) {
  try {
    const action = e.parameter.action;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Fitur Diagnosa Baru: List semua sheet yang ada
    if (action === 'listSheets') {
      const sheets = ss.getSheets().map(s => `"${s.getName()}"`);
      return successResponse({ sheets: sheets });
    }
    
    if (action === 'getBudget') return getData(ss, 'Budget');
    if (action === 'getEotm') return getData(ss, 'EOTM');
    
    return errorResponse('Aksi tidak valid: ' + action);
  } catch (err) {
    return errorResponse('Error doGet: ' + err.toString());
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'addBudget') return addData(ss, 'Budget', data);
    if (action === 'deleteBudget') return deleteData(ss, 'Budget', data.id);
    if (action === 'addEotm') return addData(ss, 'EOTM', data);
    if (action === 'updateEotm') return updateData(ss, 'EOTM', data);
    if (action === 'deleteEotm') return deleteData(ss, 'EOTM', data.id);

    return errorResponse('Aksi POST tidak valid');
  } catch (err) {
    return errorResponse('Error doPost: ' + err.toString());
  }
}

// --- Fungsi Pendukung Robust ---

function getSheetRobust(ss, name) {
  // Cari sheet berdasarkan nama (Case-insensitive & Trimmed)
  const target = name.toLowerCase().trim();
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    const sheetName = sheets[i].getName().toLowerCase().trim();
    if (sheetName === target) return sheets[i];
  }
  return null;
}

function getData(ss, sheetName) {
  const sheet = getSheetRobust(ss, sheetName);
  if (!sheet) {
    const available = ss.getSheets().map(s => s.getName()).join(', ');
    return errorResponse(`Sheet "${sheetName}" tidak ditemukan. Tersedia: [${available}]`);
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return successResponse([]);
  
  const headers = data[0].map(h => h.toString().trim().toLowerCase());
  const rows = data.slice(1);
  
  const result = rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      if (header) obj[header] = row[i];
    });
    return obj;
  });
  
  return successResponse(result);
}

function addData(ss, sheetName, data) {
  const sheet = getSheetRobust(ss, sheetName);
  if (!sheet) return errorResponse(`Sheet "${sheetName}" tidak ditemukan.`);
  
  const lastRow = sheet.getLastRow();
  let newId = 1;
  if (lastRow > 1) {
    const val = sheet.getRange(lastRow, 1).getValue();
    newId = (typeof val === 'number') ? val + 1 : 1;
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => h.toString().trim().toLowerCase());
  const newRowData = headers.map(h => {
    if (h === 'id') return newId;
    const key = Object.keys(data).find(k => k.toLowerCase() === h);
    return key ? data[key] : '';
  });
  
  sheet.appendRow(newRowData);
  return successResponse({ id: newId });
}

// ... updateData dan deleteData juga menggunakan getSheetRobust ...
function updateData(ss, sheetName, data) {
  const sheet = getSheetRobust(ss, sheetName);
  if (!sheet) return errorResponse('Sheet not found');
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(h => h.toString().trim().toLowerCase());
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == data.id) {
      headers.forEach((h, colIndex) => {
        if (h !== 'id') {
          const key = Object.keys(data).find(k => k.toLowerCase() === h);
          if (key !== undefined) sheet.getRange(i + 1, colIndex + 1).setValue(data[key]);
        }
      });
      return successResponse('Updated');
    }
  }
  return errorResponse('ID tidak ditemukan');
}

function deleteData(ss, sheetName, id) {
  const sheet = getSheetRobust(ss, sheetName);
  if (!sheet) return errorResponse('Sheet not found');
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == id) {
      sheet.deleteRow(i + 1);
      return successResponse('Deleted');
    }
  }
  return errorResponse('ID tidak ditemukan');
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
