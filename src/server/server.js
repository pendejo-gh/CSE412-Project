import pkg from 'pg';
const { Pool } = pkg;

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://data_owner:51utpIEKxUMs@ep-tight-bush-a6wob1nh.us-west-2.aws.neon.tech/data?sslmode=require',
    ssl: { rejectUnauthorized: false },
});

// Get all restaurants
app.get('/restaurants', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM restaurant');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add an order
app.post('/orders', async (req, res) => {
    const { c_id, rtr_id, oo_ordercontents, oo_pickupdelivery, oo_status, oo_ordertotal } = req.body;

    try {
        // Insert into onlineorder table and return the unique order ID (oo_id)
        const result = await pool.query(
            `INSERT INTO onlineorder (c_id, rtr_id, oo_ordercontents, oo_pickupdelivery, oo_status, oo_ordertotal)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING oo_id`,
            [c_id, rtr_id, oo_ordercontents, oo_pickupdelivery, oo_status, oo_ordertotal]
        );

        // Send a success response with the generated oo_id
        res.json({
            message: 'Order created successfully!',
            orderId: result.rows[0].oo_id
        });
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).json({ error: 'Failed to create order. Please try again.' });
    }
});

// Get menu for a specific restaurant
app.get('/restaurants/:id/menus', async (req, res) => {
    const { id } = req.params; // Get restaurant ID from URL params
    try {
        const result = await pool.query('SELECT * FROM menu WHERE rtr_id = $1', [id]);
        res.json(result.rows); // Return the menu items for the given restaurant
    } catch (err) {
        console.error('Error fetching menu:', err.message);
        res.status(500).send('Server error');
    }
});

// Add a review
app.post('/reviews', async (req, res) => {
    const { rtr_id, rv_rating, rv_comment, c_id } = req.body;

    try {
        // Insert review into the database
        const result = await pool.query(
            `INSERT INTO review (rtr_id, rv_rating, rv_comment, rv_dateposted, c_id)
             VALUES ($1, $2, $3, NOW(), $4)
             RETURNING rv_id`,
            [rtr_id, rv_rating, rv_comment, c_id]
        );

        // Respond with success message and the review ID
        res.json({
            message: 'Thank you for your valuable response!',
            reviewId: result.rows[0].rv_id,
        });
    } catch (err) {
        console.error('Error creating review:', err.message);
        res.status(500).json({ error: 'Failed to submit review. Please try again.' });
    }
});


// Add a reservation
// Add a reservation
app.post('/reservations', async (req, res) => {
    const { c_id, rtr_id, rsvt_datetime, rsvt_partysize, rsvt_status } = req.body;
    try {
        // Insert into reservation table and return the unique reservation ID (rsvt_id)
        const result = await pool.query(
            `INSERT INTO reservation (c_id, rtr_id, rsvt_datetime, rsvt_partysize, rsvt_status)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING rsvt_id`,
            [c_id, rtr_id, rsvt_datetime, rsvt_partysize, rsvt_status]
        );

        // Respond with success message and reservation ID
        res.json({
            message: 'Reservation confirmed successfully!',
            rsvt_id: result.rows[0].rsvt_id,
        });
    } catch (err) {
        console.error('Error creating reservation:', err.message);
        res.status(500).json({ error: 'Failed to create reservation. Please try again.' });
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant Reservation API');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

