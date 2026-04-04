# Generate additional important API flowchart images

$flowchartsPath = "d:\NTI-OSAD\Technical\BackEnd\Project\flowcharts"
$imagesPath = "$flowchartsPath\images"

# Forget Password API
@"
flowchart TD
    A[Client Request] --> B{Validate Input}
    B -->|Invalid| C[Return 400 - Validation Error]
    B -->|Valid| D[Find User by Email]
    D -->|Not Found/Inactive| E[Return 404 - User Not Found]
    D -->|Found| F[Generate 6-Digit OTP]
    F --> G[Save OTP to User]
    G --> H[Send OTP Email]
    H --> I[Return 200 - Check Email]
"@ | Out-File -FilePath "$flowchartsPath\temp_forget.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_forget.mmd" -o "$imagesPath\forget-password-api.png" -t neutral -b transparent

# Reset Password API
@"
flowchart TD
    A[Client Request] --> B{Validate Input}
    B -->|Invalid| C[Return 400 - Validation Error]
    B -->|Valid| D{Password Match?}
    D -->|No| E[Return 400 - Password Not Matched]
    D -->|Yes| F[Find User by Email]
    F -->|Not Found/Inactive| G[Return 404 - User Not Found]
    F -->|Found| H{OTP Correct?}
    H -->|No| I[Return 400 - OTP Not Correct]
    H -->|Yes| J[Hash New Password]
    J --> K[Update User Password]
    K --> L[Clear OTP]
    L --> M[Return 200 - Password Updated]
"@ | Out-File -FilePath "$flowchartsPath\temp_reset.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_reset.mmd" -o "$imagesPath\reset-password-api.png" -t neutral -b transparent

# View Cart API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 401 - Login First]
    B -->|Auth Valid| D[Find User by ID]
    D -->|Not Found/Inactive| E[Return 404 - User Not Found]
    D -->|Found| F[Get User Cart Items]
    F -->|Empty Cart| G[Return 404 - Cart Empty]
    F -->|Has Items| H[Check Each Item's Product Status]
    H --> I{Inactive Products Found?}
    I -->|Yes| J[Remove Inactive Items]
    J --> K{Cart Now Empty?}
    K -->|Yes| L[Return 404 - Cart Empty After Cleanup]
    K -->|No| M[Return 200 - Updated Cart]
    I -->|No| N[Return 200 - Cart Data]
"@ | Out-File -FilePath "$flowchartsPath\temp_view_cart.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_view_cart.mmd" -o "$imagesPath\view-cart-api.png" -t neutral -b transparent

# Get Products API (Public with filters)
@"
flowchart TD
    A[Client Request] --> B[Parse Query Parameters]
    B --> C{Subcategory Only?}
    C -->|Yes| D[Find Subcategory]
    D -->|Not Found| E[Return 404 - Subcategory Not Found]
    D -->|Found| F[Set Filter with Category]
    C -->|No| G{Category & Subcategory?}
    G -->|Yes| H[Find Category & Subcategory]
    H -->|Not Found| I[Return 404 - Category/Subcategory Not Found]
    H -->|Found| J{Subcategory Belongs to Category?}
    J -->|No| K[Return 400 - Subcategory Not Belong to Category]
    J -->|Yes| L[Set Filter for Both]
    G -->|No| M{Category Only?}
    M -->|Yes| N[Find Category]
    N -->|Not Found| O[Return 404 - Category Not Found]
    N -->|Found| P[Set Category Filter]
    M -->|No| Q[Use Default Filter]
    F --> R[Apply Price Range Filter]
    L --> R
    P --> R
    Q --> R
    R --> S[Apply Sorting]
    S --> T[Apply Pagination]
    T --> U[Query Products]
    U -->|Products Found| V[Return 200 - Products Data]
    U -->|No Products| W[Return 404 - No Products Found]
"@ | Out-File -FilePath "$flowchartsPath\temp_get_products.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_get_products.mmd" -o "$imagesPath\get-products-api.png" -t neutral -b transparent

# Update Profile API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 400 - Login First]
    B -->|Auth Valid| D[Validate Input]
    D -->|Invalid| E[Return 400 - Validation Error]
    D -->|Valid| F[Find User by ID]
    F -->|Not Found/Inactive| G[Return 404 - User Not Found]
    F -->|Found| H{Avatar Uploaded?}
    H -->|Yes| I[Save Avatar URL]
    H -->|No| J[Continue Without Avatar]
    I --> K[Prepare Update Object]
    J --> K
    K --> L[Update User Profile]
    L --> M[Return 200 - Updated Data]
"@ | Out-File -FilePath "$flowchartsPath\temp_update_profile.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_update_profile.mmd" -o "$imagesPath\update-profile-api.png" -t neutral -b transparent

# Clean up temporary files
Remove-Item "$flowchartsPath\temp_*.mmd" -Force

Write-Host "Additional flowchart images generated successfully!"
