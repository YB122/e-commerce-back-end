# E-Commerce Backend API

A comprehensive Node.js and Express.js backend API for an e-commerce platform with user authentication, product management, cart functionality, order processing, and admin features.

## 🚀 Features

- **User Management**: Registration, login, email verification, password reset
- **Product Catalog**: Categories, subcategories, products with image uploads
- **Shopping Cart**: Add, update, remove items with stock validation
- **Order Management**: Order creation, status tracking, admin order management
- **Admin Panel**: Staff management, user management, product/category management
- **Coupon System**: Discount coupons for users
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Email Services**: Verification emails, password reset, notifications

## 🛠️ Tech Stack

- **Runtime**: Node.js with ES6 Modules
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi for input validation
- **File Upload**: Multer for image handling
- **Email**: Nodemailer for email services
- **Password Hashing**: bcrypt
- **Testing**: Jest with Supertest
- **Documentation**: Mermaid flowcharts for API documentation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd e-commerce-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Copy the environment configuration and update as needed:

   ```bash
   cp config/.env.example config/.env
   ```

   Update the following variables in `config/.env`:

   ```env
   PORT = 3000
   EMAIL = your-email@gmail.com
   PASSWORD = your-app-password
   HASH = 12
   BASE_URL = http://localhost:3000
   SIGNATURE_ADMIN = signatureAdmin
   SIGNATURE_USER = signatureUser
   SIGNATURE_STAFF = signatureStaff
   ACCESS_TOKEN = 1d
   REFRESH_TOKEN = 1y
   DATA_BASE_URL_MY = mongodb://localhost:27017/e-commerce-nti
   VERIFY_SIGNATURE_MY = my
   ```

4. **Start MongoDB**

   ```bash
   # For local MongoDB
   mongod
   ```

5. **Run the application**

   ```bash
   # Development mode with auto-restart
   npm start

   # Or run directly
   node src/main.js
   ```

6. **Access the API**
   The server will start on `http://localhost:3000`

## 📁 Project Structure

```
├── src/
│   ├── app.controller.js          # Main Express app setup
│   ├── main.js                    # Application entry point
│   ├── common/                    # Shared utilities and middleware
│   │   ├── middleware/            # Express middleware
│   │   └── utils/                 # Utility functions
│   ├── database/                  # Database configuration
│   │   ├── connection.js          # MongoDB connection
│   │   └── model/                 # Mongoose models
│   └── module/                    # Feature modules
│       ├── auth/                  # Authentication
│       ├── users/                 # User management
│       ├── categories/            # Product categories
│       ├── subCategories/         # Subcategories
│       ├── products/              # Product management
│       ├── carts/                 # Shopping cart
│       ├── orders/                # Order processing
│       ├── staffs/                # Staff management
│       └── coupons/               # Coupon system
├── config/                        # Configuration files
├── flowcharts/                    # API documentation with flowcharts
├── uploads/                       # File upload directory
└── tests/                         # Test files
```

## 🔐 Authentication & Authorization

The API uses JWT-based authentication with three user roles:

- **User**: Regular customers with shopping and order capabilities
- **Admin**: Full system access including user and product management
- **Staff**: Limited access for order processing and customer service

### Authentication Flow

1. **Login**: User provides credentials → JWT tokens generated
2. **Access Token**: Short-lived token for API requests (1 day)
3. **Refresh Token**: Long-lived token for token renewal (1 year)
4. **Role-based Access**: Middleware checks user role for protected endpoints

## 📊 API Flowcharts

This project includes comprehensive API flowcharts in the `flowcharts/` directory. Each flowchart visually represents the API logic, including validation, business rules, error handling, and success paths.

### 🔐 Authentication Flowcharts

#### User Registration Flow

```mermaid
flowchart TD
    A[Client Request] --> B{Validate Input}
    B -->|Invalid| C[Return 400 - Validation Error]
    B -->|Valid| D{Check Email Exists}
    D -->|Exists & Active| E[Return 400 - Email Already Exists]
    D -->|Password Mismatch| F[Return 400 - Password Not Matched]
    D -->|Valid| G[Hash Password]
    G --> H{Avatar Uploaded?}
    H -->|Yes| I[Save Avatar URL]
    H -->|No| J[Continue Without Avatar]
    I --> K{User Exists Inactive?}
    J --> K
    K -->|Yes| L[Update Existing User]
    K -->|No| M[Create New User]
    L --> N[Generate Verification Token]
    M --> N
    N --> O[Send Verification Email]
    O --> P[Return 200 - Success]
```

