# ScheduleLink System - Use Case Diagram

## Overview
ScheduleLink is an event management system for educational institutions that allows students to request events, admins to approve/manage them, and provides calendar viewing capabilities.

## Actors
- **Admin**: System administrator with full access to manage events, resources, and users
- **Student**: Department head or student who can create event requests and submit reports
- **Calendar Viewer**: User with limited access to view approved events and receive notifications
- **System**: Automated processes for notifications, caching, and file management

## Visual Use Case Diagram (PlantUML)

```
@startuml ScheduleLink Use Case Diagram

left to right direction

actor "Admin" as Admin
actor "Student" as Student
actor "Calendar Viewer" as CalendarViewer
actor "System" as System

rectangle "ScheduleLink System" {
  usecase "Login to System" as UC1
  usecase "Manage Events\n(Approve/Decline/Edit)" as UC2
  usecase "Manage Resources" as UC3
  usecase "Manage Venues" as UC4
  usecase "View Reports" as UC5
  usecase "Manage Tasks" as UC6
  usecase "View Dashboard Analytics" as UC7
  usecase "Manage Admin Accounts" as UC8

  usecase "Select Role" as UC9
  usecase "Create Event Request" as UC10
  usecase "Submit Narrative Reports" as UC11
  usecase "View Calendar" as UC12
  usecase "Receive Notifications" as UC13

  usecase "Send Real-time Notifications\n(SSE)" as UC14
  usecase "Cache API Responses\n(5min cache)" as UC15
  usecase "Authenticate Users\n(JWT validation)" as UC16
  usecase "Manage File Uploads\n(PDF storage/serving)" as UC17
}

' Admin relationships
Admin --> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC4
Admin --> UC5
Admin --> UC6
Admin --> UC7
Admin --> UC8

' Student relationships
Student --> UC9
Student --> UC10
Student --> UC11
Student --> UC12
Student --> UC13

' Calendar Viewer relationships
CalendarViewer --> UC9
CalendarViewer --> UC12
CalendarViewer --> UC13

' System relationships
System --> UC14
System --> UC15
System --> UC16
System --> UC17

' Include relationships
UC10 ..> UC17 : include
UC11 ..> UC12 : include

' Extend relationships
UC12 ..> UC13 : extend
UC8 ..> UC1 : extend

' Generalization
CalendarViewer --|> Student : generalization

@enduml
```

## Detailed Use Cases

### Admin Use Cases:
1. **Login to System**
   - Authenticate with username/password
   - Receive JWT token for session management

2. **Manage Events**
   - View all event requests (pending/approved/declined)
   - Approve event requests
   - Decline event requests
   - Edit event details
   - Delete events

3. **Manage Resources**
   - View all resources (equipment/materials)
   - Add new resources
   - Update resource information
   - Delete resources
   - Approve resource booking requests

4. **Manage Venues**
   - View all venues/facilities
   - Add new venues
   - Update venue information
   - Delete venues

5. **View Reports**
   - Access all uploaded narrative reports
   - Download PDF reports
   - Delete reports

6. **Manage Tasks**
   - Create personal/administrative tasks
   - View upcoming tasks
   - Mark tasks as completed
   - Delete tasks

7. **View Dashboard Analytics**
   - Monitor pending events count
   - View approved events statistics
   - Track system notifications

8. **Manage Admin Accounts**
   - View all admin users
   - Add new admin accounts
   - Update admin passwords
   - Delete admin accounts (except last admin)

### Student Use Cases:
1. **Select Role**
   - Choose between Student or Calendar Viewer role

2. **Create Event Request**
   - Fill event details (name, description, dates, venues, equipment)
   - Upload multi-day schedule if needed
   - Submit request for admin approval

3. **Submit Narrative Reports**
   - Select approved event
   - Upload PDF report
   - View upload confirmation

4. **View Calendar**
   - Browse approved events
   - View event details
   - Filter events by date

5. **Receive Notifications**
   - Get real-time updates on approved events
   - View notification history

### Calendar Viewer Use Cases:
1. **Select Role**
   - Choose Calendar Viewing role

2. **View Calendar**
   - Browse all approved events
   - View detailed event information
   - Navigate through different months

3. **Receive Notifications**
   - Get notified about newly approved events
   - View notification feed

### System Use Cases:
1. **Send Real-time Notifications**
   - Broadcast event approval notifications via SSE
   - Handle client connections/disconnections

2. **Cache API Responses**
   - Cache GET requests for 5 minutes
   - Clear cache on data modifications

3. **Authenticate Users**
   - Validate JWT tokens
   - Protect admin-only endpoints

4. **Manage File Uploads**
   - Store PDF reports securely
   - Serve uploaded files
   - Sync orphaned files with database

## Key System Flows

### Event Approval Flow:
1. Student → Create Event Request → System (status: pending)
2. System → Create Notification → Admin
3. Admin → Approve/Decline Event → System
4. System → Update Event Status → Send Notifications → Student/Calendar Viewer

### Report Submission Flow:
1. Student → Select Approved Event → Upload PDF → System
2. System → Store File → Admin can view/download

### Calendar Viewing Flow:
1. Calendar Viewer/Student → View Calendar → System returns approved events
2. System → Send real-time notifications on new approvals

## How to Generate the Visual Diagram

To create the visual diagram from the PlantUML code above:

1. **Online Tools:**
   - Visit https://www.plantuml.com/plantuml
   - Copy and paste the PlantUML code between `@startuml` and `@enduml`
   - The diagram will render automatically

2. **VS Code Extension:**
   - Install the "PlantUML" extension
   - Create a new file with `.puml` or `.plantuml` extension
   - Paste the code and it will preview the diagram

3. **Command Line:**
   - Install PlantUML: `choco install plantuml` (Windows) or `brew install plantuml` (Mac)
   - Save the code to a `.puml` file
   - Run: `plantuml diagram.puml` to generate PNG/SVG

The visual diagram will show:
- Actors on the left (Admin, Student, Calendar Viewer, System)
- Use cases in the central rectangle
- Lines connecting actors to their use cases
- Include/extend relationships between use cases
- Generalization relationship between Calendar Viewer and Student
