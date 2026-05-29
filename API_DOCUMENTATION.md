# API Documentation

## Base URL
All requests go through the API Gateway:
```
http://localhost:8080
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## User Service APIs

### 1. Register User
Create a new user account.

**Endpoint:** `POST /api/users/register`  
**Authentication:** Not required  
**Request Body:**
```json
{
    "username": "string (required, unique)",
    "password": "string (required, min 6 chars)",
    "email": "string (required, unique, valid email)",
    "firstName": "string (optional)",
    "lastName": "string (optional)"
}
```

**Success Response (201 Created):**
```json
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2026-05-28T10:30:00",
    "updatedAt": "2026-05-28T10:30:00"
}
```

**Error Responses:**
- `400 Bad Request` - Username or email already exists
- `400 Bad Request` - Invalid input data

**Example:**
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

---

### 2. Login
Authenticate and receive JWT token.

**Endpoint:** `POST /api/users/login`  
**Authentication:** Not required  
**Request Body:**
```json
{
    "username": "string (required)",
    "password": "string (required)"
}
```

**Success Response (200 OK):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "john_doe",
    "userId": 1
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid username or password

**Example:**
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

---

### 3. Get User by ID
Retrieve user details by user ID.

**Endpoint:** `GET /api/users/{id}`  
**Authentication:** Required  
**Path Parameters:**
- `id` (Long) - User ID

**Success Response (200 OK):**
```json
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2026-05-28T10:30:00",
    "updatedAt": "2026-05-28T10:30:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found

**Example:**
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. Get All Users
Retrieve list of all users.

**Endpoint:** `GET /api/users`  
**Authentication:** Required

**Success Response (200 OK):**
```json
[
    {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "createdAt": "2026-05-28T10:30:00",
        "updatedAt": "2026-05-28T10:30:00"
    },
    {
        "id": 2,
        "username": "jane_smith",
        "email": "jane@example.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "createdAt": "2026-05-28T11:00:00",
        "updatedAt": "2026-05-28T11:00:00"
    }
]
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

**Example:**
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. Update User
Update user information.

**Endpoint:** `PUT /api/users/{id}`  
**Authentication:** Required  
**Path Parameters:**
- `id` (Long) - User ID

**Request Body:**
```json
{
    "email": "string (optional)",
    "password": "string (optional)",
    "firstName": "string (optional)",
    "lastName": "string (optional)"
}
```

**Note:** Username cannot be updated. Only send fields you want to update.

**Success Response (200 OK):**
```json
{
    "id": 1,
    "username": "john_doe",
    "email": "newemail@example.com",
    "firstName": "John",
    "lastName": "Updated",
    "createdAt": "2026-05-28T10:30:00",
    "updatedAt": "2026-05-28T14:30:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found
- `400 Bad Request` - Email already exists

**Example:**
```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com",
    "firstName": "John",
    "lastName": "Updated"
  }'
```

---

### 6. Delete User
Delete a user account.

**Endpoint:** `DELETE /api/users/{id}`  
**Authentication:** Required  
**Path Parameters:**
- `id` (Long) - User ID

**Success Response (200 OK):**
```
"User deleted successfully"
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found

**Example:**
```bash
curl -X DELETE http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Note Service APIs

### 1. Create Note
Create a new note for a user.

**Endpoint:** `POST /api/notes/notes`  
**Authentication:** Required  
**Request Body:**
```json
{
    "userId": "Long (required)",
    "title": "string (required)",
    "content": "string (optional, max 2000 chars)",
    "pinned": "boolean (optional, default: false)"
}
```

**Success Response (201 Created):**
```json
{
    "id": 1,
    "userId": 1,
    "title": "My First Note",
    "content": "This is the content",
    "pinned": false,
    "createdAt": "2026-05-28T10:30:00",
    "updatedAt": "2026-05-28T10:30:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `400 Bad Request` - User not found (validated via Feign client)
- `400 Bad Request` - Invalid input data

**Example:**
```bash
curl -X POST http://localhost:8080/api/notes/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "My First Note",
    "content": "This is important information",
    "pinned": false
  }'
