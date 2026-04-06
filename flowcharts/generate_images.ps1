# PowerShell script to generate all API flowchart images

$flowchartsPath = "d:\NTI-OSAD\Technical\BackEnd\Project\flowcharts"
$imagesPath = "$flowchartsPath\images"

# Create images directory if it doesn't exist
if (-not (Test-Path $imagesPath)) {
    New-Item -ItemType Directory -Path $imagesPath -Force
}

# Authentication APIs
@"
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
"@ | Out-File -FilePath "$flowchartsPath\temp_signup.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_signup.mmd" -o "$imagesPath\signup-api.png" -t neutral -b transparent

@"
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
"@ | Out-File -FilePath "$flowchartsPath\temp_login.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_login.mmd" -o "$imagesPath\login-api.png" -t neutral -b transparent

@"
flowchart TD
    A[Client Request] --> B[Verify JWT Token]
    B -->|Invalid| C[Return 400 - Invalid Token]
    B -->|Valid| D[Find User by Email]
    D -->|Not Found| E[Return 400 - User Not Found]
    D -->|Found| F{Already Verified?}
    F -->|Yes| G[Return 400 - Already Verified]
    F -->|No| H[Update User - Set Verified]
    H --> I[Return 200 - Email Verified]
"@ | Out-File -FilePath "$flowchartsPath\temp_verify_email.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_verify_email.mmd" -o "$imagesPath\verify-email-api.png" -t neutral -b transparent

# Cart API
@"
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
"@ | Out-File -FilePath "$flowchartsPath\temp_cart.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_cart.mmd" -o "$imagesPath\add-to-cart-api.png" -t neutral -b transparent

# User Profile API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 400 - Login First]
    B -->|Auth Valid| D[Find User by ID]
    D -->|Not Found/Inactive| E[Return 404 - User Not Found]
    D -->|Found| F[Return 200 - User Data]
"@ | Out-File -FilePath "$flowchartsPath\temp_profile.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_profile.mmd" -o "$imagesPath\get-profile-api.png" -t neutral -b transparent

# Category API
@"
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Validate Input]
    D -->|Invalid| E[Return 400 - Validation Error]
    D -->|Valid| F{Category Image Uploaded?}
    F -->|Yes| G[Save Image URL]
    F -->|No| H[Continue Without Image]
    G --> I[Check Category Name Exists]
    H --> I
    I -->|Exists| J[Return 400 - Category Already Exists]
    I -->|Not Exists| K[Create Category]
    K --> L[Return 200 - Category Created]
"@ | Out-File -FilePath "$flowchartsPath\temp_category.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_category.mmd" -o "$imagesPath\create-category-api.png" -t neutral -b transparent

# Product API
@"
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
"@ | Out-File -FilePath "$flowchartsPath\temp_product.mmd" -Encoding UTF8

mmdc -i "$flowchartsPath\temp_product.mmd" -o "$imagesPath\create-product-api.png" -t neutral -b transparent

# Clean up temporary files
Remove-Item "$flowchartsPath\temp_*.mmd" -Force

Write-Host "All flowchart images generated successfully in $imagesPath"
