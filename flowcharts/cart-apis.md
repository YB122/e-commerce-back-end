# Cart APIs Flowcharts

## 1. POST /api/v1/cart (Add Item to Cart)

```mermaid
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
```

## 2. PUT /api/v1/cart/:productId (Update Quantity)

```mermaid
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
```

## 3. GET /api/v1/cart (View Cart)

```mermaid
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
```

## 4. DELETE /api/v1/cart/:productId (Remove Item)

```mermaid
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
```

## 5. DELETE /api/v1/cart (Clear Cart)

```mermaid
flowchart TD
    A[Client Request] --> B[Auth Middleware]
    B -->|No Auth| C[Return 401 - Login First]
    B -->|Auth Valid| D[Find User by ID]
    D -->|Not Found/Inactive| E[Return 404 - User Not Found]
    D -->|Found| F[Delete All User Cart Items]
    F --> G{Items Deleted?}
    G -->|Yes| H[Return 200 - Cart Cleared]
    G -->|No| I[Return 404 - Cart Already Empty]
```
