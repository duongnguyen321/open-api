---
test_category: unit-tests
generated_date: 2024-07-26
total_test_cases: 5
test_framework_version: v1
priority: medium
automation_level: automated
tags: [unit, helpers, utilities]
---

# Unit Tests for Common Helpers

## Overview

This document outlines unit tests for the utility functions found in `src/common/helpers`. These tests focus on validating the logic of individual, isolated functions with various inputs.

## Test Environment Setup

- A Node.js test runner (e.g., Jest, Vitest).
- No external dependencies (like databases or caches) are needed.

## Test Cases

### TCUTL001: `timer.helper.ts` - Time String to Seconds Conversion 🟡 High

**Priority:** High
**Type:** Functional
**Automation:** Automated

#### Test Objective

To verify that the `timer` function correctly converts human-readable time strings into seconds.

#### Test Data

- **Input:** `'5m'`, **Expected Output:** `300`
- **Input:** `'2 hours'`, **Expected Output:** `7200`
- **Input:** `'1 day'`, **Expected Output:** `86400`
- **Input:** `'10s'`, **Expected Output:** `10`
- **Input:** `'1y'`, **Expected Output:** `31536000`
- **Input:** `'invalid time'`, **Expected Exception:** `Error('Invalid time format')`

#### Pass Criteria

- The function returns the correct number of seconds for all valid inputs and throws an error for invalid inputs.

---

### TCUTL002: `slug.helper.ts` - String to Slug Conversion 🟠 Medium

**Priority:** Medium
**Type:** Functional
**Automation:** Automated

#### Test Objective

To verify that the `slug` function correctly converts strings into URL-friendly slugs.

#### Test Data

- **Input:** `'Xin Chào Thế Giới'`, **Expected Output:** `'xin-chao-the-gioi'`
- **Input:** `'  Leading and Trailing Spaces  '`, **Expected Output:** `'leading-and-trailing-spaces'`
- **Input:** `'Special!@#$Ch@rs'`, **Expected Output:** `'special-ch-rs'`
- **Input:** `'Multiple---Dashes'`, **Expected Output:** `'multiple-dashes'`
- **Input:** `'Test With ID', 123`, **Expected Output:** `'test-with-id~123'`

#### Pass Criteria

- The function produces the expected URL-friendly slug for each input string.

---

### TCUTL003: `validate.helper.ts` - Email Validation 🟡 High

**Priority:** High
**Type:** Functional
**Automation:** Automated

#### Test Objective

To verify the correctness of `isEmail` and `isBusinessEmail` validation functions.

#### Test Data

- `isEmail('test@test.com')` -> `true`
- `isEmail('invalid-email')` -> `false`
- `isBusinessEmail('test@company.com')` -> `true`
- `isBusinessEmail('test@gmail.com')` -> `false`
- `isBusinessEmail('test@outlook.com')` -> `false`
- `isBusinessEmail('not-an-email')` -> `false`

#### Pass Criteria

- All validation functions return the correct boolean value for the given inputs.

---

### TCUTL004: `generateOTP.ts` - OTP Generation 🟠 Medium

**Priority:** Medium
**Type:** Functional
**Automation:** Automated

#### Test Objective

To verify that `generateOtp` produces a valid 6-digit string.

#### Test Steps

1.  **Action:** Call `generateOtp()`.
    **Expected Result:** The return value is a string of length 6, containing only digit characters.
2.  **Action:** Call `generateOtp()` again.
    **Expected Result:** The return value should be different from the first call with very high probability.

#### Pass Criteria

- The function consistently returns a 6-digit numeric string.

---

### TCUTL005: `removeAccents.helper.ts` - Accent Removal 🟠 Medium

**Priority:** Medium
**Type:** Functional
**Automation:** Automated

#### Test Objective

To verify the function correctly removes diacritics from strings.

#### Test Data

- **Input:** `'Thử nghiệm tiếng Việt có dấu'`, **Expected Output:** `'Thu nghiem tieng Viet co dau'`
- **Input:** `'français'`, **Expected Output:** `'francais'`
- **Input:** `'español'`, **Expected Output:** `'espanol'`
- **Input:** `'Đồng'`, **Expected Output:** `'Dong'`

#### Pass Criteria

- The function returns the expected accent-free string for each input.
