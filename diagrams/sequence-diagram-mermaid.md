# Sequence Diagram - Event Approval (Mermaid Version)

## How to View This Diagram

1. Go to https://mermaid.live/
2. Copy the code below
3. Paste it in the editor
4. Download as PNG or SVG

---

## Mermaid Code - Event Creation

```mermaid
sequenceDiagram
    actor Student
    participant Frontend
    participant Backend
    participant Database

    Student->>Frontend: Click "Add Event"
    Frontend->>Student: Display Event Form
    Student->>Frontend: Fill Form & Submit
    Frontend->>Frontend: Validate Fields

    alt Invalid Fields
        Frontend->>Student: Display Error
    else Valid Fields
        Frontend->>Backend: POST /api/events<br/>{name, dates, venues...}

        Backend->>Backend: Verify Authentication

        alt Not Authenticated
            Backend->>Frontend: 401 Unauthorized
            Frontend->>Student: Display Auth Error
        else Authenticated
            Backend->>Database: INSERT INTO events<br/>(status='pending')
            Database-->>Backend: eventId

            Backend->>Database: INSERT INTO notifications<br/>(type='event_approval')
            Database-->>Backend: notificationId

            Backend-->>Frontend: 201 Created
            Frontend->>Student: Success Message
        end
    end
```

---

## Event Approval by Admin

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant Backend
    participant Database
    participant SSE
    actor OtherAdmin

    Admin->>Frontend: Navigate to Notifications
    Frontend->>Backend: GET /api/notifications
    Backend->>Database: SELECT notifications<br/>JOIN events
    Database-->>Backend: notifications[]
    Backend-->>Frontend: 200 OK
    Frontend->>Admin: Display Notification List

    Admin->>Frontend: Click "Approve"
    Frontend->>Admin: Confirmation Modal
    Admin->>Frontend: Confirm

    Frontend->>Backend: PUT /api/notifications/:id/approve

    Backend->>Database: UPDATE notifications<br/>SET status='approved'
    Database-->>Backend: Success

    Backend->>Database: UPDATE events<br/>SET status='approved'
    Database-->>Backend: Success

    Backend->>Database: INSERT notification<br/>(for Other-Admins)
    Database-->>Backend: Success

    par Broadcast in Parallel
        Backend->>SSE: broadcast(event_approved)
        SSE->>OtherAdmin: New Event Notification
    and Return to Admin
        Backend-->>Frontend: 200 OK
        Frontend->>Admin: Success Message
    end
```

---

## Report Upload Flow

```mermaid
sequenceDiagram
    actor Student
    participant Frontend
    participant Backend
    participant Database
    participant Cloudinary

    Student->>Frontend: Navigate to Reports
    Frontend->>Backend: GET /api/events?status=approved
    Backend->>Database: SELECT approved events
    Database-->>Backend: events[]
    Backend-->>Frontend: 200 OK
    Frontend->>Student: Display Event Dropdown

    Student->>Frontend: Select Event & Choose PDF
    Frontend->>Frontend: Validate File Type & Size

    alt Invalid File
        Frontend->>Student: Display Error
    else Valid File
        Student->>Frontend: Click Upload
        Frontend->>Backend: POST /api/reports/upload<br/>(multipart/form-data)

        Backend->>Cloudinary: Upload PDF File
        Cloudinary-->>Backend: {secure_url, public_id}

        Backend->>Database: INSERT INTO reports<br/>(eventId, filePath, public_id)
        Database-->>Backend: reportId

        Backend-->>Frontend: 201 Created
        Frontend->>Student: Success Message
    end
```

---

## Simplified Event Approval

```mermaid
sequenceDiagram
    Student->>+Backend: Create Event
    Backend->>+Database: Save (status=pending)
    Database-->>-Backend: eventId
    Backend->>Database: Create Notification
    Database-->>Backend: notificationId
    Backend-->>-Student: Success

    Admin->>+Backend: Get Notifications
    Backend->>+Database: Query Notifications
    Database-->>-Backend: List
    Backend-->>-Admin: Display

    Admin->>+Backend: Approve Event
    Backend->>Database: Update Event (approved)
    Backend->>Database: Update Notification
    Backend->>SSE: Broadcast
    SSE->>OtherAdmin: Alert
    Backend-->>-Admin: Success
