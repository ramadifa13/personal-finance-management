# Personal Finance Management App

Aplikasi manajemen keuangan pribadi yang dibangun dengan React, TypeScript, Vite, dan Tailwind CSS v4. Dilengkapi dengan sistem keamanan PIN 6 digit dan penyimpanan data menggunakan localStorage.

## 🚀 Fitur Utama

- **🏠 Dashboard Overview**: Ringkasan keuangan dengan chart dan statistik real-time
- **💰 Manajemen Transaksi**: Pencatatan pemasukan dan pengeluaran dengan kategori
- **🎯 Goals Financial**: Target dan planning keuangan dengan tracking progress
- **📊 Laporan & Analytics**: Visualisasi data dengan chart interaktif menggunakan Recharts
- **⚙️ Settings**: Keamanan PIN, backup data, dan preferensi aplikasi
- **📱 Responsive Design**: Optimized untuk desktop dan mobile dengan sidebar navigation
- **✨ Modern UI/UX**: Glass morphism effects, smooth animations, dan dark mode support
- **🔒 Security**: Sistem autentikasi PIN 6 digit dengan enkripsi localStorage

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite (super fast)
- **Styling**: Tailwind CSS v4 dengan custom design tokens
- **UI Components**: Radix UI primitives + Custom shadcn/ui components
- **Charts**: Recharts untuk visualisasi data
- **Icons**: Lucide React
- **Storage**: localStorage (no backend/database required)
- **Notifications**: Sonner untuk toast notifications

## 📦 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn atau pnpm

### Installation

1. **Clone atau copy project ini**
```bash
# Jika dari Git
git clone <repository-url>
cd personal-finance-app

# Atau buat folder baru dan copy semua files
mkdir personal-finance-app
cd personal-finance-app
# Copy semua files dari Figma Make ke folder ini
```

2. **Install dependencies**
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. **Jalankan development server**
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

4. **Buka browser**
```
http://localhost:5173
```

5. **Build untuk production**
```bash
npm run build
# atau
yarn build
# atau  
pnpm build
```

## 📁 Project Structure

```
personal-finance-app/
├── public/                 # Static assets
│   └── favicon.svg        # App icon
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── figma/            # Figma-specific components
│   ├── Dashboard.tsx     # Dashboard overview page
│   ├── Transactions.tsx  # Transaction management
│   ├── Goals.tsx         # Financial goals
│   ├── Reports.tsx       # Analytics & reports
│   ├── Settings.tsx      # App settings
│   ├── Layout.tsx        # Main layout with sidebar
│   ├── PinSetup.tsx      # PIN setup for new users
│   └── PinLogin.tsx      # PIN authentication
├── contexts/              # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── FinanceContext.tsx # Financial data state
├── styles/               # Global styles
│   └── globals.css       # Tailwind + custom CSS
├── App.tsx               # Main app component
├── main.tsx              # React entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies & scripts
```

## 🎨 Design System

### Color Palette
- **Primary**: Modern blue (#2563eb) untuk actions dan highlights
- **Success**: Green (#10b981) untuk positive values dan success states
- **Warning**: Amber (#f59e0b) untuk warnings dan alerts
- **Danger**: Red (#ef4444) untuk destructive actions dan errors

### Typography
- **Base font size**: 14px untuk optimal readability
- **Font weights**: 300 (light) to 700 (bold) dengan proper hierarchy
- **Line heights**: Optimized untuk readability di semua device

### Components
- **Glass morphism**: Backdrop blur effects untuk modern UI
- **Animations**: Smooth transitions dan micro-interactions
- **Responsive**: Mobile-first approach dengan breakpoints
- **Dark mode**: Full support dengan automatic system detection

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server dengan hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint untuk code quality check

### Key Components

#### AuthContext
- Manajemen state autentikasi dengan PIN
- Session persistence menggunakan localStorage
- Auto-logout untuk security

#### FinanceContext  
- Centralized state management untuk data keuangan
- CRUD operations untuk transactions dan goals
- Real-time calculations dan statistics

#### Layout
- Responsive sidebar navigation
- Mobile-friendly hamburger menu
- Breadcrumb navigation

### Data Structure

```typescript
// Transaction
{
  id: string,
  amount: number,
  type: 'income' | 'expense',
  category: string,
  description: string,
  date: string
}

// Goal
{
  id: string,
  title: string,
  targetAmount: number,
  currentAmount: number,
  deadline: string,
  priority: 'high' | 'medium' | 'low'
}

// User Settings
{
  name: string,
  pin: string, // encrypted
  currency: string,
  theme: 'light' | 'dark' | 'system'
}
```

## 🔐 Security Features

- **PIN Authentication**: 6-digit PIN dengan validation
- **Data Encryption**: localStorage data di-encrypt
- **Session Management**: Auto-timeout untuk security
- **Input Validation**: Comprehensive validation untuk semua forms

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🚀 Deployment

### Static Hosting (Recommended)

1. **Build project**
```bash
npm run build
```

2. **Deploy folder `dist/` ke hosting pilihan:**

#### Vercel
```bash
npm i -g vercel
vercel --prod
```

#### Netlify
```bash
# Drag & drop folder dist/ ke netlify.com
# Atau gunakan Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
# Push ke GitHub repository
# Enable GitHub Pages di repository settings
# Set source ke GitHub Actions
```

#### Firebase Hosting
```bash
npm i -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 💡 Usage Tips

### First Time Setup
1. Buka aplikasi di browser
2. Buat PIN 6 digit untuk keamanan
3. Setup profil (nama, mata uang, dll)
4. Mulai input transaksi pertama

### Best Practices
- **Input transaksi**: Selalu tambah kategori dan deskripsi
- **Goals**: Set target yang realistis dengan deadline
- **Backup**: Export data secara berkala via Settings
- **Security**: Jangan share PIN dengan orang lain

### Tips Optimalisasi
- **Performance**: Aplikasi menggunakan localStorage, semakin banyak data semakin lambat
- **Data Management**: Hapus transaksi lama yang tidak relevan
- **Categories**: Gunakan kategori yang konsisten untuk analytics yang akurat

## 🤝 Contributing

Project ini adalah template untuk personal use. Jika ingin berkontribusi:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📝 License

Private project - All rights reserved.

## 🆘 Troubleshooting

### Common Issues

**Error: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors**
```bash
npm run lint
npm run build -- --mode development
```

**Port already in use**
```bash
# Edit vite.config.ts, ubah port
server: {
  port: 3000, // ubah dari 5173
}
```

**LocalStorage issues di browser**
- Clear browser cache dan localStorage
- Disable browser extensions
- Try incognito/private mode

---

**📞 Support**: Jika ada masalah, buat issue di repository atau contact developer.

**🌟 Dibuat dengan ❤️ menggunakan React + Vite + Tailwind CSS v4**