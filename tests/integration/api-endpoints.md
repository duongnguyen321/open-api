---
test_category: integration-tests
generated_date: 2024-07-26
total_test_cases: 21
test_framework_version: v1
priority: critical
automation_level: automated
tags: [api, integration, http, country, otp, mail]
---

# API Endpoint Integration Tests

## Overview

This document contains integration test cases for the public API endpoints. These tests validate the full request-response cycle, including routing, controller logic, service execution, DTO validation, and correct data serialization.

## Test Environment Setup

- A running instance of the OpenAPI application connected to a seeded database and Redis.
- An API testing client.

## Country API Test Cases (`/countries`)

### TC001: Get Countries - Happy Path with Pagination 🟢 Low

**Priority:** High, **Type:** Functional
**Action:** Send `GET` request to `/countries?page=2&limit=5`.
**Expected Result:** `200 OK`. Response body is a valid `ApiResponseDto` with `pagination.page` as 2, `pagination.limit` as 5, and the `data` array containing 5 country records.

### TC002: Get Countries - "Vietnam First" Feature 🟡 High

**Priority:** Medium, **Type:** Functional
**Action:** Send `GET` request to `/countries?limit=10`.
**Expected Result:** `200 OK`. The first element in the `data` array should be the record for "Vietnam" (`id: 246`).

### TC003: Get Countries - Filter by Name 🟡 High

**Priority:** High, **Type:** Functional
**Action:** Send `GET` request to `/countries?name=United`.
**Expected Result:** `200 OK`. The `data` array contains countries like "United States", "United Kingdom", "United Arab Emirates".

### TC004: Get Countries - Filter by ISO2 Code 🟡 High

**Priority:** High, **Type:** Functional
**Action:** Send `GET` request to `/countries?iso2=JP`.
**Expected Result:** `200 OK`. The `data` array contains exactly one record for "Japan".

### TC005: Get Countries - General Search 'q' 🟡 High

**Priority:** High, **Type:** Functional
**Action:** Send `GET` request to `/countries?q=stan`.
**Expected Result:** `200 OK`. The `data` array contains countries whose name, capital, or other fields contain "stan" (e.g., Afghanistan, Pakistan, Kazakhstan).

### TC006: Get Countries - No Results Found 🟢 Low

**Priority:** Medium, **Type:** Functional
**Action:** Send `GET` request to `/countries?name=NonExistentCountry123`.
**Expected Result:** `200 OK`. The `data` array is empty and `pagination.total` is 0.

### TC007: Get Countries - Invalid Pagination Input 🔴 Critical

**Priority:** High, **Type:** Functional
**Action:** Send `GET` request to `/countries?page=abc&limit=-5`.
**Expected Result:** `400 Bad Request`. The response body indicates a validation error for `page` and `limit`.

### TC008: Get Country by ID - Success 🟡 High

**Priority:** High, **Type:** Functional
**Action:** Send `GET` request to `/countries/246` (ID for Vietnam).
**Expected Result:** `200 OK`. Response body contains the full country object for Vietnam, including `states`, `cities`, `timezones`, and `translations` arrays/objects.

### TC009: Get Country by ID - Not Found 🔴 Critical

**Priority:** High, **Type:** Functional
**Action:** Send `GET` request to `/countries/99999`.
**Expected Result:** `200 OK` with `data` being `null`. (Based on service logic which may not throw a 404).

### TC010: Get Country by ID - Invalid ID format 🔴 Critical

**Priority:** High, **Type:** Functional
**Action:** Send `GET` request to `/countries/abc`.
**Expected Result:** `400 Bad Request` due to the `ParseIntPipe` failing.

### TC011: Get States - Filter by Country 🟡 High

**Priority:** High, **Type:** Functional
**Action:** Send `GET` request to `/countries/states?countryId=246`.
**Expected Result:** `200 OK`. The `data` array contains all 63 states/provinces of Vietnam.

### TC012: Get Cities - Filter by State 🟡 High

