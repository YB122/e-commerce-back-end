# API Flowcharts Documentation

This folder contains detailed flowcharts for all APIs in the e-commerce backend project.

## Available Flowcharts

### 1. Authentication APIs (`authentication-apis.md`)

- POST `/api/v1/auth/signup` - User registration
- POST `/api/v1/auth/login` - User login
- GET `/api/v1/auth/verify-email/:token` - Email verification
- POST `/api/v1/auth/resend-verification` - Resend verification email
- POST `/api/v1/auth/forget-password` - Password reset request
- POST `/api/v1/auth/reset-password` - Password reset with OTP
- POST `/api/v1/auth/generate-new-access-token` - Token refresh

### 2. User APIs (`user-apis.md`)

- GET `/api/v1/users/profile` - Get user profile
- PUT `/api/v1/users/profile` - Update user profile
- DELETE `/api/v1/users/profile` - Soft delete user
- POST `/api/v1/users/upload-profile-image` - Upload profile image

### 3. Category APIs (`category-apis.md`)

- POST `/api/v1/categories` - Create category (admin only)
- PUT `/api/v1/categories/:id` - Update category (admin only)
- DELETE `/api/v1/categories/:id` - Soft delete category (admin only)
- GET `/api/v1/categories/admin` - Get all categories (admin only)
- GET `/api/v1/categories/:id/admin` - Get one category (admin only)
- GET `/api/v1/categories` - Get active categories (public)
- GET `/api/v1/categories/:id/subcategories` - Get subcategories by category (public)

### 4. Product APIs (`product-apis.md`)

- POST `/api/v1/products` - Add product (admin only)
- PUT `/api/v1/products/:id` - Update product (admin only)
- DELETE `/api/v1/products/:id` - Soft delete product (admin only)
- GET `/api/v1/products/admin` - Get all products (admin only)
- GET `/api/v1/products` - Get products with filters (public)
- GET `/api/v1/products/:id` - Get one product (public)

### 5. Cart APIs (`cart-apis.md`)

- POST `/api/v1/cart` - Add item to cart
- PUT `/api/v1/cart/:productId` - Update item quantity
- GET `/api/v1/cart` - View cart
- DELETE `/api/v1/cart/:productId` - Remove item from cart
- DELETE `/api/v1/cart` - Clear cart

### 6. SubCategory APIs (`subcategory-apis.md`)

- POST `/api/v1/subcategories` - Create subcategory (admin only)
- PUT `/api/v1/subcategories/:id` - Update subcategory (admin only)
- DELETE `/api/v1/subcategories/:id` - Soft delete subcategory (admin only)
- GET `/api/v1/subcategories/admin` - Get all subcategories (admin only)
- GET `/api/v1/subcategories/:id` - Get one subcategory (public)

### 7. Staff APIs (`staff-apis.md`)

- GET `/api/v1/staff/admin` - Get all staff (admin only)
- POST `/api/v1/staff/admin` - Add staff (admin only)
- GET `/api/v1/staff/admin/:id` - Get staff details (admin only)
- PUT `/api/v1/staff/admin/:id` - Update staff (admin only)
- DELETE `/api/v1/staff/admin/:id` - Soft delete staff (admin only)
- POST `/api/v1/staff/check-in` - Staff check in
- POST `/api/v1/staff/check-out` - Staff check out
- POST `/api/v1/staff/admin/:id/deductions` - Add deduction (admin only)
- GET `/api/v1/staff/admin/:id/deductions` - Get staff deductions (admin only)
- PUT `/api/v1/staff/admin/:id/deductions/:deductionId` - Update deduction (admin only)
- DELETE `/api/v1/staff/admin/:id/deductions/:deductionId` - Remove deduction (admin only)
- GET `/api/v1/staff/admin/:id/salary/:month` - Get monthly salary (admin only)
- PATCH `/api/v1/staff/admin/:id/salary/:month/pay` - Mark salary as paid (admin only)
- PUT `/api/v1/staff/admin/:id/salary/:month/adjust` - Adjust salary (admin only)

### 8. Orders APIs (`orders-apis.md`)

- POST `/checkout` - Create order
- GET `/` - Get user orders
- GET `/:id` - Get single order
- GET `/admin` - Get all orders (admin only)
- PATCH `/admin/:id/status` - Update order status (admin only)

## How to View Flowcharts

These flowcharts are written in Mermaid syntax. To view them:

1. **GitHub/GitLab**: Automatically renders Mermaid diagrams
2. **VS Code**: Install Mermaid Preview extension
3. **Online**: Use mermaid.live or mermaid-js.github.io
4. **Markdown Editors**: Many support Mermaid rendering

## Flowchart Legend

- **Rectangles**: Process/Action steps
- **Diamonds**: Decision points (Yes/No branches)
- **Parallelograms**: Input/Output operations
- **Cylinders**: Database operations
- **Colors**: Different colors indicate different types of operations
  - Green: Success paths
  - Red: Error paths
  - Blue: Authentication/Authorization
  - Orange: Validation

## Key Patterns

### Authentication Flow

All protected endpoints follow this pattern:

1. Client Request → Auth Middleware → Business Logic → Response
2. Unauthorized users receive 401/400 status codes
3. Admin-only endpoints check for admin role

### Error Handling

- 400: Bad Request (validation errors, business logic violations)
- 401: Unauthorized (not logged in)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error (unexpected issues)

### Data Validation

- Input validation using Joi schemas
- Database existence checks before operations
- Business rule validation (stock, uniqueness, etc.)

### Soft Delete Pattern

Admin endpoints use soft delete (isActive = false) instead of hard delete to maintain data integrity.
