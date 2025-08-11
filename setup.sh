#!/bin/bash

# Personal Finance App Setup Script
echo "🚀 Setting up Personal Finance Management App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    echo "   Please upgrade Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please make sure you're in the project directory."
    echo "   Make sure all files have been copied from Figma Make."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install dependencies
if npm install; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies."
    echo "   Try running: npm install --legacy-peer-deps"
    exit 1
fi

# Create public directory if it doesn't exist
if [ ! -d "public" ]; then
    mkdir -p public
    echo "📁 Created public directory"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Run 'npm run dev' to start development server"
echo "   2. Open http://localhost:5173 in your browser"  
echo "   3. Create your first PIN and start using the app!"
echo ""
echo "📚 Available commands:"
echo "   npm run dev     - Start development server"
echo "   npm run build   - Build for production"
echo "   npm run preview - Preview production build"
echo "   npm run lint    - Check code quality"
echo ""
echo "🚀 Happy coding with your Personal Finance App!"