async function testApi() {
    // 1. Test Direct Backend
    const backendUrl = 'http://localhost:5000/api/auth/login';
    console.log(`\nTesting Direct Backend (${backendUrl})...`);

    try {
        const res = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roll_no: 'ADMIN01', password: 'admin123' })
        });

        const data = await res.json();

        if (res.ok) {
            console.log('✅ BACKEND LOGIN SUCCESS!');
            console.log('Token:', data.token ? 'Received' : 'Missing');
        } else {
            console.log('❌ BACKEND LOGIN FAILED:', res.status, data.message);
        }
    } catch (err) {
        console.error('❌ BACKEND CONNECTION ERROR:', err.code || err.message);
    }

    // 2. Test Frontend Proxy
    const proxyUrl = 'http://localhost:3000/api/auth/login';
    console.log(`\nTesting Frontend Proxy (${proxyUrl})...`);

    try {
        const res = await fetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roll_no: 'ADMIN01', password: 'admin123' })
        });

        let data;
        try { data = await res.json(); } catch (e) { data = 'Non-JSON Response'; }

        if (res.ok) {
            console.log('✅ PROXY LOGIN SUCCESS!');
        } else {
            console.log('❌ PROXY LOGIN FAILED:', res.status);
            console.log('Response:', typeof data === 'string' ? data.substring(0, 100) : data.message);
        }
    } catch (err) {
        console.error('❌ PROXY CONNECTION ERROR:', err.code || err.message);
    }
}

testApi();
