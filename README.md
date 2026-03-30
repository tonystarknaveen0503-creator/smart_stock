# Smart Stock

A full-stack stock market dashboard application with real-time data visualization.

## Features

- Real-time stock data visualization
- Stock search by ticker symbol
- Watchlist management
- Technical indicators (SMA, RSI)
- Dark/light mode toggle
- Responsive design

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, MongoDB, JWT Authentication

## Deployment on Render

### Backend Deployment

1. Go to [Render](https://render.com) and sign up/login
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `smartstock-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string (or use Render's free MongoDB)
   - `JWT_SECRET`: A random secret key
   - `PORT`: `4000`
6. Click **Create Web Service**

### Frontend Deployment

1. Go to [Render](https://render.com) and sign up/login
2. Click **New +** → **Static Site**
3. Connect your GitHub repository
4. Configure the site:
   - **Name**: `smartstock-frontend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Add Environment Variables:
   - **Key**: `VITE_API_URL`, **Value**: Your backend URL (e.g., `https://smartstock-backend.onrender.com`)
6. Click **Create Static Site**

### Alternative: Deploy Backend with MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Add it as `MONGO_URI` in Render backend environment variables

## Local Development

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/health` - Health check
- `GET /api/dashboard/overview` - Dashboard data
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/:symbol` - Remove from watchlist

## Environment Variables

### Backend (.env)
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/smartstock
JWT_SECRET=your-secret-key
```

### Frontend
```
VITE_API_URL=http://localhost:4000
```

## License

ISC
