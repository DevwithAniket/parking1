# SmartPark - IoT Smart Parking System Frontend

A modern, responsive React + Vite + Tailwind CSS frontend for an IoT-powered smart parking management system.

## Features

✨ **Modern UI**
- Responsive design for mobile, tablet, and desktop
- Dark/Light theme toggle
- Smooth animations and hover effects
- Clean card-based layout

🚗 **Core Features**
- User authentication (Login/Register)
- Real-time parking slot availability
- One-click slot booking
- Secure payment simulation
- Booking management
- Live slot status updates (5-second polling)

📊 **Dashboard**
- 6 parking slots with color-coded status
  - Green = Available
  - Yellow = Booked
  - Red = Occupied
- Real-time statistics
- Parking status legend
- Quick booking interface

💳 **Payment**
- Mock payment gateway UI
- Card detail input validation
- Test card support
- Payment success confirmation

📱 **Responsive**
- Mobile-first design
- Touch-friendly buttons
- Optimized for all screen sizes

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - API calls
- **Context API** - State management

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx         # Navigation bar
│   ├── SlotCard.jsx       # Parking slot display
│   ├── BookingModal.jsx   # Booking form modal
│   ├── Toast.jsx          # Notification system
│   └── Legend.jsx         # Status legend
├── pages/
│   ├── Landing.jsx        # Home page
│   ├── Login.jsx          # Auth page
│   ├── Dashboard.jsx      # Main dashboard
│   ├── Payment.jsx        # Payment page
│   ├── MyBookings.jsx     # Booking history
│   └── ProtectedRoute.jsx # Route protection
├── context/
│   ├── AuthContext.jsx    # Auth state management
│   └── ParkingContext.jsx # Parking state & logic
├── services/
│   └── api.js             # API service
├── App.jsx                # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Clone or extract the project:**
   ```bash
   cd parking1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Start backend server in a second terminal:**
   ```bash
   npm run server
   ```

   The backend runs at `http://localhost:5000/api` and stores users, hashed passwords, parking slots, reservations, and test payments in `server/data/db.json`.

   For real OTP emails, create a `.env` file from `.env.example` and fill in your SMTP settings. Without SMTP settings, the backend prints the OTP in the server console for local testing.

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

## Demo Credentials

Use these credentials to test the application:

- **Email:** demo@smartpark.com
- **Password:** demo123

New accounts are stored by the backend. The seeded demo account is available for testing.

New signups require email OTP verification before the user is created. OTPs expire after 10 minutes.

Accounts that have not been active for 3 days are automatically removed from the local database during normal server requests. The seeded demo account is kept for testing.

## Test Card Details (Payment)

For payment testing:

- **Card Number:** 4532 1234 5678 9010
- **Expiry:** 12/25
- **CVV:** 123

## Usage Flow

### 1. Landing Page
- View project overview
- Features showcase
- Login/Register button

### 2. Authentication
- Register new account or login
- Email and password validation
- Session persistence

### 3. Dashboard
- View 6 parking slots with real-time status
- See slot availability statistics
- Click "Book Now" on any available slot

### 4. Booking
- Select parking slot
- Choose start time
- Select duration (1-8 hours)
- View price calculation
- Confirm booking details

### 5. Payment
- Enter card details
- Review order summary
- Process payment
- See booking confirmation

### 6. My Bookings
- View active bookings
- See booking details and timeline
- Cancel bookings
- View booking history

## Features in Detail

### Real-Time Updates
- Slot status updates every 5 seconds
- Automatic slot status changes (simulated)
- Live availability counter

### State Management
- **AuthContext** - User authentication and theme
- **ParkingContext** - Slots, bookings, and notifications

### Responsive Design
- Mobile navigation menu
- Touch-optimized buttons
- Flexible grid layouts
- Adaptive typography

### Dark/Light Theme
- Toggle theme in navbar
- Persistent theme preference
- Optimized colors for both themes

### Animations
- Slide-in modals
- Hover effects on cards
- Smooth transitions
- Bounce animations

## API Integration

The app now calls the local backend in `server/server.js`. Set `VITE_API_URL` if you want the frontend to target another API host.

### Auth Endpoints

```javascript
POST /api/register/start          // Send OTP to signup email
POST /api/register/verify         // Verify OTP and create account
POST /api/login                   // User login
GET /api/me                       // Restore current session
```

### Parking Endpoints

```javascript
GET /api/slots                    // Get all parking slots
POST /api/bookings                // Book a slot
POST /api/payment                 // Process payment
GET /api/bookings                 // Get current user's bookings
POST /api/bookings/:id/cancel     // Cancel booking
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized bundle size with Vite
- Lazy loading for routes
- Efficient re-renders with React
- CSS optimization with Tailwind
- Image optimization

## Future Enhancements

- [ ] Real backend integration
- [ ] User profile management
- [ ] Payment gateway integration (Razorpay)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] QR code generation for bookings
- [ ] Map view of parking lot
- [ ] Receipt generation
- [ ] User ratings/reviews
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] WebSocket for real-time updates
- [ ] Progressive Web App (PWA)

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Theme Not Applying
- Clear browser cache
- Check if dark class is in HTML root element
- Verify Tailwind config has `darkMode: 'class'`

## Development Tips

1. **Hot Module Replacement (HMR)** - Changes reflect instantly
2. **Browser DevTools** - Inspect React components with React DevTools
3. **Responsive Testing** - Use browser's device toolbar
4. **Mock Data** - Located in `ParkingContext.jsx`

## License

MIT License - Feel free to use this project for learning or commercial purposes.

## Support

For issues or questions, please refer to the code comments or create an issue in the repository.

---

**SmartPark** - Making parking smart, easy, and convenient! 🚗✨
