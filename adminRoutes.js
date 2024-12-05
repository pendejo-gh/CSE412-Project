const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all restaurants
router.get('/restaurants', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM restaurant ORDER BY rtr_id');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching restaurants:', err);
        res.status(500).json({ error: err.message });
    }
});


// Get menu items for a restaurant
router.get('/restaurants/:id/menu', async (req, res) => {
    try {
        console.log('Fetching menu for restaurant:', req.params.id);

        const result = await pool.query(
            'SELECT menu_id, rtr_id, item_name, item_price FROM menu WHERE rtr_id = $1',
            [req.params.id]
        );
        
        console.log('Menu items found:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching menu items:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get tables for a specific restaurant
router.get('/restaurants/:id/tables', async (req, res) => {
    try {
        const rtr_id = req.params.id;
        console.log('Fetching tables for restaurant:', rtr_id);

        // Now query tables directly with rtr_id
        const result = await pool.query(
            'SELECT t_id, t_capacity, t_status, rtr_id FROM tables WHERE rtr_id = $1 ORDER BY t_id',
            [rtr_id]
        );
        
        console.log('Tables found:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching tables:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add tables to a restaurant
// Add tables to a restaurant
router.post('/restaurants/:id/tables', async (req, res) => {
    const { numTables, capacity } = req.body;
    const rtr_id = req.params.id;
    
    try {
        await pool.query('BEGIN');
        
        // Check if restaurant exists
        const restaurantCheck = await pool.query(
            'SELECT rtr_numtables FROM restaurant WHERE rtr_id = $1',
            [rtr_id]
        );
        
        if (restaurantCheck.rows.length === 0) {
            throw new Error('Restaurant not found');
        }

        // Create the VALUES part of the query for multiple rows
        const values = [];
        const placeholders = [];
        
        for (let i = 0; i < numTables; i++) {
            values.push(capacity, 'available', rtr_id);
            const offset = i * 3; // 3 parameters per row
            placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);
        }

        // Insert all tables in one query
        const insertQuery = `
            INSERT INTO tables (t_capacity, t_status, rtr_id)
            VALUES ${placeholders.join(', ')}
            RETURNING *;
        `;

        const insertResult = await pool.query(insertQuery, values);
        const insertedTables = insertResult.rows;
        
        // Update restaurant's table count
        await pool.query(
            'UPDATE restaurant SET rtr_numtables = rtr_numtables + $1 WHERE rtr_id = $2',
            [numTables, rtr_id]
        );
        
        await pool.query('COMMIT');
        console.log('Successfully added tables:', insertedTables);
        res.json(insertedTables);
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error adding tables:', {
            message: err.message,
            code: err.code,
            detail: err.detail,
            stack: err.stack
        });
        res.status(500).json({ error: err.message });
    }
});

// Add menu item
router.post('/restaurants/:id/menu', async (req, res) => {
    try {
        const { name, price } = req.body;
        const rtr_id = req.params.id;
        
        // Check if restaurant exists
        const restaurantCheck = await pool.query(
            'SELECT rtr_id FROM restaurant WHERE rtr_id = $1',
            [rtr_id]
        );

        if (restaurantCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const result = await pool.query(
            'INSERT INTO menu (rtr_id, item_name, item_price) VALUES ($1, $2, $3) RETURNING *',
            [rtr_id, name, price]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding menu item:', err);
        res.status(500).json({ 
            error: 'Failed to add menu item',
            details: err.message 
        });
    }
});

module.exports = router;