# MongoDB Setup Guide for SA'ADA Students' Union

This guide will help you set up MongoDB and resolve any dependency issues in the Next.js application.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/saada-union
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Clear Cache (if needed)

```bash
npm run clear-cache
```

### 4. Start Development Server

```bash
npm run dev
```

## 🔧 MongoDB Configuration

### Local MongoDB Setup

1. **Install MongoDB Community Edition:**
   - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Follow the installation guide for your operating system

2. **Start MongoDB Service:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   ```

### MongoDB Atlas (Cloud)

1. **Create a free MongoDB Atlas account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a new cluster:**
   - Choose the free tier (M0)
   - Select your preferred cloud provider and region

3. **Set up database access:**
   - Create a database user with read/write permissions
   - Note down the username and password

4. **Set up network access:**
   - Add your IP address or use `0.0.0.0/0` for all IPs (development only)

5. **Get your connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and replace `<password>` with your actual password

## 🧪 Testing Your Setup

### 1. Test MongoDB Connection

Visit: `http://localhost:3000/api/test-mongodb`

You should see a response like:
```json
{
  "success": true,
  "message": "MongoDB connection successful",
  "database": "saada-union",
  "collections": [],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Authentication System

Visit: `http://localhost:3000/test-auth`

This page will show you:
- Current authentication status
- User information (if logged in)
- Role-based permissions
- Session data
- Next steps based on your authentication state

### 3. Test Login System

1. Visit: `http://localhost:3000/login`
2. Use one of the demo accounts:
   - **Admin:** `admin@saada.com` / `Admin123!`
   - **Moderator:** `moderator@saada.com` / `Moderator123!`
   - **User:** `user@saada.com` / `User123!`

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. MongoDB Dependency Errors

If you see errors like:
```
Module not found: Can't resolve 'mongodb-client-encryption'
Module not found: Can't resolve 'kerberos'
```

**Solution:**
```bash
npm run clear-cache
npm install --legacy-peer-deps
```

#### 2. SessionProvider Error

If you see:
```
Error: [next-auth]: `useSession` must be wrapped in a <SessionProvider />
```

**Solution:**
- Ensure the SessionProvider is properly configured in `app/layout.tsx`
- Check that all components using `useSession` are inside the SessionProvider

#### 3. Connection Timeout

If MongoDB connection times out:

**Check:**
- MongoDB service is running
- Connection string is correct
- Network access is configured (for Atlas)
- Firewall settings

#### 4. Authentication Errors

If you get authentication errors:

**For Local MongoDB:**
- Ensure no authentication is required for local development
- Or create a user with proper permissions

**For MongoDB Atlas:**
- Verify username and password are correct
- Check if the user has the right permissions

#### 5. Next.js Build Errors

If you get build errors related to MongoDB:

**Solution:**
```bash
# Clear all caches
rm -rf .next
rm -rf node_modules/.cache
npm install --legacy-peer-deps
```

#### 6. Port Already in Use

If you see "Port 3000 is in use":

**Solution:**
- The server will automatically try port 3001
- Or kill the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:3000 | xargs kill -9
  ```

## 📁 Project Structure

```
├── lib/
│   ├── mongodb.ts          # Main MongoDB client
│   └── mongodb-utils.ts    # Utility functions
├── app/api/
│   ├── auth/               # Authentication endpoints
│   ├── user/               # User management endpoints
│   ├── test-mongodb/       # MongoDB test endpoint
│   └── test-auth/          # Authentication test page
├── hooks/
│   └── useAuth.ts          # Authentication hook
├── components/
│   ├── session-provider.tsx # NextAuth SessionProvider
│   └── navbar.tsx          # Navigation with auth
└── middleware.ts           # Route protection
```

## 🔐 Authentication System

The application includes a comprehensive authentication system with:

- **User Roles:** USER, ADMIN, MODERATOR
- **Role-based Access Control**
- **Protected Routes**
- **User Profile Management**

### Demo Accounts

For testing purposes, you can use these demo accounts:

- **Admin:** `admin@saada.com` / `Admin123!`
- **Moderator:** `moderator@saada.com` / `Moderator123!`
- **User:** `user@saada.com` / `User123!`

### Authentication Flow

1. **Registration:** Users can create accounts at `/signup`
2. **Login:** Users can sign in at `/login`
3. **Role-based Redirects:** 
   - Admins → `/admin`
   - Users → `/` (homepage)
4. **Protected Routes:** Some pages require authentication
5. **Profile Management:** Users can edit profiles at `/profile`

## 🚀 Production Deployment

### Environment Variables

For production, ensure these environment variables are set:

```env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=your-secure-secret-key
NEXTAUTH_URL=https://your-domain.com
```

### Build and Deploy

```bash
npm run build
npm start
```

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify your MongoDB connection string
3. Ensure all dependencies are installed correctly
4. Clear the Next.js cache and reinstall dependencies
5. Test the authentication system at `/test-auth`

## 🔄 Updates and Maintenance

To update the project:

```bash
# Pull latest changes
git pull

# Clear cache and reinstall
npm run clear-cache
npm install --legacy-peer-deps

# Start development server
npm run dev
```

## 🎯 Quick Test Checklist

After setup, verify everything works:

- [ ] MongoDB connection test: `/api/test-mongodb`
- [ ] Authentication test page: `/test-auth`
- [ ] Login page: `/login`
- [ ] Registration page: `/signup`
- [ ] Admin panel (if admin): `/admin`
- [ ] User profile: `/profile`

---

**Note:** This project uses MongoDB 5.9.2 and Next.js 15.2.4. Make sure your MongoDB version is compatible. 