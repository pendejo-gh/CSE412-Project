// CSE 412 
// Team Members: Smit Desai, Tanmay Chaudhari, Christopher Hernandez, Gage Smith
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

// --------- ROUTES ---------

app.post('/signup', async (req, res) => {
    const { c_firstname, c_lastname, email, c_phonenumber } = req.body;

    if (!c_firstname || !c_lastname || !email || !c_phonenumber) {
        return res.status(400).json({ message: 'All fields are required for signup' });
    }

    try {
        // Check if the email already exists
        const existingCustomer = await pool.query('SELECT * FROM customer WHERE c_email = $1', [email]);
        if (existingCustomer.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered. Please log in.' });
        }

        // Insert the new customer into the database
        const result = await pool.query(
            `INSERT INTO customer (c_firstname, c_lastname, c_email, c_phonenumber)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [c_firstname, c_lastname, email, c_phonenumber]
        );

        return res.json({ success: true, message: 'Signup successful!', customer: result.rows[0] });
    } catch (err) {
        console.error('Error during signup:', err.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.post('/login', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required for login' });
    }

    try {
        // Check if the customer exists in the database
        const result = await pool.query('SELECT * FROM customer WHERE c_email = $1', [email]);
        if (result.rows.length > 0) {
            return res.json({ success: true, message: 'Login successful', customer: result.rows[0] });
        } else {
            return res.status(404).json({ success: false, message: 'No email registered. Please sign up.' });
        }
    } catch (err) {
        console.error('Error during customer login:', err.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Get all restaurants
app.get('/restaurants', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM restaurant');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching restaurants:', err.message);
        res.status(500).send('Failed to fetch restaurants');
    }
});

// Add a new online order
app.post('/orders', async (req, res) => {
    const { c_id, rtr_id, oo_ordercontents, oo_pickupdelivery, oo_status, oo_ordertotal } = req.body;

    if (!c_id || !rtr_id || !oo_ordercontents || !oo_pickupdelivery || !oo_status || !oo_ordertotal) {
        return res.status(400).json({ error: 'All order fields are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO onlineorder (c_id, rtr_id, oo_ordercontents, oo_pickupdelivery, oo_status, oo_ordertotal)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING oo_id`,
            [c_id, rtr_id, oo_ordercontents, oo_pickupdelivery, oo_status, oo_ordertotal]
        );

        res.json({
            message: 'Order placed successfully!',
            orderId: result.rows[0].oo_id,
        });
    } catch (err) {
        console.error('Error placing order:', err.message);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// Get menu for a specific restaurant
app.get('/restaurants/:id/menu', async (req, res) => {
    const { id } = req.params; // Extract restaurant ID from URL params
    console.log(`Fetching menu for restaurant ID: ${id}`); // Log the restaurant ID

    try {
        const result = await pool.query('SELECT * FROM menu WHERE rtr_id = $1', [id]);
        res.json(result.rows); // Send the menu items as JSON response
    } catch (err) {
        console.error('Error fetching menu:', err.message);
        res.status(500).send('Failed to fetch menu');
    }
});

// Add a menu item
app.post('/restaurants/:id/menu', async (req, res) => {
    const { id } = req.params;
    const { item_name, item_price } = req.body;

    if (!item_name || !item_price) {
        return res.status(400).json({ error: 'Item name and price are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO menu (rtr_id, item_name, item_price)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [id, item_name, item_price]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding menu item:', err.message);
        res.status(500).send('Failed to add menu item');
    }
});

// Delete a menu item
app.delete('/restaurants/:id/menu/:menuId', async (req, res) => {
    const { menuId } = req.params;
    try {
        await pool.query('DELETE FROM menu WHERE menu_id = $1', [menuId]);
        res.json({ message: 'Menu item deleted successfully' });
    } catch (err) {
        console.error('Error deleting menu item:', err.message);
        res.status(500).send('Failed to delete menu item');
    }
});

// Get all tables for a specific restaurant
app.get('/restaurants/:id/tables', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tables WHERE rtr_id = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching tables:', err.message);
        res.status(500).send('Failed to fetch tables');
    }
});

// Add a table to a restaurant
app.post('/restaurants/:id/tables', async (req, res) => {
    const { id } = req.params;
    const { t_capacity } = req.body;

    if (!t_capacity) {
        return res.status(400).json({ error: 'Table capacity is required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO tables (rtr_id, t_capacity, t_status)
             VALUES ($1, $2, 'available')
             RETURNING *`,
            [id, t_capacity]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding table:', err.message);
        res.status(500).send('Failed to add table');
    }
});

// Delete a table
app.delete('/restaurants/:id/tables/:tableId', async (req, res) => {
    const { tableId } = req.params;
    try {
        await pool.query('DELETE FROM tables WHERE t_id = $1', [tableId]);
        res.json({ message: 'Table deleted successfully' });
    } catch (err) {
        console.error('Error deleting table:', err.message);
        res.status(500).send('Failed to delete table');
    }
});

// Add a reservation
app.post('/reservations', async (req, res) => {
    const { c_id, rtr_id, rsvt_datetime, rsvt_partysize, rsvt_status } = req.body;

    if (!c_id || !rtr_id || !rsvt_datetime || !rsvt_partysize || !rsvt_status) {
        return res.status(400).json({ error: 'All reservation details are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO reservation (c_id, rtr_id, rsvt_datetime, rsvt_partysize, rsvt_status)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING rsvt_id`,
            [c_id, rtr_id, rsvt_datetime, rsvt_partysize, rsvt_status]
        );
        res.json({
            message: 'Reservation confirmed successfully!',
            rsvt_id: result.rows[0].rsvt_id,
        });
    } catch (err) {
        console.error('Error creating reservation:', err.message);
        res.status(500).send('Failed to create reservation');
    }
});

// Add a review
app.post('/reviews', async (req, res) => {
    const { rtr_id, rv_rating, rv_comment, c_id } = req.body;

    if (!rtr_id || !rv_rating || !rv_comment || !c_id) {
        return res.status(400).json({ error: 'All review details are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO review (rtr_id, rv_rating, rv_comment, rv_dateposted, c_id)
             VALUES ($1, $2, $3, NOW(), $4)
             RETURNING rv_id`,
            [rtr_id, rv_rating, rv_comment, c_id]
        );
        res.json({
            message: 'Thank you for your valuable response!',
            reviewId: result.rows[0].rv_id,
        });
    } catch (err) {
        console.error('Error creating review:', err.message);
        res.status(500).send('Failed to submit review');
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant Reservation API');
});

// --------- SERVER ---------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
