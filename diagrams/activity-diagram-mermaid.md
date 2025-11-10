# Activity Diagram - Event Approval (Mermaid Version)

## How to View This Diagram

1. Go to https://mermaid.live/
2. Copy the code below
3. Paste it in the editor
4. Download as PNG or SVG

---

## Mermaid Code - Event Creation & Approval (Swimlane Style)

```mermaid
sequenceDiagram
    Note over Student,Database: ● START

    Student->>Student: Click Add Event
    Student->>Frontend: Fill Event Form:<br/>Name, Description,<br/>Dates, Venues, Equipment
    Student->>Frontend: Submit Form

    Frontend->>Frontend: Validate Fields

    alt [invalid]
        Frontend->>Student: Show Error
        Note over Student: ● END
    else [valid]
        Frontend->>Backend: POST /api/events
        Backend->>Backend: Receive Request
        Backend->>Backend: Check Authentication

        alt [not authenticated]
            Backend->>Frontend: Show Auth Error
            Frontend->>Student: Display Auth Error
            Note over Student: ● END
        else [authenticated]
            Backend->>Database: Save Event<br/>(status='pending')
            Database-->>Backend: INSERT INTO events
            Backend->>Database: Create Notification<br/>(type='event_approval')
            Database-->>Backend: INSERT INTO notifications
            Backend->>Frontend: Return 201 Created
            Frontend->>Student: Display Success

            Student->>Student: Wait for Approval

            Note over Admin,Database: ==== FORK ====

            Admin->>Admin: Navigate to Notifications
            Admin->>Frontend: View Pending Notifications
            Admin->>Admin: Click View Details
            Admin->>Admin: Review Event Information

            alt Decision: Approve
                Admin->>Backend: Confirm Approval
                Backend->>Backend: Process Approval
                Backend->>Database: Update Event<br/>(status='approved')
                Database-->>Backend: UPDATE events
                Backend->>Database: Create Notification<br/>for Other-Admins
                Database-->>Backend: INSERT notification

                par Broadcast in Parallel
                    Backend->>OtherAdmin: SSE Broadcast
                    OtherAdmin->>OtherAdmin: Display Alert:<br/>New Event Approved
                    Note over OtherAdmin: ==== JOIN ====
                    Note over OtherAdmin: ● END
                and
                    Backend->>Admin: Display Success
                    Note over Admin: ● END
                end

            else Decision: Decline
                Admin->>Backend: Confirm Decline
                Backend->>Backend: Process Decline
                Backend->>Database: Update Event<br/>(status='declined')
                Database-->>Backend: UPDATE events
                Backend->>Admin: Display Success
                Note over Admin: ● END
            end
        end
    end
```

---

## Report Upload Flow (Swimlane Style)

```mermaid
sequenceDiagram
    Note over Student,Cloudinary: ● START

    Student->>Student: Navigate to Reports Page
    Student->>Frontend: Request Reports Page

    Frontend->>Backend: GET /api/events?status=approved
    Backend->>Database: Query Approved Events
    Database-->>Backend: SELECT * FROM events<br/>WHERE status='approved'
    Backend->>Frontend: Return Events List
    Frontend->>Student: Display Event Dropdown

    Student->>Student: View Approved Events Dropdown
    Student->>Student: Select Event
    Student->>Student: Choose PDF File
    Student->>Frontend: Click Upload

    Frontend->>Frontend: Validate File Type

    alt File is not PDF
        Frontend->>Student: Display Error:<br/>Only PDF allowed
        Note over Student: ● END
    else File is PDF
        Frontend->>Frontend: Validate File Size

        alt Size > 10MB
            Frontend->>Student: Display Error:<br/>File too large
            Note over Student: ● END
        else Size OK
            Frontend->>Backend: POST /api/reports/upload<br/>(multipart/form-data)
            Backend->>Backend: Receive Upload Request
            Backend->>Cloudinary: Upload PDF to Cloudinary
            Cloudinary->>Cloudinary: Store PDF File
            Cloudinary-->>Backend: Return secure_url & public_id
            Backend->>Backend: Save Report Metadata
            Backend->>Database: INSERT INTO reports<br/>(eventId, filePath, cloudinary_id)
            Database-->>Backend: Success
            Backend->>Frontend: Return 201 Created
            Frontend->>Student: Display Success
            Note over Student: ● END
        end
    end
```

---

## Edit Event Flow (Swimlane Style)

