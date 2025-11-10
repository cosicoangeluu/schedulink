# ScheduleLink UML Diagrams

This directory contains comprehensive UML diagrams for the ScheduleLink Event Management System.

## 📋 Contents

### 1. Use Case Diagram
**File:** [use-case-diagram.md](use-case-diagram.md)

**Description:** Shows all actors and their interactions with the system

**Actors:**
- Admin (Primary Administrator)
- Student/Department Head
- Other Admin (View-Only)
- System (Automated processes)

**Total Use Cases:** 27 use cases across 7 categories
- Authentication (2 use cases)
- Event Management (6 use cases)
- Notification Management (4 use cases)
- Resource Management (4 use cases)
- Report Management (4 use cases)
- Task Management (4 use cases)
- Dashboard & Analytics (3 use cases)

---

### 2. Activity Diagrams

#### 2.1 Event Creation & Approval Process
**File:** [activity-diagram-event-approval.md](activity-diagram-event-approval.md)

**Description:** Complete workflow from event creation by student to admin approval/decline

**Swimlanes:**
- Student/Admin
- Frontend
- Backend
- Admin
- SSE System
- Other-Admin

**Key Decision Points:**
- Fields valid?
- Authenticated?
- Approve or Decline?

**Parallel Activities:**
- SSE broadcast to Other-Admins
- Return success response to Admin

---

#### 2.2 Report Upload Process
**File:** [activity-diagram-report-upload.md](activity-diagram-report-upload.md)

**Description:** Workflow for students uploading narrative reports to Cloudinary

**Swimlanes:**
- Student
- Frontend
- Backend
- Database
- Cloudinary Storage

**Key Decision Points:**
- File is PDF?
- File size < 10MB?

**Parallel Activities:**
- Cloudinary upload
- Database preparation

---

### 3. System Sequence Diagrams (SSD)

#### 3.1 Event Creation & Approval
**File:** [sequence-diagram-event-approval.md](sequence-diagram-event-approval.md)

**Description:** Detailed message flow between system components for event approval workflow

**Participants:**
- Student/Admin
- Frontend
- Backend
- Database
- SSE System
- Other-Admin
- Admin

**Key Sequences:**
1. Event Creation Phase
2. Admin Review Phase
3. Approval Decision Phase (Approve/Decline)

**API Endpoints:**
- `POST /api/events` - Create event
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/approve` - Approve notification
- `PUT /api/notifications/:id/decline` - Decline notification

---

#### 3.2 Report Upload
**File:** [sequence-diagram-report-upload.md](sequence-diagram-report-upload.md)

**Description:** Detailed message flow for uploading PDF reports to Cloudinary

**Participants:**
- Student
- Frontend
- Backend
- Database
- Cloudinary

**Key Sequences:**
1. Load Approved Events
2. File Selection & Validation
3. File Upload
4. Backend Processing
5. Database Storage
6. Success Response

**API Endpoints:**
- `GET /api/events?status=approved` - Get approved events
- `POST /api/reports/upload` - Upload report

---

## 🎨 How to View the Diagrams

### Method 1: PlantUML Online Viewer
1. Copy the PlantUML code from any diagram file (between \`\`\`plantuml and \`\`\`)
2. Go to [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
3. Paste the code and click "Submit"
4. View or download the rendered diagram

### Method 2: VS Code Extension
1. Install the "PlantUML" extension in VS Code
2. Open any diagram markdown file
3. Press `Alt + D` to preview the diagram
4. Right-click → "Export Current Diagram" to save as PNG/SVG

### Method 3: IntelliJ IDEA / WebStorm
1. Install the "PlantUML Integration" plugin
2. Open any diagram markdown file
3. The diagram will render automatically in the preview pane

### Method 4: Local PlantUML Installation
```bash
# Install PlantUML (requires Java)
# Ubuntu/Debian
sudo apt-get install plantuml

# macOS
brew install plantuml

# Windows (using Chocolatey)
choco install plantuml

