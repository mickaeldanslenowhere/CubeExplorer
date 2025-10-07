# CubeExplorer Web

Modern web version of CubeExplorer, built with React and Node.js.

## Project Structure

```
CubeExplorerWeb/
├── frontend/          # React Application
├── backend/           # Node.js API
├── shared/            # Shared code between frontend and backend
└── docs/              # Documentation
```

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Three.js (3D cube rendering)

### Backend
- Node.js
- Express.js
- TypeScript
- Socket.io (real-time communication)
- Prisma (ORM)

## Installation and Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Development
```bash
# Start backend (port 3001)
cd backend
npm run dev

# Start frontend (port 3000)
cd frontend
npm run dev
```

## Features

- [ ] 3D Rubik's cube visualization
- [ ] Automatic solving with different algorithms
- [ ] Intuitive user interface
- [ ] Configuration saving
- [ ] Solving statistics
- [ ] Multiplayer mode (future)

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for more details.