```mermaid
sequenceDiagram
    Note over Admin,Database: ● START

    Admin->>Admin: Navigate to Calendar
    Admin->>Frontend: Request Calendar

    Frontend->>Backend: GET /api/events
    Backend->>Backend: Query All Events
    Backend->>Database: SELECT * FROM events
    Database-->>Backend: Return Events
    Backend->>Frontend: Return Events
    Frontend->>Admin: Display Calendar

    Admin->>Admin: View Events on Calendar
    Admin->>Frontend: Click Event to View Details
    Frontend->>Admin: Show Event Details Modal

    Admin->>Frontend: Click Edit Button
    Frontend->>Admin: Show Edit Form (Pre-filled Data)

    Admin->>Admin: View Edit Form
    Admin->>Admin: Modify Event:<br/>Name, Dates, Venues, Equipment
    Admin->>Frontend: Submit Changes

    Frontend->>Frontend: Validate Fields

    alt Fields Invalid
        Frontend->>Admin: Display Error
        Note over Admin: ● END
    else Fields Valid
        Frontend->>Backend: PUT /api/events/:id
        Backend->>Backend: Receive Update Request
        Backend->>Backend: Check Admin Authentication

        alt Not Authenticated
            Backend->>Frontend: Show Auth Error
            Frontend->>Admin: Display Auth Error
            Note over Admin: ● END
        else Authenticated
            Backend->>Backend: Update Event
            Backend->>Database: UPDATE events SET<br/>name=?, dates=?...<br/>WHERE id=?
            Database-->>Backend: Success
            Backend->>Backend: Fetch Updated Event Data
            Backend->>Database: SELECT * WHERE id=?
            Database-->>Backend: Return Updated Event
            Backend->>Frontend: Return 200 OK
            Frontend->>Frontend: Refresh Calendar
            Frontend->>Admin: Display Success
            Note over Admin: ● END
        end
    end
```

---

## Delete Event Flow (Swimlane Style)

```mermaid
sequenceDiagram
    Note over Admin,Database: ● START

    Admin->>Admin: Navigate to Calendar
    Admin->>Frontend: Request Calendar

    Frontend->>Backend: GET /api/events
    Backend->>Backend: Query All Events
    Backend->>Database: SELECT * FROM events
    Database-->>Backend: Return Events
    Backend->>Frontend: Return Events
    Frontend->>Admin: Display Calendar

    Admin->>Admin: View Events on Calendar
    Admin->>Frontend: Click Event
    Frontend->>Admin: Show Event Details Modal

    Admin->>Frontend: Click Delete Button
    Frontend->>Admin: Show Confirmation Modal

    Admin->>Admin: View Confirmation:<br/>"Are you sure?"

    alt Confirm: No
        Admin->>Admin: Cancel
        Note over Admin: ● END
    else Confirm: Yes
        Admin->>Frontend: Confirm Deletion
        Frontend->>Backend: DELETE /api/events/:id
        Backend->>Backend: Receive Delete Request
        Backend->>Backend: Check Admin Authentication

        alt Not Authenticated
            Backend->>Frontend: Show Auth Error
            Frontend->>Admin: Display Auth Error
            Note over Admin: ● END
        else Authenticated
            Backend->>Backend: Cascade Delete Process
            Backend->>Database: DELETE FROM reports<br/>WHERE eventId=?
            Database-->>Backend: Success
            Backend->>Database: DELETE FROM notifications<br/>WHERE eventId=?
            Database-->>Backend: Success
            Backend->>Database: DELETE FROM events<br/>WHERE id=?
            Database-->>Backend: Success
            Backend->>Frontend: Return 200 OK
            Frontend->>Frontend: Refresh Calendar
            Frontend->>Admin: Display Success:<br/>Event Deleted
            Note over Admin: ● END
        end
    end
```

---

## Add Resource/Venue/Task Flow (Swimlane Style - Combined)

