# Research Paradigm and Conceptual Framework
## Web-Based Event Coordination and Resource Management System
### Manuel S. Enverga University Foundation Candelaria Inc.

---

## I. INTRODUCTION

This conceptual framework presents the theoretical foundation, system architecture, and interconnected components of the ScheduleLink system - a comprehensive web-based event coordination and resource management platform designed for Manuel S. Enverga University Foundation Candelaria Inc.

---

## II. RESEARCH PARADIGM

### A. Input-Process-Output (IPO) Model

The ScheduleLink system follows the Input-Process-Output paradigm, which provides a structured approach to understanding how the system transforms user requirements into meaningful outcomes.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                               INPUT PHASE                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. USER INPUTS                                                              │
│     • Event Requests (Date, Venue, Type, Participants)                       │
│     • Resource Booking Requests (Equipment, Facilities)                      │
│     • Event Reports & Feedback (PDF uploads)                                 │
│     • Task Management Data (To-Do Lists, Deadlines)                          │
│     • User Authentication Credentials                                        │
│                                                                              │
│  2. SYSTEM REQUIREMENTS                                                      │
│     • Multi-role Access Control (Admin, Student, Calendar Viewer)            │
│     • Real-time Notification Needs                                           │
│     • Conflict Prevention Requirements                                       │
│     • Data Security & Privacy Standards                                      │
│     • Accessibility & Usability Standards                                    │
│                                                                              │
│  3. INSTITUTIONAL DATA                                                       │
│     • Venue Availability (Gymnasium, Sports Areas)                           │
│     • Resource Inventory (Equipment, Utilities)                              │
│     • Academic Calendar Constraints                                          │
│     • Historical Event Data                                                  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                              PROCESS PHASE                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CORE SYSTEM MODULES:                                                        │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ 1. AUTHENTICATION & AUTHORIZATION ENGINE                         │       │
│  │    • Secure Login (bcrypt password hashing)                      │       │
│  │    • Role-Based Access Control (RBAC)                            │       │
│  │    • Session Management                                          │       │
│  │    • Multi-user Administration                                   │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                      ↓                                       │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ 2. EVENT SCHEDULING & MANAGEMENT SYSTEM                          │       │
│  │    • Event CRUD Operations (Create, Read, Update, Delete)        │       │
│  │    • Venue Assignment & Conflict Detection                       │       │
│  │    • Approval Workflow (Pending → Approved/Declined)             │       │
│  │    • Calendar Integration                                        │       │
│  │    • Event Status Tracking                                       │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                      ↓                                       │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ 3. RESOURCE MANAGEMENT MODULE                                    │       │
│  │    • Venue Booking System                                        │       │
│  │    • Equipment & Utility Tracking                                │       │
│  │    • Availability Status Management                              │       │
│  │    • Resource Analytics & Reporting                              │       │
│  │    • Category-based Resource Organization                        │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                      ↓                                       │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ 4. NOTIFICATION & COMMUNICATION SYSTEM                           │       │
│  │    • Real-time Event Notifications (SSE)                         │       │
│  │    • Status Update Alerts                                        │       │
│  │    • Multi-user Broadcasting                                     │       │
│  │    • Event Approval Announcements                                │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                      ↓                                       │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ 5. REPORTING & ANALYTICS ENGINE                                  │       │
│  │    • Event Report Uploads (PDF)                                  │       │
│  │    • Attendance Tracking                                         │       │
│  │    • Feedback Collection                                         │       │
│  │    • Report-Event Linkage                                        │       │
│  │    • Historical Data Analysis                                    │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                      ↓                                       │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ 6. TASK MANAGEMENT SYSTEM                                        │       │
│  │    • To-Do List Creation                                         │       │
│  │    • Due Date & Time Management                                  │       │
│  │    • Priority Setting                                            │       │
│  │    • Task Completion Tracking                                    │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                      ↓                                       │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ 7. CALENDAR VISUALIZATION SYSTEM                                 │       │
│  │    • Multi-view Display (Daily/Weekly/Monthly)                   │       │
│  │    • Color-coded Events                                          │       │
│  │    • Interactive Event Details                                   │       │
│  │    • Export Functionality                                        │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                      ↓                                       │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ 8. DATABASE MANAGEMENT LAYER (MySQL)                             │       │
│  │    • User Data Storage                                           │       │
│  │    • Event Records Management                                    │       │
│  │    • Resource Inventory Database                                 │       │
│  │    • Relational Data Integrity (Foreign Keys)                    │       │
│  │    • Transaction Management                                      │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                      ↓                                       │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ 9. SECURITY & PERFORMANCE LAYER                                  │       │
│  │    • API Rate Limiting                                           │       │
│  │    • Request Caching (5-min GET cache)                           │       │
│  │    • CORS Configuration                                          │       │
│  │    • SQL Injection Prevention                                    │       │
│  │    • File Upload Security                                        │       │
│  │    • Cache Invalidation                                          │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OUTPUT PHASE                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. OPERATIONAL OUTCOMES                                                     │
│     • Successfully Scheduled Events                                          │
│     • Conflict-free Resource Allocation                                      │
│     • Real-time Event Calendar                                               │
│     • Approved/Declined Event Notifications                                  │
│     • Completed Tasks & To-Do Lists                                          │
│                                                                              │
│  2. INFORMATIONAL OUTPUTS                                                    │
│     • Event Reports & Documentation (PDF)                                    │
│     • Attendance Records                                                     │
│     • Resource Utilization Analytics                                         │
│     • Feedback Summaries                                                     │
│     • Historical Event Data                                                  │
│                                                                              │
│  3. USER EXPERIENCE OUTCOMES                                                 │
│     • Intuitive Dashboard Views (Role-specific)                              │
│     • Responsive Interface (Desktop/Mobile)                                  │
│     • Accessible Features for All Users                                      │
│     • Real-time Status Updates                                               │
│                                                                              │
│  4. ADMINISTRATIVE OUTCOMES                                                  │
│     • Streamlined Event Approval Workflow                                    │
│     • Efficient Resource Management                                          │
│     • Reduced Scheduling Conflicts                                           │
│     • Improved Communication                                                 │
│     • Data-driven Decision Making                                            │
│                                                                              │
│  5. INSTITUTIONAL BENEFITS                                                   │
│     • Improved Event Coordination                                            │
│     • Optimized Resource Utilization                                         │
│     • Enhanced Transparency                                                  │
│     • Better Record Keeping                                                  │
│     • Increased Operational Efficiency                                       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## III. CONCEPTUAL FRAMEWORK

