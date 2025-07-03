---
test_category: e2e-tests
generated_date: 2024-07-26
total_test_cases: 2
test_framework_version: v1
priority: high
automation_level: automated
tags: [e2e, workflow, user-journey]
---

# End-to-End User Journey Test Cases

## Overview

These test cases simulate complete user workflows from start to finish, validating that multiple components and services work together correctly to achieve a user's goal. They are critical for ensuring the integrated system behaves as expected in real-world scenarios.

## Test Environment Setup

- A running instance of the OpenAPI application.
- Accessible PostgreSQL database, seeded with geographic data.
- Accessible Redis instance.
- An SMTP server mock or a test email account to receive and inspect emails.
- An API testing client (e.g., Postman, or a test script using `axios`/`fetch`).

## Test Cases

### UJ001: Full OTP Verification Flow 🔴 Critical

**Priority:** Critical
**Type:** Functional
**Automation:** Automated

#### Test Objective

To verify the entire One-Time Password (OTP) lifecycle: creation, email delivery with tracking, successful validation, and prevention of reuse.

#### Preconditions

- The application is running and accessible.
- Mail service is correctly configured to send emails.
- Redis service is running.

#### Test Steps

1.  **Action:** Send a `POST` request to `/otp/create` with a valid JSON body: `{ "name": "Test User", "email": "test.user@example.com" }`.
    **Expected Result:** The API returns a `200 OK` status with a success message. An OTP is generated and stored in Redis for the user's email.

2.  **Action:** Check the test email inbox for `test.user@example.com`.
    **Expected Result:** An email is received with the subject "Your One-Time Password, Test User". The email body contains a 6-digit OTP and a tracking pixel image.

3.  **Action:** Extract the tracking pixel URL from the email. Send a `GET` request to this URL.
    **Expected Result:** The API returns a `200 OK` status with an image/png content type. The `MailTracking` record in the database for this email is updated to `status: 'READ'`.

4.  **Action:** Extract the 6-digit OTP from the email. Send a `POST` request to `/otp/validate` with the body: `{ "email": "test.user@example.com", "otp": "THE_OTP_FROM_EMAIL" }`.
    **Expected Result:** The API returns a `200 OK` status with the message "OTP is valid...". The OTP key is deleted from Redis.

5.  **Action:** Immediately send the same `POST` request to `/otp/validate` again with the same OTP.
    **Expected Result:** The API returns a `400 Bad Request` status with the message "Invalid or expired OTP, please try again."

#### Pass Criteria

- All steps are completed successfully, and all expected results are met.

#### Fail Criteria

- Any step fails to produce the expected result.
- Email is not received or is malformed.
- OTP validation fails on the first attempt or succeeds on the second attempt.

---

### UJ002: Geographic Data Exploration Flow 🟡 High

**Priority:** High
**Type:** Functional
**Automation:** Automated

#### Test Objective

To simulate a developer's workflow of exploring the geographic data, starting from a broad search for countries and drilling down to specific cities.

#### Preconditions

- The application is running and accessible.
- The database is fully seeded with geographic data via the `importData` process.

#### Test Steps

1.  **Action:** Send a `GET` request to `/countries?q=land&limit=5` to search for countries.
    **Expected Result:** The API returns a `200 OK` status. The `data` array contains countries with "land" in their name (e.g., Switzerland, Finland, Poland, Ireland, Iceland).

2.  **Action:** From the previous result, pick a country (e.g., "Switzerland", which has `id: 224`). Send a `GET` request to `/countries/224`.
    **Expected Result:** The API returns a `200 OK` status. The response body is a single country object containing detailed information, including non-empty arrays for `states`, `timezones`, and a `translations` object.

3.  **Action:** From the details of Switzerland, pick a state (e.g., "Zürich", which has `id: 3734`). Send a `GET` request to `/countries/states?countryId=224&name=Zurich`.
    **Expected Result:** The API returns a `200 OK` status. The `data` array contains the state object for "Zürich", which includes nested country information.

4.  **Action:** Using the state ID `3734`, send a `GET` request to `/countries/cities?stateId=3734&limit=5`.
    **Expected Result:** The API returns a `200 OK` status. The `data` array contains up to 5 cities located within the state of Zürich. Each city object includes nested state and country information.

#### Pass Criteria

- All API requests return a `200 OK` status and the data at each step is consistent and logically connected.

#### Fail Criteria

- Any API request returns an error status (e.g., 500) or incorrect/empty data when data is expected.
- The data returned in a step does not logically follow from the previous step (e.g., cities returned are not in the requested state).
