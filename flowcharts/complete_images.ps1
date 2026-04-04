# Generate flowchart images for ALL remaining APIs

$flowchartsPath = "d:\NTI-OSAD\Technical\BackEnd\Project\flowcharts"
$imagesPath = "$flowchartsPath\images"

# Resend Verification API
@"
flowchart TD
    A[Client Request] --> B{Validate Input}
    B -->|Invalid| C[Return 400 - Validation Error]
    B -->|Valid| D[Find User by Email]
    D -->|Not Found/Inactive| E[Return 400 - User Not Found]
    D -->|Found| F{Already Verified?}
    F -->|Yes| G[Return 400 - Already Verified]
    F -->|No| H[Generate New Token]
    H --> I[Send Verification Email]
    I --> J[Return 200 - Email Sent]
"@ | Out-File -FilePath "$flowchartsPath\temp_resend.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_resend.mmd" -o "$imagesPath\resend-verification-api.png" -t neutral -b transparent

# Generate New Access Token API
@"
flowchart TD
    A[Client Request] --> B[Extract Authorization Header]
    B --> C[Split Bearer and Token]
    C --> D{Determine User Role}
    D -->|admin| E[Use Admin Signature]
    D -->|user| F[Use User Signature]
    D -->|staff| G[Use Staff Signature]
    D -->|Unknown| H[Return Error]
    E --> I[Verify Refresh Token]
    F --> I
    G --> I
    I -->|Invalid| J[Return Error]
    I -->|Valid| K[Generate New Access Token]
    K --> L[Return 200 - New Token]
"@ | Out-File -FilePath "$flowchartsPath\temp_refresh.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_refresh.mmd" -o "$imagesPath\refresh-token-api.png" -t neutral -b transparent

# Upload Profile Image API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 400 - Login First]
    B -->|Auth Valid| D[Find User by ID]
    D -->|Not Found/Inactive| E[Return 404 - User Not Found]
    D -->|Found| F{Image Uploaded?}
    F -->|No| G[Return 400 - Must Upload Image]
    F -->|Yes| H[Save Image URL]
    H --> I[Update User Profile Image]
    I --> J[Return 200 - Image Uploaded]
"@ | Out-File -FilePath "$flowchartsPath\temp_upload_image.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_upload_image.mmd" -o "$imagesPath\upload-profile-image-api.png" -t neutral -b transparent

# Soft Delete User API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 400 - Login First]
    B -->|Auth Valid| D[Find User by ID]
    D -->|Not Found/Inactive| E[Return 404 - User Not Found]
    D -->|Found| F[Soft Delete User]
    F --> G[Set isActive = false]
    G --> H[Return 200 - User Deleted]
"@ | Out-File -FilePath "$flowchartsPath\temp_delete_user.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_delete_user.mmd" -o "$imagesPath\soft-delete-user-api.png" -t neutral -b transparent

# Update Cart Quantity API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 401 - Login First]
    B -->|Auth Valid| D[Find User by ID]
    D -->|Not Found/Inactive| E[Return 404 - User Not Found]
    D -->|Found| F[Find Product by ID]
    F -->|Not Found/Inactive| G[Return 404 - Product Not Found]
    F -->|Found| H[Find Cart Item]
    H -->|Not Found| I[Return 404 - Item Not in Cart]
    H -->|Found| J{Quantity Valid?}
    J -->|Invalid| K[Return 400 - Quantity Must Be >= 1]
    J -->|Valid| L{Stock Available?}
    L -->|Insufficient| M[Return 404 - Insufficient Stock]
    L -->|Available| N[Update Cart Item Quantity]
    N --> O[Return 200 - Quantity Updated]
"@ | Out-File -FilePath "$flowchartsPath\temp_update_cart.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_update_cart.mmd" -o "$imagesPath\update-cart-quantity-api.png" -t neutral -b transparent

# Remove Cart Item API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 401 - Login First]
    B -->|Auth Valid| D[Find User by ID]
    D -->|Not Found/Inactive| E[Return 404 - User Not Found]
    D -->|Found| F[Find Product by ID]
    F -->|Not Found/Inactive| G[Return 404 - Product Not Found]
    F -->|Found| H[Find Cart Item]
    H -->|Not Found| I[Return 404 - Item Not in Cart]
    H -->|Found| J[Delete Cart Item]
    J --> K[Return 200 - Item Removed]
