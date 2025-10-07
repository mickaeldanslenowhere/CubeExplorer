# Getting Started Guide - CubeExplorer Web

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# From project root
npm run install:all
```

### 2. Start Development Mode

```bash
# Start frontend and backend simultaneously
npm run dev
```

Or separately:

```bash
# Terminal 1 - Backend (port 3001)
cd backend
npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## 📁 Folder Structure

```
CubeExplorerWeb/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── hooks/         # Custom Hooks
│   │   ├── utils/         # Utilities
│   │   └── types/        # TypeScript Types
│   └── public/           # Static Assets
├── backend/           # Node.js + Express + Socket.io
│   ├── src/
│   │   ├── routes/       # API Routes
│   │   ├── services/     # Business Logic
│   │   └── utils/        # Utilities
│   └── dist/            # TypeScript Build
└── shared/            # Shared Code
    ├── src/
    │   ├── types/       # Shared Types
    │   └── algorithms/  # Cube Algorithms
    └── dist/            # TypeScript Build
```

## 🛠️ Available Scripts

### Main Scripts
- `npm run dev` - Start frontend and backend
- `npm run build` - Full project build
- `npm run install:all` - Install all dependencies

### Component Scripts
- `npm run dev:frontend` - Frontend only
- `npm run dev:backend` - Backend only
- `npm run build:frontend` - Build frontend
- `npm run build:backend` - Build backend
- `npm run build:shared` - Build shared

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### TypeScript Configuration

Each folder has its own `tsconfig.json` configured for:
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Shared**: Shared code with declarations

## 🎯 Next Steps

1. **3D Cube Component**: Create React Three Fiber component
2. **Algorithms**: Implement solving algorithms
3. **Interface**: Develop UI/UX
4. **Tests**: Add unit tests
5. **Deployment**: Production configuration

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change port in environment variables
2. **Missing dependencies**: Re-run `npm run install:all`
3. **TypeScript errors**: Check tsconfig.json configuration

### Useful Logs

- Backend: Logs in terminal console
- Frontend: Logs in browser console
- Socket.io: Connections in backend console
