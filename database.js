// database.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://data_owner:51utpIEKxUMs@ep-tight-bush-a6wob1nh.us-west-2.aws.neon.tech/data?sslmode=require',
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;