# Generate PNG from diagram
plantuml use-case-diagram.md
```

---

## 📊 Diagram Consistency

All diagrams are consistent with each other and reflect the actual codebase:

### Activity Diagram ↔ System Sequence Diagram Alignment

**Event Creation & Approval:**
- ✅ Same function names (`createEvent`, `approveNotification`)
- ✅ Same sequence of operations (validate → save → notify → broadcast)
- ✅ Same decision points (Valid?, Authenticated?, Approve?)
- ✅ Same data flows (eventId, token, status)
- ✅ Same external interactions (Database, SSE)

**Report Upload:**
- ✅ Same function names (`uploadReport`, `validateFile`)
- ✅ Same sequence (select event → validate → upload → save)
- ✅ Same decision points (isPDF?, fileSize < 10MB?)
- ✅ Same data flows (eventId, filePath, public_id)
- ✅ Same external interactions (Cloudinary, Database)

---

## 🔗 Mapping to Codebase

### Backend Files
- [server.js](../backend/server.js) - Main Express server setup
- [events.js](../backend/events.js) - Event CRUD operations
- [notifications.js](../backend/notifications.js) - Notification approval system
- [reports.js](../backend/reports.js) - Report upload with Cloudinary
- [auth.js](../backend/auth.js) - Admin authentication
- [sse.js](../backend/sse.js) - Real-time notifications

### Frontend Files
- [app/calendar/page.tsx](../app/calendar/page.tsx) - Calendar view
- [app/events/AddEventModal.tsx](../app/events/AddEventModal.tsx) - Event creation form
- [app/notifications/page.tsx](../app/notifications/page.tsx) - Notification approval UI
- [app/reports/page.tsx](../app/reports/page.tsx) - Report upload/management

### Database Schema
- [database_schema.sql](../backend/database_schema.sql) - Complete database structure

---

## 📝 Key Workflows

### 1. Event Status Workflow
```
pending → approved (visible to public)
        ↘ declined (hidden)
```

### 2. Notification Types
- `event_approval` - Requires admin action
- `event_approved` - Informational for Other-Admins
- `resource_booking` - Requires admin action

### 3. Authentication Flow
- **Admin:** JWT token (username/password)
- **Student/Other-Admin:** Role-based (no password)

### 4. Real-Time Communication
- **Protocol:** Server-Sent Events (SSE)
- **Endpoint:** `/api/sse`
- **Trigger:** Event approval
- **Recipients:** Other-Admin users

---

## 🎯 Use Cases

### Creating Use Case Diagram
Perfect for:
- Understanding system actors and their roles
- Identifying all system features
- Showing relationships between use cases
- Documenting system boundaries
- Planning new features

### Creating Activity Diagrams
Perfect for:
- Understanding business processes
- Identifying decision points
- Showing parallel activities
- Documenting swimlane responsibilities
- Training new developers

### Creating Sequence Diagrams
Perfect for:
- Understanding API interactions
- Documenting request/response flows
- Debugging issues
- Planning API changes
- System integration

---

## 📚 Additional Resources

### PlantUML Documentation
- [Official PlantUML Guide](https://plantuml.com/guide)
- [Use Case Diagrams](https://plantuml.com/use-case-diagram)
- [Activity Diagrams](https://plantuml.com/activity-diagram-beta)
- [Sequence Diagrams](https://plantuml.com/sequence-diagram)

### UML Resources
- [UML Use Case Diagrams](https://www.uml-diagrams.org/use-case-diagrams.html)
- [UML Activity Diagrams](https://www.uml-diagrams.org/activity-diagrams.html)
- [UML Sequence Diagrams](https://www.uml-diagrams.org/sequence-diagrams.html)

---

## ✅ Validation Checklist

Use this checklist to verify diagram accuracy:

- [ ] All actors match actual user roles in the system
- [ ] All use cases correspond to actual features
- [ ] API endpoints match backend routes
- [ ] Database operations match schema
- [ ] Activity diagram decision points match code logic
- [ ] Sequence diagram messages match API calls
- [ ] Status workflows match database enums
- [ ] Authentication flows match middleware
- [ ] SSE broadcasts match actual implementation

---

## 🔄 Keeping Diagrams Updated

When making code changes:

1. **New Feature Added:**
   - Add use case to Use Case Diagram
   - Create activity diagram for new workflow
   - Create sequence diagram for new API interactions

2. **API Endpoint Changed:**
   - Update sequence diagrams with new endpoint
   - Update activity diagrams if flow changed

3. **Database Schema Changed:**
   - Update sequence diagrams showing database operations
   - Update use case descriptions if entities changed

4. **Authentication Changed:**
   - Update use case diagram relationships
   - Update sequence diagrams showing auth flows

---

## 📞 Contact

For questions about these diagrams or the system:
- Review the [codebase](../README.md)
- Check the [database schema](../backend/database_schema.sql)
- Examine [API routes](../backend/server.js)

---

**Last Updated:** 2025-11-07
**Created for:** ScheduleLink Event Management System
**Diagram Format:** PlantUML
