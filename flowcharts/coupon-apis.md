# Coupon APIs Flowcharts

## Admin Coupon APIs

### 1. POST /api/v1/coupons/admin - Add Coupon

![Add Coupon API Flowchart](images/coupon/add-coupon-api.png)

```mermaid
flowchart TD
    A[Admin Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Validate Input]
    D -->|Invalid| E[Return 400 - Validation Error]
    D -->|Valid| F[Prepare Coupon Data]
    F --> G[Create Coupon Record]
    G -->|Creation Failed| H[Return 400 - Failed to Add Coupon]
    G -->|Success| I[Return 201 - Coupon Added Successfully]
```

### 2. GET /api/v1/coupons/admin - Get All Coupons (Admin)

![Get All Coupons Admin API Flowchart](images/coupon/get-all-coupons-admin-api.png)

```mermaid
flowchart TD
    A[Admin Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D{Page & Limit Provided?}
    D -->|Yes| E[Extract Page & Limit]
    E --> F[Calculate Skip = (page-1) * limit]
    F --> G[Query with Pagination]
    G --> H[Get Total Count]
    H --> I[Calculate Total Pages]
    I --> J{Coupons Found?}
    J -->|No| K[Return 404 - No Coupons Found]
    J -->|Yes| L[Return 200 with Pagination Data]
    D -->|No| M[Query All Coupons]
    M --> N{Coupons Found?}
    N -->|No| O[Return 404 - No Coupons Found]
    N -->|Yes| P[Return 200 - All Coupons Data]
```

### 3. GET /api/v1/coupons/admin/:id - Get One Coupon (Admin)

![Get One Coupon Admin API Flowchart](images/coupon/get-one-coupon-admin-api.png)

```mermaid
flowchart TD
    A[Admin Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Extract ID from Body]
    D --> E[Find Coupon by ID]
    E -->|Not Found| F[Return 404 - Coupon Not Found]
    E -->|Found| G[Return 200 - Coupon Data]
```

### 4. PUT /api/v1/coupons/admin - Update Coupon

![Update Coupon API Flowchart](images/coupon/update-coupon-api.png)

```mermaid
flowchart TD
    A[Admin Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Validate Input]
    D -->|Invalid| E[Return 400 - Validation Error]
    D -->|Valid| F[Extract ID & Update Data]
    F --> G[Find Coupon by ID]
    G -->|Not Found| H[Return 404 - Coupon Not Found]
    G -->|Found| I[Update Coupon Record]
    I -->|Update Failed| J[Return 404 - Coupon Not Found]
    I -->|Success| K[Return 200 - Coupon Updated Successfully]
```

### 5. DELETE /api/v1/coupons/admin - Delete/Deactivate Coupon

![Delete Coupon API Flowchart](images/coupon/delete-coupon-api.png)

```mermaid
flowchart TD
    A[Admin Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Extract ID from Body]
    D --> E[Find Coupon by ID]
    E -->|Not Found| F[Return 404 - Coupon Not Found]
    E -->|Found| G[Set isActive = false]
    G --> H[Save Updated Coupon]
    H --> I[Return 200 - Coupon Deactivated Successfully]
```

## User Coupon APIs

### 6. GET /api/v1/coupons - Get All Coupons (User)

![Get All Coupons User API Flowchart](images/coupon/get-all-coupons-user-api.png)

```mermaid
flowchart TD
    A[User Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 400 - Login Required]
    B -->|Auth Valid| D{Page & Limit Provided?}
    D -->|Yes| E[Extract Page & Limit]
    E --> F[Calculate Skip = (page-1) * limit]
    F --> G[Query Active Coupons with Pagination]
    G --> H[Get Total Count]
    H --> I[Calculate Total Pages]
    I --> J{Active Coupons Found?}
    J -->|No| K[Return 404 - No Coupons Found]
    J -->|Yes| L[Return 200 with Pagination Data]
    D -->|No| M[Query All Active Coupons]
    M --> N{Active Coupons Found?}
    N -->|No| O[Return 404 - No Coupons Found]
    N -->|Yes| P[Return 200 - All Active Coupons Data]
```

### 7. GET /api/v1/coupons/:id - Get One Coupon (User)

![Get One Coupon User API Flowchart](images/coupon/get-one-coupon-user-api.png)

```mermaid
flowchart TD
    A[User Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 400 - Login Required]
    B -->|Auth Valid| D[Extract ID from Body]
    D --> E[Find Active Coupon by ID]
    E -->|Not Found| F[Return 404 - Coupon Not Found]
    E -->|Found| G[Return 200 - Coupon Data]
```

## Coupon Status Flow

```mermaid
flowchart LR
    A[Created] --> B[Active]
    B --> C[Deactivated]
    B --> D[Expired]
    C --> E[Cannot Be Used]
    D --> E
```

## Pagination Logic

```mermaid
flowchart TD
    A[Request with Page & Limit] --> B[Calculate Skip]
    B --> C[Skip = (Page - 1) * Limit]
    C --> D[Apply Skip & Limit to Query]
    D --> E[Get Total Count]
    E --> F[Calculate Total Pages = ceil(Total/Limit)]
    F --> G[Return Data + Pagination Info]
    G --> H{Has Next Page?}
    G --> I[hasNextPage = true]
    H -->|Yes| I
    H -->|No| J[hasNextPage = false]
```

## Error Handling Patterns

```mermaid
flowchart TD
    A[API Request] --> B{Authentication Valid?}
    B -->|No| C[400: Admin Only/Login Required]
    B -->|Yes| D{Request Valid?}
    D -->|No| E[400: Validation Error]
    D -->|Yes| F{Resource Found?}
    F -->|No| G[404: Not Found]
    F -->|Yes| H{Operation Success?}
    H -->|No| I[400/404: Operation Failed]
    H -->|Yes| J[200/201: Success Response]
```

## Data Access Patterns

```mermaid
flowchart TD
    A[API Request] --> B{User Type}
    B -->|Admin| C[Full Access to All Coupons]
    C --> D[Can Create/Update/Delete]
    C --> E[View Active & Inactive]
    B -->|Regular User| F[Limited Access]
    F --> G[View Active Coupons Only]
    F --> H[Cannot Modify Coupons]
```

## Coupon Validation Rules

```mermaid
flowchart TD
    A[Coupon Data] --> B{Required Fields Present?}
    B -->|No| C[Return Validation Error]
    B -->|Yes| D{Discount Code Valid?}
    D -->|No| E[Return Validation Error]
    D -->|Yes| F{Expiry Date Valid?}
    F -->|No| G[Return Validation Error]
    F -->|Yes| H{Price/Type Valid?}
    H -->|No| I[Return Validation Error]
    H -->|Yes| J[Process Coupon]
```
