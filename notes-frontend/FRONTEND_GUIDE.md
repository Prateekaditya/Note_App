# Frontend Quick Start Guide

## Installation

### 1. Install Node.js
Download and install Node.js 16+ from: https://nodejs.org/

Verify installation:
```powershell
node --version
npm --version
```

### 2. Install Dependencies
```powershell
cd C:\Project\MicroServices\notes-frontend
npm install
```

This will install all required packages (React, TypeScript, Material-UI, etc.)

## Running the Frontend

### 1. Make sure backend is running
Before starting the frontend, ensure these are running:
- Eureka Server (8761)
- API Gateway (8080)
- User Service (8081)
- Note Service (8082)

### 2. Start the React app
```powershell
cd C:\Project\MicroServices\notes-frontend
npm start
```

The app will automatically open in your browser at: **http://localhost:3000**

## Using the Application

### 1. Register a New Account
- Click "Sign Up" link on login page
- Fill in all required fields:
  - First Name
  - Last Name
  - Username (unique)
  - Email (unique)
  - Password
- Click "Sign Up"
- You'll be redirected to login page

### 2. Login
- Enter your username and password
- Click "Sign In"
- You'll be redirected to the dashboard

### 3. Create Notes
- Click the "New Note" button
- Enter a title (required)
- Enter content (required)
- Toggle "Pin this note" if you want it pinned
- Click "Create"

### 4. Manage Notes
- **View notes**: All your notes are displayed in a grid
- **Filter**: Use tabs (All, Pinned, Unpinned)
- **Edit**: Click the edit icon (pencil) on any note
- **Delete**: Click the delete icon (trash) - confirms before deleting
- **Pin/Unpin**: Click the pin icon to toggle

### 5. Logout
- Click your avatar in the top right
- Click "Logout"

## Features Showcase

### Beautiful Design
- ✅ Modern gradient backgrounds
- ✅ Material Design components
- ✅ Smooth animations and transitions
- ✅ Responsive layout (works on mobile)

### User Experience
- ✅ Instant visual feedback
- ✅ Loading indicators
- ✅ Error messages
- ✅ Confirmation dialogs
- ✅ Password visibility toggle

### Notes Management
- ✅ Create, edit, delete notes
- ✅ Pin important notes (highlighted)
- ✅ Multi-line content support
- ✅ Date stamps on each note
- ✅ Filter by pinned status

## Keyboard Shortcuts

- **Tab** - Navigate between form fields
- **Enter** - Submit forms (login, register)
- **Esc** - Close dialogs

## Mobile Experience

The app is fully responsive:
- Floating action button (FAB) for creating notes
- Hamburger menu for navigation
- Touch-friendly buttons
- Optimized layout for small screens

## Troubleshooting

### App won't start
```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm start
```

### Can't connect to backend
- Check if API Gateway is running on port 8080
- Check browser console for CORS errors
- Verify API_BASE_URL in `src/config/api.config.ts`

### Login fails
- Verify backend services are running
- Check username/password
- Check browser console for error details

### Notes don't load
- Ensure you're logged in
- Check if Note Service is running
- Refresh the page

### Build errors
```powershell
# Clear cache and rebuild
npm run build
```

## Development

### File Structure
```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (Login, Register, Dashboard)
├── services/       # API services
├── context/        # React Context (Auth)
├── config/         # Configuration
├── types/          # TypeScript types
└── App.tsx         # Main app
```

### Adding a New Feature

1. Create service in `src/services/`
2. Add types in `src/types/`
3. Create component in `src/components/`
4. Use in pages

### Customizing Theme

Edit `src/App.tsx`:
```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#YOUR_COLOR',
    },
  },
});
```

## Production Build

```powershell
npm run build
```

This creates optimized files in the `build/` folder.

To serve the production build:
```powershell
npm install -g serve
serve -s build
```

## Environment Variables

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8080/api
```

Use in code:
```typescript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

## Tips

1. **Keep backend running** - Frontend needs API Gateway
2. **Use Chrome DevTools** - Check Network tab for API calls
3. **Check Console** - Errors are logged there
4. **Token expiry** - Logout and login again after 10 hours

## Next Steps

- Explore the code in `src/` folder
- Customize the theme and colors
- Add more features (search, categories, etc.)
- Deploy to production

## Support

For issues:
1. Check browser console
2. Check backend logs
3. Verify all services are running
4. Restart frontend: `Ctrl+C` then `npm start`

Happy coding! 🚀

