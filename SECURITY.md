# Security Documentation
## ZOF MRP Backend - Security Guidelines & Implementation

**Last Updated:** January 2026
**Version:** 1.0

---

## Table of Contents
1. [Security Overview](#security-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Security Headers](#security-headers)
4. [Rate Limiting](#rate-limiting)
5. [Input Validation](#input-validation)
6. [Data Protection](#data-protection)
7. [Audit Logging](#audit-logging)
8. [Security Best Practices](#security-best-practices)
9. [Incident Response](#incident-response)
10. [Security Checklist](#security-checklist)

---

## Security Overview

The ZOF MRP backend implements multiple layers of security to protect against common web vulnerabilities and ensure data integrity.

### Key Security Features
- ✅ JWT-based stateless authentication
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Role-Based Access Control (RBAC)
- ✅ Security headers (Helmet.js)
- ✅ Rate limiting (Throttler)
- ✅ Request body size limits
- ✅ CORS protection
- ✅ Audit logging
- ✅ Input validation (class-validator)
- ✅ Refresh token rotation

---

## Authentication & Authorization

### JWT Token Security

**Access Tokens:**
- Expiration: 15 minutes
- Algorithm: HS256
- Stored: Client-side only (localStorage/memory)
- Contains: User ID, email, role ID, active status

**Refresh Tokens:**
- Expiration: 7 days
- Storage: Database (hashed with bcrypt)
- Rotation: New token issued on each refresh
- Revocation: Immediate on logout

### Environment Variables Required

```bash
# CRITICAL: Must be set in production
JWT_ACCESS_SECRET=<strong-random-secret-min-32-bytes>

# Database credentials
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=zof_mrp

# Frontend CORS
FRONTEND_URL=https://your-frontend-domain.com

# reCAPTCHA (optional but recommended)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
```

### Password Policy

Enforced requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

### Role-Based Access Control (RBAC)

The system implements granular permissions through the `@HasRight()` decorator:

```typescript
@HasRight(AppRightsEnum.AddUsers)
@Post()
async create(@Body() dto: CreateUserDto) { }
```

Available rights include:
- ViewUsers, AddUsers, UpdateUsers, DeleteUsers
- ViewOrders, AddOrders, UpdateOrders, DeleteOrders
- ViewProducts, AddProducts, UpdateProducts, DeleteProducts
- *(see `roles-rights.enum.ts` for complete list)*

---

## Security Headers

Implemented via Helmet.js:

```typescript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
})
```

**Headers Applied:**
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `Strict-Transport-Security` - Forces HTTPS
- `Content-Security-Policy` - Mitigates XSS attacks

---

## Rate Limiting

### Global Rate Limit
- **100 requests per minute** per IP across all endpoints

### Endpoint-Specific Limits

**Login Endpoint** (`POST /api/auth/login`):
- **5 attempts per minute** per IP
- Prevents brute force attacks
- Logs failed attempts with user ID (not email)

**Token Refresh** (`POST /api/auth/refresh`):
- **10 requests per minute** per IP
- Prevents token refresh abuse

### Bypassing Rate Limits
Rate limits are applied using `@nestjs/throttler`. To skip rate limiting for specific endpoints (e.g., health checks):

```typescript
@SkipThrottle()
@Get('health')
async healthCheck() { }
```

---

## Input Validation

### Validation Pipeline

All incoming requests are validated using `class-validator`:

```typescript
// Global validation pipe in main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,            // Strip unknown properties
    forbidNonWhitelisted: false, // Allow but don't fail on extra props
    transform: true,             // Auto-transform types
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

### Request Body Limits

```typescript
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
```

**Max sizes:**
- JSON body: 1MB
- URL-encoded body: 1MB

### DTO Examples

```typescript
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  Email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
    message: 'Password too weak'
  })
  Password: string;
}
```

### Refresh Token Validation

```typescript
@MaxLength(500, { message: 'Refresh token must not exceed 500 characters' })
refresh_token: string;
```

---

## Data Protection

### Password Storage
- **Algorithm:** bcrypt
- **Rounds:** 10
- **Never logged** in plain text
- **Never returned** in API responses (masked as `****`)

### Sensitive Data Handling

**In Logs:**
```typescript
// ❌ BAD: Don't log sensitive data
this.logger.log(`User email: ${user.email}`);

// ✅ GOOD: Log only IDs
this.logger.log(`User ID: ${user.id}`);
```

**In Responses:**
```typescript
const { Password: _, ...userWithoutPassword } = user;
return userWithoutPassword;
```

### Database Security
- Parameterized queries (TypeORM)
- No direct SQL injection points
- Connection pooling (max 10 connections)
- Passwords stored as hashed values only

---

## Audit Logging

### Logged Events
All non-GET requests are logged with:
- User ID (not email)
- Module/Entity accessed
- Action performed (Created, Updated, Deleted, etc.)
- Timestamp
- IP address
- Device/User-Agent
- Request payload (sanitized)

### Sensitive Field Redaction

```typescript
const sensitiveFields = [
  'password', 'Password', 'PASSWORD',
  'token', 'Token', 'TOKEN',
  'secret', 'Secret', 'SECRET'
];
```

All fields matching these patterns are redacted to `[REDACTED]` in audit logs.

### Accessing Audit Logs

```http
GET /api/audit-logs?page=1&limit=50
Authorization: Bearer <jwt-token>
```

**Note:** Audit log access should be restricted to administrators only.

---

## Security Best Practices

### For Developers

1. **Never commit secrets**
   - Use `.env` files
   - Add `.env` to `.gitignore`
   - Use environment variables for all sensitive config

2. **Validate all inputs**
   - Use DTOs with class-validator
   - Never trust client data
   - Sanitize before processing

3. **Use proper error handling**
   ```typescript
   // ❌ BAD: Exposes internal details
   throw new Error(error.message);

   // ✅ GOOD: Generic message
   throw new BadRequestException('Invalid request');
   ```

4. **Log appropriately**
   - Use Logger service, not console.*
   - Don't log sensitive data
   - Log user IDs, not emails
   - Use appropriate log levels

5. **Follow least privilege principle**
   - Grant minimum required permissions
   - Use RBAC decorators
   - Validate authorization on every endpoint

### For Deployment

1. **Environment Configuration**
   ```bash
   # Generate strong JWT secret:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Set in production:
   JWT_ACCESS_SECRET=<generated-secret>
   FRONTEND_URL=https://prod-domain.com
   DB_PASSWORD=<strong-db-password>
   ```

2. **HTTPS Only**
   - Enforce HTTPS in production
   - Use HSTS header (already configured)
   - Never serve over HTTP

3. **Database Security**
   - Use separate DB user with limited privileges
   - Enable MySQL SSL/TLS connections
   - Regular backups
   - Keep DB updated

4. **Monitor and Alert**
   - Set up logging aggregation
   - Monitor failed login attempts
   - Alert on unusual patterns
   - Regular security audits

---

## Incident Response

### If a Security Breach is Suspected

1. **Immediate Actions:**
   - Rotate JWT secrets immediately
   - Revoke all refresh tokens
   - Force all users to log out
   - Review audit logs for suspicious activity

2. **Investigation:**
   - Check audit logs for unauthorized access
   - Review database for data tampering
   - Analyze server logs
   - Identify entry point

3. **Communication:**
   - Notify affected users
   - Document the incident
   - Report to relevant authorities if required

4. **Prevention:**
   - Patch vulnerabilities
   - Update dependencies
   - Enhance monitoring
   - Conduct security review

### Emergency JWT Secret Rotation

```bash
# 1. Generate new secret
NEW_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 2. Update environment variable
JWT_ACCESS_SECRET=$NEW_SECRET

# 3. Restart application
pm2 restart zof-mrp-backend

# 4. Revoke all refresh tokens in database
# Execute SQL: UPDATE refresh_tokens SET is_revoked = 1;
```

---

## Security Checklist

### Pre-Production
- [ ] JWT_ACCESS_SECRET is set to strong random value
- [ ] All environment variables are properly configured
- [ ] HTTPS is enforced
- [ ] CORS is configured for production domain only
- [ ] Rate limiting is enabled
- [ ] Security headers are present
- [ ] Audit logging is functional
- [ ] Password policy is enforced
- [ ] All dependencies are updated
- [ ] No console.log statements in production code
- [ ] Error messages don't expose sensitive info
- [ ] Database backups are configured

### Post-Production
- [ ] Monitor failed login attempts
- [ ] Review audit logs weekly
- [ ] Update dependencies monthly
- [ ] Conduct security audits quarterly
- [ ] Test incident response plan
- [ ] Review and rotate secrets annually

### Code Review
- [ ] No hardcoded secrets or credentials
- [ ] Proper input validation on all endpoints
- [ ] Authorization checks on protected routes
- [ ] Sensitive data is not logged
- [ ] Error handling doesn't leak information
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (input sanitization)
- [ ] CSRF protection (if using cookies)

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security Best Practices](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)

---

## Contact

For security concerns or to report vulnerabilities:
- **Email:** security@zofmrp.com
- **Response Time:** 24-48 hours
- **PGP Key:** [Available on request]

---

**Remember:** Security is an ongoing process, not a one-time implementation. Regularly review and update security measures.
