# Activity Diagram - Admin Login & Logout

## How to View

1. Go to https://mermaid.live/
2. Copy the code below
3. Paste it in the editor
4. Download as PNG or SVG

---

## Login Flow

```mermaid
sequenceDiagram
    Note over Admin,System: ● START LOGIN

    Admin->>Admin: Navigate to /admin/login
    Admin->>Admin: Enter username & password
    Admin->>System: Click "Sign In" button

    System->>System: Validate input fields
    System->>System: Send POST /api/auth/login

    alt [Fields Invalid]
        System->>Admin: Display validation error
        Note over Admin: ● END
    else [Fields Valid]
        System->>System: Query admins table<br/>SELECT password_hash WHERE username = ?
        System->>System: bcrypt.compare(password, hash)

        alt [Invalid Credentials]
            System->>Admin: Display "Invalid username or password"
            Note over Admin: ● END
        else [Valid Credentials]
            System->>System: Generate JWT token<br/>(expires in 1 hour)
            System->>Admin: Return {success: true, token}
            Admin->>Admin: Store adminToken & adminLoggedIn<br/>in localStorage
            Admin->>Admin: Redirect to /admin/dashboard
            Note over Admin: ● END
        end
    end
```

---

## Logout Flow

```mermaid
sequenceDiagram
    Note over Admin,System: ● START LOGOUT

    Admin->>Admin: Click "Logout" in Sidebar
    Admin->>System: Trigger clearRole() function

    System->>System: Remove userRole from localStorage

    Note over System: ⚠️ adminToken & adminLoggedIn<br/>NOT cleared from localStorage

    System->>Admin: Redirect to homepage /
    Admin->>Admin: Logout complete

    Note over Admin: ⚠️ Token remains valid for 1h<br/>No server-side logout endpoint

    Note over Admin: ● END
```

## Key Components

**Frontend Files:**
- [app/admin/login/page.tsx](../app/admin/login/page.tsx) - Login form UI
- [components/Sidebar.tsx](../components/Sidebar.tsx) - Logout button
- [components/RoleContext.tsx](../components/RoleContext.tsx) - Role management

**Backend Files:**
- [backend/auth.js](../backend/auth.js) - Login endpoint & JWT generation

**Database:**
- `admins` table: Stores username, password_hash

**Security Notes:**
- ✅ Passwords hashed with bcrypt (saltRounds = 10)
- ✅ JWT tokens expire in 1 hour
- ⚠️ Logout only clears `userRole`, not tokens
- ⚠️ No token revocation mechanism
- ⚠️ Tokens remain valid until expiry even after logout

**API Details:**
- `POST /api/auth/login` - Validates credentials, returns JWT
- No logout endpoint (client-side only)

**LocalStorage Keys:**
- `adminToken`: JWT token for API authentication
- `adminLoggedIn`: Boolean flag for UI state
- `userRole`: Role for sidebar menu customization

---

## PlantUML Activity Diagram (Alternative Format)

```plantuml
@startuml Admin_Login_Logout
|Admin|
start
:Navigate to Login Page;

|System|
if (Enter Credentials?) then (yes)
  :Validate Input Fields;

  if (Valid?) then (no)
    |Admin|
    :Show Validation Error;
    stop
  else (yes)
    :Send Login Request;

    |System|
    :Query Database for Admin;
    :Verify Password with bcrypt;

    if (Credentials Valid?) then (no)
      |Admin|
      :Show "Invalid Credentials";
      stop
    else (yes)
      :Generate JWT Token (1h expiry);
      :Return Success Response;

      |Admin|
      :Store Token & Login Status;
      :Redirect to Dashboard;
      stop
    endif
  endif
endif

:Click Logout Button;

|System|
:Clear userRole from localStorage;

Note right: ⚠️ Tokens NOT cleared

|Admin|
:Redirect to Homepage;
stop

@enduml
```

---

## Flow Summary

**Login Process:**
1. Admin navigates to login page
2. Enters username/password
3. Frontend validates fields
4. POST request to `/api/auth/login`
5. Backend queries `admins` table
6. bcrypt password verification
7. JWT token generation (1h expiry)
8. Store token in localStorage
9. Redirect to dashboard

**Logout Process:**
1. Admin clicks logout in sidebar
2. `clearRole()` removes `userRole` from localStorage
3. Redirect to homepage
4. Tokens remain valid until expiry (no server logout)

**Security Considerations:**
- Client-side logout doesn't invalidate tokens
- Tokens valid for 1 hour regardless of logout
- No server-side session management
- Relies on JWT expiry for security
