const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', adminRoutes);

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
    try {
        // Check tables table structure
        const tableStructure = await pool.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE table_name = 'tables'
        `);
        console.log('Tables table structure:', tableStructure.rows);

        // Test a simple select from tables
        const tablesTest = await pool.query('SELECT * FROM tables LIMIT 1');
        console.log('Sample table record:', tablesTest.rows);

    } catch (err) {
        console.error('Startup diagnostic error:', err);
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: err.message });
});