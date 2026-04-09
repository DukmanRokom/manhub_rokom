const url = 'https://script.google.com/macros/s/AKfycbwfCmI6l5iNIYGew6VkzLwRDUDvPdVBQuY7zebXr8h_xsMSeRTupK7kRC-kuWY0mUixQg/exec';

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
  await testAction('getAtkMaster');
  await testAction('getAtkRequests');
}

run();
