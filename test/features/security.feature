Feature: Application Security
  As a security-conscious organization
  I want the application to follow security best practices
  So that user data and system integrity are protected

  Background:
    Given the ZOF MRP API is running

  @security @headers
  Scenario: Security headers are present in responses
    When I make a request to "/api/auth/login"
    Then the response should include the following security headers:
      | X-Content-Type-Options | nosniff                        |
      | X-Frame-Options        | SAMEORIGIN                     |
      | Strict-Transport-Security | max-age=31536000; includeSubDomains |

  @security @cors
  Scenario: CORS policy is properly configured
    When I make a request from an unauthorized origin "http://malicious-site.com"
    Then the request should be blocked by CORS
    And no sensitive data should be returned

  @security @injection
  Scenario: SQL Injection protection on login
    When I attempt to login with SQL injection in email:
      | email                           | password    |
      | admin@test.com' OR '1'='1       | password    |
      | admin@test.com'; DROP TABLE users; -- | password |
    Then the login should fail safely
    And no database error should be exposed
    And the database should remain intact

  @security @xss
  Scenario: XSS protection in user input
    Given I am logged in as an administrator
    When I create a user with XSS payload in firstName:
      """
      <script>alert('XSS')</script>
      """
    Then the input should be sanitized or rejected
    And no script execution should occur in responses

  @security @rate-limiting
  Scenario: Global rate limiting is enforced
    When I make 101 requests to "/api/products" within 1 minute
    Then the 101st request should fail with status code 429
    And the response should indicate "Too Many Requests"

  @security @input-validation
  Scenario: Request body size limits are enforced
    When I send a request with body size exceeding 1MB to "/api/users"
    Then the request should fail with status code 413
    And the response should indicate "Payload Too Large"

  @security @sensitive-data
  Scenario: Passwords are properly hashed
    Given a user with password "MySecurePass@123" is created
    When I query the database directly for this user
    Then the password should be hashed with bcrypt
    And the hash should not match the plain password
    And the hash should start with "$2"

  @security @error-handling
  Scenario: Error messages do not expose sensitive information
    When I make an invalid request to "/api/users/9999999"
    Then the error response should not contain:
      | database table names  |
      | file paths            |
      | stack traces          |
      | internal error details|

  @security @token-management
  Scenario: JWT tokens have secure configuration
    Given I obtain a valid JWT token
    Then the token should have an expiration time of 15 minutes
    And the token should be signed with a strong secret
    And the token should not contain sensitive user data beyond ID and role

  @security @session-management
  Scenario: Multiple device login tracking
    Given a user logs in from device A
    When the same user logs in from device B
    Then both sessions should be tracked
    And each session should have unique refresh token
    And logout from one device should not affect the other

  @security @token-rotation
  Scenario: Refresh token rotation on use
    Given a user has a valid refresh token "TOKEN_A"
    When the user uses "TOKEN_A" to refresh access token
    Then a new refresh token "TOKEN_B" should be issued
    And "TOKEN_A" should be revoked
    And subsequent use of "TOKEN_A" should fail

  @security @audit-logging
  Scenario: Sensitive operations are logged
    Given I am logged in as an administrator
    When I perform the following actions:
      | action            | resource |
      | CREATE user       | /api/users |
      | UPDATE user       | /api/users/1 |
      | DELETE user       | /api/users/1 |
    Then all actions should be logged in audit logs
    And each log should include user ID, action, timestamp
    And logs should not contain sensitive data like passwords

  @security @authorization
  Scenario: Role-based access control is enforced
    Given I am logged in as a user with role "Viewer"
    When I attempt to access resources requiring "Admin" role:
      | endpoint              | method | should_succeed |
      | /api/users            | POST   | false          |
      | /api/users            | GET    | true           |
      | /api/users/1          | DELETE | false          |
    Then access should be granted/denied based on permissions

  @security @csrf
  Scenario: API endpoints don't require CSRF tokens for stateless JWT auth
    Given I have a valid JWT access token
    When I make a POST request without CSRF token
    Then the request should succeed if JWT is valid
    And CSRF protection should not be required

  @security @password-policy
  Scenario: Strong password policy is enforced
    When users create accounts with various passwords:
      | password        | should_be_accepted | reason                      |
      | short           | false              | Too short                   |
      | alllowercase123 | false              | No uppercase                |
      | ALLUPPERCASE123 | false              | No lowercase                |
      | NoNumbersHere!  | false              | No numbers                  |
      | NoSpecialChar1  | false              | No special characters       |
      | Valid@Pass1     | true               | Meets all requirements      |
    Then password validation should enforce all rules

  @security @account-lockout
  Scenario: Account lockout after multiple failed login attempts
    Given a user with email "lockout@test.com" exists
    When I attempt to login with wrong password 6 times consecutively
    Then the 6th attempt should be rate limited
    And further attempts should be blocked temporarily

  @security @information-disclosure
  Scenario: API does not disclose user enumeration
    When I attempt to login with:
      | email                  | password  | expected_message      |
      | existing@test.com      | wrong     | Invalid credentials   |
      | nonexistent@test.com   | wrong     | Invalid credentials   |
    Then both responses should have identical error messages
    And response times should be consistent
    And no indication should be given whether email exists
