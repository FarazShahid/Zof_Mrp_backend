# BDD Testing with Cucumber

This directory contains Behavior-Driven Development (BDD) tests using Cucumber for the ZOF MRP backend.

## Overview

BDD tests are written in Gherkin syntax, which allows non-technical stakeholders to understand and contribute to test scenarios. The tests cover:

- **Authentication** - Login, token refresh, logout flows
- **User Management** - CRUD operations, permissions
- **Security** - Rate limiting, injection protection, CORS, headers
- **Authorization** - Role-based access control (RBAC)

## Directory Structure

```
test/
├── features/                    # Feature files (Gherkin scenarios)
│   ├── authentication.feature   # Authentication test scenarios
│   ├── user-management.feature  # User management scenarios
│   └── security.feature         # Security-focused scenarios
├── step-definitions/            # Step implementations (TypeScript)
│   ├── authentication.steps.ts
│   ├── user-management.steps.ts
│   └── security.steps.ts
├── support/                     # Support files and hooks
│   ├── hooks.ts
│   └── world.ts
└── README.md                    # This file
```

## Running Tests

### Prerequisites

```bash
npm install
```

### Run All BDD Tests

```bash
npm run test:bdd
```

### Run Specific Test Suites

```bash
# Run only security tests
npm run test:bdd:security

# Run only authentication tests
npm run test:bdd:auth

# Run only user management tests
npm run test:bdd:users
```

### Run Tests by Tag

```bash
# Run all tests tagged with @security
npx cucumber-js --tags "@security"

# Run tests tagged with @authentication
npx cucumber-js --tags "@authentication"

# Run multiple tags (OR)
npx cucumber-js --tags "@security or @authentication"

# Run multiple tags (AND)
npx cucumber-js --tags "@security and @rate-limiting"

# Exclude specific tags
npx cucumber-js --tags "not @wip"
```

## Test Reports

After running tests, reports are generated in the `test-results/` directory:

- `cucumber-report.html` - HTML report (open in browser)
- `cucumber-report.json` - JSON report (for CI/CD)
- `cucumber-report.xml` - JUnit XML report (for Jenkins, etc.)

### View HTML Report

```bash
open test-results/cucumber-report.html  # macOS
xdg-open test-results/cucumber-report.html  # Linux
start test-results/cucumber-report.html  # Windows
```

## Writing New Tests

### 1. Create a Feature File

Create a new `.feature` file in `test/features/`:

```gherkin
Feature: Product Management
  As a product manager
  I want to manage products
  So that I can maintain the product catalog

  @products @crud
  Scenario: Create a new product
    Given I am logged in as a product manager
    When I create a product with name "Test Product"
    Then the product should be created successfully
    And the product should have an ID
```

### 2. Implement Step Definitions

Create corresponding steps in `test/step-definitions/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

Given('I am logged in as a product manager', async function() {
  // Implementation
});

When('I create a product with name {string}', async function(name: string) {
  // Implementation
});

Then('the product should be created successfully', function() {
  // Implementation
});
```

### 3. Run Your New Test

```bash
npx cucumber-js test/features/your-feature.feature
```

## Tags Reference

Common tags used in feature files:

- `@security` - Security-related tests
- `@authentication` - Authentication flows
- `@authorization` - Authorization and RBAC tests
- `@user-management` - User CRUD operations
- `@rate-limiting` - Rate limiting tests
- `@validation` - Input validation tests
- `@crud` - Create, Read, Update, Delete operations
- `@rbac` - Role-based access control
- `@wip` - Work in progress (excluded from CI)
- `@smoke` - Smoke tests (quick, critical paths)

## Best Practices

### Feature Files

1. **Use business language** - Features should be readable by non-technical stakeholders
2. **Focus on behavior** - Describe what, not how
3. **Keep scenarios independent** - Each scenario should be self-contained
4. **Use Background** - For common setup steps
5. **Use Scenario Outlines** - For data-driven tests

**Example:**

```gherkin
# ✅ Good - Focuses on behavior
Scenario: User logs in with valid credentials
  Given a user exists
  When the user logs in with correct credentials
  Then the user should be authenticated

# ❌ Bad - Too implementation-focused
Scenario: POST /api/auth/login returns 200
  Given database has user record
  When client sends POST to /api/auth/login
  Then response code is 200
```

### Step Definitions

1. **Keep steps reusable** - Write generic steps that can be used across scenarios
2. **Use TypeScript** - For type safety and better IDE support
3. **Avoid business logic** - Steps should orchestrate, not implement business logic
4. **Use helper functions** - Extract common operations
5. **Clean up after tests** - Use `After` hooks for cleanup

### Naming Conventions

- **Feature files**: `kebab-case.feature` (e.g., `user-management.feature`)
- **Step files**: `camelCase.steps.ts` (e.g., `authentication.steps.ts`)
- **Tags**: `@kebab-case` (e.g., `@user-management`)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: BDD Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run BDD tests
        run: npm run test:bdd
      - name: Upload test report
        uses: actions/upload-artifact@v2
        if: always()
        with:
          name: cucumber-report
          path: test-results/cucumber-report.html
```

## Debugging Tests

### Run with Debug Output

```bash
# Verbose output
npx cucumber-js --verbose

# Debug specific feature
npx cucumber-js test/features/authentication.feature --verbose
```

### Use Node Debugger

```bash
node --inspect-brk node_modules/.bin/cucumber-js
```

Then attach your IDE's debugger to the Node process.

## Common Issues

### Issue: "Step undefined"

**Problem:** Step definition not found for a given step.

**Solution:**
1. Implement the step in a `.steps.ts` file
2. Ensure the step file is in `test/step-definitions/`
3. Check that the step pattern matches exactly

### Issue: "Multiple step definitions"

**Problem:** Same step defined in multiple places.

**Solution:**
- Consolidate duplicate steps
- Use more specific step text
- Check all `.steps.ts` files for duplicates

### Issue: "Ambiguous step definitions"

**Problem:** Multiple steps match the same text.

**Solution:**
- Make step patterns more specific
- Use different wording for different scenarios

## Resources

- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Cucumber.js](https://github.com/cucumber/cucumber-js)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/reference/)
- [BDD Best Practices](https://cucumber.io/docs/bdd/)

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Add appropriate tags
3. Keep scenarios focused and atomic
4. Document any new helper functions
5. Update this README if adding new test categories

## Support

For questions or issues with tests:
- Check existing feature files for examples
- Review step definitions for available steps
- Consult Cucumber documentation
- Ask the team in #qa-automation channel
