const url = 'https://script.google.com/macros/s/AKfycbzB680czLYiEsvsb4G1ES4SrGId2hWNNr-TlPtlR9Bhx9-roA-v_rqGvQgybdPRPXVkWg/exec';

async function testAction(action) {
  try {
    const response = await fetch(url + '?action=' + action);
    const dataGET = await response.text();
    
    let printGet = dataGET;
    if (dataGET.startsWith('[')) {
        const json = JSON.parse(dataGET);
        printGet = `Array with ${json.length} items. Keys: ${Object.keys(json[0] || {}).join(', ')}`;
    }
    
    console.log(`Action: ${action} | GET: ${printGet.substring(0, 100)}...`);
  } catch (err) {
    console.log(`Action: ${action} | Error: ${err.message}`);
  }
}

async function run() {
  await testAction('getVehicleRequests');
  await testAction('getAtkMaster');
  await testAction('getAtkRequests');
}

run();
