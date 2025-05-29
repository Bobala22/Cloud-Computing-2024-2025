const axios = require('axios');

module.exports = async function (context, req) {
    try {
        const url = 'https://sendnotif.azurewebsites.net';
        const data = {
            key1: 'value1',
            key2: 'value2',
        };

        const response = await axios.post(url, data);
        
        context.log('Success:', response.data);
        
        return {
            status: 200,
            body: response.data
        };
    } catch (error) {
        context.log.error('Error:', error.response ? error.response.data : error.message);
        
        return {
            status: 500,
            body: {
                error: error.response ? error.response.data : error.message
            }
        };
    }
};