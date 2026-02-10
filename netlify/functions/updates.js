const { Pool } = require('pg');

/**
 * Public Updates Endpoint
 * GET /.netlify/functions/updates?limit=20
 * Returns published updates ordered by published_at DESC
 */

// Create connection pool (reused across invocations)
let pool;

function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
    }
    return pool;
}

exports.handler = async (event) => {
    // Only allow GET
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const limit = parseInt(event.queryStringParameters?.limit || '20', 10);

        // Validate limit
        if (limit < 1 || limit > 100) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Limit must be between 1 and 100' })
            };
        }

        const pool = getPool();

        // Query published updates only
        const result = await pool.query(
            `SELECT id, title, body, published_at, created_at, updated_at
       FROM updates
       WHERE status = 'published' AND published_at IS NOT NULL
       ORDER BY published_at DESC
       LIMIT $1`,
            [limit]
        );

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60' // Cache for 1 minute
            },
            body: JSON.stringify({
                updates: result.rows,
                count: result.rows.length
            })
        };

    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch updates' })
        };
    }
};
