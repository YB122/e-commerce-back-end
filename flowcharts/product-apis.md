# Product APIs Flowcharts

## 1. POST /api/v1/products (Admin Only)

![Create Product API Flowchart](images/product/create-product-api.png)

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

## 2. PUT /api/v1/products/:id (Admin Only)

![Update Product API Flowchart](images/product/update-product-api.png)

```mermaid
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
```

## 3. DELETE /api/v1/products/:id (Admin Only)

![Delete Product API Flowchart](images/product/delete-product-api.png)

```mermaid
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Find Product by ID]
    D -->|Not Found| E[Return 404 - Product Not Found]
    D -->|Found| F[Soft Delete Product]
    F --> G[Set isActiveAdmin = false]
    G --> H[Return 200 - Product Deleted]
```

## 4. GET /api/v1/products/admin (Admin Only)

![Get Products Admin API Flowchart](images/product/get-products-admin-api.png)

```mermaid
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Get All Products]
    D -->|Products Found| E[Return 200 - Products Data]
    D -->|No Products| F[Return 404 - Products Not Found]
```

## 5. GET /api/v1/products (Public)

![Get Products Public API Flowchart](images/product/get-products-public-api.png)

```mermaid
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
```

## 6. GET /api/v1/products/:id (Public)

![Get Single Product API Flowchart](images/product/get-single-product-api.png)

```mermaid
flowchart TD
    A[Client Request] --> B[Find Product by ID]
    B -->|Not Found/Inactive| C[Return 404 - Product Not Found]
    B -->|Found & Active| D[Return 200 - Product Data]
```