**Priority:** High, **Type:** Functional
**Action:** Send `GET` request to `/countries/cities?stateId=5149` (ID for Hà Nội).
**Expected Result:** `200 OK`. The `data` array contains all districts of Hanoi.

### TC013: Cache Hit Verification for Get Countries 🟠 Medium

**Priority:** Medium, **Type:** Performance
**Action:**

1. Record the time. Send `GET` request to `/countries?limit=1`.
2. Note the `X-Response-Time` header (if available) or measure client-side duration.
3. Immediately send the exact same `GET` request to `/countries?limit=1`.
   **Expected Result:** The second request should have a significantly shorter response time, indicating a Redis cache hit.

---

## OTP API Test Cases (`/otp`)

### TC014: Create OTP - Success 🔴 Critical

**Priority:** Critical, **Type:** Functional
**Action:** Send `POST` request to `/otp/create` with body `{"name": "John Doe", "email": "john.doe@example.com"}`.
**Expected Result:** `200 OK`. The response confirms OTP creation. An OTP for `john.doe@example.com` is stored in Redis. An email is sent.

### TC015: Create OTP - Invalid Email Format 🔴 Critical

**Priority:** Critical, **Type:** Security
**Action:** Send `POST` request to `/otp/create` with body `{"name": "John Doe", "email": "invalid-email"}`.
**Expected Result:** `400 Bad Request` due to DTO validation failure.

### TC016: Create OTP - Missing Name 🔴 Critical

**Priority:** Critical, **Type:** Functional
**Action:** Send `POST` request to `/otp/create` with body `{"email": "john.doe@example.com"}`.
**Expected Result:** `400 Bad Request` due to DTO validation failure (`name` is required).

### TC017: Validate OTP - Success 🔴 Critical

**Priority:** Critical, **Type:** Functional
**Preconditions:** An OTP has been successfully created for `test.validate@example.com` and its value is known.
**Action:** Send `POST` to `/otp/validate` with body `{"email": "test.validate@example.com", "otp": "VALID_OTP"}`.
**Expected Result:** `200 OK`. The response confirms successful validation. The OTP is deleted from Redis.

### TC018: Validate OTP - Invalid OTP 🔴 Critical

**Priority:** Critical, **Type:** Functional
**Preconditions:** An OTP exists for `test.validate@example.com`.
**Action:** Send `POST` to `/otp/validate` with body `{"email": "test.validate@example.com", "otp": "000000"}`.
**Expected Result:** `400 Bad Request` with message "Invalid or expired OTP, please try again.".

### TC019: Validate OTP - Expired OTP 🟡 High

**Priority:** High, **Type:** Functional
**Preconditions:** Create an OTP for `test.expire@example.com` using the `otpService` directly with a 1-second TTL. Wait for 2 seconds.
**Action:** Send `POST` to `/otp/validate` with body `{"email": "test.expire@example.com", "otp": "EXPIRED_OTP"}`.
**Expected Result:** `400 Bad Request` with message "Invalid or expired OTP, please try again.".

---

## Mail API Test Cases (`/mail`)

### TC020: Mail Tracking Pixel - Success 🟡 High

**Priority:** High, **Type:** Functional
**Preconditions:** An email has been sent via the `/otp/create` endpoint, which generated a `MailTracking` record with a unique ID and `status: 'SENT'`.
**Action:** Send `GET` request to the tracking URL: `/mail/tracking?id=VALID_ID&email=VALID_EMAIL`.
**Expected Result:** `200 OK` with `Content-Type: image/png`. The corresponding `MailTracking` record in the database is updated to `status: 'READ'`.

### TC021: Get All Mails - Filter by Type and Status 🟠 Medium

**Priority:** Medium, **Type:** Functional
**Preconditions:** Multiple emails of different types (`OTP`, `WELCOME`, etc.) and statuses have been generated.
**Action:** Send `GET` request to `/mail?type=OTP&status=SENT`.
**Expected Result:** `200 OK`. The `data` array only contains email records that match `type: 'OTP'` and `status: 'SENT'`.
