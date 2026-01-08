const axios = require('axios');

async function checkPrice() {
    try {
        const response = await axios.get('http://localhost:3000/events');
        console.log('Events:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkPrice();
