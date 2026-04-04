# Complete API Flowchart Images - All 34 Endpoints

This folder now contains **flowchart images for EVERY API endpoint** in the e-commerce backend project.

## 📊 **Total Images Generated: 34**

### 🔐 **Authentication APIs (7 images)**
1. `signup-api.png` - POST /api/v1/auth/signup
2. `login-api.png` - POST /api/v1/auth/login
3. `verify-email-api.png` - GET /api/v1/auth/verify-email/:token
4. `resend-verification-api.png` - POST /api/v1/auth/resend-verification
5. `forget-password-api.png` - POST /api/v1/auth/forget-password
6. `reset-password-api.png` - POST /api/v1/auth/reset-password
7. `refresh-token-api.png` - POST /api/v1/auth/generate-new-access-token

### 👤 **User Management APIs (4 images)**
8. `get-profile-api.png` - GET /api/v1/users/profile
9. `update-profile-api.png` - PUT /api/v1/users/profile
10. `soft-delete-user-api.png` - DELETE /api/v1/users/profile
11. `upload-profile-image-api.png` - POST /api/v1/users/upload-profile-image

### 🛒 **Cart APIs (5 images)**
12. `add-to-cart-api.png` - POST /api/v1/cart
13. `update-cart-quantity-api.png` - PUT /api/v1/cart/:productId
14. `view-cart-api.png` - GET /api/v1/cart
15. `remove-cart-item-api.png` - DELETE /api/v1/cart/:productId
16. `clear-cart-api.png` - DELETE /api/v1/cart

### 📦 **Product APIs (6 images)**
17. `create-product-api.png` - POST /api/v1/products
18. `update-product-api.png` - PUT /api/v1/products/:id
19. `delete-product-api.png` - DELETE /api/v1/products/:id
20. `get-products-admin-api.png` - GET /api/v1/products/admin
21. `get-products-api.png` - GET /api/v1/products (public with filters)
22. `get-single-product-api.png` - GET /api/v1/products/:id

### 🏷️ **Category APIs (7 images)**
23. `create-category-api.png` - POST /api/v1/categories
24. `update-category-api.png` - PUT /api/v1/categories/:id
25. `delete-category-api.png` - DELETE /api/v1/categories/:id
26. `get-categories-admin-api.png` - GET /api/v1/categories/admin
27. `get-single-category-admin-api.png` - GET /api/v1/categories/:id/admin
28. `get-categories-public-api.png` - GET /api/v1/categories (public)
29. `get-subcategories-by-category-api.png` - GET /api/v1/categories/:id/subcategories

### 📂 **SubCategory APIs (5 images)**
30. `create-subcategory-api.png` - POST /api/v1/subcategories
31. `update-subcategory-api.png` - PUT /api/v1/subcategories/:id
32. `delete-subcategory-api.png` - DELETE /api/v1/subcategories/:id
33. `get-subcategories-admin-api.png` - GET /api/v1/subcategories/admin
34. `get-single-subcategory-api.png` - GET /api/v1/subcategories/:id

## 🎨 **Image Specifications**
- **Format**: PNG with transparent background
- **Theme**: Neutral professional style
- **Quality**: High-resolution vector rendering
- **Size**: Optimized for documentation (12KB - 66KB per image)
- **Total Size**: ~1.2MB for all 34 images

## 📋 **Flowchart Features**
Each flowchart includes:
- ✅ Request validation steps
- ✅ Authentication & authorization checks
- ✅ Business logic validation
- ✅ Database operations
- ✅ Error handling paths
- ✅ Response formatting
- ✅ Color-coded decision paths

## 🎯 **Coverage**
- **100% API Coverage** - Every single endpoint has a flowchart
- **Complete Logic Flow** - From request to response
- **Error Scenarios** - All error paths documented
- **Security Checks** - Auth and role validation shown
- **Data Validation** - Input validation steps included

## 📖 **Usage**
These images can be used for:
- API documentation
- Developer onboarding
- Code reviews
- Technical presentations
- System architecture diagrams
- Testing reference guides

**All 34 API endpoints now have complete visual flowchart documentation!** 🎉