#### User Login Flow

```mermaid
flowchart TD
    A[Client Request] --> B{Validate Input}
    B -->|Invalid| C[Return 400 - Validation Error]
    B -->|Valid| D[Find User by Email]
    D -->|Not Found/Inactive| E[Return 400 - Invalid Credentials]
    D -->|Found| F{Compare Password}
    F -->|Mismatch| E
    F -->|Match| G{Email Verified?}
    G -->|No| H[Return 400 - Email Not Verified]
    G -->|Yes| I[Generate Access Token]
    I --> J[Generate Refresh Token]
    J --> K[Return 200 - Login Success]
```

### Shopping Cart Flowcharts

#### Add Item to Cart Flow

```mermaid
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 401 - Login First]
    B -->|Auth Valid| D[Find User by ID]
    D -->|Not Found/Inactive| E[Return 404 - User Not Found]
    D -->|Found| F[Find Product by ID]
    F -->|Not Found/Inactive| G[Return 404 - Product Not Found]
    F -->|Found| H{Quantity Provided?}
    H -->|No| I[Set Quantity = 1]
    H -->|Yes| J[Use Provided Quantity]
    I --> K{Stock Available?}
    J --> K
    K -->|Insufficient| L[Return 404 - Insufficient Stock]
    K -->|Available| M[Check if Item Already in Cart]
    M -->|Exists| N[Update Quantity]
    M -->|Not Exists| O[Add New Cart Item]
    N --> P{New Total Stock OK?}
    P -->|Insufficient| Q[Return 404 - Insufficient Stock]
    P -->|Available| R[Update Cart Item]
    R --> S[Return 200 - Cart Updated]
    O --> T[Create Cart Item]
    T --> U[Return 200 - Item Added]
```

### Product Management Flowcharts

#### Create Product Flow (Admin Only)

```mermaid
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Validate Input]
    D -->|Invalid| E[Return 400 - Validation Error]
    D -->|Valid| F[Check Product Name Exists]
    F -->|Exists| G[Return 400 - Product Already Exists]
    F -->|Not Exists| H[Find Subcategory]
    H -->|Not Found| I[Return 404 - Subcategory Not Found]
    H -->|Found| J[Find Category]
    J -->|Not Found| K[Return 404 - Category Not Found]
    J -->|Found| L{Subcategory Belongs to Category?}
    L -->|No| M[Return 404 - Subcategory Not for This Category]
    L -->|Yes| N{Stock & Price Valid?}
    N -->|Invalid| O[Return 400 - Stock and Price Must Be > 0]
    N -->|Valid| P[Create Product]
    P --> Q[Return 200 - Product Created]
```

### Available Flowcharts

The complete flowcharts are available in the `flowcharts/` directory:

#### 1. Authentication APIs

- **User Registration**: Complete signup flow with email verification
- **User Login**: Authentication with token generation
- **Email Verification**: Token-based email verification
- **Password Reset**: OTP-based password recovery
- **Token Refresh**: Access token renewal

#### 2. User Management APIs

- **Profile Management**: View, update, and delete user profiles
- **Profile Image Upload**: Avatar management

#### 3. Product Management APIs

- **Product CRUD**: Create, read, update, delete products (admin only)
- **Category Management**: Category and subcategory operations
- **Product Search**: Filtered product browsing

#### 4. Shopping Cart APIs

- **Cart Operations**: Add, update, remove items
- **Stock Validation**: Real-time stock checking
- **Cart Management**: View and clear cart

#### 5. Order Management APIs

- **Order Creation**: Checkout process with cart items
- **Order Tracking**: Status updates and history
- **Admin Order Management**: Order processing and fulfillment

#### 6. Staff Management APIs

- **Staff CRUD**: Staff member management
- **Check-in/Check-out**: Attendance tracking
- **Deduction Management**: Salary deductions

#### 7. Coupon System APIs

- **Coupon Management**: Create and manage discount codes
- **Coupon Application**: Apply discounts to orders

### How to View Flowcharts

