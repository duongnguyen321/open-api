# Open API Platform

## Overview

A comprehensive, publicly accessible API platform providing various data services with the first implementation focused
on worldwide geographic data. Built with NestJS, this platform offers robust, well-documented APIs with advanced
filtering, pagination, and caching capabilities.

## Features

- **Multiple Data Services**: Starting with detailed geographic data (countries, states, cities)
- **RESTful API Design**: Follows REST principles with standardized responses
- **Advanced Filtering**: Multiple filter parameters for precise data retrieval
- **Search Functionality**: Cross-field searching with the `q` parameter
- **Pagination**: Control result sets with page and limit parameters
- **Performance Optimization**: Redis caching for high-performance responses
- **Comprehensive Documentation**: Interactive Swagger documentation
- **Type Safety**: Fully typed with TypeScript

## Available APIs

### Geographic Data API

Access detailed information about countries, states/provinces, and cities worldwide.

#### Countries Endpoints

```
GET /countries            # List countries with filters
GET /countries/:id        # Get specific country with details
GET /countries/states     # List states/provinces with filters
GET /countries/cities     # List cities with filters
```

**Example Request:**

```bash
curl https://open-api.duonguyen.site/countries?name=Vietnam&page=0&limit=10
```

Countries data includes:

- Basic information (name, codes)
- Geographic details (coordinates, region)
- Economic information (currency)
- Related entities (states, cities)
- Localization (translations)
- Time data (timezones)