```

---

### 2. Get Note by ID
Retrieve a specific note.

**Endpoint:** `GET /api/notes/notes/{id}`  
**Authentication:** Required  
**Path Parameters:**
- `id` (Long) - Note ID

**Success Response (200 OK):**
```json
{
    "id": 1,
    "userId": 1,
    "title": "My First Note",
    "content": "This is the content",
    "pinned": false,
    "createdAt": "2026-05-28T10:30:00",
    "updatedAt": "2026-05-28T10:30:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Note not found

**Example:**
```bash
curl -X GET http://localhost:8080/api/notes/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Get All Notes
Retrieve all notes.

**Endpoint:** `GET /api/notes/notes`  
**Authentication:** Required

**Success Response (200 OK):**
```json
[
    {
        "id": 1,
        "userId": 1,
        "title": "My First Note",
        "content": "Content here",
        "pinned": true,
        "createdAt": "2026-05-28T10:30:00",
        "updatedAt": "2026-05-28T10:30:00"
    },
    {
        "id": 2,
        "userId": 1,
        "title": "Another Note",
        "content": "More content",
        "pinned": false,
        "createdAt": "2026-05-28T11:00:00",
        "updatedAt": "2026-05-28T11:00:00"
    }
]
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

**Example:**
```bash
curl -X GET http://localhost:8080/api/notes/notes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. Get Notes by User ID
Retrieve all notes for a specific user.

**Endpoint:** `GET /api/notes/notes/user/{userId}`  
**Authentication:** Required  
**Path Parameters:**
- `userId` (Long) - User ID

**Success Response (200 OK):**
```json
[
    {
        "id": 1,
        "userId": 1,
        "title": "User's Note",
        "content": "Content",
        "pinned": false,
        "createdAt": "2026-05-28T10:30:00",
        "updatedAt": "2026-05-28T10:30:00"
    }
]
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

**Example:**
```bash
curl -X GET http://localhost:8080/api/notes/notes/user/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. Get Pinned Notes by User ID
Retrieve only pinned notes for a specific user.

**Endpoint:** `GET /api/notes/notes/user/{userId}/pinned`  
**Authentication:** Required  
**Path Parameters:**
- `userId` (Long) - User ID

**Success Response (200 OK):**
```json
[
    {
        "id": 1,
        "userId": 1,
        "title": "Important Note",
        "content": "This is pinned",
        "pinned": true,
        "createdAt": "2026-05-28T10:30:00",
        "updatedAt": "2026-05-28T12:00:00"
    }
]
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

**Example:**
```bash
curl -X GET http://localhost:8080/api/notes/notes/user/1/pinned \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. Update Note
Update note details.

**Endpoint:** `PUT /api/notes/notes/{id}`  
**Authentication:** Required  
**Path Parameters:**
- `id` (Long) - Note ID

**Request Body:**
```json
{
    "title": "string (optional)",
    "content": "string (optional)",
    "pinned": "boolean (optional)"
}
```

**Note:** Only send fields you want to update.

**Success Response (200 OK):**
```json
{
    "id": 1,
    "userId": 1,
    "title": "Updated Title",
    "content": "Updated content",
    "pinned": true,
    "createdAt": "2026-05-28T10:30:00",
    "updatedAt": "2026-05-28T14:30:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Note not found
- `400 Bad Request` - Invalid input data

**Example:**
```bash
curl -X PUT http://localhost:8080/api/notes/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "pinned": true
  }'
```

---

### 7. Toggle Pin/Unpin
Toggle the pinned status of a note.

**Endpoint:** `PATCH /api/notes/notes/{id}/pin`  
**Authentication:** Required  
**Path Parameters:**
- `id` (Long) - Note ID

**Success Response (200 OK):**
```json
{
    "id": 1,
    "userId": 1,
    "title": "My Note",
    "content": "Content",
    "pinned": true,
    "createdAt": "2026-05-28T10:30:00",
    "updatedAt": "2026-05-28T14:30:00"
}
```

**Note:** The `pinned` field will be toggled (true → false or false → true)

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Note not found

**Example:**
```bash
curl -X PATCH http://localhost:8080/api/notes/notes/1/pin \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. Delete Note
Delete a note.

**Endpoint:** `DELETE /api/notes/notes/{id}`  
**Authentication:** Required  
**Path Parameters:**
- `id` (Long) - Note ID

**Success Response (200 OK):**
```
"Note deleted successfully"
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Note not found

**Example:**
```bash
curl -X DELETE http://localhost:8080/api/notes/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Response Format

All error responses follow this format:
```
"Operation failed: error message"
```

For example:
```
"Login failed: Invalid password"
"Note creation failed: User validation failed: User not found"
"Update failed: User not found"
```

## Rate Limiting
Currently no rate limiting is implemented. Consider adding it for production.

## Versioning
Current API version: v1 (implicit in URLs)

## Support
For issues or questions, please refer to the README.md file.