```

---

## Edit Event Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant Backend
    participant Database

    Admin->>Frontend: Navigate to Calendar
    Frontend->>Backend: GET /api/events
    Backend->>Database: SELECT * FROM events
    Database-->>Backend: events[]
    Backend-->>Frontend: 200 OK
    Frontend->>Admin: Display Calendar

    Admin->>Frontend: Click Event to View Details
    Frontend->>Admin: Display Event Details Modal

    Admin->>Frontend: Click "Edit" Button
    Frontend->>Admin: Display Edit Event Form<br/>(Pre-filled with current data)

    Admin->>Frontend: Modify Fields & Submit
    Frontend->>Frontend: Validate Fields

    alt Invalid Fields
        Frontend->>Admin: Display Error
    else Valid Fields
        Frontend->>Backend: PUT /api/events/:id<br/>{name, dates, venues, equipment...}<br/>[Auth Token Required]

        Backend->>Backend: Verify Admin Token

        alt Not Authenticated
            Backend->>Frontend: 401 Unauthorized
            Frontend->>Admin: Display Auth Error
        else Authenticated
            Backend->>Database: UPDATE events SET<br/>name=?, description=?, dates=?...<br/>WHERE id=?
            Database-->>Backend: affectedRows

            Backend->>Database: SELECT * FROM events<br/>WHERE id=?
            Database-->>Backend: updatedEvent

            Backend-->>Frontend: 200 OK<br/>{id, name, dates, status...}
            Frontend->>Frontend: Refresh Calendar
            Frontend->>Admin: Success Message
        end
    end
```

---

## Delete Event Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant Backend
    participant Database

    Admin->>Frontend: Navigate to Calendar
    Frontend->>Backend: GET /api/events
    Backend->>Database: SELECT * FROM events
    Database-->>Backend: events[]
    Backend-->>Frontend: 200 OK
    Frontend->>Admin: Display Calendar

    Admin->>Frontend: Click Event to View Details
    Frontend->>Admin: Display Event Details Modal

    Admin->>Frontend: Click "Delete" Button
    Frontend->>Admin: Show Confirmation Modal:<br/>"Are you sure you want to delete?"

    Admin->>Frontend: Confirm Deletion

    Frontend->>Backend: DELETE /api/events/:id<br/>[Auth Token Required]

    Backend->>Backend: Verify Admin Token

    alt Not Authenticated
        Backend->>Frontend: 401 Unauthorized
        Frontend->>Admin: Display Auth Error
    else Authenticated
        Note over Backend,Database: Cascade delete related records

        Backend->>Database: DELETE FROM reports<br/>WHERE eventId=?
        Database-->>Backend: Success

        Backend->>Database: DELETE FROM notifications<br/>WHERE eventId=?
        Database-->>Backend: Success

        Backend->>Database: DELETE FROM events<br/>WHERE id=?
        Database-->>Backend: affectedRows

        alt Event Not Found
            Backend->>Frontend: 404 Not Found
            Frontend->>Admin: Display Error
        else Event Deleted
            Backend-->>Frontend: 200 OK<br/>{message: "Event deleted successfully"}
            Frontend->>Frontend: Refresh Calendar
            Frontend->>Admin: Success Message
        end
    end
```

---

## Add Resource (Equipment) Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant Backend
    participant Database

    Admin->>Frontend: Navigate to Resources Page
    Frontend->>Backend: GET /api/resources
    Backend->>Database: SELECT * FROM resources
    Database-->>Backend: resources[]
    Backend-->>Frontend: 200 OK
    Frontend->>Admin: Display Resources List

    Admin->>Frontend: Click "Add Equipment"
    Frontend->>Admin: Display Resource Form

    Admin->>Frontend: Fill Form & Submit<br/>{name, description, category,<br/>total, available, location, condition}
    Frontend->>Frontend: Validate Fields

    alt Invalid Fields
        Frontend->>Admin: Display Error
    else Valid Fields
        Frontend->>Backend: POST /api/resources<br/>[Auth Token Required]

        Backend->>Backend: Verify Admin Token

        alt Not Authenticated
            Backend->>Frontend: 401 Unauthorized
            Frontend->>Admin: Display Auth Error
        else Authenticated
            Backend->>Database: INSERT INTO resources<br/>(name, description, category,<br/>total, available, location, condition)
            Database-->>Backend: resourceId

            Backend-->>Frontend: 201 Created<br/>{id, name, total, available...}
            Frontend->>Frontend: Refresh Resources List
            Frontend->>Admin: Success Message
        end
    end
```