For complete documentation of the Geographic API endpoints and parameters, see
the [Geographic API Documentation](#geographic-api-documentation) section below.

### Future APIs (Planned/Coming Soon)

The platform is designed to expand with additional API services beyond geographic data:

- **Currency Exchange Rates API**: Real-time and historical exchange rates
- **Weather Data API**: Current conditions and forecasts by location
- **News Aggregation API**: Categorized news from multiple sources
- **Translation Services API**: Text translation between multiple languages
- **User Authentication API**: OAuth and token-based authentication services

## Geographic API Documentation

### Countries

#### Get all countries with filters

```
GET /countries
```

**Query Parameters:**

| Parameter | Type   | Description                   | Example              |
|-----------|--------|-------------------------------|----------------------|
| name      | string | Filter by country name        | "Vietnam"            |
| iso3      | string | Filter by ISO3 code           | "VNM"                |
| iso2      | string | Filter by ISO2 code           | "VN"                 |
| currency  | string | Filter by currency code       | "VND"                |
| capital   | string | Filter by capital city        | "Hanoi"              |
| region    | string | Filter by region              | "Asia"               |
| subregion | string | Filter by subregion           | "South-Eastern Asia" |
| q         | string | Search across multiple fields | "viet"               |
| page      | number | Page number (0-indexed)       | 0                    |
| limit     | number | Number of items per page      | 10                   |

[Full response examples and additional endpoints documentation...]

## Architecture

The application follows a modular architecture based on NestJS best practices:

```
src/
├── modules/
│   ├── country/           # Geographic data API module
│   ├── [future-modules]/  # Additional API modules
├── core/
│   ├── prisma/            # Database access module
│   ├── redis/             # Caching module
│   ├── common/            # Shared utilities
│   └── middlewares/       # Middleware components
└── main.ts                # Application entry point
```

## Using the Platform

### Base URL

```
https://open-api.duonguyen.site
```

### Authentication

The API is currently publicly available without authentication requirements.

### Rate Limiting

Please be respectful of API usage limits. Excessive requests may be throttled.

### Error Response Format

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

## Development and Contribution

For information on setting up a local development environment, running tests, or contributing to the project, please
visit the [GitHub repository](https://github.com/duongnguyen321/open-api).


---

# API Dữ Liệu Địa Lý

## Tổng Quan

Một nền tảng API toàn diện, có thể truy cập công khai, cung cấp nhiều dịch vụ dữ liệu khác nhau với triển khai đầu tiên
tập trung vào dữ liệu địa lý trên toàn thế giới. Được xây dựng bằng NestJS, nền tảng này cung cấp các API mạnh mẽ, được
ghi chép đầy đủ với khả năng lọc, phân trang và lưu trữ đệm nâng cao.

## Tính Năng

- **Dữ liệu địa lý đầy đủ**: Cung cấp thông tin chi tiết về quốc gia, tỉnh/thành phố, và đô thị
- **Quan hệ phân cấp**: Dữ liệu bao gồm mối quan hệ giữa các đơn vị địa lý
- **Lọc dữ liệu nâng cao**: Lọc theo nhiều trường bao gồm tên, mã quốc gia, khu vực, và nhiều hơn nữa
- **Tìm kiếm linh hoạt**: Sử dụng tham số tìm kiếm tổng quát để tìm kiếm trên nhiều trường
- **Phân trang**: Kiểm soát kết quả với các tham số trang và giới hạn
- **Thông tin phong phú**: Truy cập thông tin mở rộng bao gồm tiền tệ, múi giờ, bản dịch, và nhiều hơn nữa
- **Tối ưu hiệu suất**: Thiết kế với bộ nhớ đệm Redis để đạt hiệu suất cao

## API Endpoints

### Quốc Gia

#### Lấy tất cả quốc gia với bộ lọc

```
GET /countries
```

**Tham Số Truy Vấn:**

| Tham số   | Kiểu   | Mô tả                       | Ví dụ                |
|-----------|--------|-----------------------------|----------------------|
| name      | string | Lọc theo tên quốc gia       | "Vietnam"            |
| iso3      | string | Lọc theo mã ISO3            | "VNM"                |
| iso2      | string | Lọc theo mã ISO2            | "VN"                 |
| currency  | string | Lọc theo mã tiền tệ         | "VND"                |
| capital   | string | Lọc theo thủ đô             | "Hanoi"              |
| region    | string | Lọc theo khu vực            | "Asia"               |
| subregion | string | Lọc theo tiểu khu vực       | "South-Eastern Asia" |
| q         | string | Tìm kiếm trên nhiều trường  | "viet"               |
| page      | number | Số trang (đánh số từ 0)     | 0                    |
| limit     | number | Số lượng mục trên mỗi trang | 10                   |

**Ví Dụ Yêu Cầu:**

```bash
curl https://open-api.duonguyen.site/countries?name=Vietnam&page=0&limit=10
```

**Ví Dụ Phản Hồi:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": 246,
      "name": "Vietnam",
      "iso3": "VNM",
      "iso2": "VN",
      "numeric_code": "704",
      "phonecode": "84",
      "capital": "Hanoi",
      "currency": "VND",
      "currency_name": "Vietnamese đồng",
      "currency_symbol": "₫",
      "tld": ".vn",
      "native": "Việt Nam",
      "region": "Asia",
      "region_id": 3,
      "subregion": "South-Eastern Asia",
      "subregion_id": 13,
      "nationality": "Vietnamese",
      "latitude": "16.16666666",
      "longitude": "107.83333333",
      "emoji": "🇻🇳",
      "emojiU": "U+1F1FB U+1F1F3"
    }
  ],
  "pagination": {
    "page": 0,
    "limit": 10,
    "total": 1,
    "totalPage": 1,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "message": "Get data countries success."
}
```

#### Lấy thông tin chi tiết của một quốc gia cụ thể

```
GET /countries/:id
```

Trả về thông tin toàn diện về một quốc gia cụ thể, bao gồm tỉnh thành, thành phố, múi giờ và bản dịch.

**Ví Dụ Yêu Cầu:**

```bash
curl https://open-api.duonguyen.site/countries/246
```

**Ví Dụ Phản Hồi:**

```json
{
  "statusCode": 200,
  "data": {
    "id": 246,
    "name": "Vietnam",
    "iso3": "VNM",
    "iso2": "VN",
    "numeric_code": "704",
    "phonecode": "84",
    "capital": "Hanoi",
    "currency": "VND",
    "currency_name": "Vietnamese đồng",
    "currency_symbol": "₫",
    "tld": ".vn",
    "native": "Việt Nam",
    "region": "Asia",
    "region_id": 3,
    "subregion": "South-Eastern Asia",
    "subregion_id": 13,
    "nationality": "Vietnamese",
    "latitude": "16.16666666",
    "longitude": "107.83333333",
    "emoji": "🇻🇳",
    "emojiU": "U+1F1FB U+1F1F3",
    "states": [
      {
        "id": 5149,
        "name": "Hà Nội",
        "state_code": "HN",
        "latitude": "21.02776440",
        "longitude": "105.83415980",
        "type": "municipality",
        "countryId": 246,
        "cities": [
          {
            "id": 149834,
            "name": "Ba Đình",
            "latitude": "21.03482330",
            "longitude": "105.80854700",
            "stateId": 5149
          }
        ]
      }
    ],
    "timezones": [
      {
        "id": 424,
        "zoneName": "Asia/Ho_Chi_Minh",
        "gmtOffset": 25200,
        "gmtOffsetName": "UTC+07:00",
        "abbreviation": "ICT",
        "tzName": "Indochina Time",
        "countryId": 246
      }
    ],
    "translations": {
      "id": 246,
      "ko": "베트남",
      "ptBR": "Vietnã",
      "pt": "Vietname",
      "nl": "Vietnam",
      "hr": "Vijetnam",
      "fa": "ویتنام",
      "de": "Vietnam",
      "es": "Vietnam",
      "fr": "Viêt Nam",
      "ja": "ベトナム",
      "it": "Vietnam",
      "zhCN": "越南",
      "tr": "Vietnam",
      "ru": "Вьетнам",
      "uk": "В'єтнам",
      "pl": "Wietnam",
      "countryId": 246
    }
  },
  "pagination": null,
  "message": "Get data country success."
}
```

### Tỉnh/Thành Phố

#### Lấy danh sách tỉnh/thành với bộ lọc

```
GET /countries/states
```

**Tham Số Truy Vấn:**

| Tham số    | Kiểu   | Mô tả                       | Ví dụ      |
|------------|--------|-----------------------------|------------|
| countryId  | string | Lọc theo ID quốc gia        | "246"      |
| name       | string | Lọc theo tên tỉnh/thành     | "Hà Nội"   |
| state_code | string | Lọc theo mã tỉnh/thành      | "HN"       |
| type       | string | Lọc theo loại               | "province" |
| q          | string | Tìm kiếm trên nhiều trường  | "hanoi"    |
| page       | number | Số trang (đánh số từ 0)     | 0          |
| limit      | number | Số lượng mục trên mỗi trang | 10         |

**Ví Dụ Yêu Cầu:**

```bash
curl https://open-api.duonguyen.site/countries/states?countryId=246&page=0&limit=1
```

**Ví Dụ Phản Hồi:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": 5126,
      "name": "An Giang",
      "state_code": "44",
      "latitude": "10.52158360",
      "longitude": "105.12589550",
      "type": "province",
      "countryId": 246,
      "country": {
        "id": 246,
        "name": "Vietnam",
        "iso3": "VNM",
        "iso2": "VN"
      }
    }
  ],
  "pagination": {
    "page": 0,
    "limit": 1,
    "total": 63,
    "totalPage": 63,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "message": "Get data states success."
}
```

