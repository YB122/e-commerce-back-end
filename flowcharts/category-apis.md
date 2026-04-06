# Category APIs Flowcharts

## 1. POST /api/v1/categories (Admin Only)

![Create Category API Flowchart](images/category/create-category-api.png)

```mermaid
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
```

## 2. PUT /api/v1/categories/:id (Admin Only)

![Update Category API Flowchart](images/category/update-category-api.png)

```mermaid
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
```

## 3. DELETE /api/v1/categories/:id (Admin Only)

![Delete Category API Flowchart](images/category/delete-category-api.png)

```mermaid
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Find Category by ID]
    D -->|Not Found| E[Return 404 - Category Not Found]
    D -->|Found| F[Soft Delete Category]
    F --> G[Set isActive = false]
    G --> H[Return 200 - Category Deleted]
```

## 4. GET /api/v1/categories/admin (Admin Only)

![Get Categories Admin API Flowchart](images/category/get-categories-admin-api.png)

```mermaid
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Get All Categories]
    D -->|Categories Found| E[Return 200 - Categories Data]
    D -->|No Categories| F[Return 404 - Categories Not Found]
```

## 5. GET /api/v1/categories/:id/admin (Admin Only)

![Get Single Category Admin API Flowchart](images/category/get-single-category-admin-api.png)

```mermaid
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Find Category by ID]
    D -->|Not Found| E[Return 404 - Category Not Found]
    D -->|Found| F[Return 200 - Category Data]
```

## 6. GET /api/v1/categories (Public)

![Get Categories Public API Flowchart](images/category/get-categories-public-api.png)

```mermaid
flowchart TD
    A[Client Request] --> B[Get Active Categories Only]
    B -->|Categories Found| C[Return 200 - Categories Data]
    B -->|No Categories| D[Return 404 - Categories Not Found]
```

## 7. GET /api/v1/categories/:id/subcategories (Public)

![Get Subcategories by Category API Flowchart](images/subcategories/get-subcategories-by-category-api.png)

```mermaid
flowchart TD
    A[Client Request] --> B[Find Category by ID]
    B -->|Not Found/Inactive| C[Return 404 - Category Not Found]
    B -->|Found & Active| D[Get Subcategories by Category ID]
    D -->|Subcategories Found| E[Return 200 - Subcategories Data]
    D -->|No Subcategories| F[Return 404 - Subcategories Not Found]
```
