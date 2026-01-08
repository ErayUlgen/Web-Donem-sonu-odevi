const axios = require('axios');

async function checkPrice() {
    try {
        const response = await axios.get('http://localhost:3000/events');
        // Sadece ilk etkinliğin fiyat ve isFree bilgisini yazdır
        if (response.data.length > 0) {
            console.log('First Event Price Info:', {
                id: response.data[0].id,
                title: response.data[0].title,
                isFree: response.data[0].isFree,
                price: response.data[0].price
            });
        } else {
            console.log('No events found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkPrice();
