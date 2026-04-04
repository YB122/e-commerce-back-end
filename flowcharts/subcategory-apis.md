# SubCategory APIs Flowcharts

## 1. POST /api/v1/subcategories (Admin Only)

```mermaid
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
```

## 2. PUT /api/v1/subcategories/:id (Admin Only)

```mermaid
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
```

## 3. DELETE /api/v1/subcategories/:id (Admin Only)

```mermaid
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Find SubCategory by ID]
    D -->|Not Found| E[Return 404 - SubCategory Not Found]
    D -->|Found| F[Soft Delete SubCategory]
    F --> G[Set isActive = false]
    G --> H[Return 200 - SubCategory Deleted]
```

## 4. GET /api/v1/subcategories/admin (Admin Only)

```mermaid
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth/Not Admin| C[Return 400 - Admin Only]
    B -->|Admin Auth| D[Get All SubCategories]
    D -->|SubCategories Found| E[Return 200 - SubCategories Data]
    D -->|No SubCategories| F[Return 404 - SubCategories Not Found]
```

## 5. GET /api/v1/subcategories/:id (Public)

```mermaid
flowchart TD
    A[Client Request] --> B[Find SubCategory by ID]
    B -->|Not Found/Inactive| C[Return 404 - SubCategory Not Found]
    B -->|Found & Active| D[Return 200 - SubCategory Data]
```
