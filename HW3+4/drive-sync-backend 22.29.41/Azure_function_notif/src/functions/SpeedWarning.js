const { app } = require('@azure/functions');
const sql = require('mssql');
const dbConfig = require('../../config/dbConfig');

let pool = null;

async function getPool() {
    if (!pool) {
        try {
            pool = await sql.connect(dbConfig);
            pool.config.options.connectTimeout = 30000;
            pool.config.options.requestTimeout = 30000;
        } catch (err) {
            console.error('Database connection failed:', err.message);
            throw new Error('Database connection failed');
        }
    }
    return pool;
}

app.http('SpeedWarning', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('SpeedWarning function processing request');
        
        try {
            const pool = await getPool();
        
            const result = await pool.request()
                .query('SELECT TOP 1 speed FROM dbo.cars ORDER BY id DESC');
            
            if (result.recordset.length === 0) {
                context.log('No speed data found');
                return {
                    status: 404,
                    body: JSON.stringify({ message: "No speed data available" }),
                    headers: { 'Content-Type': 'application/json' }
                };
            }
            
            const currentSpeed = parseFloat(result.recordset[0].speed);
            context.log(`Current speed: ${currentSpeed}`);
            
            const response = {
                message: currentSpeed > 60 ? "go slower" : "Speed is acceptable",
                speed: currentSpeed
            };

            return {
                status: 200,
                body: JSON.stringify(response),
                headers: { 'Content-Type': 'application/json' }
            };
            
        } catch (error) {
            context.log.error(`Error checking speed: ${error.message}`);
            return {
                status: 500,
                body: JSON.stringify({ message: "An error occurred while checking speed" }),
                headers: { 'Content-Type': 'application/json' }
            };
        } finally {
            
        }
    }
});