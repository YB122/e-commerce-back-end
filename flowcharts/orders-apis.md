# Orders APIs Flowcharts

## User APIs

### POST /checkout - Create Order

![Create Order API Flowchart](images/orders/create-order-api.png)

```mermaid
flowchart TD
    A[User Request] --> B[Authentication Check]
    B --> C{User Active?}
    C -->|No| D[403: Account Inactive]
    C -->|Yes| E[Validate Request Body]
    E --> F{Valid paymentMethod?}
    F -->|No| G[400: Valid paymentMethod Required]
    F -->|Yes| H{Valid productIds Array?}
    H -->|No| I[400: productIds Required]
    H -->|Yes| J[Check User Address]
    J --> K{Complete Address?}
    K -->|No| L[400: Complete Shipping Address Required]
    K -->|Yes| M[Get Cart Items]
    M --> N{Items Found?}
    N -->|No| O[404: No Selected Items in Cart]
    N -->|Yes| P[Validate All productIds in Cart]
    P --> Q{All Items Valid?}
    Q -->|No| R[400: Some Products Not in Cart]
    Q -->|Yes| S[Process Each Cart Item]
    S --> T[Check Product Availability]
    T --> U{Product Active?}
    U -->|No| V[400: Product Not Available]
    U -->|Yes| W[Check Stock Level]
    W --> X{Sufficient Stock?}
    X -->|No| Y[400: Insufficient Stock]
    X -->|Yes| Z[Validate Price Consistency]
    Z --> AA{Price Match?}
    AA -->|No| BB[400: Price Changed]
    AA -->|Yes| CC[Add to Order Items]
    CC --> DD[Calculate Totals]
    DD --> EE[Set Payment Status]
    EE --> FF[Create Order]
    FF --> GG{Order Created?}
    GG -->|No| HH[400: Order Not Created]
    GG -->|Yes| II[Update Product Stock]
    II --> JJ{Stock Update Success?}
    JJ -->|No| KK[Rollback: Delete Order]
    KK --> LL[500: Stock Update Failed]
    JJ -->|Yes| MM[Delete Cart Items]
    MM --> NN[201: Order Created Successfully]
```

### GET / - Get User Orders

![Get User Orders API Flowchart](images/orders/get-user-orders-api.png)

```mermaid
flowchart TD
    A[User Request] --> B[Authentication Check]
    B --> C{User Active?}
    C -->|No| D[403: Account Not Found]
    C -->|Yes| E[Parse Query Parameters]
    E --> F[Set Defaults: page=1, limit=0, sortBy=createdAt, sortOrder=desc]
    F --> G[Build Query: userId = req.user._id]
    G --> H[Set Sort Options]
    H --> I[Execute Query with Pagination]
    I --> J{Orders Found?}
    J -->|No| K[404: No Orders Found]
    J -->|Yes| L[200: Return Orders with Pagination]
```

### GET /:id - Get Single Order

![Get Single Order API Flowchart](images/orders/get-single-order-api.png)

```mermaid
flowchart TD
    A[User Request] --> B[Authentication Check]
    B --> C{User Active?}
    C -->|No| D[403: Account Not Found]
    C -->|Yes| E[Get Order ID from Params]
    E --> F[Find Order by ID]
    F --> G{Order Found?}
    G -->|No| H[404: No Order Found]
    G -->|Yes| I[Check Order Ownership]
    I --> J{Order Belongs to User?}
    J -->|No| K[403: Access Denied]
    J -->|Yes| L[200: Return Order Data]
```

## Admin APIs

### GET /admin - Get All Orders

![Get All Orders Admin API Flowchart](images/orders/get-all-orders-admin-api.png)

```mermaid
flowchart TD
    A[Admin Request] --> B[Authentication Check]
    B --> C{Admin User?}
    C -->|No| D[401: Admin Only]
    C -->|Yes| E[Parse Query Parameters]
    E --> F[Set Defaults: page=1, limit=0, sortBy=createdAt, sortOrder=desc]
    F --> G[Build Empty Query]
    G --> H[Set Sort Options]
    H --> I[Execute Query with Pagination]
    I --> J{Orders Found?}
    J -->|No| K[404: No Orders Found]
    J -->|Yes| L[200: Return All Orders]
```

### PATCH /admin/:id/status - Update Order Status

![Update Order Status Admin API Flowchart](images/orders/update-order-status-admin-api.png)

```mermaid
flowchart TD
    A[Admin Request] --> B[Authentication Check]
    B --> C{Admin User?}
    C -->|No| D[401: Admin Only]
    C -->|Yes| E[Validate Request Body]
    E --> F{Valid orderStatus?}
    F -->|No| G[400: Invalid Status]
    F -->|Yes| H[Get Order ID from Params]
    H --> I[Find Order by ID]
    I --> J{Order Found?}
    J -->|No| K[404: Order Not Found]
    J -->|Yes| L[Update Order Status]
    L --> M{Update Success?}
    M -->|No| N[400: Order Status Not Updated]
    M -->|Yes| O[200: Order Status Updated]
```

## Order Status Flow

```mermaid
flowchart LR
    A[pending] --> B[processing]
    B --> C[shipped]
    C --> D[delivered]
    A --> E[cancelled]
    A --> F[payment]
    F --> B
```

## Payment Methods

```mermaid
flowchart TD
    A[Payment Method Selection] --> B{Method Type}
    B -->|card| C[Payment Status: paid]
    B -->|cod| D[Payment Status: pending]
```

## Error Handling Patterns

```mermaid
flowchart TD
    A[API Request] --> B{Authentication Valid?}
    B -->|No| C[401: Login First]
    B -->|Yes| D{User Active?}
    D -->|No| E[403: Account Inactive]
    D -->|Yes| F{Admin Required?}
    F -->|Yes| G{Is Admin?}
    G -->|No| H[401: Admin Only]
    G -->|Yes| I[Process Request]
    F -->|No| I
    I --> J{Request Valid?}
    J -->|No| K[400: Validation Error]
    J -->|Yes| L{Resource Found?}
    L -->|No| M[404: Not Found]
    L -->|Yes| N{Operation Success?}
    N -->|No| O[400/500: Operation Failed]
    N -->|Yes| P[200/201: Success Response]
```

## Security Checks

```mermaid
flowchart TD
    A[Order Access] --> B{User Type}
    B -->|Regular User| C[Check Order Ownership]
    C --> D{Order Belongs to User?}
    D -->|No| E[403: Access Denied]
    D -->|Yes| F[Allow Access]
    B -->|Admin| G[Allow All Orders Access]
```
