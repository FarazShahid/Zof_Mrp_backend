Feature: User Management
  As an administrator
  I want to manage users in the system
  So that I can control access and maintain security

  Background:
    Given the ZOF MRP API is running
    And I am logged in as an administrator

  @user-management @authorization
  Scenario: Create a new user with valid data
    When I create a user with the following details:
      | firstName | John           |
      | lastName  | Doe            |
      | email     | john@test.com  |
      | password  | Secure@Pass123 |
      | roleId    | 2              |
    Then the user creation should be successful
    And the response should include user ID
    And the password should be hashed
    And the password should not be visible in the response

  @user-management @validation
  Scenario: Fail to create user with weak password
    When I create a user with password "weak"
    Then the user creation should fail with status code 400
    And the response should contain "Password must include"

  @user-management @validation
  Scenario: Fail to create user with duplicate email
    Given a user with email "existing@test.com" exists
    When I create a user with email "existing@test.com"
    Then the user creation should fail with status code 409
    And the response should contain "Email already in use"

  @user-management @validation
  Scenario: Password strength requirements
    When I create a user with various passwords:
      | password     | should_succeed |
      | Short1!      | false          |
      | NoUpperCase1!| false          |
      | NOLOWERCASE1!| false          |
      | NoDigits!    | false          |
      | NoSpecial123 | false          |
      | Valid@Pass1  | true           |
    Then the password validation should match expected results

  @user-management @authorization
  Scenario: Retrieve all users as administrator
    Given multiple users exist in the system
    When I request all users
    Then the request should be successful
    And the response should contain a list of users
    And each user should have masked password

  @user-management @authorization
  Scenario: Retrieve user by ID
    Given a user with ID 1 exists
    When I request user with ID 1
    Then the request should be successful
    And the response should include user details
    And the password should be masked

  @user-management @authorization
  Scenario: Update user information
    Given a user with ID 1 exists
    When I update user 1 with new email "newemail@test.com"
    Then the update should be successful
    And the user email should be updated
    And the UpdatedOn timestamp should be current

  @user-management @authorization
  Scenario: Delete a user
    Given a user with ID 99 exists
    When I delete user with ID 99
    Then the deletion should be successful with status code 204
    And the user should no longer exist in the database

  @user-management @authorization @rbac
  Scenario: Non-admin user cannot create users
    Given I am logged in as a regular user without AddUsers permission
    When I attempt to create a new user
    Then the request should fail with status code 403
    And the response should indicate "Access denied"

  @user-management @authorization @rbac
  Scenario: Non-admin user cannot delete users
    Given I am logged in as a regular user without DeleteUsers permission
    And a user with ID 99 exists
    When I attempt to delete user with ID 99
    Then the request should fail with status code 403

  @user-management @security
  Scenario: User data should not leak in logs
    When I create a user with sensitive data
    Then the application logs should not contain:
      | raw password       |
      | full email address |
      | sensitive PII      |
