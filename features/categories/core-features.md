---
category: core-features
generated_date: 2025-07-03
total_suggestions: 2
project_analysis_version: v1
tags: [enhancement, geo-api, financial-data, new-module]
---

# Core Features Suggestions

## Overview

These features directly expand the primary data offerings of the API platform, adding significant new capabilities to the existing geographic and utility services. They align with the project's vision outlined in the `README.md` and provide substantial value to developers.

## Suggested Features

### 1. Geospatial Proximity Search ⭐⭐⭐

**Priority:** High
**Effort:** Medium
**Impact:** High

#### Description

Enhance the geographic API to support proximity searches. This would allow users to query for cities, states, or other points of interest within a specified radius (e.g., in kilometers or miles) of a given latitude and longitude coordinate.

#### User Value

This is a foundational feature for any location-aware application. It enables use cases like "find stores near me," "show all attractions within a 50km radius," or local service discovery, dramatically increasing the utility of the geographic data.

#### Technical Approach

1.  **Database Extension:** Enable the PostGIS extension for PostgreSQL, which provides powerful geospatial data types and functions.
2.  **Prisma Schema Update:** Update the `City` and `State` models in `schema.prisma` to use a native database `Point` type for coordinates instead of separate `latitude` and `longitude` strings. This requires a data migration.
3.  **New Endpoints/DTOs:** Introduce new endpoints like `GET /countries/cities/nearby` and a corresponding `NearbyCitiesDto` that accepts `latitude`, `longitude`, and `radius` as query parameters.
4.  **Service Logic:** In `country.service.ts`, use Prisma's raw query capabilities (`$queryRaw`) to execute a PostGIS spatial query (e.g., using `ST_DWithin`) to efficiently find all matching locations.

#### Success Metrics

- Adoption rate of the new `/nearby` endpoints.
- Positive feedback from developers building location-based services.

#### Dependencies

- Requires PostGIS to be installed and enabled on the PostgreSQL database server.

---

### 2. Currency Exchange Rate API ⭐⭐

**Priority:** Medium
**Effort:** Medium
**Impact:** High

#### Description

Fulfilling the vision in the `README.md`, this feature introduces a new set of endpoints for fetching real-time and historical currency exchange rates. The API would support querying for rates against a base currency and retrieving rates for a specific date.

#### User Value

Provides a highly sought-after financial data service that complements the existing country/currency information. It enables developers to build applications with multi-currency support, financial dashboards, or travel planning tools.

#### Technical Approach

1.  **New Module:** Create a new `CurrencyModule` with its own controller, service, and DTOs.
2.  **Prisma Model:** Add an `ExchangeRate` model to `schema.prisma` to store daily rates, with fields like `baseCurrency`, `targetCurrency`, `rate`, and `date`.
3.  **External Data Integration:** Integrate with a reliable third-party exchange rate provider (e.g., Open Exchange Rates, exchangerate-api.com).
4.  **Scheduled Job:** Use `@nestjs/schedule` to create a daily `CronJob` that fetches the latest rates from the external provider and populates the `ExchangeRate` table.
5.  **Caching:** Heavily cache the API responses in Redis, as rates typically only update once per day. The cache key could be `currency:rates:YYYY-MM-DD`.
6.  **Endpoints:**
    - `GET /currency/latest?base=USD&symbols=EUR,GBP,JPY`
    - `GET /currency/historical?date=2024-12-25&base=USD`

#### Success Metrics

- API traffic to the new `/currency/*` endpoints.
- Number of applications integrating the currency data.

#### Dependencies

- Requires a subscription or API key for an external exchange rate data provider.