```mermaid
sequenceDiagram
    Note over Admin,Database: ● START

    Admin->>Admin: Navigate to Resources/Dashboard
    Admin->>Frontend: Request List

    Frontend->>Backend: GET /api/resources<br/>or /api/venues<br/>or /api/tasks
    Backend->>Backend: Query List from Database
    Backend->>Database: SELECT * FROM table
    Database-->>Backend: Return List
    Backend->>Frontend: Return List
    Frontend->>Admin: Display List

    Admin->>Admin: View Resources/Venues/Tasks List
    Admin->>Frontend: Click Add Button
    Frontend->>Admin: Show Add Form

    Admin->>Admin: View Form
    Admin->>Admin: Fill Details:<br/>Name, Description, Category, etc.
    Admin->>Frontend: Submit Form

    Frontend->>Frontend: Validate Fields

    alt Fields Invalid
        Frontend->>Admin: Display Error
        Note over Admin: ● END
    else Fields Valid
        Frontend->>Backend: POST /api/resource<br/>or /api/venue<br/>or /api/task
        Backend->>Backend: Receive POST Request
        Backend->>Backend: Check Admin Authentication

        alt Not Authenticated
            Backend->>Frontend: Show Auth Error
            Frontend->>Admin: Display Auth Error
            Note over Admin: ● END
        else Authenticated
            Backend->>Backend: Save Record
            Backend->>Database: INSERT INTO<br/>resources/venues/tasks
            Database-->>Backend: Success
            Backend->>Frontend: Return 201 Created
            Frontend->>Frontend: Refresh List
            Frontend->>Admin: Display Success
            Note over Admin: ● END
        end
    end
```

---

## Update Task Status Flow (Swimlane Style)

```mermaid
sequenceDiagram
    Note over Admin,Database: ● START

    Admin->>Frontend: Request Dashboard
    Frontend->>Backend: GET /api/tasks
    Backend->>Backend: Query Today's Tasks
    Backend->>Database: SELECT * FROM tasks<br/>WHERE due_date=?
    Database-->>Backend: Return Tasks
    Backend->>Frontend: Return Tasks
    Frontend->>Admin: Display Tasks Widget

    Admin->>Admin: View Tasks on Dashboard
    Admin->>Frontend: Click Task Checkbox

    Frontend->>Frontend: Toggle Checkbox UI
    Frontend->>Backend: PUT /api/tasks/:id<br/>{completed: toggle}
    Backend->>Backend: Receive Update Request
    Backend->>Backend: Check Admin Authentication

    alt Not Authenticated
        Backend->>Frontend: Show Auth Error
        Frontend->>Admin: Display Auth Error
        Note over Admin: ● END
    else Authenticated
        Backend->>Backend: Toggle completed Status
        Backend->>Database: UPDATE tasks<br/>SET completed=?<br/>WHERE id=?
        Database-->>Backend: Success
        Backend->>Frontend: Return 200 OK
        Frontend->>Frontend: Update UI State
        Frontend->>Admin: Visual Feedback:<br/>Checked/Unchecked
        Note over Admin: ● END
    end
```

---

## Add New Admin Flow (Swimlane Style)

```mermaid
sequenceDiagram
    Note over SuperAdmin,Database: ● START

    SuperAdmin->>SuperAdmin: Navigate to Admin Management
    SuperAdmin->>Frontend: Request Admin Management

    Frontend->>Backend: GET /api/admins
    Backend->>Backend: Query Admins
    Backend->>Database: SELECT * FROM users<br/>WHERE role='admin'
    Database-->>Backend: Return Admin List
    Backend->>Frontend: Return Admin List
    Frontend->>SuperAdmin: Display Admin List

    SuperAdmin->>SuperAdmin: View Admin List
    SuperAdmin->>Frontend: Click Add Admin
    Frontend->>SuperAdmin: Show Add Form

    SuperAdmin->>SuperAdmin: View Add Form
    SuperAdmin->>SuperAdmin: Fill Details:<br/>Name, Email, Password
    SuperAdmin->>Frontend: Submit Form

    Frontend->>Frontend: Validate Fields

    alt Fields Invalid
        Frontend->>SuperAdmin: Display Error
        Note over SuperAdmin: ● END
    else Fields Valid
        Frontend->>Backend: POST /api/admins
        Backend->>Backend: Receive POST Request
        Backend->>Backend: Check Super Admin Authentication

        alt Not Super Admin
            Backend->>Frontend: Show Auth Error
            Frontend->>SuperAdmin: Display Auth Error:<br/>Not Super Admin
            Note over SuperAdmin: ● END
        else Super Admin
            Backend->>Backend: Hash Password
            Backend->>Backend: Check Email Exists
            Backend->>Database: SELECT COUNT(*)<br/>WHERE email=?
            Database-->>Backend: Return Count

            alt Email Already Exists
                Backend->>Frontend: Email Exists Error
                Frontend->>SuperAdmin: Display Error:<br/>Email Already Exists
                Note over SuperAdmin: ● END
            else Email Available
                Backend->>Backend: Save New Admin
                Backend->>Database: INSERT INTO users<br/>(name, email, password, role='admin')
                Database-->>Backend: Success
                Backend->>Frontend: Return 201 Created
                Frontend->>Frontend: Refresh Admin List
                Frontend->>SuperAdmin: Display Success
                Note over SuperAdmin: ● END
            end
        end
    end
```

