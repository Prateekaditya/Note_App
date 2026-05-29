# NotesApp Frontend

Modern React + TypeScript frontend for the NotesApp microservices application.

## Features

- ✅ **Beautiful Material-UI Design** - Modern, professional interface
- ✅ **TypeScript** - Type-safe code
- ✅ **Authentication** - Login & Registration
- ✅ **Notes Management** - Create, Edit, Delete notes
- ✅ **Pin/Unpin** - Pin important notes
- ✅ **Responsive Design** - Works on all devices
- ✅ **Real-time Updates** - Instant feedback

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## Prerequisites

- Node.js 16+ and npm
- Backend services running (see main README)

## Installation

```bash
cd notes-frontend
npm install
```

## Configuration

The app connects to the API Gateway at `http://localhost:8080/api`

If your backend is running on a different port, update `src/config/api.config.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:YOUR_PORT/api';
```

## Running the App

```bash
npm start
```

The app will open at: http://localhost:3000

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.tsx
│   ├── NoteCard.tsx
│   ├── NoteDialog.tsx
│   └── ProtectedRoute.tsx
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
├── services/           # API services
│   ├── api.service.ts
│   ├── auth.service.ts
│   ├── note.service.ts
│   └── user.service.ts
├── context/            # React Context
│   └── AuthContext.tsx
├── config/             # Configuration
│   └── api.config.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Main app component
└── index.tsx           # Entry point
```

## Features

### 1. Authentication
- **Login** - Sign in with username/password
- **Register** - Create new account
- **Auto-redirect** - Protected routes redirect to login
- **Token storage** - JWT stored in localStorage

### 2. Dashboard
- **View all notes** - Grid layout
- **Filter notes** - All, Pinned, Unpinned tabs
- **Search notes** - Find notes quickly
- **Responsive** - Works on mobile and desktop

### 3. Note Management
- **Create notes** - Add title and content
- **Edit notes** - Update existing notes
- **Delete notes** - Remove notes with confirmation
- **Pin notes** - Keep important notes at top
- **Rich formatting** - Multi-line content support

### 4. UI/UX
- **Material Design** - Beautiful, modern interface
- **Gradient backgrounds** - Eye-catching design
- **Smooth animations** - Hover effects, transitions
- **Loading states** - Visual feedback
- **Error handling** - User-friendly error messages

## Usage

### 1. Register an Account
- Go to http://localhost:3000/register
- Fill in your details
- Click "Sign Up"

### 2. Login
- Go to http://localhost:3000/login
- Enter username and password
- Click "Sign In"

### 3. Create Notes
- Click "New Note" button
- Enter title and content
- Optionally pin the note
- Click "Create"

### 4. Manage Notes
- **Edit**: Click edit icon on note card
- **Delete**: Click delete icon (with confirmation)
- **Pin**: Click pin icon to toggle
- **Filter**: Use tabs to view all/pinned/unpinned notes

## Screenshots

### Login Page
- Beautiful gradient background
- Clean, modern design
- Password visibility toggle

### Dashboard
- Grid layout for notes
- Tabs for filtering
- Floating action button (mobile)
- Pinned notes highlighted

### Note Dialog
- Create/Edit modal
- Title and content fields
- Pin toggle switch

## API Integration

The frontend connects to these backend endpoints:

### Authentication
- `POST /api/users/register` - Register
- `POST /api/users/login` - Login

### Notes
- `GET /api/notes/notes/user/:userId` - Get user's notes
- `POST /api/notes/notes` - Create note
- `PUT /api/notes/notes/:id` - Update note
- `DELETE /api/notes/notes/:id` - Delete note
- `PATCH /api/notes/notes/:id/pin` - Toggle pin

## Customization

### Change Theme Colors

Edit `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea', // Change this
    },
  },
});
```

### Change API URL

Edit `src/config/api.config.ts`:

```typescript
export const API_BASE_URL = 'http://your-api-url/api';
```

## Troubleshooting

### CORS Errors
If you get CORS errors, make sure your backend allows requests from `http://localhost:3000`

### Connection Refused
Ensure the backend services are running on port 8080

### 401 Unauthorized
Your token may have expired. Logout and login again.

## License

This project is part of the NotesApp microservices ecosystem.

