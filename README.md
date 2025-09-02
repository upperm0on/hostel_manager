# Hostel Management System

A modern, responsive hostel management system built with React and Vite, featuring a clean and intuitive interface for managing hostel operations.

## 🚀 Features

- **Dashboard**: Overview with statistics and recent activity
- **Tenant Management**: Complete tenant profiles and management
- **Payment Tracking**: Monitor rent payments and financial records
- **Settings**: Configure hostel information, rooms, and amenities
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Styling**: Custom CSS with CSS Variables
- **No External UI Libraries**: Pure custom styling for complete control

## 📁 Project Structure

```
src/
├── assets/
│   └── css/
│       ├── theme.css              # Global theme and variables
│       ├── layout.css             # Main layout styles
│       ├── Sidebar/               # Sidebar component styles
│       ├── Header/                # Header component styles
│       ├── StatCard/              # Dashboard stat card styles
│       ├── PaymentTable/          # Payment table styles
│       ├── TenantProfile/         # Tenant profile styles
│       └── HostelSettings/        # Settings page styles
├── components/                    # Reusable components
│   ├── Sidebar/                  # Navigation sidebar
│   ├── Header/                   # Top header bar
│   ├── StatCard/                 # Dashboard statistics
│   └── PaymentTable/             # Payment records table
├── pages/                        # Application pages
│   ├── Dashboard/                # Main dashboard
│   ├── Tenants/                  # Tenant management
│   ├── Payments/                 # Payment tracking
│   └── Settings/                 # Hostel configuration
└── App.jsx                       # Main application component
```

## 🎨 Design System

### Colors
- **Primary**: #2563eb (Blue)
- **Secondary**: #10b981 (Green)
- **Background**: #f9fafb (Light Gray)
- **Surface**: #ffffff (White)
- **Text**: #111827 (Dark Gray)

### Components
- **Cards**: Clean, elevated design with hover effects
- **Buttons**: Consistent styling with hover animations
- **Tables**: Responsive tables with hover highlights
- **Forms**: Modern form inputs with focus states

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hostel_manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📱 Pages Overview

### Dashboard
- Statistics cards showing key metrics
- Recent activity feed
- Quick action buttons

### Tenants
- Tenant list with search and filters
- Individual tenant profiles
- Contact information and payment history

### Payments
- Payment records table
- Status indicators (paid, pending, overdue)
- Financial summaries

### Settings
- Hostel information configuration
- Room management
- Amenities selection
- Payment method setup

## 🎯 Key Components

### Sidebar
- Navigation menu with icons
- User profile section
- Mobile-responsive with toggle

### Header
- Search functionality
- User menu
- Notifications

### StatCard
- Icon-based statistics display
- Trend indicators
- Hover animations

### PaymentTable
- Sortable payment records
- Status badges
- Action buttons for each record

## 🔧 Customization

### Adding New Pages
1. Create a new folder in `src/pages/`
2. Add your component and CSS files
3. Update routing in `App.jsx`
4. Add navigation link in `Sidebar.jsx`

### Styling
- All styles use CSS custom properties defined in `theme.css`
- Component-specific styles are in their respective CSS files
- Responsive breakpoints are consistent across components

### Icons
- All icons are from Lucide React
- Import only the icons you need for optimal bundle size

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

## 🚀 Performance Features

- **Code Splitting**: Routes are automatically code-split
- **Icon Optimization**: Only imported icons are included
- **CSS Variables**: Efficient theming and customization
- **Lazy Loading**: Components load only when needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

Built with ❤️ using React and modern web technologies.
