async function runTests() {
  const BASE_URL = 'http://localhost:3001';
  console.log('Testing APIs on dev server:', BASE_URL);

  try {
    // 1. Test History API
    console.log('\n--- 1. Testing /api/history ---');
    const historyRes = await fetch(`${BASE_URL}/api/history`);
    const historyData = await historyRes.json();
    console.log('GET /api/history Response:', historyRes.status);
    console.log('History data count:', historyData.data?.length);

    if (historyData.success) {
      console.log('✅ History API GET success');
    } else {
      console.log('❌ History API GET failed', historyData);
    }

    // 2. Test saving a document to History
    console.log('\n--- 2. Testing Saving to History ---');
    const saveRes = await fetch(`${BASE_URL}/api/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Test E2E Customer',
        customer_contact: '9999999999',
        document_type: 'affidavit',
        document_name: 'General Sworn Affidavit',
        operator_name: 'E2E Test Bot',
        system_name: 'System E2E',
        amount: 250,
        status: 'Printed',
        document_data: JSON.stringify({ test: 'data' })
      })
    });
    const saveData = await saveRes.json();
    console.log('POST /api/history Response:', saveRes.status);
    if (saveData.success) {
      console.log('✅ History API POST success. Saved ID:', saveData.data.id);
    } else {
      console.log('❌ History API POST failed', saveData);
    }

    // 3. Test Front End (SSR) Loads Successfully
    console.log('\n--- 3. Testing Frontend Load ---');
    const feRes = await fetch(BASE_URL);
    if (feRes.ok) {
      const html = await feRes.text();
      console.log('✅ Frontend HTML loaded successfully, length:', html.length);
      if (html.includes('Varma Xerox')) {
        console.log('✅ Frontend contains expected title/brand');
      } else {
        console.log('❌ Frontend missing title/brand');
      }
    } else {
      console.log('❌ Frontend failed to load', feRes.status);
    }

  } catch (err) {
    console.error('Error during testing:', err);
  }
}

runTests();
