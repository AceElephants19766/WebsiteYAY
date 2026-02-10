const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

/**
 * Admin Updates CRUD Endpoint (JWT Protected)
 * GET    /.netlify/functions/admin-updates - List all updates
 * POST   /.netlify/functions/admin-updates - Create update
 * PUT    /.netlify/functions/admin-updates - Update update
 * DELETE /.netlify/functions/admin-updates?id=<uuid> - Delete update
 */

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

/**
 * Verify JWT token from Authorization header
 */
function verifyToken(event) {
    const authHeader = event.headers.authorization || event.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET not configured');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

/**
 * GET - List all updates (admin view)
 */
async function handleGet(pool) {
    const result = await pool.query(
        `SELECT id, title, body, status, published_at, created_at, updated_at
     FROM updates
     ORDER BY created_at DESC`
    );

    return {
        statusCode: 200,
        body: JSON.stringify({
            updates: result.rows,
            count: result.rows.length
        })
    };
}

/**
 * POST - Create new update
 */
async function handlePost(pool, body) {
    const { title, body: content, status = 'draft' } = JSON.parse(body);

    if (!title || !content) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Title and body are required' })
        };
    }

    if (!['draft', 'published'].includes(status)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid status' })
        };
    }

    // If publishing, set published_at to now
    const publishedAt = status === 'published' ? 'now()' : 'NULL';

    const result = await pool.query(
        `INSERT INTO updates (title, body, status, published_at)
     VALUES ($1, $2, $3, ${publishedAt})
     RETURNING id, title, body, status, published_at, created_at, updated_at`,
        [title, content, status]
    );

    return {
        statusCode: 201,
        body: JSON.stringify(result.rows[0])
    };
}

/**
 * PUT - Update existing update
 */
async function handlePut(pool, body) {
    const { id, title, body: content, status } = JSON.parse(body);

    if (!id || !title || !content || !status) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'ID, title, body, and status are required' })
        };
    }

    if (!['draft', 'published'].includes(status)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid status' })
        };
    }

    // Get current status to handle transitions
    const current = await pool.query(
        'SELECT status, published_at FROM updates WHERE id = $1',
        [id]
    );

    if (current.rows.length === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Update not found' })
        };
    }

    const currentStatus = current.rows[0].status;
    const currentPublishedAt = current.rows[0].published_at;

    // Determine published_at value
    let publishedAtClause;
    if (status === 'published' && !currentPublishedAt) {
        // Transitioning to published for first time
        publishedAtClause = 'published_at = now()';
    } else if (status === 'draft') {
        // Transitioning to draft - clear published_at
        publishedAtClause = 'published_at = NULL';
    } else {
        // Keep existing published_at
        publishedAtClause = `published_at = '${currentPublishedAt}'`;
    }

    const result = await pool.query(
        `UPDATE updates
     SET title = $1, body = $2, status = $3, ${publishedAtClause}
     WHERE id = $4
     RETURNING id, title, body, status, published_at, created_at, updated_at`,
        [title, content, status, id]
    );

    return {
        statusCode: 200,
        body: JSON.stringify(result.rows[0])
    };
}

/**
 * DELETE - Delete update
 */
async function handleDelete(pool, id) {
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'ID is required' })
        };
    }

    const result = await pool.query(
        'DELETE FROM updates WHERE id = $1 RETURNING id',
        [id]
    );

    if (result.rows.length === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Update not found' })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Update deleted successfully' })
    };
}

/**
 * Main handler
 */
exports.handler = async (event) => {
    // Verify JWT token
    try {
        verifyToken(event);
    } catch (error) {
        console.error('Auth error:', error.message);
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' })
        };
    }

    const pool = getPool();

    try {
        const method = event.httpMethod;

        switch (method) {
            case 'GET':
                return await handleGet(pool);

            case 'POST':
                return await handlePost(pool, event.body);

            case 'PUT':
                return await handlePut(pool, event.body);

            case 'DELETE':
                const id = event.queryStringParameters?.id;
                return await handleDelete(pool, id);

            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }
    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
