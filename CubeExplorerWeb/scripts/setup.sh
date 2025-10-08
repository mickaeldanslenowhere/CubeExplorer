#!/bin/bash

echo "🚀 Setting up CubeExplorer Web..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build shared package first
echo "🔧 Building shared package..."
npm run build:shared

echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To build everything:"
echo "  npm run build"