---

# PlantUML Activity Diagrams (Swimlane Style)

## How to View PlantUML Diagrams

1. Go to http://www.plantuml.com/plantuml/uml/
2. Copy the code below
3. Paste it in the editor
4. View or download as PNG/SVG

---

## Event Creation & Approval (PlantUML)

```plantuml
@startuml Event_Creation_Approval
|Student|
start
:Click Add Event;
:Fill Event Form;
:Submit Form;

|Frontend|
if (Valid?) then (no)
  |Student|
  :Show Error;
  stop
else (yes)
  :Send to Server;

  |Backend|
  if (Logged In?) then (no)
    |Student|
    :Show Auth Error;
    stop
  else (yes)
    :Get Request;

    |Database|
    :Save Event
    (pending);

    |Backend|
    :Create Alert;

    |Database|
    :Save Alert;

    |Backend|
    :Success Response;

    |Frontend|
    :Show Success;

    |Student|
    :See Success Message;
  endif
endif

:Wait for Admin;

|Admin|
fork
  :Go to Alerts;
  :View Pending Events;
  :Click Event;
  :Review Details;

  if (Decision?) then (Approve)
    :Click Approve;

    |Backend|
    :Process Approval;

    |Database|
    :Update Event
    (approved);

    |Backend|
    :Create Alert
    for Other Admins;

    |Database|
    :Save Alert;

    |Backend|
    fork
      |Other Admin|
      :Get Alert;
      :See Message;
      stop
    fork again
      |Admin|
      :See Success;
      stop
    end fork

  else (Decline)
    :Click Decline;

    |Backend|
    :Process Decline;

    |Database|
    :Update Event
    (declined);

    |Admin|
    :See Success;
    stop
  endif
end fork

@enduml
```

---

## Report Upload Flow (PlantUML)

```plantuml
@startuml Report_Upload
|Student|
start
:Go to Reports Page;

|Frontend|
:Load Approved Events;

|Backend|
:Get Events;

|Database|
:Fetch Approved Events;

|Backend|
:Send Events List;

|Frontend|
:Show Event List;

|Student|
:See Event List;
:Select Event;
:Choose PDF File;
:Click Upload;

|Frontend|
if (PDF File?) then (no)
  |Student|
  :Show Error:
  Only PDF allowed;
  stop
else (yes)
  if (Size OK?) then (no)
    |Student|
    :Show Error:
    File too large;
    stop
  else (yes)
    :Send File to Server;

    |Backend|
    :Get File;
    :Upload to Cloud;

    |Cloudinary|
    :Store File;
    :Return File Link;

    |Backend|
    :Save Report Info;

    |Database|
    :Save Report;

    |Backend|
    :Success Response;

    |Frontend|
    :Show Success;

    |Student|
    :See Success Message;
    stop
  endif
endif

@enduml
```

---

## Edit Event Flow (PlantUML)

```plantuml
@startuml Edit_Event
|Admin|
start
:Go to Calendar;

|Frontend|
:Load Events;

|Backend|
:Get All Events;

|Database|
:Fetch All Events;

|Backend|
:Send Events;

|Frontend|
:Show Calendar;

|Admin|
:View Calendar;
:Click Event;

|Frontend|
:Show Event Details;

|Admin|
:Click Edit;

|Frontend|
:Show Edit Form;

|Admin|
:View Form;
:Change Details;
:Submit Changes;

|Frontend|
if (Valid?) then (no)
  |Admin|
  :Show Error;
  stop
else (yes)
  :Send Changes;

  |Backend|
  :Get Changes;

  if (Logged In?) then (no)
    |Admin|
    :Show Auth Error;
    stop
  else (yes)
    :Update Event;

    |Database|
    :Save Changes;

    |Backend|
    :Get Updated Event;

    |Database|
    :Fetch Updated Event;

    |Backend|
    :Success Response;

    |Frontend|
    :Refresh Calendar;

    |Admin|
    :See Success;
    stop
  endif
endif

@enduml
```

---

## Delete Event Flow (PlantUML)

