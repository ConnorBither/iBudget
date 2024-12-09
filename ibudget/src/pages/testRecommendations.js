const axios = require('axios');

async function testRecommendations() {
  try {
    const response = await axios.get('http://localhost:5000/recommendations', {
      params: { customerID: '993229' }, // Ensure this matches the server-side logic
    });
    console.log('Recommendations:', response.data);
  } catch (error) {
    console.error(
      'Error fetching recommendations:',
      error.response ? error.response.data : error.message
    );
  }
}

testRecommendations();
