# Sequence Diagram - Login & Logout

## How to View

1. Go to https://mermaid.live/
2. Copy the code below
3. Paste it in the editor
4. Download as PNG or SVG

---

## Login Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant Backend
    participant Database
    participant Storage

    Admin->>Frontend: Enter username & password
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: SELECT admin WHERE username = ?
    Database-->>Backend: admin record

    alt Invalid Credentials
        Backend-->>Frontend: 401 Unauthorized
        Frontend-->>Admin: Error Message
    else Valid Credentials
        Backend->>Backend: bcrypt verify password
        Backend->>Backend: Generate JWT (1h expiry)
        Backend-->>Frontend: {success: true, token}
        Frontend->>Storage: Save adminToken & adminLoggedIn
        Frontend-->>Admin: Redirect to Dashboard
    end
```

---

## Logout Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Sidebar
    participant RoleContext
    participant Storage

    Admin->>Sidebar: Click Logout
    Sidebar->>RoleContext: clearRole()
    RoleContext->>Storage: Remove userRole only

    Note over Storage: ⚠️ adminToken NOT cleared

    Sidebar-->>Admin: Redirect to Homepage

    Note over Storage: ⚠️ Token still valid for 1h
```

## Key Components

**Files:**
- [backend/auth.js](../backend/auth.js) - Login endpoint
- [backend/authMiddleware.js](../backend/authMiddleware.js) - Token verification
- [app/admin/login/page.tsx](../app/admin/login/page.tsx) - Login UI
- [components/Sidebar.tsx](../components/Sidebar.tsx) - Logout button
- [components/RoleContext.tsx](../components/RoleContext.tsx) - clearRole()

**API:**
- `POST /api/auth/login` - Admin login (returns JWT token)
- No logout endpoint (frontend only)

**Security:**
- JWT token expires in 1 hour
- bcrypt password hashing
- ⚠️ Logout doesn't clear tokens from localStorage
- ⚠️ No token revocation mechanism