```plantuml
@startuml Delete_Event
|Admin|
start
:Go to Calendar;

|Frontend|
:Load Events;

|Backend|
:Get All Events;

|Database|
:Fetch All Events;

|Backend|
:Send Events;

|Frontend|
:Show Calendar;

|Admin|
:View Calendar;
:Click Event;

|Frontend|
:Show Event Details;

|Admin|
:Click Delete;

|Frontend|
:Show Confirmation;

|Admin|
:See Confirmation:
"Are you sure?";

if (Confirm?) then (no)
  :Cancel;
  stop
else (yes)
  |Frontend|
  :Send Delete Request;

  |Backend|
  :Get Delete Request;

  if (Logged In?) then (no)
    |Admin|
    :Show Auth Error;
    stop
  else (yes)
    :Delete Process;

    |Database|
    :Delete Reports;
    :Delete Alerts;
    :Delete Event;

    |Backend|
    :Success Response;

    |Frontend|
    :Refresh Calendar;

    |Admin|
    :See Success:
    Event Deleted;
    stop
  endif
endif

@enduml
```

---

## Add Resource/Venue/Task Flow (PlantUML)

```plantuml
@startuml Add_Resource_Venue_Task
|Admin|
start
:Go to Resources Page;

|Frontend|
:Load List;

|Backend|
:Get List;

|Database|
:Fetch List;

|Backend|
:Send List;

|Frontend|
:Show List;

|Admin|
:View List;
:Click Add;

|Frontend|
:Show Add Form;

|Admin|
:View Form;
:Fill Details;
:Submit Form;

|Frontend|
if (Valid?) then (no)
  |Admin|
  :Show Error;
  stop
else (yes)
  :Send to Server;

  |Backend|
  :Get Request;

  if (Logged In?) then (no)
    |Admin|
    :Show Auth Error;
    stop
  else (yes)
    :Save Item;

    |Database|
    :Save to Database;

    |Backend|
    :Success Response;

    |Frontend|
    :Refresh List;

    |Admin|
    :See Success;
    stop
  endif
endif

@enduml
```

---

## Update Task Status Flow (PlantUML)

```plantuml
@startuml Update_Task_Status
|Admin|
start

|Frontend|
:Load Tasks;

|Backend|
:Get Today's Tasks;

|Database|
:Fetch Tasks;

|Backend|
:Send Tasks;

|Frontend|
:Show Tasks;

|Admin|
:View Tasks;
:Click Checkbox;

|Frontend|
:Toggle Checkbox;
:Send Update;

|Backend|
:Get Update Request;

if (Logged In?) then (no)
  |Admin|
  :Show Auth Error;
  stop
else (yes)
  :Update Task;

  |Database|
  :Save Status Change;

  |Backend|
  :Success Response;

  |Frontend|
  :Update Display;

  |Admin|
  :See Change;
  stop
endif

@enduml
```

---

## Add New Admin Flow (PlantUML)

```plantuml
@startuml Add_New_Admin
|Super Admin|
start
:Go to Admin Management;

|Frontend|
:Load Admin List;

|Backend|
:Get Admin List;

|Database|
:Fetch Admins;

|Backend|
:Send Admin List;

|Frontend|
:Show Admin List;

|Super Admin|
:View Admin List;
:Click Add Admin;

|Frontend|
:Show Add Form;

|Super Admin|
:View Form;
:Fill Details:
Name, Email, Password;
:Submit Form;

|Frontend|
if (Valid?) then (no)
  |Super Admin|
  :Show Error;
  stop
else (yes)
  :Send to Server;

  |Backend|
  :Get Request;

  if (Super Admin?) then (no)
    |Super Admin|
    :Show Auth Error;
    stop
  else (yes)
    :Hash Password;
    :Check Email;

    |Database|
    :Check Email Exists;

    |Backend|
    if (Email Exists?) then (yes)
      |Super Admin|
      :Show Error:
      Email Already Exists;
      stop
    else (no)
      :Save New Admin;

      |Database|
      :Save to Database;

      |Backend|
      :Success Response;

      |Frontend|
      :Refresh Admin List;

      |Super Admin|
      :See Success;
      stop
    endif
  endif
endif

@enduml
```

---

## Notes

### Diagram Formats Available

This document provides **TWO versions** of each activity diagram:

1. **Mermaid Format** (above)
   - Modern, GitHub-compatible
   - Renders in markdown viewers
   - View at: https://mermaid.live/

2. **PlantUML Format** (just added)
   - Traditional UML syntax
   - Better swimlane rendering (like the ATM example)
   - View at: http://www.plantuml.com/plantuml/uml/

---

### Mermaid Diagrams

**Features:**
- ✅ Uses sequence diagram syntax for proper vertical swimlanes
- ✅ Native swimlane support with actors and participants
- ✅ Modern syntax, GitHub-compatible
- ✅ Good for web documentation
- ✅ Renders similar to traditional UML Activity Diagrams with swimlanes

