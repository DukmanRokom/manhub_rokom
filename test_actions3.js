const url = 'https://script.google.com/macros/s/AKfycbwfCmI6l5iNIYGew6VkzLwRDUDvPdVBQuY7zebXr8h_xsMSeRTupK7kRC-kuWY0mUixQg/exec';

async function countRows() {
    const response = await fetch(url + '?action=getAtkRequests');
    const dataGET = await response.json();
    return dataGET.length;
}

async function testAction(action) {
  const payload = {
    action: action,
    namapemohon: 'ANTIGRAVITY TEST',
    unitkerja: 'Test Unit',
    namabarang: 'Kertas',
    kodebarang: 'A4',
    jumlah: 1,
    satuan: 'rim',
    keterangan: 'Test',
    timestamp: new Date().toISOString()
  };
  
  try {
    const before = await countRows();
    console.log(`Rows before: ${before}`);
    
    const resPost = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const dataPOST = await resPost.text();
    console.log(`Action: ${action} POST: ${dataPOST}`);
    
    const after = await countRows();
    console.log(`Rows after: ${after}`);
  } catch (err) {
    console.log(`Action: ${action} | Error: ${err.message}`);
  }
}

testAction('addAtkRequest');
