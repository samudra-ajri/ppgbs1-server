# AI Coding Assistant Rules and Guidelines

This document outlines the rules and guidelines for the AI coding assistant working on this project. Adhering to these rules will ensure consistency, maintainability, performance, and high-quality code.

---

## 1. Project Structure

The project follows a modular architecture with a clear separation of concerns. Each module is self-contained and follows a consistent structure.

### 1.1. Module Structure

Each module should be organized into the following files:

* **`[moduleName]Controller.js`**: Handles HTTP requests and responses. It should be lightweight and delegate business logic to the service layer.
* **`[moduleName]Service.js`**: Contains the core business logic of the module. It should not directly interact with the database.
* **`[moduleName]Repository.js`**: Responsible for all database interactions. It should be the only layer that interacts with the database.
* **`[moduleName]ElasticsearchRepository.js`** (optional): If the module interacts with Elasticsearch, this file should contain all Elasticsearch queries.

### 1.2. Creating a New Module

When creating a new module, follow these steps:

1. Create a new directory under `modules/v1/`.
2. Create the controller, service, and repository files within the new directory.
3. Define the routes for the new module in a new file under the `routes/` directory.
4. Import and use the new routes in `server.js`.

---

## 2. Coding Style

Consistency in coding style is crucial for readability and maintainability.

### 2.1. Naming Conventions

* Use `camelCase` for variables, functions, and file names.
* Use `PascalCase` for class names.
* Use `UPPER_SNAKE_CASE` for constants.
* Avoid semicolon at the end of the code line.

### 2.2. Formatting

* Use an indentation of 4 spaces.
* Use single quotes (`'`) for strings.
* Add a space after keywords (`if`, `for`, `while`, etc.).
* Add a space before and after operators (`+`, `-`, `*`, `/`, `=`, etc.).

---

## 3. API Development

All API endpoints should be well-documented and follow a consistent design.

### 3.1. Route Definitions

* Routes should be defined in the `routes/` directory.
* Use descriptive and consistent route paths.
* Use the appropriate HTTP verb for each action (`GET`, `POST`, `PUT`, `DELETE`).

### 3.2. API Documentation

Each controller function should include a comment block that documents the API endpoint:

```javascript
// @desc    [A brief description of the endpoint]
// @route   [HTTP_METHOD] /[route_path]
// @access  [Access level (e.g., Private, Admin, Protect)]
```

---

## 4. Database

All database interactions should be managed through Sequelize and follow the established conventions.

### 4.1. Migrations

* Use `sequelize-cli` to create new migrations.
* Migrations must include both `up` and `down` functions.
* Keep migrations small and focused on a single change.
* Use `bigint` for datetime values (Unix epoch timestamp in milliseconds).
* Use raw SQL queries inside migrations.

### 4.2. Seeders

* Use `sequelize-cli` to create new seeders.
* Seeders should only be used for initial or reference data.

---

## 5. Authentication and Authorization

* Secure protected endpoints using JWT-based authentication.
* Use `authMiddleware` to protect routes that require authentication.
* Clearly define access levels in the API documentation block.

---

## 6. Error Handling

* Use `express-async-handler` for asynchronous controller functions.
* Use the `throwError` utility to throw custom errors with message and status code.
* All errors must be handled by `errorMiddleware` and return a standardized response format.

---

## 7. Logging

* Use the centralized `logger` utility.
* Log all successful and failed requests inside controller functions.
* Always include the `req` object in logs to capture request context.
* Add new constants if needed under `constants/eventConstant.js`
* Do not log sensitive data (passwords, tokens, secrets).

---

## 8. Testing

* All new features and bug fixes must be manually tested.
* Test both success and failure scenarios.
* Automated testing (unit/integration) is encouraged for future development.

---

## 9. Performance and N+1 Query Prevention

### 9.1. Avoid N+1 Queries

* Never perform database queries inside loops.
* Use `include` with proper associations when fetching related data.
* Prefer batch queries (`IN (...)`) instead of multiple single queries.
* Validate generated SQL logs when adding new complex queries.

### 9.2. Pagination and Limits

* All list endpoints must support pagination.
* Always apply `limit` and `offset` (or cursor-based pagination for large datasets).
* Never return unbounded result sets.

### 9.3. Indexing

* Ensure frequently queried columns are indexed.
* Add indexes through migrations, not manually in the database.

---

## 10. Transactions and Data Consistency

* Use database transactions for operations involving multiple write queries.
* Ensure transactions are properly committed or rolled back.
* Do not mix transactional and non-transactional queries in the same flow.

---

## 11. Input Validation and Data Integrity

* Validate all incoming request data at the controller level.
* Reject unknown or extra fields when possible.
* Never trust client-side validation alone.

---

## 12. Security Best Practices

* Never expose internal error details to clients.
* Sanitize inputs to prevent SQL injection and XSS.
* Do not hardcode secrets or credentials in the codebase.
* Use environment variables for sensitive configuration.

---

## 13. Configuration and Environment

* Use environment-based configuration (`development`, `staging`, `production`).
* Configuration files must not contain secrets.
* Validate required environment variables on application startup.

---

## 14. Versioning and Backward Compatibility

* All APIs must be versioned (e.g., `/v1/`).
* Do not introduce breaking changes in existing versions.
* Create a new version when breaking changes are required.

---

## 15. Code Quality and Maintainability

* Keep functions small and focused on a single responsibility.
* Avoid duplicated logic; extract reusable utilities.
* Remove unused code, logs, and comments before merging.

---

## 16. Git and Collaboration Guidelines

* Write clear and descriptive commit messages.
* Keep pull requests small and focused.
* Ensure code passes manual testing before merging.

---

These rules are mandatory for all current and future development in this project.
