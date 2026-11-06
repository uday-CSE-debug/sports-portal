async function testRecommendations() {
    try {
        const baseUrl = 'http://localhost:5003/api';

        // 1. Login to get token
        console.log('Logging in...');
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'student@example.com',
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            const errData = await loginRes.json();
            throw new Error(`Login failed: ${JSON.stringify(errData)}`);
        }
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Got Token:', token ? 'Yes' : 'No');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 2. Log an activity
        await fetch(`${baseUrl}/recommendations/activity`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                activity_type: 'VIEW',
                target_type: 'CATEGORY',
                target_id: 'Cricket'
            })
        });
        console.log('Logged Activity: Cricket View');

        // 3. Get Recommendations
        const recRes = await fetch(`${baseUrl}/recommendations`, { headers });
        const recData = await recRes.json();
        console.log('Recommendations:', JSON.stringify(recData, null, 2));

        // 4. Get Slots
        const equipRes = await fetch(`${baseUrl}/equipment/category/Cricket`, { headers });
        const equipData = await equipRes.json();

        if (equipData.length > 0) {
            const eqId = equipData[0].id;
            const today = new Date().toISOString().split('T')[0];
            const slotRes = await fetch(`${baseUrl}/recommendations/slots?equipment_id=${eqId}&date=${today}`, { headers });
            const slotData = await slotRes.json();
            console.log('Optimized Slots:', JSON.stringify(slotData.slots ? slotData.slots.slice(0, 3) : slotData, null, 2));
        } else {
            console.log('No equipment found to test slots');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testRecommendations();
