const url = 'https://script.google.com/macros/s/AKfycbwfCmI6l5iNIYGew6VkzLwRDUDvPdVBQuY7zebXr8h_xsMSeRTupK7kRC-kuWY0mUixQg/exec';

async function testAction(action) {
  const payload = {
    action: action,
    namapemohon: 'TEST',
    unitkerja: 'Test Unit',
    namabarang: 'Kertas',
    kodebarang: 'A4',
    jumlah: 1,
    satuan: 'rim',
    keterangan: 'Test',
    timestamp: new Date().toISOString()
  };
  
  try {
    const response = await fetch(url + '?action=' + action);
    const dataGET = await response.text();
    
    // We only want to print first 60 chars of data
    let printGet = dataGET;
    if (dataGET.startsWith('[')) {
        const json = JSON.parse(dataGET);
        printGet = `Array with ${json.length} items. Keys: ${Object.keys(json[0] || {}).join(', ')}`;
    }
    
    const resPost = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const dataPOST = await resPost.text();
    
    console.log(`Action: ${action} | GET: ${printGet.substring(0, 60)}... | POST: ${dataPOST.substring(0, 60)}...`);
  } catch (err) {
    console.log(`Action: ${action} | Error: ${err.message}`);
  }
}

async function run() {
  await testAction('getAtkHistory');
  await testAction('getRiwayatAtk');
  await testAction('getPermintaanAtk');
  await testAction('getPermintaanATK');
  await testAction('addAtkRequest');
  // Just to see what addAtkRequest complains about
  await testAction('addPermintaanAtk');
}

run();
