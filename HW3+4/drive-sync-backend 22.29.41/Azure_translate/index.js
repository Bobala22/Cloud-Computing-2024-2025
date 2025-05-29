// server.js
const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const key = "Al8Qp1o3twXBkGQE3vHIjhQJwDpbbDvRgV29U18K9lpkvAltHHbGJQQJ99BEACgEuAYXJ3w3AAAbACOGGCD0";
const endpoint = "https://api.cognitive.microsofttranslator.com";
const location = "italynorth";

app.post('/', async (req, res) => {
  try {
    const textToTranslate = req.body.text || 'I would really like to drive your car around the block a few times!';

    const response = await axios({
      baseURL: endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      params: {
        'api-version': '3.0',
        'from': 'en',
        'to': 'fr,zu'
      },
      data: [{ 'text': textToTranslate }],
      responseType: 'json'
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