These flowcharts are written in Mermaid syntax and can be viewed using:

- **GitHub/GitLab**: Automatic Mermaid rendering
- **VS Code**: Install Mermaid Preview extension
- **Online**: Use [mermaid.live](https://mermaid.live) or [Mermaid.js](https://mermaid-js.github.io)
- **Markdown Editors**: Most modern editors support Mermaid

## 🖼️ Flowchart Images

In addition to the Mermaid diagrams above, the project includes visual flowchart images for each API endpoint. These images are located in the `flowcharts/images/` directory and provide a visual representation of each API flow.

### 🔐 Authentication API Images

| API Endpoint                                | Flowchart Image                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| POST /api/v1/auth/signup                    | ![Signup API](flowcharts/images/auth/signup-api.png)                                       |
| POST /api/v1/auth/login                     | ![Login API](flowcharts/images/auth/login-api.png)                                         |
| GET /api/v1/auth/verify-email/:token        | ![Verify Email API](flowcharts/images/auth/verify-email-api.png)                           |
| POST /api/v1/auth/resend-verification       | ![Resend Verification API](flowcharts/images/auth/resend-verification-api.png)             |
| POST /api/v1/auth/forget-password           | ![Forget Password API](flowcharts/images/auth/forget-password-api.png)                     |
| POST /api/v1/auth/reset-password            | ![Reset Password API](flowcharts/images/auth/reset-password-api.png)                       |
| POST /api/v1/auth/generate-new-access-token | ![Generate New Access Token API](flowcharts/images/auth/generate-new-access-token-api.png) |
| Refresh Token Flow                          | ![Refresh Token API](flowcharts/images/auth/refresh-token-api.png)                         |

### 🛒 Shopping Cart API Images

| API Endpoint                   | Flowchart Image                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------- |
| POST /api/v1/cart              | ![Add to Cart API](flowcharts/images/cart/add-to-cart-api.png)                   |
| POST /api/v1/cart (Add Item)   | ![Add Item to Cart API](flowcharts/images/cart/add-item-to-cart-api.png)         |
| PUT /api/v1/cart/:productId    | ![Update Cart Quantity API](flowcharts/images/cart/update-cart-quantity-api.png) |
| GET /api/v1/cart               | ![View Cart API](flowcharts/images/cart/view-cart-api.png)                       |
| DELETE /api/v1/cart/:productId | ![Remove Cart Item API](flowcharts/images/cart/remove-cart-item-api.png)         |
| DELETE /api/v1/cart            | ![Clear Cart API](flowcharts/images/cart/clear-cart-api.png)                     |

### 📂 Category API Images

| API Endpoint                     | Flowchart Image                                                                                |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| POST /api/v1/categories          | ![Create Category API](flowcharts/images/category/create-category-api.png)                     |
| PUT /api/v1/categories/:id       | ![Update Category API](flowcharts/images/category/update-category-api.png)                     |
| DELETE /api/v1/categories/:id    | ![Delete Category API](flowcharts/images/category/delete-category-api.png)                     |
| GET /api/v1/categories/admin     | ![Get Categories Admin API](flowcharts/images/category/get-categories-admin-api.png)           |
| GET /api/v1/categories           | ![Get Categories Public API](flowcharts/images/category/get-categories-public-api.png)         |
| GET /api/v1/categories/:id/admin | ![Get Single Category Admin API](flowcharts/images/category/get-single-category-admin-api.png) |

### 🎫 Coupon API Images

| API Endpoint                  | Flowchart Image                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| POST /api/v1/coupons/admin    | ![Add Coupon API](flowcharts/images/coupon/add-coupon-api.png)                       |
| GET /api/v1/coupons/admin     | ![Get All Coupons Admin API](flowcharts/images/coupon/get-all-coupons-admin-api.png) |
| GET /api/v1/coupons/admin/:id | ![Get One Coupon Admin API](flowcharts/images/coupon/get-one-coupon-admin-api.png)   |
| PUT /api/v1/coupons/admin     | ![Update Coupon API](flowcharts/images/coupon/update-coupon-api.png)                 |
| DELETE /api/v1/coupons/admin  | ![Delete Coupon API](flowcharts/images/coupon/delete-coupon-api.png)                 |
| GET /api/v1/coupons           | ![Get All Coupons User API](flowcharts/images/coupon/get-all-coupons-user-api.png)   |
| GET /api/v1/coupons/:id       | ![Get One Coupon User API](flowcharts/images/coupon/get-one-coupon-user-api.png)     |

### 📋 Order API Images

| API Endpoint            | Flowchart Image                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| POST /checkout          | ![Create Order API](flowcharts/images/orders/create-order-api.png)                           |
| GET /                   | ![Get User Orders API](flowcharts/images/orders/get-user-orders-api.png)                     |
| GET /:id                | ![Get Single Order API](flowcharts/images/orders/get-single-order-api.png)                   |
| GET /admin              | ![Get All Orders Admin API](flowcharts/images/orders/get-all-orders-admin-api.png)           |
| PATCH /admin/:id/status | ![Update Order Status Admin API](flowcharts/images/orders/update-order-status-admin-api.png) |
| Order Security Checks   | ![Order Security Checks](flowcharts/images/orders/order-security-checks.png)                 |
| Order Status Flow       | ![Order Status Flow](flowcharts/images/orders/order-status-flow.png)                         |
| Payment Methods Flow    | ![Payment Methods Flow](flowcharts/images/orders/payment-methods-flow.png)                   |

### 📦 Product API Images

| API Endpoint                  | Flowchart Image                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------- |
| POST /api/v1/products         | ![Create Product API](flowcharts/images/product/create-product-api.png)           |
| PUT /api/v1/products/:id      | ![Update Product API](flowcharts/images/product/update-product-api.png)           |
| DELETE /api/v1/products/:id   | ![Delete Product API](flowcharts/images/product/delete-product-api.png)           |
| GET /api/v1/products/admin    | ![Get Products Admin API](flowcharts/images/product/get-products-admin-api.png)   |
| GET /api/v1/products          | ![Get Products API](flowcharts/images/product/get-products-api.png)               |
| GET /api/v1/products (Public) | ![Get Products Public API](flowcharts/images/product/get-products-public-api.png) |
| GET /api/v1/products/:id      | ![Get Single Product API](flowcharts/images/product/get-single-product-api.png)   |

### 👥 Staff API Images

| API Endpoint                                           | Flowchart Image                                                                   |
| ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| GET /api/v1/staff/admin                                | ![Get All Staff API](flowcharts/images/staff/get-all-staff-api.png)               |
| POST /api/v1/staff/admin                               | ![Add Staff API](flowcharts/images/staff/add-staff-api.png)                       |
| GET /api/v1/staff/admin/:id                            | ![Get Staff Details API](flowcharts/images/staff/get-staff-details-api.png)       |
| PUT /api/v1/staff/admin/:id                            | ![Update Staff API](flowcharts/images/staff/update-staff-api.png)                 |
| DELETE /api/v1/staff/admin/:id                         | ![Delete Staff API](flowcharts/images/staff/delete-staff-api.png)                 |
| POST /api/v1/staff/check-in                            | ![Staff Check-in API](flowcharts/images/staff/check-in-api.png)                   |
| POST /api/v1/staff/check-out                           | ![Staff Check-out API](flowcharts/images/staff/check-out-api.png)                 |
| POST /api/v1/staff/admin/:id/deductions                | ![Add Deduction API](flowcharts/images/staff/add-deduction-api.png)               |
| GET /api/v1/staff/admin/:id/deductions                 | ![Get Staff Deductions API](flowcharts/images/staff/get-staff-deductions-api.png) |
| PUT /api/v1/staff/admin/:id/deductions/:deductionId    | ![Update Deduction API](flowcharts/images/staff/update-deduction-api.png)         |
| DELETE /api/v1/staff/admin/:id/deductions/:deductionId | ![Remove Deduction API](flowcharts/images/staff/remove-deduction-api.png)         |

### 🏷️ Subcategory API Images

| API Endpoint                     | Flowchart Image                                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| POST /api/v1/subcategories       | ![Create Subcategory API](flowcharts/images/subcategory/create-subcategory-api.png)                   |
| PUT /api/v1/subcategories/:id    | ![Update Subcategory API](flowcharts/images/subcategory/update-subcategory-api.png)                   |
| DELETE /api/v1/subcategories/:id | ![Delete Subcategory API](flowcharts/images/subcategory/delete-subcategory-api.png)                   |
| GET /api/v1/subcategories/admin  | ![Get All Subcategories Admin API](flowcharts/images/subcategory/get-all-subcategories-admin-api.png) |
| GET /api/v1/subcategories/:id    | ![Get Single Subcategory API](flowcharts/images/subcategory/get-single-subcategory-api.png)           |

### 👤 User API Images

| API Endpoint                            | Flowchart Image                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| GET /api/v1/users/profile               | ![Get User Profile API](flowcharts/images/user/get-user-profile-api.png)         |
| PUT /api/v1/users/profile               | ![Update User Profile API](flowcharts/images/user/update-user-profile-api.png)   |
| DELETE /api/v1/users/profile            | ![Delete User Profile API](flowcharts/images/user/delete-user-profile-api.png)   |
| POST /api/v1/users/upload-profile-image | ![Upload Profile Image API](flowcharts/images/user/upload-profile-image-api.png) |

## 📁 Flowchart Directory Structure

```
flowcharts/
├── images/
│   ├── auth/                    # Authentication flowcharts
│   │   ├── signup-api.png
│   │   ├── login-api.png
│   │   ├── verify-email-api.png
│   │   ├── resend-verification-api.png
│   │   ├── forget-password-api.png
│   │   ├── reset-password-api.png
│   │   ├── generate-new-access-token-api.png
│   │   └── refresh-token-api.png
│   ├── cart/                    # Shopping cart flowcharts
│   │   ├── add-to-cart-api.png
│   │   ├── add-item-to-cart-api.png
│   │   ├── update-cart-quantity-api.png
│   │   ├── view-cart-api.png
│   │   ├── remove-cart-item-api.png
│   │   └── clear-cart-api.png
│   ├── category/                # Category management flowcharts
│   │   ├── create-category-api.png
│   │   ├── update-category-api.png
│   │   ├── delete-category-api.png
│   │   ├── get-categories-admin-api.png
│   │   ├── get-categories-public-api.png
│   │   └── get-single-category-admin-api.png
│   ├── coupon/                  # Coupon management flowcharts
│   │   ├── add-coupon-api.png
│   │   ├── get-all-coupons-admin-api.png
│   │   ├── get-one-coupon-admin-api.png
│   │   ├── update-coupon-api.png
│   │   ├── delete-coupon-api.png
│   │   ├── get-all-coupons-user-api.png
│   │   └── get-one-coupon-user-api.png
│   ├── orders/                  # Order management flowcharts
│   │   ├── create-order-api.png
│   │   ├── get-user-orders-api.png
│   │   ├── get-single-order-api.png
│   │   ├── get-all-orders-admin-api.png
│   │   ├── update-order-status-admin-api.png
│   │   ├── order-security-checks.png
│   │   ├── order-status-flow.png
│   │   └── payment-methods-flow.png
│   ├── product/                 # Product management flowcharts
│   │   ├── create-product-api.png
│   │   ├── update-product-api.png
│   │   ├── delete-product-api.png
│   │   ├── get-products-admin-api.png
│   │   ├── get-products-api.png
│   │   ├── get-products-public-api.png
│   │   └── get-single-product-api.png
│   ├── staff/                   # Staff management flowcharts
│   │   ├── get-all-staff-api.png
│   │   ├── add-staff-api.png
│   │   ├── get-staff-details-api.png
│   │   ├── update-staff-api.png
│   │   ├── delete-staff-api.png
│   │   ├── check-in-api.png
│   │   ├── check-out-api.png
│   │   ├── add-deduction-api.png
│   │   ├── get-staff-deductions-api.png
│   │   ├── update-deduction-api.png
│   │   └── remove-deduction-api.png
│   ├── subcategory/             # Subcategory management flowcharts
│   │   ├── create-subcategory-api.png
│   │   ├── update-subcategory-api.png
│   │   ├── delete-subcategory-api.png
│   │   ├── get-all-subcategories-admin-api.png
│   │   └── get-single-subcategory-api.png
│   └── user/                    # User management flowcharts
│       ├── get-user-profile-api.png
│       ├── update-user-profile-api.png
│       ├── delete-user-profile-api.png
│       └── upload-profile-image-api.png
└── README.md                    # This documentation
```

## 🎯 How to Use Flowcharts

1. **For Development**: Use the Mermaid diagrams to understand API logic during development
2. **For Documentation**: The images provide visual representations for documentation
3. **For Testing**: Use flowcharts to understand test scenarios and edge cases
4. **For Onboarding**: New developers can quickly understand the API structure
5. **For Troubleshooting**: Visualize the flow to identify where issues might occur

Each flowchart image corresponds to a specific API endpoint and shows the complete flow from request to response, including all validation steps, error handling, and business logic.

### Flowchart Legend

- **Rectangles**: Process/Action steps
- **Diamonds**: Decision points (Yes/No branches)
- **Parallelograms**: Input/Output operations
- **Cylinders**: Database operations
- **Colors**:
  - 🟢 Green: Success paths
  - 🔴 Red: Error paths
  - 🔵 Blue: Authentication/Authorization
  - 🟠 Orange: Validation

## 🛡️ Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Joi schemas for all API inputs
- **Role-based Access Control**: Middleware for authorization
- **Email Verification**: Account activation required
- **Rate Limiting**: Protection against brute force attacks
- **File Upload Security**: Multer with file type validation

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Common Response Format

**Success Response (200/201):**

```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error Response (4xx/5xx):**

```json
{
  "message": "Error description",
  "status": 400
}
```

### Authentication Endpoints

| Method | Endpoint                          | Description               | Auth Required |
| ------ | --------------------------------- | ------------------------- | ------------- |
| POST   | `/auth/signup`                    | User registration         | No            |
| POST   | `/auth/login`                     | User login                | No            |
| GET    | `/auth/verify-email/:token`       | Email verification        | No            |
| POST   | `/auth/resend-verification`       | Resend verification email | No            |
| POST   | `/auth/forget-password`           | Request password reset    | No            |
| POST   | `/auth/reset-password`            | Reset password with OTP   | No            |
| POST   | `/auth/generate-new-access-token` | Refresh access token      | No            |

### User Management Endpoints

| Method | Endpoint                      | Description          | Auth Required |
| ------ | ----------------------------- | -------------------- | ------------- |
| GET    | `/users/profile`              | Get user profile     | User          |
| PUT    | `/users/profile`              | Update user profile  | User          |
| DELETE | `/users/profile`              | Soft delete user     | User          |
| POST   | `/users/upload-profile-image` | Upload profile image | User          |

### Category Management Endpoints

| Method | Endpoint                        | Description                   | Auth Required |
| ------ | ------------------------------- | ----------------------------- | ------------- |
| POST   | `/categories`                   | Create category               | Admin         |
| PUT    | `/categories/:id`               | Update category               | Admin         |
| DELETE | `/categories/:id`               | Soft delete category          | Admin         |
| GET    | `/categories/admin`             | Get all categories            | Admin         |
| GET    | `/categories/:id/admin`         | Get one category              | Admin         |
| GET    | `/categories`                   | Get active categories         | Public        |
| GET    | `/categories/:id/subcategories` | Get subcategories by category | Public        |

### Product Management Endpoints

| Method | Endpoint          | Description               | Auth Required |
| ------ | ----------------- | ------------------------- | ------------- |
| POST   | `/products`       | Add product               | Admin         |
| PUT    | `/products/:id`   | Update product            | Admin         |
| DELETE | `/products/:id`   | Soft delete product       | Admin         |
| GET    | `/products/admin` | Get all products          | Admin         |
| GET    | `/products`       | Get products with filters | Public        |
| GET    | `/products/:id`   | Get one product           | Public        |

### Shopping Cart Endpoints

| Method | Endpoint           | Description           | Auth Required |
| ------ | ------------------ | --------------------- | ------------- |
| POST   | `/cart`            | Add item to cart      | User          |
| PUT    | `/cart/:productId` | Update item quantity  | User          |
| GET    | `/cart`            | View cart             | User          |
| DELETE | `/cart/:productId` | Remove item from cart | User          |
| DELETE | `/cart`            | Clear cart            | User          |

### Order Management Endpoints

| Method | Endpoint            | Description         | Auth Required |
| ------ | ------------------- | ------------------- | ------------- |
| POST   | `/checkout`         | Create order        | User          |
| GET    | `/`                 | Get user orders     | User          |
| GET    | `/:id`              | Get single order    | User          |
| GET    | `/admin`            | Get all orders      | Admin         |
| PATCH  | `/admin/:id/status` | Update order status | Admin         |

### Staff Management Endpoints

| Method | Endpoint                                   | Description          | Auth Required |
| ------ | ------------------------------------------ | -------------------- | ------------- |
| GET    | `/staff/admin`                             | Get all staff        | Admin         |
| POST   | `/staff/admin`                             | Add staff            | Admin         |
| GET    | `/staff/admin/:id`                         | Get staff details    | Admin         |
| PUT    | `/staff/admin/:id`                         | Update staff         | Admin         |
| DELETE | `/staff/admin/:id`                         | Soft delete staff    | Admin         |
| POST   | `/staff/check-in`                          | Staff check in       | Staff         |
| POST   | `/staff/check-out`                         | Staff check out      | Staff         |
| POST   | `/staff/admin/:id/deductions`              | Add deduction        | Admin         |
| GET    | `/staff/admin/:id/deductions`              | Get staff deductions | Admin         |
| PUT    | `/staff/admin/:id/deductions/:deductionId` | Update deduction     | Admin         |
| DELETE | `/staff/admin/:id/deductions/:deductionId` | Remove deduction     | Admin         |

### Coupon Management Endpoints

| Method | Endpoint             | Description              | Auth Required |
| ------ | -------------------- | ------------------------ | ------------- |
| POST   | `/coupons/admin`     | Add coupon               | Admin         |
| GET    | `/coupons/admin`     | Get all coupons          | Admin         |
| GET    | `/coupons/admin/:id` | Get one coupon           | Admin         |
| PUT    | `/coupons/admin`     | Update coupon            | Admin         |
| DELETE | `/coupons/admin`     | Delete/deactivate coupon | Admin         |
| GET    | `/coupons`           | Get all coupons          | User          |
| GET    | `/coupons/:id`       | Get one coupon           | User          |

## 🔧 Development

### Code Style

- ES6+ JavaScript with modules
- RESTful API design principles
- MVC (Model-View-Controller) pattern
- Middleware-based architecture
- Comprehensive error handling

### Database Schema

The application uses MongoDB with the following main collections:

- **users**: User accounts and profiles
- **categories**: Product categories
- **subcategories**: Product subcategories
- **products**: Product catalog
- **carts**: Shopping cart items
- **orders**: Order records
- **staff**: Staff management
- **coupons**: Discount codes

### Environment Variables

| Variable            | Description                  | Default                                  |
| ------------------- | ---------------------------- | ---------------------------------------- |
| PORT                | Server port                  | 3000                                     |
| EMAIL               | SMTP email address           | -                                        |
| PASSWORD            | SMTP app password            | -                                        |
| HASH                | bcrypt salt rounds           | 12                                       |
| BASE_URL            | Application base URL         | http://localhost:3000                    |
| SIGNATURE_ADMIN     | Admin JWT signature          | signatureAdmin                           |
| SIGNATURE_USER      | User JWT signature           | signatureUser                            |
| SIGNATURE_STAFF     | Staff JWT signature          | signatureStaff                           |
| ACCESS_TOKEN        | Access token expiry          | 1d                                       |
| REFRESH_TOKEN       | Refresh token expiry         | 1y                                       |
| DATA_BASE_URL_MY    | MongoDB connection string    | mongodb://localhost:27017/e-commerce-nti |
| VERIFY_SIGNATURE_MY | Email verification signature | my                                       |

## 🚀 Deployment

### Production Setup

1. **Set Environment Variables**

   ```bash
   export NODE_ENV=production
   export PORT=3000
   # Set all other required environment variables
   ```

2. **Database Setup**
   - Configure MongoDB connection string
   - Ensure database indexes are created
   - Set up database backups

3. **File Upload Storage**
   - Configure upload directory permissions
   - Set up CDN for production if needed

4. **Email Service**
   - Configure SMTP settings
   - Set up email templates

5. **Start Application**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 📞 Support

For support and questions:

- Email: youssefbenyamine2eme@gmail.com
- GitHub Issues: [Create an issue](https://github.com/your-username/e-commerce-backend/issues)

## 🙏 Acknowledgments

- Node.js and Express.js communities
- MongoDB and Mongoose documentation
- JWT authentication best practices
- Open source contributors
