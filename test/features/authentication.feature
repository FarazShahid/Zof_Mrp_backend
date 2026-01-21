Feature: User Authentication
  As a user of the ZOF MRP system
  I want to be able to securely authenticate
  So that I can access the system features

  Background:
    Given the ZOF MRP API is running
    And the database is initialized

  @security @authentication
  Scenario: Successful user login with valid credentials
    Given a user with email "test@example.com" and password "Test@123Pass" exists
    When the user attempts to login with email "test@example.com" and password "Test@123Pass"
    Then the login should be successful
    And the response should include an access token
    And the response should include a refresh token
    And the access token should expire in 900 seconds

  @security @authentication
  Scenario: Failed login with invalid password
    Given a user with email "test@example.com" exists
    When the user attempts to login with email "test@example.com" and incorrect password "WrongPass@123"
    Then the login should fail with status code 401
    And the response should contain error message "Invalid credentials"
    And no tokens should be provided

  @security @authentication
  Scenario: Failed login with non-existent user
    Given no user with email "nonexistent@example.com" exists
    When the user attempts to login with email "nonexistent@example.com" and password "AnyPass@123"
    Then the login should fail with status code 401
    And the response should contain error message "Invalid credentials"

  @security @authentication
  Scenario: Login attempt with inactive user account
    Given an inactive user with email "inactive@example.com" exists
    When the user attempts to login with email "inactive@example.com" and correct password
    Then the login should fail with status code 401
    And the response should contain "Account is inactive"

  @security @rate-limiting
  Scenario: Rate limiting on login endpoint
    Given a user with email "test@example.com" exists
    When the user attempts to login 6 times within 1 minute
    Then the 6th login attempt should fail with status code 429
    And the response should indicate rate limit exceeded

  @security @authentication
  Scenario: Successful token refresh with valid refresh token
    Given a user is logged in with valid tokens
    When the user requests token refresh with valid refresh token
    Then the refresh should be successful
    And new access token should be provided
    And new refresh token should be provided
    And the old refresh token should be invalidated

  @security @authentication
  Scenario: Failed token refresh with invalid refresh token
    When the user requests token refresh with invalid refresh token
    Then the refresh should fail with status code 401
    And the response should contain "Invalid refresh token"

  @security @authentication
  Scenario: Failed token refresh with expired refresh token
    Given a user has an expired refresh token
    When the user requests token refresh with expired refresh token
    Then the refresh should fail with status code 401
    And the response should contain "Refresh token expired"

  @security @authentication
  Scenario: Successful logout
    Given a user is logged in with valid tokens
    When the user requests logout with valid refresh token
    Then the logout should be successful with status code 200
    And the refresh token should be revoked
    And subsequent requests with the same refresh token should fail

  @security @jwt
  Scenario: Access protected endpoint with valid JWT token
    Given a user is logged in with valid access token
    When the user requests a protected resource "/api/users"
    Then the request should be successful with status code 200

  @security @jwt
  Scenario: Access protected endpoint without JWT token
    When an unauthenticated user requests a protected resource "/api/users"
    Then the request should fail with status code 401
    And the response should indicate "Unauthorized"

  @security @jwt
  Scenario: Access protected endpoint with expired JWT token
    Given a user has an expired access token
    When the user requests a protected resource with expired token
    Then the request should fail with status code 401
