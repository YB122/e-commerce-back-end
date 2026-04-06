# API Flowchart Images

This folder contains visual flowchart images for all major APIs in the e-commerce backend project.

## Generated Flowchart Images

### Authentication APIs
- **signup-api.png** - User registration flow with email verification
- **login-api.png** - User login with token generation
- **verify-email-api.png** - Email verification process
- **forget-password-api.png** - Password reset request with OTP
- **reset-password-api.png** - Password reset with OTP verification

### User Management APIs
- **get-profile-api.png** - Get user profile
- **update-profile-api.png** - Update user profile with avatar upload

### Cart APIs
- **add-to-cart-api.png** - Add item to cart with duplicate handling
- **view-cart-api.png** - View cart with inactive product cleanup

### Product APIs
- **create-product-api.png** - Create product with category/subcategory validation
- **get-products-api.png** - Get products with filtering, sorting, and pagination

### Category APIs
- **create-category-api.png** - Create category with image upload

## Image Details

- **Format**: PNG
- **Style**: Neutral theme with transparent background
- **Size**: Optimized for documentation and presentations
- **Resolution**: High-quality vector rendering

## How to Use These Images

1. **Documentation**: Include in API documentation
2. **Presentations**: Use in technical presentations
3. **Code Reviews**: Reference during development discussions
4. **Training**: Use for team training and onboarding

## Flowchart Legend

- **Rectangles**: Process/Action steps
- **Diamonds**: Decision points
- **Colors**: Different colors indicate different types of operations
  - Blue: Authentication/Authorization
  - Green: Success paths
  - Red: Error paths
  - Orange: Validation

## Technical Notes

All flowcharts are generated using Mermaid CLI and represent the actual implementation logic from the source code. They include:

- Request validation
- Authentication and authorization checks
- Business logic validation
- Database operations
- Error handling paths
- Response formatting

## Total Images Generated: 12

These images provide comprehensive visual documentation of the API flows and can be used to understand the complete request-response cycle for each endpoint.
