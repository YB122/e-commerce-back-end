# Authentication APIs Flowcharts

## 1. POST /api/v1/auth/signup

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

## 2. POST /api/v1/auth/login

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

## 3. GET /api/v1/auth/verify-email/:token

```mermaid
flowchart TD
    A[Client Request] --> B[Verify JWT Token]
    B -->|Invalid| C[Return 400 - Invalid Token]
    B -->|Valid| D[Find User by Email]
    D -->|Not Found| E[Return 400 - User Not Found]
    D -->|Found| F{Already Verified?}
    F -->|Yes| G[Return 400 - Already Verified]
    F -->|No| H[Update User - Set Verified]
    H --> I[Return 200 - Email Verified]
```

## 4. POST /api/v1/auth/resend-verification

```mermaid
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
```

## 5. POST /api/v1/auth/forget-password

```mermaid
flowchart TD
    A[Client Request] --> B{Validate Input}
    B -->|Invalid| C[Return 400 - Validation Error]
    B -->|Valid| D[Find User by Email]
    D -->|Not Found/Inactive| E[Return 404 - User Not Found]
    D -->|Found| F[Generate 6-Digit OTP]
    F --> G[Save OTP to User]
    G --> H[Send OTP Email]
    H --> I[Return 200 - Check Email]
```

## 6. POST /api/v1/auth/reset-password

```mermaid
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
```

## 7. POST /api/v1/auth/generate-new-access-token

```mermaid
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
```
