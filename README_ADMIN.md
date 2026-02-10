# Admin News System Setup Guide

## Overview
This system allows you to manage news/updates for your website through an admin dashboard. Updates are stored in Neon Postgres and displayed automatically on the public site.

## Setup Instructions

### 1. Neon Database Setup

1. Go to [neon.tech](https://neon.tech) and create a new project
2. Create a new database (or use the default)
3. Copy your **pooled connection string** (should include port 5432)
4. Run the SQL schema:
   - Open Neon SQL Editor
   - Copy and paste contents of `db/schema.sql`
   - Execute the SQL

### 2. Netlify Environment Variables

In your Netlify dashboard, go to **Site Settings → Environment Variables** and add:

```
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
ADMIN_USER=your_admin_username
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_long_random_secret_string_min_32_chars
```

**Important:**
- Use the **pooled** connection string from Neon (not the direct one)
- Generate a strong JWT_SECRET (minimum 32 characters, random)
- Choose a secure ADMIN_PASSWORD

### 3. Install Dependencies

In your project directory:

```bash
npm install
```

This will install:
- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT authentication

### 4. Deploy to Netlify

```bash
# If using Netlify CLI
netlify deploy --prod

# Or connect your GitHub repo to Netlify
```

### 5. Test the System

1. **Public Page**: Visit `https://yoursite.netlify.app/news.html`
   - Should show "אין עדכונים זמינים" if no updates published yet

2. **Admin Login**: Visit `https://yoursite.netlify.app/admin.html`
   - Login with your ADMIN_USER and ADMIN_PASSWORD
   - Should see admin dashboard

3. **Create Update**:
   - Fill in title and body
   - Select status (טיוטה or פורסם)
   - Click שמור
   - Check public page to see published updates

## File Structure

```
/
├── admin.html              # Admin dashboard (protected)
├── news.html               # Public news page
├── netlify/
│   └── functions/
│       ├── login.js        # Admin authentication
│       ├── updates.js      # Public updates endpoint
│       └── admin-updates.js # Protected CRUD endpoint
├── db/
│   └── schema.sql          # Database schema
├── netlify.toml            # Netlify configuration
├── package.json            # Node dependencies
└── README_ADMIN.md         # This file
```

## API Endpoints

### Public
- `GET /.netlify/functions/updates?limit=20` - Get published updates

### Admin (requires JWT)
- `POST /.netlify/functions/login` - Admin login
- `GET /.netlify/functions/admin-updates` - List all updates
- `POST /.netlify/functions/admin-updates` - Create update
- `PUT /.netlify/functions/admin-updates` - Update update
- `DELETE /.netlify/functions/admin-updates?id=<uuid>` - Delete update

## Security Features

✅ No credentials in frontend code  
✅ JWT authentication with 24-hour expiry  
✅ Parameterized SQL queries (SQL injection protection)  
✅ HTTPS enforced (Netlify default)  
✅ Fixed response time for login (timing attack protection)  
✅ Admin page not indexed by search engines  

## Troubleshooting

### "Invalid credentials" when logging in
- Check ADMIN_USER and ADMIN_PASSWORD in Netlify env vars
- Make sure they match exactly (case-sensitive)

### "Failed to load updates"
- Check DATABASE_URL is correct
- Ensure you're using the **pooled** connection string
- Verify schema.sql was executed successfully

### "Unauthorized" in admin panel
- JWT token expired - logout and login again
- Check JWT_SECRET is set in Netlify env vars

### Database connection errors
- Neon requires SSL - connection string should include `?sslmode=require`
- Check database is not paused (Neon auto-pauses after inactivity)

## Updating the System

To add new features or modify updates:

1. Edit the relevant Netlify Function in `netlify/functions/`
2. Commit and push changes
3. Netlify will automatically redeploy

## Support

For issues, check:
1. Netlify Function logs (Netlify Dashboard → Functions)
2. Browser Console (F12) for frontend errors
3. Database logs in Neon dashboard
