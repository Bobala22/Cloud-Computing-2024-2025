const express = require('express');
const carRoutes = require('./routes/carRoutes');

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Routes
app.use('/api/azureCars', carRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});