### A. System Architecture Model

The ScheduleLink system is built on a **three-tier architecture** with clear separation of concerns:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER (Tier 1)                       │
│                          Frontend - Next.js 14                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐              │
│  │ Admin         │  │ Student/Dept  │  │ Calendar      │              │
│  │ Dashboard     │  │ Head View     │  │ Viewer        │              │
│  └───────────────┘  └───────────────┘  └───────────────┘              │
│           │                  │                   │                      │
│           └──────────────────┴───────────────────┘                      │
│                              │                                          │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │ React Components (TypeScript)                            │          │
│  │ • Event Management Forms                                 │          │
│  │ • Resource Booking Interface                             │          │
│  │ • Calendar Views                                         │          │
│  │ • Task Lists                                             │          │
│  │ • Notification Center                                    │          │
│  │ • Report Upload Interface                                │          │
│  └──────────────────────────────────────────────────────────┘          │
│                              │                                          │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │ Styling & UI Framework (Tailwind CSS)                    │          │
│  │ • Responsive Design                                      │          │
│  │ • Accessibility Features                                 │          │
│  └──────────────────────────────────────────────────────────┘          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST API ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER (Tier 2)                          │
│                    Backend - Node.js + Express.js                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │ API ENDPOINTS & ROUTING                                  │          │
│  │ • /api/auth/*     - Authentication                       │          │
│  │ • /api/events/*   - Event Management                     │          │
│  │ • /api/resources/* - Resource Management                 │          │
│  │ • /api/reports/*  - Report Handling                      │          │
│  │ • /api/tasks/*    - Task Management                      │          │
│  │ • /api/notifications/* - SSE Notifications               │          │
│  └──────────────────────────────────────────────────────────┘          │
│                              │                                          │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │ BUSINESS LOGIC LAYER                                     │          │
│  │ • Event Scheduling Logic                                 │          │
│  │ • Conflict Detection Algorithm                           │          │
│  │ • Approval Workflow Engine                               │          │
│  │ • Resource Allocation Logic                              │          │
│  │ • Notification Queue Management                          │          │
│  └──────────────────────────────────────────────────────────┘          │
│                              │                                          │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │ MIDDLEWARE LAYER                                         │          │
│  │ • Authentication Middleware (JWT/Session)                │          │
│  │ • Authorization Middleware (RBAC)                        │          │
│  │ • Rate Limiting (API throttling)                         │          │
│  │ • Cache Management (5-min GET cache)                     │          │
│  │ • Error Handling                                         │          │
│  │ • File Upload Handler (Multer)                           │          │
│  │ • CORS Policy Enforcement                                │          │
│  └──────────────────────────────────────────────────────────┘          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                              ↓ SQL Queries ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER (Tier 3)                             │
│                          MySQL Database                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   users     │  │   events    │  │  resources  │  │   reports   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│         │                  │                │                 │         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │notifications│  │    tasks    │  │   venues    │  │event_users  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                          │
│  Features:                                                               │
│  • Relational Data Integrity (Foreign Keys)                             │
│  • ACID Transaction Support                                             │
│  • Indexed Queries for Performance                                      │
│  • Data Validation Constraints                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### B. Core System Components & Interactions

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          SCHEDULINK SYSTEM                                │
│                     Core Components & Data Flow                           │
└───────────────────────────────────────────────────────────────────────────┘

       ┌───────────────────────────────────────────────────┐
       │                                                   │
       │           USER AUTHENTICATION MODULE              │
       │                                                   │
       │  • Secure Login (bcrypt hashing)                  │
       │  • Role Assignment (Admin/Student/Viewer)         │
       │  • Session Management                             │
       │  • Password Reset/Update                          │
       │                                                   │
       └───────────────────┬───────────────────────────────┘
                           │
                           ↓
       ┌────────────────────────────────────────────────────┐
       │                                                    │
       │         ROLE-BASED ACCESS CONTROL (RBAC)          │
       │                                                    │
       └──┬─────────────────┬───────────────────┬───────────┘
          │                 │                   │
          ↓                 ↓                   ↓
   ┌──────────┐      ┌──────────┐       ┌──────────┐
   │  ADMIN   │      │ STUDENT/ │       │ CALENDAR │
   │  ROLE    │      │ DEPT HEAD│       │  VIEWER  │
   └────┬─────┘      └────┬─────┘       └────┬─────┘
        │                 │                   │
        │                 │                   │
        ↓                 ↓                   ↓
┌────────────────────────────────────────────────────────┐
│                                                        │
│  EVENT SCHEDULING & MANAGEMENT SYSTEM                  │
│  ┌───────────────────────────────────────────────┐    │
│  │                                               │    │
│  │  EVENT LIFECYCLE WORKFLOW:                    │    │
│  │                                               │    │
│  │  1. Event Creation                            │    │
│  │     ↓                                         │    │
│  │  2. Venue & Resource Selection                │    │
│  │     ↓                                         │    │
│  │  3. Conflict Detection Check                  │    │
│  │     ↓                                         │    │
│  │  4. Submission (Status: Pending)              │    │
│  │     ↓                                         │    │
│  │  5. Admin Review & Approval                   │    │
│  │     ↓                                         │     │
│  │  6. Status Update (Approved/Declined)         │     │
│  │     ↓                                         │     │
│  │  7. Notification Broadcast                    │     │
│  │     ↓                                         │     │
│  │  8. Calendar Publication                      │     │
│  │                                               │     │
│  └───────────────────────────────────────────────┘     │
│                                                        │
└────────────┬───────────────────────┬───────────────────┘
             │                       │
             ↓                       ↓
┌─────────────────────┐   ┌─────────────────────┐
│  RESOURCE           │   │  NOTIFICATION       │
│  MANAGEMENT         │   │  SYSTEM             │
│                     │   │                     │
│  • Venue Booking    │   │  • Real-time SSE    │
│  • Equipment Track  │   │  • Status Alerts    │
│  • Availability     │   │  • Broadcasting     │
│  • Analytics        │   │  • Event Approvals  │
│                     │   │                     │
└──────┬──────────────┘   └──────────┬──────────┘
       │                              │
       └──────────┬───────────────────┘
                  │
                  ↓
       ┌──────────────────────────┐
       │  CALENDAR SYSTEM         │
       │                          │
       │  • Display Events        │
       │  • Multiple Views        │
       │  • Color Coding          │
       │  • Export Data           │
       │                          │
       └────────┬─────────────────┘
                │
                ↓
       ┌──────────────────────────┐
       │  REPORTING & ANALYTICS   │
       │                          │
       │  • Report Upload         │
       │  • Attendance Tracking   │
       │  • Feedback Collection   │
       │  • Historical Data       │
       │                          │
       └──────────────────────────┘
```

---

## IV. THEORETICAL FOUNDATIONS

### A. Software Engineering Principles

1. **Separation of Concerns (SoC)**
   - Clear division between presentation, business logic, and data layers
   - Modular component architecture for maintainability

2. **Don't Repeat Yourself (DRY)**
   - Reusable React components
   - Centralized API endpoints
   - Shared utility functions

3. **Single Responsibility Principle**
   - Each module handles one specific domain (events, resources, notifications)
   - Dedicated middleware for cross-cutting concerns

4. **Security by Design**
   - bcrypt password hashing
   - SQL injection prevention
   - CORS configuration
   - Rate limiting
   - File upload validation

### B. User-Centered Design (UCD)

The system incorporates user-centered design principles:

```
User Research → Design → Prototype → Test → Implement → Evaluate
     ↑                                                        │
     └────────────────────────────────────────────────────────┘
                    (Iterative Process)
```

Key UCD Elements:
- **Accessibility**: Features designed for users of varying technical abilities
- **Responsiveness**: Mobile-first design approach
- **Clarity**: Simple navigation and clear visual hierarchy
- **Efficiency**: Streamlined workflows for common tasks
- **Feedback**: Real-time notifications and status updates

### C. Database Design Principles

**Normalization & Relational Integrity**
- Third Normal Form (3NF) database schema
- Foreign key relationships maintain referential integrity
- Prevention of data redundancy
- ACID transaction support

**Entity-Relationship Model:**
```
┌─────────┐         ┌─────────┐         ┌──────────┐
│  USERS  │─────────│ EVENTS  │─────────│ VENUES   │
└─────────┘    1:N  └─────────┘   N:1   └──────────┘
     │                   │
     │ 1:N           N:N │
     │                   │
┌─────────┐         ┌──────────┐
│  TASKS  │         │ REPORTS  │
└─────────┘         └──────────┘
     │                   │
     └───────┬───────────┘
             │
        ┌────────────┐
        │RESOURCES   │
        └────────────┘
```

---

## V. SYSTEM FEATURES & CAPABILITIES MATRIX

| Component | Features | Capabilities | User Impact |
|-----------|----------|--------------|-------------|
| **Authentication** | Multi-role login, Password security, Session mgmt | Secure access control, User verification | Safe, authorized access |
| **Event Management** | CRUD operations, Approval workflow, Conflict detection | Prevent double-booking, Status tracking | Organized events, No conflicts |
| **Resource Management** | Venue booking, Equipment tracking, Analytics | Real-time availability, Allocation optimization | Efficient resource use |
| **Notifications** | Real-time SSE, Status alerts, Broadcasting | Instant updates, Multi-user communication | Timely information |
| **Calendar** | Multi-view display, Color coding, Export | Visual event overview, Schedule transparency | Easy event discovery |
| **Reports** | PDF upload, Attendance tracking, Feedback | Event documentation, Historical records | Data-driven insights |
| **Task Management** | To-do lists, Due dates, Priority setting | Personal productivity, Task tracking | Organized workflow |
| **Security** | Rate limiting, Caching, CORS, SQL prevention | System protection, Performance optimization | Fast, secure experience |

---

## VI. TECHNOLOGY STACK FRAMEWORK

### Frontend Layer
```
┌─────────────────────────────────────────┐
│  Next.js 14 (React 18 Framework)        │
│  • Server-side Rendering (SSR)          │
│  • Static Site Generation (SSG)         │
│  • API Routes                           │
│                                         │
│  TypeScript                             │
│  • Type Safety                          │
│  • Enhanced IDE Support                 │
│  • Reduced Runtime Errors               │
│                                         │
│  Tailwind CSS                           │
│  • Utility-first Styling               │
│  • Responsive Design                    │
│  • Custom Themes                        │
└─────────────────────────────────────────┘
```

### Backend Layer
```
┌─────────────────────────────────────────┐
│  Node.js + Express.js                   │
│  • RESTful API Architecture             │
│  • Middleware Support                   │
│  • Async/Await Operations               │
│                                         │
│  bcrypt                                 │
│  • Password Hashing (10 salt rounds)    │
│  • Secure Authentication                │
│                                         │
│  Multer                                 │
│  • File Upload Handling                 │
│  • PDF Report Management                │
│                                         │
│  Server-Sent Events (SSE)               │
│  • Real-time Notifications              │
│  • Unidirectional Server Push           │
└─────────────────────────────────────────┘
```

### Database Layer
```
┌─────────────────────────────────────────┐
│  MySQL Database                         │
│  • Relational Data Model                │
│  • Foreign Key Constraints              │
│  • ACID Transactions                    │
│  • Indexed Queries                      │
└─────────────────────────────────────────┘
```

### Security & Performance
```
┌─────────────────────────────────────────┐
│  Security Measures:                     │
│  • CORS Configuration                   │
│  • SQL Injection Prevention             │
│  • File Upload Validation               │
│  • API Rate Limiting                    │
│                                         │
│  Performance Optimization:              │
│  • Redis-like Caching (5-min)           │
│  • Cache Invalidation                   │
│  • Query Optimization                   │
└─────────────────────────────────────────┘
```

---

## VII. USER ROLE & ACCESS CONTROL FRAMEWORK

```
┌──────────────────────────────────────────────────────────────┐
│                    USER ROLE HIERARCHY                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────┐        │
│  │              ADMIN ROLE                          │        │
│  │  Permissions:                                    │        │
│  │  • Full CRUD on Events                           │        │
│  │  • Approve/Decline Requests                      │        │
│  │  • Manage Resources                              │        │
│  │  • View All Reports                              │        │
│  │  • User Management                               │        │
│  │  • Generate Analytics                            │        │
│  └─────────────────────────────────────────────────┘        │
│                         │                                     │
│                         ↓                                     │
│  ┌─────────────────────────────────────────────────┐        │
│  │         STUDENT / DEPARTMENT HEAD ROLE           │        │
│  │  Permissions:                                    │        │
│  │  • Create Event Requests                         │        │
│  │  • Submit Resource Bookings                      │        │
│  │  • Upload Reports                                │        │
│  │  • View Personal Events                          │        │
│  │  • Manage Personal Tasks                         │        │
│  │  • View Notifications                            │        │
│  └─────────────────────────────────────────────────┘        │
│                         │                                     │
│                         ↓                                     │
│  ┌─────────────────────────────────────────────────┐        │
│  │           CALENDAR VIEWER ROLE                   │        │
│  │  Permissions:                                    │        │
│  │  • View Approved Events (Read-only)              │        │
│  │  • View Calendar                                 │        │
│  │  • Receive Event Notifications                   │        │
│  │  • Export Calendar Data                          │        │
│  └─────────────────────────────────────────────────┘        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## VIII. DATA FLOW DIAGRAM

### A. Event Scheduling Data Flow

```
┌──────────────┐
│   USER       │
│  (Student/   │
│   Dept Head) │
└──────┬───────┘
       │
       │ 1. Submit Event Request
       ↓
┌──────────────────────────┐
│  Frontend (Next.js)      │
│  Event Form Component    │
└──────┬───────────────────┘
       │
       │ 2. POST /api/events
       ↓
┌──────────────────────────┐
│  Backend API             │
│  Event Controller        │
└──────┬───────────────────┘
       │
       │ 3. Validate Data
       ↓
┌──────────────────────────┐
│  Business Logic Layer    │
│  Conflict Detection      │
└──────┬───────────────────┘
       │
       │ 4. Check Venue Availability
       ↓
┌──────────────────────────┐
│  Database Query          │
│  Check Overlapping Events│
└──────┬───────────────────┘
       │
       ├── No Conflict ───┐
       │                  ↓
       │           ┌──────────────────┐
       │           │ Insert Event     │
       │           │ Status: Pending  │
       │           └──────┬───────────┘
       │                  │
       │                  │ 5. Notify Admin
       │                  ↓
       │           ┌──────────────────┐
       │           │ Notification     │
       │           │ Queue            │
       │           └──────┬───────────┘
       │                  │
       │                  │ 6. Admin Reviews
       │                  ↓
       │           ┌──────────────────┐
       │           │ Admin Dashboard  │
       │           │ Approval Action  │
       │           └──────┬───────────┘
       │                  │
       │                  ├── Approve ──┐
       │                  │              ↓
       │                  │       ┌───────────────┐
       │                  │       │ Update Status │
       │                  │       │ to "Approved" │
       │                  │       └───────┬───────┘
       │                  │               │
       │                  │               │ 7. Broadcast
       │                  │               ↓
       │                  │       ┌───────────────┐
       │                  │       │ SSE Notify    │
       │                  │       │ All Users     │
       │                  │       └───────┬───────┘
       │                  │               │
       │                  │               │ 8. Update Calendar
       │                  │               ↓
       │                  │       ┌───────────────┐
       │                  │       │ Calendar View │
       │                  │       │ Shows Event   │
       │                  │       └───────────────┘
       │                  │
       │                  └── Decline ──┐
       │                                 ↓
       │                          ┌───────────────┐
       │                          │ Update Status │
       │                          │ to "Declined" │
       │                          └───────┬───────┘
       │                                  │
       │                                  │ 9. Notify User
       │                                  ↓
       │                          ┌───────────────┐
       │                          │ SSE Notify    │
       │                          │ Requester     │
       │                          └───────────────┘
       │
       └── Conflict Detected ──┐
                                ↓
                         ┌──────────────┐
                         │ Return Error │
                         │ Message      │
                         └──────┬───────┘
                                │
                                │ 10. Display Error
                                ↓
                         ┌──────────────┐
                         │ Frontend     │
                         │ Error UI     │
                         └──────────────┘
```

### B. Resource Booking Data Flow

```
USER REQUEST → Frontend Form → API Validation →
Database Check (Availability) → Resource Allocation →
Notification → Admin Approval → Status Update → Calendar Update
```

---

## IX. SECURITY FRAMEWORK

### A. Security Layers

```
┌────────────────────────────────────────────────────┐
│  Layer 1: Authentication & Authorization           │
│  • bcrypt password hashing (10 salt rounds)        │
│  • Session-based authentication                    │
│  • Role-based access control (RBAC)                │
└────────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────┐
│  Layer 2: API Security                             │
│  • Rate limiting (prevent brute force)             │
│  • CORS policy enforcement                         │
│  • Request validation & sanitization               │
└────────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────┐
│  Layer 3: Data Security                            │
│  • SQL injection prevention (parameterized queries)│
│  • File upload validation (type, size)             │
│  • Input sanitization                              │
└────────────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────┐
│  Layer 4: Database Security                        │
│  • Foreign key constraints                         │
│  • Transaction rollback on errors                  │
│  • Data validation constraints                     │
└────────────────────────────────────────────────────┘
```

---

## X. PERFORMANCE OPTIMIZATION FRAMEWORK

### A. Caching Strategy

```
┌─────────────────────────────────────────┐
│  Request Received                        │
└─────────────┬───────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│  Check Cache (5-minute TTL)             │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ↓ Cache Hit         ↓ Cache Miss
┌─────────┐      ┌──────────────┐
│ Return  │      │ Query DB     │
│ Cached  │      └──────┬───────┘
│ Data    │             │
└─────────┘             ↓
                 ┌──────────────┐
                 │ Store in     │
                 │ Cache        │
                 └──────┬───────┘
                        │
                        ↓
                 ┌──────────────┐
                 │ Return Data  │
                 └──────────────┘
```

### B. Cache Invalidation

```
Event Created/Updated/Deleted
        ↓
Clear Related Caches:
  • /api/events/*
  • /api/calendar/*
  • /api/resources/* (if venue changed)
        ↓
Next Request Fetches Fresh Data
```

---

## XI. SYSTEM BENEFITS & EXPECTED OUTCOMES

### A. For Administrators
- **Efficiency**: Reduced time spent on manual event coordination
- **Transparency**: Clear visibility of all events and resources
- **Control**: Centralized approval workflow
- **Insights**: Data-driven decision making through analytics

### B. For Students/Department Heads
- **Convenience**: Easy online event registration
- **Visibility**: Real-time status updates
- **Organization**: Integrated task management
- **Communication**: Instant notifications

### C. For Calendar Viewers
- **Awareness**: Stay informed about university events
- **Accessibility**: View events anytime, anywhere
- **Planning**: Plan around scheduled events

### D. For the Institution
- **Optimization**: Better resource utilization
- **Documentation**: Comprehensive event records
- **Coordination**: Improved inter-department communication
- **Professionalism**: Modern, efficient event management

---

## XII. SYSTEM SCALABILITY & FUTURE ENHANCEMENTS

### A. Scalability Considerations

```
Current Architecture → Future Enhancements
┌──────────────────┐     ┌──────────────────┐
│ Single Server    │ ──→ │ Load Balancer    │
│ Deployment       │     │ Multi-server     │
└──────────────────┘     └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│ Simple Caching   │ ──→ │ Redis Cluster    │
│ (In-memory)      │     │ Distributed Cache│
└──────────────────┘     └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│ MySQL Single     │ ──→ │ Database         │
│ Instance         │     │ Replication      │
└──────────────────┘     └──────────────────┘
```

### B. Potential Future Features
1. Mobile Application (React Native)
2. Email Notification Integration
3. SMS Alerts for Critical Updates
4. Advanced Analytics Dashboard
5. AI-powered Conflict Resolution
6. Integration with Academic Management System
7. QR Code Check-in for Events
8. Multi-language Support
9. Event Budgeting Module
10. Attendee Feedback Forms

---

## XIII. RESEARCH METHODOLOGY ALIGNMENT

This conceptual framework supports the following research methodologies:

### A. Systems Development
- **Agile/Scrum**: Iterative development with user feedback
- **Test-Driven Development**: Comprehensive testing at all layers
- **Continuous Integration**: Automated testing and deployment

### B. User Research
- **Usability Testing**: Interface design validation
- **Stakeholder Interviews**: Requirements gathering
- **Analytics**: Usage pattern analysis

### C. Performance Evaluation
- **Load Testing**: System capacity assessment
- **Security Audits**: Vulnerability assessment
- **User Satisfaction Surveys**: Experience measurement

---

## XIV. CONCLUSION

The ScheduleLink system represents a comprehensive, well-architected solution for event coordination and resource management at Manuel S. Enverga University Foundation Candelaria Inc. This conceptual framework demonstrates:

1. **Clear System Architecture**: Three-tier separation with well-defined responsibilities
2. **Robust Security**: Multi-layered security approach
3. **User-Centered Design**: Interfaces tailored to different user roles
4. **Scalability**: Architecture that can grow with institutional needs
5. **Modern Technology**: Industry-standard tools and frameworks
6. **Data Integrity**: Relational database with referential integrity
7. **Real-time Communication**: Server-Sent Events for instant updates
8. **Performance Optimization**: Caching and rate limiting strategies

The IPO model ensures that user inputs are systematically processed through well-defined modules to produce meaningful outcomes that benefit all stakeholders. The system's modular architecture allows for future enhancements while maintaining stability and reliability.

---

## XV. REFERENCES & STANDARDS

### Technology Documentation
- Next.js Official Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev
- Node.js Best Practices: https://nodejs.org
- Express.js Guide: https://expressjs.com
- MySQL Reference Manual: https://dev.mysql.com/doc

### Security Standards
- OWASP Top 10: Web Application Security Risks
- NIST Cybersecurity Framework
- GDPR Data Protection Guidelines

### Software Engineering Principles
- SOLID Principles
- RESTful API Design Standards
- Microservices Architecture Patterns
- Database Normalization Theory

---

**Document Version**: 1.0
**Last Updated**: 2025-10-26
**Prepared For**: Manuel S. Enverga University Foundation Candelaria Inc.
**System Name**: ScheduleLink - Web-Based Event Coordination System