---

## Add Venue Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant Backend
    participant Database

    Admin->>Frontend: Navigate to Resources Page
    Frontend->>Backend: GET /api/venues
    Backend->>Database: SELECT * FROM venues
    Database-->>Backend: venues[]
    Backend-->>Frontend: 200 OK
    Frontend->>Admin: Display Venues List (Tab)

    Admin->>Frontend: Click "Add Venue"
    Frontend->>Admin: Display Venue Form

    Admin->>Frontend: Fill Form & Submit<br/>{name, description,<br/>category, availability}
    Frontend->>Frontend: Validate Fields

    alt Invalid Fields
        Frontend->>Admin: Display Error
    else Valid Fields
        Frontend->>Backend: POST /api/venues<br/>[Auth Token Required]

        Backend->>Backend: Verify Admin Token

        alt Not Authenticated
            Backend->>Frontend: 401 Unauthorized
            Frontend->>Admin: Display Auth Error
        else Authenticated
            Backend->>Database: INSERT INTO venues<br/>(name, description, category, availability)
            Database-->>Backend: venueId

            Backend-->>Frontend: 201 Created<br/>{id, name, availability...}
            Frontend->>Frontend: Refresh Venues List
            Frontend->>Admin: Success Message
        end
    end
```

---

## Add Task (To-Do) Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant Backend
    participant Database

    Admin->>Frontend: Navigate to Admin Dashboard
    Frontend->>Backend: GET /api/tasks?date=YYYY-MM-DD<br/>[Auth Token Required]
    Backend->>Backend: Verify Admin Token
    Backend->>Database: SELECT * FROM tasks<br/>WHERE due_date = ?
    Database-->>Backend: tasks[]
    Backend-->>Frontend: 200 OK
    Frontend->>Admin: Display Tasks Widget

    Admin->>Frontend: Click "Add Task"
    Frontend->>Admin: Display Task Form

    Admin->>Frontend: Fill Form & Submit<br/>{title, note, due_date, due_time}
    Frontend->>Frontend: Validate Fields

    alt Invalid Fields
        Frontend->>Admin: Display Error
    else Valid Fields
        Frontend->>Backend: POST /api/tasks<br/>[Auth Token Required]

        Backend->>Backend: Verify Admin Token

        alt Not Authenticated
            Backend->>Frontend: 401 Unauthorized
            Frontend->>Admin: Display Auth Error
        else Authenticated
            Backend->>Database: INSERT INTO tasks<br/>(title, note, due_date, completed=false)
            Database-->>Backend: taskId

            Backend-->>Frontend: 201 Created<br/>{id, title, due_date, completed}
            Frontend->>Frontend: Refresh Tasks List
            Frontend->>Admin: Success Message

            Note over Frontend,Admin: If task due within 10 mins,<br/>show reminder popup
        end
    end
```

---

## Update Task Status Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant Backend
    participant Database

    Admin->>Frontend: View Tasks on Dashboard
    Admin->>Frontend: Check/Uncheck Task Checkbox

    Frontend->>Backend: PUT /api/tasks/:id<br/>{completed: true/false}<br/>[Auth Token Required]

    Backend->>Backend: Verify Admin Token

    alt Not Authenticated
        Backend->>Frontend: 401 Unauthorized
        Frontend->>Admin: Display Auth Error
    else Authenticated
        Backend->>Database: UPDATE tasks<br/>SET completed = ?<br/>WHERE id = ?
        Database-->>Backend: Success

        Backend-->>Frontend: 200 OK<br/>{id, completed, ...}
        Frontend->>Frontend: Update UI (checked/unchecked)
        Frontend->>Admin: Visual Feedback
    end