### Thành Phố/Quận/Huyện

#### Lấy danh sách thành phố/quận/huyện với bộ lọc

```
GET /countries/cities
```

**Tham Số Truy Vấn:**

| Tham số | Kiểu   | Mô tả                       | Ví dụ     |
|---------|--------|-----------------------------|-----------|
| stateId | string | Lọc theo ID tỉnh/thành      | "5149"    |
| name    | string | Lọc theo tên thành phố      | "Ba Đình" |
| q       | string | Tìm kiếm trên nhiều trường  | "ba dinh" |
| page    | number | Số trang (đánh số từ 0)     | 0         |
| limit   | number | Số lượng mục trên mỗi trang | 10        |

**Ví Dụ Yêu Cầu:**

```bash
curl https://open-api.duonguyen.site/countries/cities?stateId=5149&page=0&limit=1
```

**Ví Dụ Phản Hồi:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": 149836,
      "name": "Bắc Từ Liêm",
      "latitude": "21.07148680",
      "longitude": "105.71992260",
      "stateId": 5149,
      "state": {
        "id": 5149,
        "name": "Hà Nội",
        "state_code": "HN",
        "country": {
          "id": 246,
          "name": "Vietnam",
          "iso3": "VNM",
          "iso2": "VN"
        }
      }
    }
  ],
  "pagination": {
    "page": 0,
    "limit": 1,
    "total": 30,
    "totalPage": 30,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "message": "Get data cities success."
}
```

## Kiến Trúc Hệ Thống

Ứng dụng tuân theo kiến trúc mô-đun dựa trên các thực hành tốt nhất của NestJS:

```
src/
├── modules/
│   ├── country/           # Module API dữ liệu địa lý
│   │   ├── country.controller.ts
│   │   ├── country.service.ts
│   │   ├── country.module.ts
│   │   └── dto/
│   │       ├── filter-country.dto.ts
│   │       ├── filter-state.dto.ts
│   │       └── filter-city.dto.ts
├── core/
│   ├── prisma/            # Module truy cập cơ sở dữ liệu
│   ├── redis/             # Module bộ nhớ đệm
│   ├── common/            # Tiện ích chung
│   └── middlewares/       # Các thành phần middleware
└── main.ts                # Điểm vào ứng dụng
```

## Sử Dụng API

### URL Cơ Sở

```
https://open-api.duonguyen.site
```

### Xác Thực

API hiện có sẵn công khai không yêu cầu xác thực.

### Giới Hạn Tần Suất

Vui lòng tôn trọng giới hạn sử dụng API. Các yêu cầu quá mức có thể bị hạn chế.

### Định Dạng Phản Hồi Lỗi

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy dữ liệu",
  "error": "Not Found"
}
```

## Phát Triển và Đóng Góp

Để biết thông tin về việc thiết lập môi trường phát triển cục bộ, chạy thử nghiệm, hoặc đóng góp cho dự án, vui lòng
truy cập [kho lưu trữ GitHub](https://github.com/duongnguyen321/open-api).
