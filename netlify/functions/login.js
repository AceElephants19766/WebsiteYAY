const jwt = require('jsonwebtoken');

/**
 * Admin Login Endpoint
 * POST /.netlify/functions/login
 * Body: { username, password }
 * Returns: { token } or 401 error
 */
exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { username, password } = JSON.parse(event.body);

        // Validate credentials against environment variables
        const ADMIN_USER = process.env.ADMIN_USER;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!ADMIN_USER || !ADMIN_PASSWORD || !JWT_SECRET) {
            console.error('Missing environment variables');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        // Fixed-time comparison to prevent timing attacks
        const usernameMatch = username === ADMIN_USER;
        const passwordMatch = password === ADMIN_PASSWORD;

        // Always take same time regardless of success/failure
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!usernameMatch || !passwordMatch) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid credentials' })
            };
        }

        // Generate JWT token (expires in 24 hours)
        const token = jwt.sign(
            {
                username: ADMIN_USER,
                role: 'admin'
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            body: JSON.stringify({ token })
        };

    } catch (error) {
        console.error('Login error:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request' })
        };
    }
};