```

---

## Simplified Resource/Venue/Task Creation

```mermaid
sequenceDiagram
    Admin->>+Frontend: Click "Add" (Resource/Venue/Task)
    Frontend->>Admin: Display Form

    Admin->>Frontend: Fill & Submit
    Frontend->>Frontend: Validate

    alt Invalid
        Frontend->>-Admin: Error
    else Valid
        Frontend->>+Backend: POST /api/{resource|venue|task}
        Backend->>Backend: Verify Admin Token
        Backend->>+Database: INSERT INTO {table}
        Database-->>-Backend: newId
        Backend-->>-Frontend: 201 Created
        Frontend->>-Admin: Success & Refresh List
    end
```

---

## Add New Admin Flow

```mermaid
sequenceDiagram
    actor SuperAdmin
    participant Frontend
    participant Backend
    participant Database

    SuperAdmin->>Frontend: Navigate to Admin Management
    Frontend->>Backend: GET /api/admins<br/>[Auth Token Required]
    Backend->>Backend: Verify Super Admin Token
    Backend->>Database: SELECT * FROM users<br/>WHERE role='admin'
    Database-->>Backend: admins[]
    Backend-->>Frontend: 200 OK
    Frontend->>SuperAdmin: Display Admin List

    SuperAdmin->>Frontend: Click "Add Admin"
    Frontend->>SuperAdmin: Display Add Admin Form

    SuperAdmin->>Frontend: Fill Form & Submit<br/>{name, email, password}
    Frontend->>Frontend: Validate Fields

    alt Invalid Fields
        Frontend->>SuperAdmin: Display Error
    else Valid Fields
        Frontend->>Backend: POST /api/admins<br/>{name, email, password}<br/>[Auth Token Required]

        Backend->>Backend: Verify Super Admin Token

        alt Not Super Admin
            Backend->>Frontend: 403 Forbidden
            Frontend->>SuperAdmin: Display Auth Error
        else Super Admin
            Backend->>Backend: Hash Password

            Backend->>Database: Check Email Exists
            Database-->>Backend: email count

            alt Email Already Exists
                Backend->>Frontend: 409 Conflict
                Frontend->>SuperAdmin: Error: Email exists
            else Email Available
                Backend->>Database: INSERT INTO users<br/>(name, email, password, role='admin')
                Database-->>Backend: adminId

                Backend-->>Frontend: 201 Created<br/>{id, name, email, role}
                Frontend->>Frontend: Refresh Admin List
                Frontend->>SuperAdmin: Success Message
            end
        end
    end
```

---

## Notes

**Mermaid Sequence Diagrams:**
- ✅ Clean and simple syntax
- ✅ Automatic layout
- ✅ Good for basic flows
- ✅ Supports alt/par/opt frames

**Syntax Guide:**
- `actor` - Stick figure
- `participant` - Box
- `->>` - Solid arrow (sync)
- `-->>` - Dashed arrow (return)
- `alt/else/end` - Alternative paths
- `par/and/end` - Parallel execution

**Sequence Diagrams Created:**
1. Event Creation
2. Event Approval by Admin
3. Report Upload Flow
4. Simplified Event Approval
5. Edit Event Flow
6. Delete Event Flow
7. Add Resource (Equipment) Flow
8. Add Venue Flow
9. Add Task (To-Do) Flow
10. Update Task Status Flow
11. Simplified Resource/Venue/Task Creation
12. Add New Admin Flow

**Total: 12 Sequence Diagrams**

**API Endpoints Used:**
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Edit event
- `DELETE /api/events/:id` - Delete event
- `POST /api/resources` - Add equipment
- `POST /api/venues` - Add venue
- `POST /api/tasks` - Add task
- `PUT /api/tasks/:id` - Update task status
- `GET /api/events` - List events
- `GET /api/resources` - List resources
- `GET /api/venues` - List venues
- `GET /api/tasks?date=YYYY-MM-DD` - List tasks
- `POST /api/reports/upload` - Upload report
- `PUT /api/notifications/:id/approve` - Approve notification
- `GET /api/admins` - List admins (Super Admin only)
- `POST /api/admins` - Add new admin (Super Admin only)

**Authentication:**
- All POST/PUT operations require Admin JWT token
- Token sent in Authorization header
- 401 error if not authenticated

**Limitations:**
- ⚠️ Less detailed than PlantUML
- ⚠️ Limited styling options
- ⚠️ No activation boxes control
