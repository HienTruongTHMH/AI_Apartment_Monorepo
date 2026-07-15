const axios = require('axios');

async function test() {
  try {
    const res = await axios.patch('http://localhost:3000/api/listing/844e0c7e-579f-45b0-8a03-32eb76439085', {
      title: 'Test',
      pricePerMonth: 1000,
      apartment: {
        type: 'Normal',
        floor: 1,
        area: 50,
        bedroom: 1,
        bathroom: 1,
        livingroom: 1,
        kitchen: 1,
        room_number: 1,
        fullAddress: 'Test Address'
      }
    });
    console.log(res.status);
  } catch (err) {
    console.log(err.response.status);
    console.log(err.response.data);
  }
}

test();
