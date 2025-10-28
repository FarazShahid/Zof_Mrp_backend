# JWT Access Token + Refresh Token Authentication System

This implementation provides a secure authentication system using JWT access tokens and refresh tokens, following industry best practices.

## Features

- **Access Tokens**: Short-lived (15 minutes) for API authentication
- **Refresh Tokens**: Long-lived (7 days) for token renewal
- **Token Rotation**: New refresh token issued on each refresh
- **Device Tracking**: Track login sessions with device info and IP
- **Immediate Revocation**: Revoke individual or all user sessions
- **Automatic Cleanup**: Expired tokens cleaned up hourly
- **Security**: Tokens hashed with bcrypt before storage

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
JWT_ACCESS_SECRET=your_very_secure_access_secret_key_here
JWT_REFRESH_SECRET=your_very_secure_refresh_secret_key_here
```

### Token Durations

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

## API Endpoints

### 1. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "a1b2c3d4e5f6...",
  "expires_in": 900,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "roleId": 1,
    "isActive": true
  }
}
```

### 2. Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "a1b2c3d4e5f6..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "x9y8z7w6v5u4...",
  "expires_in": 900
}
```

### 3. Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refresh_token": "a1b2c3d4e5f6..."
}
```

### 4. Logout All Sessions
```http
POST /api/auth/logout-all
Authorization: Bearer <access_token>
```

## Database Schema

### RefreshToken Table

| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| tokenHash | varchar(255) | Hashed refresh token |
| userId | int | Foreign key to users table |
| deviceInfo | varchar(500) | Device/browser information |
| ipAddress | varchar(45) | IP address |
| userAgent | text | User agent string |
| expiresAt | timestamp | Token expiration time |
| isRevoked | boolean | Whether token is revoked |
| revokedAt | timestamp | When token was revoked |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update time |
| lastUsedAt | timestamp | Last usage time |

## Security Features

1. **Token Hashing**: Refresh tokens are hashed with bcrypt before storage
2. **Token Rotation**: New refresh token issued on each refresh
3. **Immediate Revocation**: Tokens can be revoked instantly
4. **Expiration Handling**: Automatic cleanup of expired tokens
5. **Device Tracking**: Monitor login sessions for security
6. **Rate Limiting**: Built-in protection against brute force attacks

## Client Implementation

### Frontend Token Management

```typescript
class AuthManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  async login(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    
    // Store tokens securely
    localStorage.setItem('refresh_token', this.refreshToken);
  }

  async refreshAccessToken() {
    if (!this.refreshToken) throw new Error('No refresh token');
    
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.refreshToken })
    });
    
    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    
    localStorage.setItem('refresh_token', this.refreshToken);
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    if (!this.accessToken) {
      await this.refreshAccessToken();
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    // If token expired, refresh and retry
    if (response.status === 401) {
      await this.refreshAccessToken();
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
    }

    return response;
  }
}
```

## Migration

Run the migration to create the refresh_tokens table:

```bash
npm run migration:run
```

## Monitoring

The system includes automatic cleanup of expired tokens that runs every hour. Check logs for cleanup statistics:

```
[AuthService] Cleaned up 15 expired refresh tokens
```

## Best Practices

1. **Store refresh tokens securely** (httpOnly cookies recommended)
2. **Implement token refresh logic** in your frontend
3. **Handle token expiration gracefully**
4. **Monitor for suspicious login patterns**
5. **Regularly rotate JWT secrets**
6. **Implement rate limiting** on authentication endpoints