"@ | Out-File -FilePath "$flowchartsPath\temp_remove_cart.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_remove_cart.mmd" -o "$imagesPath\remove-cart-item-api.png" -t neutral -b transparent

# Clear Cart API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 401 - Login First]
    B -->|Auth Valid| D[Find User by ID]
    D -->|Not Found/Inactive| E[Return 404 - User Not Found]
    D -->|Found| F[Delete All User Cart Items]
    F --> G{Items Deleted?}
    G -->|Yes| H[Return 200 - Cart Cleared]
    G -->|No| I[Return 404 - Cart Already Empty]
"@ | Out-File -FilePath "$flowchartsPath\temp_clear_cart.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_clear_cart.mmd" -o "$imagesPath\clear-cart-api.png" -t neutral -b transparent

# Get Single Product API
@"
flowchart TD
    A[Client Request] --> B[Find Product by ID]
    B -->|Not Found/Inactive| C[Return 404 - Product Not Found]
    B -->|Found & Active| D[Return 200 - Product Data]
"@ | Out-File -FilePath "$flowchartsPath\temp_get_product.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_get_product.mmd" -o "$imagesPath\get-single-product-api.png" -t neutral -b transparent

# Update Category API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Validate Input]
    D -->|Invalid| E[Return 400 - Validation Error]
    D -->|Valid| F[Find Category by ID]
    F -->|Not Found| G[Return 404 - Category Not Found]
    F -->|Found| H{Category Image Uploaded?}
    H -->|Yes| I[Save Image URL]
    H -->|No| J[Continue Without Image]
    I --> K{Name Provided?}
    J --> K
    K -->|Yes| L[Check Name Exists]
    K -->|No| M[Update Category]
    L -->|Exists| N[Return 400 - Category Already Exists]
    L -->|Not Exists| M
    M --> O[Return 200 - Category Updated]
"@ | Out-File -FilePath "$flowchartsPath\temp_update_category.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_update_category.mmd" -o "$imagesPath\update-category-api.png" -t neutral -b transparent

# Delete Category API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Find Category by ID]
    D -->|Not Found| E[Return 404 - Category Not Found]
    D -->|Found| F[Soft Delete Category]
    F --> G[Set isActive = false]
    G --> H[Return 200 - Category Deleted]
"@ | Out-File -FilePath "$flowchartsPath\temp_delete_category.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_delete_category.mmd" -o "$imagesPath\delete-category-api.png" -t neutral -b transparent

# Get Categories Admin API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Get All Categories]
    D -->|Categories Found| E[Return 200 - Categories Data]
    D -->|No Categories| F[Return 404 - Categories Not Found]
"@ | Out-File -FilePath "$flowchartsPath\temp_get_categories_admin.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_get_categories_admin.mmd" -o "$imagesPath\get-categories-admin-api.png" -t neutral -b transparent

# Get Single Category Admin API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Find Category by ID]
    D -->|Not Found| E[Return 404 - Category Not Found]
    D -->|Found| F[Return 200 - Category Data]
"@ | Out-File -FilePath "$flowchartsPath\temp_get_category_admin.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_get_category_admin.mmd" -o "$imagesPath\get-single-category-admin-api.png" -t neutral -b transparent

# Get Categories Public API
@"
flowchart TD
    A[Client Request] --> B[Get Active Categories Only]
    B -->|Categories Found| C[Return 200 - Categories Data]
    B -->|No Categories| D[Return 404 - Categories Not Found]
"@ | Out-File -FilePath "$flowchartsPath\temp_get_categories_public.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_get_categories_public.mmd" -o "$imagesPath\get-categories-public-api.png" -t neutral -b transparent

# Get Subcategories by Category API
@"
flowchart TD
    A[Client Request] --> B[Find Category by ID]
    B -->|Not Found/Inactive| C[Return 404 - Category Not Found]
    B -->|Found & Active| D[Get Subcategories by Category ID]
    D -->|Subcategories Found| E[Return 200 - Subcategories Data]
    D -->|No Subcategories| F[Return 404 - Subcategories Not Found]
"@ | Out-File -FilePath "$flowchartsPath\temp_get_subcategories.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_get_subcategories.mmd" -o "$imagesPath\get-subcategories-by-category-api.png" -t neutral -b transparent

# Clean up temporary files
Remove-Item "$flowchartsPath\temp_*.mmd" -Force

Write-Host "Complete set of API flowchart images generated successfully!"
