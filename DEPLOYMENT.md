# Vercel + GoDaddy Setup

## 1) Push code to GitHub

Push this project to a GitHub repository.

## 2) Deploy on Vercel

1. Go to [Vercel](https://vercel.com/) and import the GitHub repository.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Install command: `npm install`.

## 3) Set environment variables on Vercel

Add these in **Project Settings > Environment Variables**:

- `JWT_SECRET` = long random string
- `ADMIN_USERNAME` = your admin username
- `ADMIN_PASSWORD` = your admin password
- `MONGODB_URI` = your MongoDB Atlas connection string
- `MONGODB_DB` = `luxe_bath_kitchen` (or your preferred db name)

## 4) Create MongoDB Atlas database

1. Create a free cluster in MongoDB Atlas.
2. Create DB user and password.
3. Allow Vercel access (temporary: `0.0.0.0/0`, then restrict later if needed).
4. Copy connection string into `MONGODB_URI`.

## 5) Connect GoDaddy domain to Vercel

1. In Vercel project, open **Settings > Domains** and add your GoDaddy domain.
2. Vercel shows required DNS records.
3. In GoDaddy DNS:
   - Add `A` record for `@` pointing to `76.76.21.21`
   - Add `CNAME` for `www` pointing to `cname.vercel-dns.com`
4. Wait for DNS propagation.

## 6) Verify

- Open your domain in browser.
- Test `/admin` login.
- Add/edit/delete product and refresh to confirm persistence.

