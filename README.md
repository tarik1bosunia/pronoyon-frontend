# Pronoyon Frontend

A modern, feature-rich frontend application built with Next.js for managing question papers, examinations, and educational content. This application provides a comprehensive platform for creating, editing, and managing exam papers with support for multiple user roles and advanced question bank functionality.

## Features

- **Question Paper Editor**: Rich text editor with support for mathematical equations, tables, and formatted content
- **Question Bank Management**: Comprehensive question database with search, filter, and categorization capabilities
- **Role-Based Access Control (RBAC)**: Multi-role system supporting Admin, Manager, and User roles
- **Authentication**: Secure authentication with Google OAuth integration
- **Payment Integration**: Wallet management and payment processing system
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS and Radix UI components
- **Real-time Data**: React Query for efficient data fetching and state management
- **Mathematical Support**: KaTeX integration for rendering mathematical equations
- **Export Capabilities**: PDF generation and print preview functionality

## 🛠️ Tech Stack

### Core Framework

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **next-themes** - Dark mode support

### State Management & Data Fetching

- **TanStack React Query** - Server state management
- **Redux Toolkit** - Client state management
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Rich Text Editing

- **Tiptap** - Headless rich text editor
  - Mathematics extension
  - Table support
  - Image and link handling
  - Text alignment and formatting

### Additional Libraries

- **@hello-pangea/dnd** - Drag and drop functionality
- **react-markdown** - Markdown rendering
- **recharts** - Data visualization
- **date-fns** - Date manipulation
- **html2canvas & jspdf** - PDF generation
- **embla-carousel-react** - Carousel components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## 🏃 Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tarik1bosunia/pronoyon-frontend.git
cd pronoyon-frontend
```

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

Create a `.env.local` file in the root directory and configure the necessary environment variables:

```env
# Add your environment variables here
# Example:
# NEXT_PUBLIC_API_URL=your_api_url
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

1. Run the development server:

```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```text
pronoyon-frontend/
├── app/                    # Next.js App Router pages
│   ├── (admin)/           # Admin routes
│   ├── (auth)/            # Authentication routes
│   ├── (manager)/         # Manager routes
│   ├── editor/            # Paper editor
│   └── user/              # User dashboard
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── editor/           # Editor-related components
│   ├── features/         # Feature components
│   ├── rbac/             # RBAC components
│   └── ui/               # Reusable UI components
├── features/             # Feature modules
│   ├── admin/           # Admin features
│   ├── manager/         # Manager features
│   ├── paper-editor/    # Paper editor feature
│   └── question-bank/   # Question bank feature
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── providers/      # Context providers
│   ├── rbac/          # RBAC utilities
│   └── redux/         # Redux store configuration
├── types/              # TypeScript type definitions
└── public/             # Static assets
```

## 🔐 Authentication & Authorization

The application implements a comprehensive authentication and authorization system:

- **Google OAuth Integration**: Secure login with Google accounts
- **Role-Based Access Control**: Different access levels for Admin, Manager, and User roles
- **Protected Routes**: Route guards for authenticated and role-specific access
- **Session Management**: Secure session handling

## 📝 Key Features in Detail

### Question Paper Editor

- Rich text editing with Tiptap
- Mathematical equation support (KaTeX)
- Table creation and editing
- Image insertion and management
- Print preview and PDF export
- Drag and drop question reordering

### Question Bank

- Question database management
- Search and filter functionality
- Question categorization
- Random question selection
- Custom question creation

### Admin Panel

- User management
- Role and permission management
- System settings
- Activity logs and audit trails
- Database management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🔗 Related Resources

This project was developed with reference to the following platforms:

- [Porikkhok](https://www.porikkhok.com/)
- [Eproshnobank](https://eproshnobank.com/)
- [Daricomma](https://www.daricomma.com/)

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Built with Next.js and TypeScript