**Diagram Elements:**
- **Initial Node**: `Note over Actor1,ActorN: ● START`
- **Final Node**: `Note over Actor: ● END`
- **Actions**: Messages between actors (`Actor->>Actor: Action`)
- **Decision Nodes**: `alt` and `else` blocks for branching logic
- **Control Flow**: Solid arrows (`->>`) and dashed return arrows (`-->>`)
- **Fork/Join Nodes**: Represented by `Note over Actor: ==== FORK ====` and `Note over Actor: ==== JOIN ====`
- **Parallel Execution**: `par` blocks with `and` separators
- **Guard Conditions**: `[condition]` in alt labels
- **Partitions/Swimlanes**: Actors and participants (Student, Admin, Frontend, Backend, Database, etc.)

**Key Advantages:**
- Proper vertical swimlane layout (like ATM example)
- Clear separation of actors/systems
- Better visualization of cross-system communication
- Activity diagram logic with sequence diagram presentation

---

### PlantUML Diagrams

**Features:**
- ✅ Native swimlane support with `|SwimlaneNamehere|` syntax
- ✅ Proper UML Activity Diagram notation
- ✅ Renders exactly like the ATM example provided
- ✅ Better for formal documentation
- ✅ Professional appearance

**Diagram Elements:**
- **start**: Initial node (filled circle)
- **stop**: Final node (filled circle)
- **:Action;**: Activity/action (rounded rectangle)
- **if-then-else-endif**: Decision nodes (diamond)
- **fork-fork again-end fork**: Fork/Join nodes (synchronization bars)
- **|Swimlane|**: Partition/Swimlane declaration
- Guard conditions automatically shown on decision branches

**Syntax Highlights:**
```plantuml
|Actor Name|        ← Declares a swimlane
start                ← Initial node
:Action Text;        ← Action/Activity
if (condition?) then (yes)  ← Decision node
  :Action;
else (no)
  :Other Action;
endif
fork                 ← Fork node
  :Parallel Action 1;
fork again
  :Parallel Action 2;
end fork            ← Join node
stop                 ← Final node
```

---

### Swimlanes Used

Both formats include these partitions:

1. **👤 STUDENT/ADMIN** - User actions
2. **💻 FRONTEND** - Client-side processing
3. **⚙️ BACKEND** - Server-side processing
4. **🗄️ DATABASE** - Data persistence layer
5. **☁️ CLOUDINARY** - External cloud service (Report Upload only)
6. **👨‍💼 OTHER ADMIN** - Secondary actors (Event Approval only)

---

### Activity Diagrams Created

**Total: 7 Activity Diagrams** (each in both Mermaid and PlantUML format)

1. **Event Creation & Approval** - Student creates event, Admin approves/declines
2. **Report Upload Flow** - Student uploads PDF report with Cloudinary integration
3. **Edit Event Flow** - Admin modifies existing event details
4. **Delete Event Flow** - Admin deletes event with cascade deletion
5. **Add Resource/Venue/Task Flow** - Admin creates new resources, venues, or tasks
6. **Update Task Status Flow** - Admin toggles task completion status
7. **Add New Admin Flow** - Super Admin adds new admin user with email validation

---

### Alignment with System Sequence Diagrams (SSD)

✅ All activity diagrams follow the same flow as their corresponding sequence diagrams
✅ API endpoints match between activity and sequence diagrams
✅ Authentication checks are consistent across both diagram types
✅ Database operations align with sequence diagram interactions
✅ Same guard conditions and decision logic

---

### How to Use

**For Mermaid Diagrams:**
1. Copy any diagram code from the `mermaid` blocks
2. Paste into https://mermaid.live/
3. View, edit, and export as PNG/SVG
4. Use for web documentation, GitHub README files
5. **NEW**: Now uses sequence diagram syntax for proper vertical swimlane layout (like ATM example)

**For PlantUML Diagrams:**
1. Copy any diagram code from the `plantuml` blocks
2. Paste into http://www.plantuml.com/plantuml/uml/
3. View, edit, and export as PNG/SVG
4. Use for formal documentation, academic papers, presentations
5. Uses native UML activity diagram notation with vertical swimlanes

**Tip**: Both Mermaid and PlantUML diagrams now render with proper vertical swimlanes similar to the ATM example! Mermaid uses sequence diagram syntax to achieve this layout while maintaining activity diagram logic.
