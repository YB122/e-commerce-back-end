# Generate remaining Product and SubCategory API flowchart images

$flowchartsPath = "d:\NTI-OSAD\Technical\BackEnd\Project\flowcharts"
$imagesPath = "$flowchartsPath\images"

# Update Product API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Validate Input]
    D -->|Invalid| E[Return 400 - Validation Error]
    D -->|Valid| F[Find Product by ID]
    F -->|Not Found| G[Return 404 - Product Not Found]
    F -->|Found| H[Find Category]
    H -->|Not Found| I[Return 404 - Category Not Found]
    I --> J[Find Subcategory]
    J -->|Not Found| K[Return 404 - Subcategory Not Found]
    K --> L{Subcategory Belongs to Category?}
    L -->|No| M[Return 404 - Category Not for Subcategory]
    L -->|Yes| N{Name Changed?}
    N -->|Yes| O[Check New Name Exists]
    N -->|No| P[Prepare Update Data]
    O -->|Exists| Q[Return 400 - Product Already Exists]
    O -->|Not Exists| P
    P --> R[Update Product]
    R --> S[Return 200 - Product Updated]
"@ | Out-File -FilePath "$flowchartsPath\temp_update_product.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_update_product.mmd" -o "$imagesPath\update-product-api.png" -t neutral -b transparent

# Delete Product API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Find Product by ID]
    D -->|Not Found| E[Return 404 - Product Not Found]
    D -->|Found| F[Soft Delete Product]
    F --> G[Set isActiveAdmin = false]
    G --> H[Return 200 - Product Deleted]
"@ | Out-File -FilePath "$flowchartsPath\temp_delete_product.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_delete_product.mmd" -o "$imagesPath\delete-product-api.png" -t neutral -b transparent

# Get Products Admin API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Get All Products]
    D -->|Products Found| E[Return 200 - Products Data]
    D -->|No Products| F[Return 404 - Products Not Found]
"@ | Out-File -FilePath "$flowchartsPath\temp_get_products_admin.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_get_products_admin.mmd" -o "$imagesPath\get-products-admin-api.png" -t neutral -b transparent

# Create SubCategory API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Validate Input]
    D -->|Invalid| E[Return 400 - Validation Error]
    D -->|Valid| F[Find Category by ID]
    F -->|Not Found| G[Return 404 - Category Not Found]
    F -->|Found| H[Check SubCategory Name Exists]
    H -->|Exists| I[Return 400 - SubCategory Already Exists]
    H -->|Not Exists| J[Create SubCategory]
    J --> K[Return 200 - SubCategory Created]
"@ | Out-File -FilePath "$flowchartsPath\temp_create_subcategory.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_create_subcategory.mmd" -o "$imagesPath\create-subcategory-api.png" -t neutral -b transparent

# Update SubCategory API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Validate Input]
    D -->|Invalid| E[Return 400 - Validation Error]
    D -->|Valid| F[Find SubCategory by ID]
    F -->|Not Found| G[Return 404 - SubCategory Not Found]
    F -->|Found| H{Name & Category Provided?}
    H -->|Both| I[Find Category]
    H -->|Name Only| J[Check Name in Same Category]
    H -->|Category Only| K[Find Category & Check Name]
    H -->|None| L[Return 400 - Must Edit Something]
    I -->|Not Found| M[Return 404 - Category Not Found]
    I -->|Found| N[Check Name+Category Exists]
    J -->|Exists| O[Return 400 - SubCategory Already Exists]
    J -->|Not Exists| P[Update Name Only]
    K -->|Not Found| Q[Return 404 - Category Not Found]
    K -->|Found| R[Check Name in New Category]
    R -->|Exists| S[Return 400 - SubCategory Already Exists]
    R -->|Not Exists| T[Update Category Only]
    N -->|Exists| U[Return 400 - SubCategory Already Exists]
    N -->|Not Exists| V[Update Both]
    P --> W[Return 200 - Updated]
    T --> W
    V --> W
"@ | Out-File -FilePath "$flowchartsPath\temp_update_subcategory.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_update_subcategory.mmd" -o "$imagesPath\update-subcategory-api.png" -t neutral -b transparent

# Delete SubCategory API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Find SubCategory by ID]
    D -->|Not Found| E[Return 404 - SubCategory Not Found]
    D -->|Found| F[Soft Delete SubCategory]
    F --> G[Set isActive = false]
    G --> H[Return 200 - SubCategory Deleted]
"@ | Out-File -FilePath "$flowchartsPath\temp_delete_subcategory.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_delete_subcategory.mmd" -o "$imagesPath\delete-subcategory-api.png" -t neutral -b transparent

# Get SubCategories Admin API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Get All SubCategories]
    D -->|SubCategories Found| E[Return 200 - SubCategories Data]
    D -->|No SubCategories| F[Return 404 - SubCategories Not Found]
"@ | Out-File -FilePath "$flowchartsPath\temp_get_subcategories_admin.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_get_subcategories_admin.mmd" -o "$imagesPath\get-subcategories-admin-api.png" -t neutral -b transparent

# Get Single SubCategory API
@"
flowchart TD
    A[Client Request] --> B[Find SubCategory by ID]
    B -->|Not Found/Inactive| C[Return 404 - SubCategory Not Found]
    B -->|Found & Active| D[Return 200 - SubCategory Data]
"@ | Out-File -FilePath "$flowchartsPath\temp_get_subcategory.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_get_subcategory.mmd" -o "$imagesPath\get-single-subcategory-api.png" -t neutral -b transparent

# Clean up temporary files
Remove-Item "$flowchartsPath\temp_*.mmd" -Force

Write-Host "Product and SubCategory API flowchart images generated successfully!"
