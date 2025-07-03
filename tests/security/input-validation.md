---
test_category: security-tests
generated_date: 2024-07-26
total_test_cases: 4
test_framework_version: v1
priority: high
automation_level: automated
tags: [security, validation, injection, xss]
---

# Security and Input Validation Test Cases

## Overview

These test cases are designed to probe the application for common security vulnerabilities related to input handling. The goal is to ensure that all user-supplied data is properly validated, sanitized, and handled to prevent attacks such as SQL Injection, Cross-Site Scripting (XSS), and parameter tampering.

## Test Environment Setup

- A running instance of the OpenAPI application.
- An API testing client capable of sending malformed and malicious payloads.

## Test Cases

### SV001: SQL Injection on Search Parameter 🔴 Critical

**Priority:** Critical
**Type:** Security
**Automation:** Automated

#### Test Objective

To verify that the application is not vulnerable to SQL injection through query parameters. Prisma ORM should prevent this, but the test serves as a critical verification.

#### Preconditions

- The `/countries` endpoint is available.

#### Test Steps

1.  **Action:** Send a `GET` request to `/countries?q=' OR 1=1; --`.
    **Expected Result:** The application should not crash or return an SQL error. It should return a `200 OK` with an empty `data` array, as no country name literally matches the payload. The query should be treated as a literal string.

2.  **Action:** Send a `GET` request to `/countries/states?name=' OR 'a'='a`.
    **Expected Result:** The application returns a `200 OK` with an empty `data` array. It does not return all states.

#### Pass Criteria

- The API handles the malicious string as a literal search term and does not execute it as a SQL command. No unexpected data is returned.

---

### SV002: Invalid Enum Values in Filters 🔴 Critical

**Priority:** High
**Type:** Security
**Automation:** Automated

#### Test Objective

To ensure that DTOs with `enum` constraints correctly reject invalid values.

#### Test Steps

1.  **Action:** Send a `GET` request to `/mail?type=INVALID_TYPE`.
    **Expected Result:** The API returns a `400 Bad Request` with a validation error message indicating that `type` must be one of the allowed enum values (e.g., WELCOME, CONTACT, OTP).

2.  **Action:** Send a `GET` request to `/mail?status=HACKED`.
    **Expected Result:** The API returns a `400 Bad Request` with a validation error message indicating that `status` must be one of the allowed enum values (SENT, READ).

---

### SV003: Cross-Site Scripting (XSS) in OTP Name Field 🟡 High

**Priority:** High
**Type:** Security
**Automation:** Manual

#### Test Objective

To verify that user input is properly escaped in email templates to prevent XSS.

#### Test Steps

1.  **Action:** Send a `POST` request to `/otp/create` with the body `{"name": "<script>alert('xss')</script>", "email": "xss.test@example.com"}`.
2.  **Action:** Open the received email in a web client and inspect the HTML source.
    **Expected Result:** The `name` field in the email body should be rendered as plain text. The `<script>` tags should be escaped (e.g., `<script>alert('xss')</script>`) and no JavaScript alert should be executed.

---

### SV004: Parameter Tampering on Pagination 🟠 Medium

**Priority:** Medium
**Type:** Security
**Automation:** Automated

#### Test Objective

To ensure the API handles abusive or excessively large values for pagination, preventing potential denial-of-service attacks.

#### Test Steps

1.  **Action:** Send a `GET` request to `/countries?limit=99999999`.
    **Expected Result:** The application should either cap the `limit` to a reasonable maximum (e.g., 100) or return a `400 Bad Request` if a validator with a `@Max()` decorator is in place. It should not attempt to query millions of records from the database.
