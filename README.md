# QuickCourt - Sports Facility Booking Platform

A modern, full-stack web application for booking sports facilities and courts. Built with Next.js and Node.js, QuickCourt provides a seamless experience for users to discover and book sports venues while offering comprehensive management tools for facility owners.


[https://drive.google.com/file/d/1oHLR4AoHxyOxPngIZW3oIJ5eLQXwF_Pv/view?usp=sharing](https://drive.google.com/file/d/1ZFNLw_c0bcgCcnjSt9uy9il_GYYqt0sN/view?usp=sharing)


## 🚀 Features

### For Users
- 🔐 **Secure Authentication** - Sign up, login, and email verification with OTP
- 🏟️ **Easy Booking** - Browse and book available sports facilities
- 👤 **Profile Management** - Update personal information and view booking history
- 📱 **Responsive Design** - Optimized for desktop and mobile devices

### For Facility Owners
- 🏗️ **Facility Management** - Add, edit, and manage your sports facilities
- 📊 **Booking Analytics** - Track bookings and revenue
- ⚙️ **Availability Control** - Set operating hours and blackout dates

### For Administrators
- 📊 **Admin Dashboard** - Comprehensive platform oversight
- 👥 **User Management** - Monitor and manage platform users
- 🏢 **Facility Oversight** - Review and approve new facilities

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form (if applicable)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator
- **Email Service:** Nodemailer
- **Security:** Helmet, CORS
- **Environment:** dotenv

## 📁 Project Structure

```
quickcourt/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── dashboard/      # User dashboards
│   │   └── layout.tsx      # Root layout
│   ├── components/          # Reusable UI components
│   │   ├── ui/            # Shadcn/ui components
│   │   ├── forms/         # Form components
│   │   └── layout/        # Layout components
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript type definitions
├── backend/                 # Express.js backend API
│   ├── models/             # MongoDB schemas/models
│   ├── routes/             # API route handlers
│   │   ├── auth.js        # Authentication routes
│   │   ├── facilities.js  # Facility management
│   │   └── bookings.js    # Booking operations
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js        # JWT authentication
│   │   └── validation.js  # Request validation
│   ├── controllers/        # Business logic
│   ├── utils/              # Helper functions
│   └── server.js           # Server entry point
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🚦 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **MongoDB Atlas** account
- **Gmail** account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/quickcourt.git
   cd quickcourt
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/quickcourt
   JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   PORT=5001
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🔑 Environment Variables

### Backend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 characters) | ✅ |
| `CLIENT_URL` | Frontend application URL | ✅ |
| `NODE_ENV` | Environment (development/production) | ✅ |
| `PORT` | Backend server port | ✅ |
| `EMAIL_USER` | Gmail address for sending emails | ✅ |
| `EMAIL_PASS` | Gmail app password | ✅ |

### Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | ✅ |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Email verification with OTP
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### User Management
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)

### Facilities
- `GET /api/facilities` - Get all facilities
- `GET /api/facilities/:id` - Get facility by ID
- `POST /api/facilities` - Create new facility (owner/admin)
- `PUT /api/facilities/:id` - Update facility (owner/admin)
- `DELETE /api/facilities/:id` - Delete facility (owner/admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables on your hosting platform
2. Deploy the backend directory
3. Update the `CLIENT_URL` to your frontend domain

### Frontend Deployment (Vercel/Netlify)
1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Deploy the frontend directory

## 🤝 Contributing

We welcome contributions to QuickCourt! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation when necessary
- Ensure code passes linting and formatting checks

## 📋 Scripts

### Backend Scripts
```bash
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Issues**
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check if your connection string is correct
- Verify database user permissions

**Email Not Sending**
- Enable 2-factor authentication on Gmail
- Generate an app-specific password
- Check if less secure apps are allowed (if not using app password)

**CORS Errors**
- Verify `CLIENT_URL` in backend environment variables
- Check if frontend URL matches the configured client URL

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [MongoDB](https://mongodb.com/) for the database solution
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📞 Support

If you have any questions or need help with setup, please:
- 📧 Email: support@quickcourt.com
- 🐛 Create an issue on GitHub
- 💬 Join our Discord community

---

⭐ **Star this repository if you found it helpful!**
