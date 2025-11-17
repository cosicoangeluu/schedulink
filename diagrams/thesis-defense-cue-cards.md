# THESIS DEFENSE CUE CARDS - SCHEDULINK
## Quick Reference Guide for Each System Feature

---

# CUE CARD 1: CALENDAR MANAGEMENT
**Category:** Core Feature - Public Access
**Location:** `app/calendar/page.tsx` (562 lines)

## What It Does:
Interactive monthly calendar displaying all approved events with visual organization and navigation.

## Key Features:
- **Monthly Grid View** - Standard calendar layout with dates
- **Multi-day Event Display** - Events spanning multiple days shown across date cells
- **Event Color Coding** - 8 distinct colors for visual differentiation
- **Time Display** - Shows event times in 12-hour AM/PM format
- **Navigation Controls** - Previous Month, Next Month, Today button
- **Add Event Button** - Quick access to create new events
- **Event Legend** - Color scheme reference guide
- **Overflow Handling** - Displays up to 3 events per day, shows "+X more" for overflow

## Technical Implementation:
- **Technology:** React with TypeScript, Next.js App Router
- **State Management:** React useState for current month/year
- **API Integration:** GET `/api/events?status=approved`
- **Date Handling:** JavaScript Date objects with custom calculations
- **Responsive Design:** Mobile-friendly grid layout

## How It Works:
1. **Data Fetching:** Retrieves all approved events from backend
2. **Month Calculation:** Generates grid of dates for current month view
3. **Event Mapping:** Assigns events to appropriate date cells
4. **Multi-day Logic:** Calculates event span across multiple dates
5. **Rendering:** Displays events with time, color, and truncated titles

## What to Say to Panelists:
"The Calendar Management module provides an intuitive monthly view where users can see all approved events at a glance. We implemented intelligent multi-day event visualization that calculates how events span across dates, displaying them with color-coded cards for easy identification. The calendar supports smooth navigation between months and includes a 'Today' button for quick access to the current date. Events are fetched from our backend API with 'approved' status only, ensuring only confirmed events appear on the public calendar."

## Demo Points:
- Navigate between months (Previous/Next)
- Click "Today" to return to current month
- Show multi-day event spanning across dates
- Point out color coding system
- Show "+X more" overflow indicator
- Explain event time display format

## Technical Questions You Might Get:
**Q: How do you handle multi-day events?**
A: "We calculate the date range for each event and create multiple date cells for events spanning several days. The algorithm determines the starting position and width needed to visually represent the event duration across the calendar grid."

**Q: Why only show approved events?**
A: "The calendar is a public-facing feature accessible without authentication. We filter by 'approved' status to ensure only confirmed, validated events are displayed to all users, maintaining data integrity and preventing confusion from pending requests."

**Q: How do you handle performance with many events?**
A: "We implemented client-side filtering to only render events for the currently visible month, reducing the rendering load. Additionally, we limit the display to 3 events per day with an overflow indicator, maintaining clean UI even with heavily scheduled dates."

---

# CUE CARD 2: EVENT MANAGEMENT (Add Event)
**Category:** Core Feature - Admin Protected
**Location:** `app/events/AddEventModal.tsx`

## What It Does:
Comprehensive form for creating new events with detailed information including venues, equipment, and scheduling.

## Key Features:
- **Event Details Input** - Name, description, dates
- **Multi-venue Selection** - Choose from available venues (EMRC, Gymnasium, HRM Hall, etc.)
- **Equipment Selection** - Select equipment with quantity specification
- **Date Range Picker** - Start date and end date selection
- **Organizer Information** - "Behalf of" field, contact information
- **Event Nature** - Type/category of event
- **Equipment Requirements** - Chairs (qty), Tables (qty), Projector, Other
- **Time Configuration** - Setup time, cleanup time, event time
- **Hours Specification** - Setup hours, cleanup hours, event hours
- **Multi-day Schedule Upload** - Optional file upload for complex events
- **Form Validation** - Required field validation before submission

## Technical Implementation:
- **Technology:** React Modal with custom hooks (useEventForm)
- **State Management:** useState for form fields and validation
- **API Endpoint:** POST `/api/events`
- **Request Format:** JSON with nested venue and equipment arrays
- **File Upload:** Multipart form data for schedule uploads

## How It Works:
1. **Open Modal:** Click "Add Event" button opens modal overlay
2. **Fill Form:** User inputs all event details
3. **Venue Selection:** Multi-select checkboxes for venues
4. **Equipment Selection:** Dropdown with quantity input
5. **Validation:** Frontend validates required fields
6. **Submission:** Sends POST request to backend
7. **Database Insert:** Backend creates event record with 'pending' status
8. **Notification Creation:** System generates notification for approval
9. **Success Feedback:** Modal closes, success message displays
10. **List Refresh:** Event list refreshes to show new pending event

## Event Fields Captured:
- `name` - Event title
- `description` - Event details
- `start_date` - Event start date
- `end_date` - Event end date
- `venues` - Array of selected venue IDs
- `equipment` - Array of {equipment_id, quantity}
- `application_date` - Date of application
- `rental_date` - Date of venue rental
- `behalf_of` - Organizer name
- `contact_info` - Contact details
- `nature_of_event` - Event category/type
- `requires_equipment` - Boolean
- `chairs_qty`, `tables_qty`, `projector`, `other_equipment`
- `setup_time`, `cleanup_time`, `event_time`
- `setup_hours`, `cleanup_hours`, `event_hours`
- `status` - Defaults to 'pending'
- `created_by` - Admin user ID from JWT

## What to Say to Panelists:
"The Add Event functionality is a comprehensive form that captures all necessary information for event planning. When an admin creates an event, they can select multiple venues simultaneously - for example, both the Gymnasium and Quadrangle for a large event. The equipment selection allows specifying exact quantities needed, such as 100 chairs and 20 tables. We implemented thorough form validation to ensure all required fields are completed before submission. Upon creation, the event is automatically assigned 'pending' status and a notification is generated for the approval workflow. The system supports complex multi-day events with optional schedule file uploads."

## Demo Points:
- Open Add Event modal
- Fill in event name and description
- Select start and end dates
- Choose multiple venues (show checkbox selection)
- Select equipment with quantities
- Enter organizer details (behalf_of, contact)
- Specify equipment needs (chairs, tables)
- Set setup, event, and cleanup times
- Submit and show success message
- Show new event appearing in pending list

## Technical Questions You Might Get:
**Q: How do you handle venue availability conflicts?**
A: "When an event is created, the system checks the selected dates against existing approved events. The notification/approval system allows admins to review conflicts before approving. Additionally, our resources module tracks venue utilization, helping admins make informed approval decisions."

**Q: Why separate setup, event, and cleanup times?**
A: "Real-world events require preparation and cleanup. By capturing these separately, we provide accurate scheduling information for venue management. For example, if an event runs 2-5pm but needs setup from 12-2pm and cleanup until 6pm, the venue is actually blocked 12-6pm. This prevents double-booking and ensures realistic time allocation."

**Q: How do you validate the form data?**
A: "We implement two-layer validation: client-side validation using React state to check required fields before enabling the submit button, and server-side validation using Joi schema validation in the backend to ensure data integrity even if client validation is bypassed. Required fields include event name, dates, and organizer information."

---

# CUE CARD 3: EVENT MANAGEMENT (Edit Event)
**Category:** Core Feature - Admin Protected
**Location:** `app/events/EditEventModal.tsx`

## What It Does:
Allows administrators to modify existing approved events while maintaining data integrity and audit trail.

## Key Features:
- **Pre-populated Form** - Loads existing event data
- **All Fields Editable** - Same fields as Add Event
- **Venue Re-selection** - Update venue assignments
- **Equipment Adjustment** - Modify equipment and quantities
- **Date Modification** - Change event dates if needed
- **Save Changes** - Update event in database
- **Validation** - Ensures data integrity on update
- **Status Preservation** - Maintains event approval status

## Technical Implementation:
- **Technology:** React Modal with pre-filled state
- **Data Loading:** GET `/api/events/:id` to fetch current data
- **API Endpoint:** PUT `/api/events/:id`
- **State Management:** useEventForm hook with initial values
- **Update Strategy:** Full object replacement, not partial updates

## How It Works:
1. **Trigger Edit:** Click edit icon on EventCard
2. **Fetch Data:** Retrieves current event details by ID
3. **Populate Form:** Pre-fills all fields with existing values
4. **User Edits:** Admin modifies needed fields
5. **Validation:** Checks required fields on client
6. **Submit Update:** Sends PUT request with updated data
7. **Database Update:** Backend updates event record
8. **Relationship Updates:** Updates event_venues and event_equipment junction tables
9. **Success Response:** Modal closes, list refreshes
10. **Visual Feedback:** Updated event shows new information

## What to Say to Panelists:
"The Edit Event feature allows administrators to modify approved events when changes are necessary - for example, if an event date needs to shift or additional equipment is required. The form pre-populates with all existing data, allowing admins to see current values while making changes. We maintain referential integrity by updating not just the main event record, but also the junction tables linking events to venues and equipment. The edit functionality preserves the event's approval status unless explicitly changed, ensuring that approved events remain approved unless an admin decides otherwise."

## Demo Points:
- Click edit button on an existing event
- Show form pre-populated with current data
- Modify event name or date
- Change venue selection (add or remove venues)
- Adjust equipment quantities
- Save changes
- Show updated event in list

## Technical Questions You Might Get:
**Q: What happens to existing relationships when editing?**
A: "When an event is updated, we use a replace strategy for the many-to-many relationships. The backend first deletes existing entries in event_venues and event_equipment junction tables for that event ID, then inserts the new selections. This ensures clean data without orphaned relationships."

**Q: Can you edit events that are already past?**
A: "Yes, administrators can edit past events for record-keeping purposes. For example, if an event occurred but the attendance count needs updating, or if equipment usage needs to be corrected for inventory tracking. However, we could add a date check if the client wants to restrict editing of past events."

**Q: How do you prevent concurrent edits by multiple admins?**
A: "Currently, the system uses a last-write-wins approach where the most recent update is saved. For production deployment with multiple concurrent admins, we could implement optimistic locking using a version number field or timestamp checking to detect conflicting updates and alert users."

---

# CUE CARD 4: EVENT MANAGEMENT (Delete Event)
**Category:** Core Feature - Admin Protected
**Location:** `app/events/page.tsx` with DeleteConfirmationModal

## What It Does:
Safely removes events from the system with confirmation to prevent accidental deletion.

## Key Features:
- **Confirmation Modal** - Two-step deletion process
- **Event Details Display** - Shows what will be deleted
- **Cascading Delete** - Removes related records
- **Success Feedback** - Confirms deletion completion
- **List Refresh** - Updates UI immediately

## Technical Implementation:
- **API Endpoint:** DELETE `/api/events/:id`
- **Modal Component:** DeleteConfirmationModal
- **Cascade Strategy:** Database foreign key constraints or manual cleanup
- **Response Handling:** Success toast notification

## How It Works:
1. **Click Delete:** User clicks delete icon on EventCard
2. **Confirmation Modal:** Modal displays event name and confirmation prompt
3. **User Confirms:** User clicks confirm button
4. **API Request:** DELETE request sent to backend
5. **Database Cleanup:** Backend deletes event record
6. **Cascade Delete:** Related records in junction tables automatically deleted
7. **Notification Cleanup:** Associated notifications removed
8. **Response:** Success status returned
9. **UI Update:** Event removed from list
10. **Feedback:** Toast notification confirms deletion

## Related Database Operations:
- Delete from `events` table
- Cascade delete from `event_venues` junction table
- Cascade delete from `event_equipment` junction table
- Delete related `notifications` records
- Optionally delete associated `reports`

## What to Say to Panelists:
"The delete functionality implements a two-step confirmation process to prevent accidental data loss. When an admin initiates deletion, a modal displays the event name and asks for explicit confirmation. Upon confirmation, the system performs a cascading delete operation, removing not just the event record but also all related records in junction tables like event_venues and event_equipment. This maintains referential integrity in our database. We also clean up associated notifications to prevent orphaned notification records. The operation is transactional, ensuring either all related records are deleted successfully or none are, preventing partial deletions that could cause data inconsistencies."

## Demo Points:
- Click delete icon on an event
- Show confirmation modal with event name
- Cancel to demonstrate prevention of accidental deletion
- Re-open and confirm deletion
- Show event removed from list
- Explain cascade delete of related records

## Technical Questions You Might Get:
**Q: What happens to reports if you delete an event?**
A: "We have two options we can configure: First, we can prevent deletion of events that have associated reports, requiring the admin to delete reports first. Second, we can cascade the deletion to also remove report records. Currently, we've implemented cascade deletion to maintain database consistency, but we store the actual PDF files in Cloudinary with identifiable names, allowing potential recovery if needed."

**Q: Can deleted events be recovered?**
A: "In the current implementation, deletion is permanent. However, for production systems, we recommend implementing soft delete using a 'deleted_at' timestamp column. This would allow events to be hidden from normal views but retained in the database for audit purposes and potential recovery. This is a common best practice for enterprise applications."

**Q: How do you ensure data integrity during deletion?**
A: "We use MySQL foreign key constraints with CASCADE options on junction tables, ensuring related records are automatically deleted when an event is removed. Additionally, the backend performs explicit cleanup of notifications. If any step fails, the database transaction rolls back, preventing partial deletions that could leave orphaned records."

---

# CUE CARD 5: NOTIFICATION & APPROVAL SYSTEM
**Category:** Core Feature - Admin Protected
**Location:** `app/notifications/page.tsx` (438 lines)

## What It Does:
Manages the approval workflow for event requests, allowing admins to review, approve, or decline pending events.

## Key Features:
- **Three-Tab Interface** - Pending | Approved | Declined
- **Notification Cards** - Display event request details
- **Approve/Decline Actions** - Two-button action system
- **Confirmation Modal** - Prevents accidental approvals/declines
- **Success Notification** - Feedback after action completion
- **Event Details Quick View** - See full event info before deciding
- **Search Functionality** - Filter notifications by event name
- **Status Count Badges** - Show counts for each tab
- **Real-time Updates** - SSE integration for live notifications
- **Auto-refresh** - List updates after approval/decline

## Technical Implementation:
- **Technology:** React with tabs state management
- **API Endpoints:**
  - GET `/api/notifications` (fetch all)
  - PUT `/api/notifications/:id/approve` (approve)
  - PUT `/api/notifications/:id/decline` (decline)
- **Real-time:** Server-Sent Events (SSE) connection
- **State Management:** useState for tabs, notifications, filters
- **Modals:** ApprovalConfirmationModal, ApprovalNotificationModal

## How It Works:

### Notification Creation:
1. User creates new event via AddEventModal
2. Backend inserts event with status = 'pending'
3. Backend creates notification record:
   - `type: 'event_approval'`
   - `eventId: [new event ID]`
   - `status: 'pending'`
   - `message: 'New event approval request'`
4. SSE broadcasts new notification to connected admins

### Approval Process:
1. **Admin Opens Notifications:** Views pending tab
2. **Review Request:** Reads event details on notification card
3. **Click Approve:** Opens confirmation modal
4. **Confirm Action:** Admin confirms approval
5. **API Call:** PUT `/api/notifications/:id/approve`
6. **Backend Updates:**
   - Update `notifications.status = 'approved'`
   - Update `events.status = 'approved'`
7. **SSE Broadcast:** Sends approval notification
8. **UI Update:** Notification moves to "Approved" tab
9. **Success Modal:** Shows success message
10. **Calendar Update:** Event now appears on public calendar

### Decline Process:
1. **Admin Clicks Decline:** Opens confirmation modal
2. **Confirm Decline:** Admin confirms rejection
3. **API Call:** PUT `/api/notifications/:id/decline`
4. **Backend Updates:**
   - Update `notifications.status = 'declined'`
   - Update `events.status = 'declined'`
5. **UI Update:** Notification moves to "Declined" tab
6. **Success Feedback:** Shows decline confirmation

## Notification Fields:
- `id` - Notification ID
- `type` - 'event_approval' | 'event_approved' | 'event_declined'
- `message` - Notification text
- `eventId` - Foreign key to events table
- `status` - 'pending' | 'approved' | 'declined'
- `created_at` - Timestamp

## What to Say to Panelists:
"The Notification and Approval System is the core workflow management feature of Schedulink. When any user creates an event, it enters the system with 'pending' status and generates an approval notification. Administrators see these requests in the Notifications page, organized into three tabs: Pending, Approved, and Declined. Each notification card displays essential event information including the event name, date, venues, and equipment requested. Admins can click 'Approve' or 'Decline' buttons, both of which trigger confirmation modals to prevent accidental actions. Upon approval, the event status is updated to 'approved' and the event becomes visible on the public calendar. We implemented real-time updates using Server-Sent Events, so multiple admins see new notifications instantly without refreshing the page. The system maintains a complete audit trail of all approval decisions."

## Demo Points:
- Show Pending tab with notification cards
- Display event details on a notification
- Click Approve button → show confirmation modal
- Confirm approval → show success notification
- Show notification moved to Approved tab
- Demonstrate search/filter functionality
- Show count badges updating
- Explain real-time SSE updates

## Technical Questions You Might Get:
**Q: How do you handle multiple admins approving the same event?**
A: "The approval endpoint is idempotent - if multiple admins approve the same pending notification simultaneously, the database update only changes the status once from 'pending' to 'approved'. The first successful request completes the approval, and subsequent requests would find the notification already approved. We could add optimistic locking to explicitly prevent race conditions if needed."

**Q: What happens if an admin approves an event with venue conflicts?**
A: "Currently, the system allows admins to make the final decision based on their knowledge. Before approving, admins can view the Resources module to check venue availability. For enhanced functionality, we could implement a conflict detection system that flags potential venue double-bookings during the approval process, alerting admins to potential conflicts while still allowing them to make the final decision if the events don't actually conflict."

**Q: Explain the real-time notification system.**
A: "We use Server-Sent Events (SSE), a web standard for server-to-client streaming. When the Notifications page loads, it establishes an SSE connection to our backend endpoint `/api/sse`. The backend maintains a list of connected clients. When any event is created, approved, or declined, the backend broadcasts a notification to all connected clients. The clients receive this event and update their UI in real-time without polling. SSE is simpler than WebSockets for our use case since communication is unidirectional - server to client only."

**Q: Can declined events be re-submitted?**
A: "Currently, declined events remain in the database with 'declined' status visible in the Declined tab. An admin could potentially edit the event and change its status back to 'pending' to re-enter the approval workflow. Alternatively, users could create a new event with corrected information. For a production system, we might implement a 'resubmit' feature that creates a new notification while maintaining the decline history for audit purposes."

---

# CUE CARD 6: RESOURCES MANAGEMENT - Equipment
**Category:** Core Feature - Admin Protected
**Location:** `app/resources/page.tsx` - Equipment Tab

## What It Does:
Manages inventory of equipment available for events, tracking quantities, availability, and allocation to events.

## Key Features:
- **Equipment Inventory List** - View all equipment items
- **Add Equipment** - Create new equipment records
- **Edit Equipment** - Modify equipment details
- **Delete Equipment** - Remove equipment from system
- **Quantity Tracking** - Total and Available counts
- **Availability Calculation** - Real-time availability based on event allocations
- **Category Organization** - Group equipment by type
- **Condition Tracking** - Monitor equipment condition
- **Location Information** - Track where equipment is stored
- **Search/Filter** - Find equipment quickly
- **Resource Cards** - Visual display with key information

## Technical Implementation:
- **API Endpoints:**
  - GET `/api/resources` (list all)
  - POST `/api/resources` (create)
  - GET `/api/resources/:id` (get one)
  - PUT `/api/resources/:id` (update)
  - DELETE `/api/resources/:id` (remove)
- **Database Table:** `resources`
- **Junction Table:** `event_equipment` (links events to equipment)
- **State Management:** React useState for list and modals

## Equipment Fields:
- `id` - Primary key
- `name` - Equipment name (e.g., "Projector", "Plastic Chairs")
- `description` - Equipment details
- `category` - Equipment type/category
- `total` - Total quantity owned
- `available` - Current available quantity
- `location` - Storage location
- `status` - Overall status (available, in-use, maintenance)
- `condition` - Physical condition (good, fair, poor)
- `created_at` - Record creation timestamp

## Sample Equipment Items:
- Projectors (10 total, 7 available)
- Plastic Chairs (200 total, 150 available)
- Tables (50 total, 30 available)
- Microphones (15 total, 12 available)
- Sound System (5 total, 3 available)
- Laptops (8 total, 5 available)

## How It Works:

### View Equipment:
1. Navigate to Resources page, Equipment tab
2. System fetches all equipment via GET `/api/resources`
3. Displays equipment cards with name, total, available, category
4. Shows availability status with color indicators

### Add Equipment:
1. Click "Add Equipment" button
2. Fill AddResourceModal form:
   - Name, description, category
   - Total quantity
   - Location, condition
3. Submit form
4. POST request to `/api/resources`
5. Backend inserts new record
6. Available quantity set equal to total initially
7. List refreshes with new equipment

### Availability Calculation:
1. When event is created with equipment, record in `event_equipment` table
2. Calculate: `available = total - SUM(allocated quantities from active events)`
3. Update display in real-time
4. Prevent over-allocation during event creation

### Edit Equipment:
1. Click edit icon on ResourceCard
2. Pre-filled EditResourceModal opens
3. Modify fields (name, quantity, condition, etc.)
4. Submit update
5. PUT request to `/api/resources/:id`
6. Backend updates record
7. List refreshes

### Delete Equipment:
1. Click delete icon
2. Confirmation modal appears
3. Confirm deletion
4. DELETE request to `/api/resources/:id`
5. Backend checks for dependencies (events using this equipment)
6. If in use, prevents deletion or cascades
7. Record removed
8. List refreshes

## What to Say to Panelists:
"The Equipment Management system provides comprehensive inventory control for all event equipment. Each equipment item tracks both total quantity owned and current available quantity, which updates dynamically based on event allocations. For example, if we own 200 plastic chairs and three upcoming events have reserved 30, 20, and 50 chairs respectively, the system shows 100 chairs available for additional bookings. We track additional metadata like storage location and physical condition, helping administrators make informed decisions about equipment allocation. When creating events, admins can see real-time availability and are prevented from over-allocating equipment beyond what's available. The system supports full CRUD operations with confirmation dialogs to prevent accidental deletions of equipment still allocated to events."

## Demo Points:
- Show Equipment tab with inventory list
- Point out total vs. available quantities
- Click "Add Equipment" and show form
- Add sample equipment (e.g., "Whiteboard - 5 total")
- Show new equipment in list
- Edit an equipment item
- Demonstrate search/filter
- Explain availability calculation logic
- Show condition and location fields

## Technical Questions You Might Get:
**Q: How do you calculate available quantity?**
A: "The backend performs a SQL query joining the resources table with event_equipment and events tables. It sums the quantities allocated to events with 'approved' status and future dates (active events), then subtracts this sum from the total quantity to get the available count. This calculation happens on each GET request to ensure real-time accuracy."

**Q: What happens if equipment is damaged?**
A: "Administrators can update the equipment record to change the condition field to 'poor' or 'maintenance', and manually reduce the total or available quantity to reflect items out of service. For a production system, we could implement a dedicated 'maintenance' status that automatically reduces availability while keeping total quantity for record-keeping."

**Q: Can you prevent deletion of equipment allocated to events?**
A: "Yes, the backend checks for references in the event_equipment junction table before allowing deletion. If the equipment is currently allocated to any approved events, the deletion is prevented and an error message is returned. This maintains referential integrity and prevents disrupting confirmed event plans. Equipment can only be deleted if it has no current allocations."

**Q: How do you handle equipment returns after an event?**
A: "Currently, the availability automatically updates when an event's end date passes, as only future events are counted in the allocation calculation. For more robust tracking, we could implement a check-in/check-out system that marks equipment as returned explicitly, allowing tracking of overdue returns and equipment audits."

---

# CUE CARD 7: RESOURCES MANAGEMENT - Venues
**Category:** Core Feature - Admin Protected
**Location:** `app/resources/page.tsx` - Venues Tab

## What It Does:
Manages available venues for events, tracks venue details, and monitors venue allocation to approved events.

## Key Features:
- **Venue Directory** - List all available venues
- **Add Venue** - Create new venue records
- **Edit Venue** - Update venue information
- **Delete Venue** - Remove venues from system
- **Availability Tracking** - Monitor venue bookings
- **Venue Details** - Description, category, capacity
- **Event Association** - View events scheduled at each venue
- **Category Organization** - Group venues by type
- **Search/Filter** - Quick venue lookup

## Technical Implementation:
- **API Endpoints:**
  - GET `/api/venues` (list all)
  - POST `/api/venues` (create)
  - GET `/api/venues/:id` (get details)
  - PUT `/api/venues/:id` (update)
  - DELETE `/api/venues/:id` (remove)
- **Database Table:** `venues`
- **Junction Table:** `event_venues` (links events to venues)
- **State Management:** React useState for venues and modal control

## Venue Fields:
- `id` - Primary key
- `name` - Venue name
- `description` - Venue details, capacity, amenities
- `category` - Venue type (hall, outdoor, classroom, etc.)
- `availability` - Current status (available, booked, maintenance)
- `created_at` - Record creation timestamp

## Sample Venues in System:
1. **EMRC** (Engineering Multipurpose Resource Center)
   - Category: Multi-purpose Hall
   - Capacity: 200 people
   - Amenities: Stage, sound system, air conditioning

2. **Gymnasium**
   - Category: Sports Facility
   - Capacity: 500 people
   - Amenities: Basketball court, bleachers, locker rooms

3. **HRM Function Hall**
   - Category: Function Hall
   - Capacity: 150 people
   - Amenities: Kitchen access, air conditioning, tables/chairs

4. **Sport and Recreational Hall**
   - Category: Multi-purpose Hall
   - Capacity: 300 people
   - Amenities: Open floor, stage area

5. **Quadrangle**
   - Category: Outdoor Venue
   - Capacity: 1000+ people
   - Amenities: Open space, covered stage area

## How It Works:

### View Venues:
1. Navigate to Resources page, Venues tab
2. System fetches all venues via GET `/api/venues`
3. Displays venue cards with name, category, description
4. Shows availability status

### Add Venue:
1. Click "Add Venue" button
2. Fill AddResourceModal form (configured for venues):
   - Name (e.g., "Conference Room A")
   - Description (capacity, amenities)
   - Category (Function Hall, Outdoor, Classroom)
   - Availability status
3. Submit form
4. POST request to `/api/venues`
5. Backend validates and inserts record
6. List refreshes with new venue

### Venue Availability Logic:
1. When event is created, venues selected are recorded in `event_venues`
2. Query checks for overlapping date ranges:
   ```
   SELECT venues WHERE id IN (
     SELECT venue_id FROM event_venues
     WHERE event_id IN (
       SELECT id FROM events
       WHERE status='approved'
       AND start_date <= :end_date
       AND end_date >= :start_date
     )
   )
   ```
3. Booked venues shown as unavailable for that date range
4. Available venues remain selectable

### Edit Venue:
1. Click edit icon on venue card
2. EditResourceModal opens with current data
3. Modify venue details
4. Submit update
5. PUT request to `/api/venues/:id`
6. Backend updates record
7. Changes reflected immediately

### Delete Venue:
1. Click delete icon
2. Confirmation modal displays
3. Confirm deletion
4. DELETE request to `/api/venues/:id`
5. Backend checks event_venues for allocations
6. If venue is assigned to approved events, deletion prevented
7. If no allocations, venue deleted
8. List refreshes

## What to Say to Panelists:
"The Venue Management system tracks all physical locations available for events. Our system currently manages five major venues: EMRC, Gymnasium, HRM Function Hall, Sport and Recreational Hall, and Quadrangle. Each venue record includes descriptive information about capacity and amenities, helping administrators match venues to event requirements. The system tracks venue availability by checking the event_venues junction table for approved events with overlapping dates. For example, if the Gymnasium is booked for a sports tournament on March 15-17, it would show as unavailable for new events during that period. Administrators can add new venues as facilities expand, edit venue information as amenities change, and maintain accurate records of all event spaces. The system prevents deletion of venues that are assigned to confirmed events, protecting data integrity."

## Demo Points:
- Show Venues tab with all venues listed
- Display venue card with details
- Click "Add Venue" button
- Add sample venue (e.g., "Library Auditorium")
- Fill description with capacity and amenities
- Submit and show new venue added
- Edit existing venue to update capacity
- Demonstrate venue availability checking
- Show venue assignment in event creation

## Technical Questions You Might Get:
**Q: How do you prevent double-booking of venues?**
A: "When an admin creates an event and selects venues, they can see which venues are already in use. During the approval process, admins can check the Resources page to view which events are scheduled at each venue. For enhanced functionality, we could implement automatic conflict detection that prevents approving events with venue conflicts, or at minimum displays a warning to the approving admin."

**Q: Can one event use multiple venues simultaneously?**
A: "Yes, our system supports multi-venue events through the event_venues many-to-many junction table. For example, a university-wide event might use both the Quadrangle for outdoor activities and the Gymnasium for indoor activities simultaneously. When creating an event, admins can select multiple venues by checking multiple checkboxes, and all selected venues are linked to the single event record."

**Q: How do you handle venue capacity limitations?**
A: "Venue capacity is stored in the description field as informational text for administrators. When reviewing approval requests, admins can see the venue details and make judgment calls about whether an event is appropriate for the selected venue based on expected attendance. For a more robust system, we could add a numeric capacity field and require events to specify expected attendance, triggering warnings if attendance exceeds venue capacity."

**Q: What about outdoor venues affected by weather?**
A: "Our system includes the Quadrangle as an outdoor venue. Currently, venue selection is at the admin's discretion based on event nature and weather forecasts. For enhanced functionality, we could add a 'venue_type' field distinguishing indoor vs. outdoor, allowing the system to suggest indoor backup venues for outdoor events, or implement a rainy-day backup venue feature during event creation."

---

# CUE CARD 8: RESOURCES MANAGEMENT - Events View
**Category:** Core Feature - Admin Protected
**Location:** `app/resources/page.tsx` - Events Tab

## What It Does:
Displays all events from a resource allocation perspective, showing which events are using which venues and equipment.

## Key Features:
- **Event List View** - All approved events
- **Resource Allocation Display** - Shows venues and equipment per event
- **Event Timeline** - Date range for each event
- **Quick Reference** - See resource usage at a glance
- **Search/Filter** - Find events by name or resource
- **Resource Utilization Overview** - Understand booking patterns

## What It Shows:
- Event name and description
- Start and end dates
- Venues assigned to the event
- Equipment assigned with quantities
- Event status (approved/pending/declined)
- Organizer information

## How It Works:
1. Navigate to Resources page, Events tab
2. System fetches all events via GET `/api/events`
3. For each event, displays:
   - Event details
   - JOIN with event_venues to show venue names
   - JOIN with event_equipment to show equipment and quantities
4. Presents resource-centric view of event calendar

## What to Say to Panelists:
"The Events tab in the Resources module provides a different perspective on event data - focused on resource allocation rather than scheduling. While the Calendar shows when events occur, and Event Management focuses on event details, this view emphasizes which resources are allocated to which events. This is particularly useful for administrators managing resource inventory, allowing them to quickly see patterns like 'Which events are using the Gymnasium this month?' or 'How many chairs are allocated to upcoming events?' This resource-centric view helps prevent over-allocation and supports data-driven decisions about resource procurement and maintenance scheduling."

## Demo Points:
- Show Events tab in Resources
- Display event card showing venues and equipment
- Point out resource quantities
- Explain difference from Calendar/Event Management views
- Demonstrate resource allocation overview

## Technical Questions You Might Get:
**Q: Why have a separate Events view in Resources?**
A: "Different user workflows require different data perspectives. The Calendar is date-centric for scheduling, Event Management is event-centric for CRUD operations, and the Resources Events view is resource-centric for inventory management. This allows admins to answer questions like 'What percentage of our chairs are allocated next week?' or 'Is the Gymnasium heavily utilized?' without navigating through individual event records."

---

# CUE CARD 9: REPORT SUBMISSION & MANAGEMENT
**Category:** Core Feature - Public Upload / Admin Management
**Location:** `app/reports/page.tsx` (607 lines)
**Backend:** `backend/reports.js`

## What It Does:
Allows users to upload PDF reports for completed events and provides administrators with a centralized repository to view, download, and manage all submitted reports.

## Key Features:
- **PDF Upload** - File upload for event reports
- **File Validation** - Client and server-side validation
- **Cloud Storage** - Cloudinary integration for file hosting
- **File Listing** - Display all uploaded reports
- **View Reports** - In-browser PDF viewing
- **Download Reports** - Local download capability
- **Delete Reports** - Remove reports with confirmation
- **File Metadata** - Track upload details
- **Event Association** - Link reports to specific events
- **Multiple Uploads** - Support multiple reports per event

## Technical Implementation:
- **Frontend:** React with file input handling
- **Backend:** Express with Multer middleware for file uploads
- **Storage:** Cloudinary cloud storage
- **API Endpoints:**
  - POST `/api/reports/upload` (public - upload)
  - GET `/api/reports` (protected - list all)
  - GET `/api/reports/:id` (protected - get one)
  - GET `/api/reports/file/:id` (public - view inline)
  - GET `/api/reports/download/:id` (public - download)
  - DELETE `/api/reports/:id` (protected - delete)
- **Database Table:** `reports`
- **File Processing:** Multer → Validation → Cloudinary Upload → DB Record

## Report Fields (Database):
- `id` - Primary key
- `eventId` - Foreign key to events table
- `filePath` - Cloudinary URL
- `fileName` - Original filename
- `public_id` - Cloudinary identifier for deletion
- `uploadedBy` - Admin or Student username
- `uploadedAt` - Timestamp
- `fileSize` - File size in bytes
- `exists` - Boolean for file verification

## File Constraints:
- **Format:** PDF only (application/pdf)
- **Max Size:** 10 MB
- **Validation:** Client (before upload) and Server (during processing)
- **Accepted MIME:** application/pdf
- **Storage:** Cloudinary cloud (persistent, scalable)

## How It Works:

### Upload Process:
1. **Select Event:** User chooses event from dropdown
2. **Select File:** User clicks "Choose File" and selects PDF
3. **Client Validation:**
   - Check file type is PDF
   - Check file size ≤ 10 MB
   - Display error if validation fails
4. **Upload Initiation:** User clicks "Upload Report"
5. **Multipart Form Data:** Frontend sends file with eventId
6. **Backend Receives:** Multer middleware processes upload
7. **Server Validation:**
   - Verify PDF MIME type
   - Confirm file size within limit
   - Validate eventId exists
8. **Cloudinary Upload:**
   - Upload file to Cloudinary
   - Receive URL and public_id
9. **Database Insert:**
   - Create report record
   - Store filePath, fileName, public_id, metadata
10. **Success Response:** Return report ID and confirmation
11. **UI Update:** Report appears in list
12. **Success Toast:** "Report uploaded successfully"

### View Report (In-Browser):
1. User clicks "View" button on report card
2. GET request to `/api/reports/file/:id`
3. Backend retrieves filePath from database
4. Redirects to Cloudinary URL
5. Browser displays PDF inline (if browser supports)
6. User can scroll through PDF in browser tab/window

### Download Report:
1. User clicks "Download" button
2. GET request to `/api/reports/download/:id`
3. Backend retrieves file from Cloudinary
4. Sets Content-Disposition header to "attachment"
5. Streams file to client
6. Browser saves file to local downloads folder
7. Original filename preserved

### Delete Report:
1. Admin clicks delete icon on report card
2. Confirmation modal displays
3. Admin confirms deletion
4. DELETE request to `/api/reports/:id`
5. Backend:
   - Deletes file from Cloudinary using public_id
   - Deletes database record
6. Success response
7. Report removed from list
8. Toast confirmation

### List All Reports:
1. Admin navigates to Reports page
2. GET request to `/api/reports`
3. Backend queries database for all reports
4. Returns array with:
   - Event name (JOIN with events table)
   - File metadata
   - Upload details
5. Frontend displays report cards
6. Each card shows:
   - Event name
   - Filename
   - Upload date
   - File size
   - Uploaded by (user)
   - View/Download/Delete buttons

## What to Say to Panelists:
"The Report Submission and Management system provides a complete document management solution for event-related reports. After an event concludes, organizers can upload PDF reports documenting the event outcomes, attendance, expenditures, or any required documentation. The system implements robust validation - both on the client side for immediate feedback and on the server side for security. We restrict uploads to PDF format with a maximum size of 10 MB, ensuring consistent file types and manageable storage. All files are stored in Cloudinary, a cloud-based digital asset management platform, providing reliable, scalable storage with global CDN delivery. The database tracks metadata about each report including which event it belongs to, who uploaded it, and when. Administrators have full access to view reports in their browser, download them for offline review, or delete obsolete reports. The system supports multiple reports per event, allowing for supplementary documents like financial reports, photo albums, and evaluation forms."

## Demo Points:
- Navigate to Reports page
- Show event dropdown selection
- Select a PDF file (demonstrate file picker)
- Show file size/type validation
- Upload report and show success message
- Display report in list with metadata
- Click "View" button → show PDF in browser
- Click "Download" button → show download
- Demonstrate delete with confirmation
- Show multiple reports for one event

## Technical Questions You Might Get:
**Q: Why use Cloudinary instead of local storage?**
A: "Cloudinary provides several advantages over local file storage. First, scalability - as the number of reports grows, we don't need to worry about server disk space limitations. Second, reliability - Cloudinary maintains redundant copies and handles backups automatically. Third, performance - files are delivered via CDN, ensuring fast access regardless of user location. Fourth, security - Cloudinary handles secure file serving with configurable access controls. Finally, the database only stores the URL reference, not the file itself, keeping our database lean and performant."

**Q: How do you ensure uploaded files are actually PDFs and not malicious?**
A: "We implement multi-layer validation. Client-side, we check the file extension and MIME type before allowing upload, providing immediate user feedback. Server-side, Multer validates the MIME type again, and we could add additional validation by reading the file header magic bytes to confirm it's truly a PDF. For production deployment, we'd implement additional security measures like scanning uploaded files for malware and potentially rendering PDFs server-side to strip any embedded scripts."

**Q: What happens if Cloudinary is down?**
A: "If Cloudinary experiences an outage, uploads would fail with an error message to the user, but existing reports remain accessible because Cloudinary maintains high availability with redundant storage. For critical production systems, we could implement a fallback storage strategy using a secondary cloud provider or local storage, with automatic retry logic. We could also implement an upload queue that stores failed uploads locally and retries them when connectivity is restored."

**Q: Can you prevent duplicate report uploads?**
A: "Yes, we could implement duplicate detection in several ways. First, we could check if a report already exists for a given eventId and uploadedBy combination, preventing the same user from uploading multiple times (or allowing it with a confirmation). Second, we could compute a file hash (MD5 or SHA-256) before upload and check against existing hashes in the database, preventing identical file content regardless of filename. Third, we could implement a 'replace' feature that deletes the old report when a new one is uploaded for the same event."

**Q: How do you handle very large files or slow connections?**
A: "Currently, we enforce a 10 MB limit to balance completeness with upload speed. For users with slow connections, we could implement several enhancements: chunked uploads that split large files into smaller pieces allowing resume on failure, progress bars showing upload percentage, and client-side compression before upload. We could also increase the size limit for authenticated admins versus public users, allowing more flexibility for official documentation while restricting casual uploads."

---

# CUE CARD 10: ADMIN DASHBOARD
**Category:** Core Feature - Admin Protected
**Location:** `app/admin/dashboard/page.tsx`

## What It Does:
Provides administrators with an at-a-glance overview of system status, key metrics, upcoming tasks, and recent activity.

## Key Features:
- **KPI Cards** - Key Performance Indicators
  - Total Events (Approved)
  - Pending Events (Awaiting approval)
  - Upcoming Tasks (Due soon)
  - Active Resources
- **Task Management** - EnhancedTodoList component
  - Expandable task list
  - Due date tracking
  - Task completion
  - Urgent task alerts (within 10 minutes)
- **Recent Activity Feed** - System activity timeline
  - Event approvals
  - New event submissions
  - Report uploads
- **Upcoming Events List** - Next scheduled events
  - Event name and dates
  - Venue information
  - Quick access to details
- **Data Visualization** - Charts and graphs
  - Event trends
  - Resource utilization
  - Approval patterns

## Technical Implementation:
- **Components:**
  - KPICard.tsx - Metric display cards
  - EnhancedTodoList.tsx - Task management
  - RecentActivity.tsx - Activity feed
  - UpcomingEvents.tsx - Event preview
  - ChartSection.tsx - Data visualizations
- **Data Sources:**
  - GET `/api/events` (for event counts and list)
  - GET `/api/tasks` (for todo list)
  - GET `/api/notifications` (for pending count)
  - GET `/api/resources` and `/api/venues` (for resource stats)
- **Visualization:** Recharts library for graphs
- **State Management:** React useState for dashboard data

## KPI Metrics Displayed:
1. **Total Approved Events**
   - Count of events with status='approved'
   - Shows system usage level

2. **Pending Events**
   - Count of events awaiting approval
   - Indicates admin workload

3. **Upcoming Tasks**
   - Tasks due within 10 minutes
   - Urgent action items
   - Popup notification if > 0

4. **Active Resources**
   - Count of available resources
   - System capacity indicator

## How It Works:

### Dashboard Load:
1. User logs in and navigates to Admin Dashboard
2. Dashboard component mounts
3. Multiple parallel API calls:
   - Fetch all events
   - Fetch pending notifications
   - Fetch tasks
   - Fetch resources/venues
4. Calculate KPI values:
   - Filter events by status for counts
   - Filter tasks by due date for urgency
   - Count available resources
5. Render KPI cards with values
6. Display data visualizations
7. Show recent activity timeline
8. List upcoming events

### Task Management:
1. **View Tasks:** EnhancedTodoList displays all tasks
2. **Expand/Collapse:** Click to show/hide task list
3. **Add Task:** Modal form for new task creation
   - Title (required)
   - Note/description
   - Due date and time
4. **Mark Complete:** Checkbox to mark task done
5. **Delete Task:** Remove completed tasks
6. **Urgent Alert:** Popup if tasks due within 10 min

### Data Visualization:
1. ChartSection component fetches event data
2. Aggregates by date/status for trending
3. Renders charts using Recharts:
   - Line chart for event timeline
   - Bar chart for approval patterns
   - Pie chart for resource allocation
4. Interactive tooltips on hover

## What to Say to Panelists:
"The Admin Dashboard serves as the central command center for system administrators, providing immediate visibility into system health and administrative workload. Upon login, admins see KPI cards displaying critical metrics: total approved events showing system utilization, pending events indicating current approval workload, and upcoming tasks flagging urgent action items. The dashboard integrates our Task Management system with an expandable todo list that helps admins track responsibilities and deadlines. A unique feature is the urgent task notification - if any task is due within 10 minutes, a popup modal alerts the admin, ensuring time-sensitive items aren't missed. The Recent Activity feed provides a chronological view of system events like new submissions and approvals, helping admins stay informed. The Upcoming Events section offers quick access to the next scheduled events. We also incorporated data visualization using Recharts to display trends in event submissions, approval patterns, and resource utilization, supporting data-driven decision making."

## Demo Points:
- Show KPI cards with live counts
- Explain each metric's significance
- Expand EnhancedTodoList
- Add a sample task
- Mark task as complete
- Show urgent task popup (if applicable)
- Display Recent Activity feed
- Show Upcoming Events list
- Demonstrate charts and hover tooltips
- Explain data-driven insights from visualizations

## Technical Questions You Might Get:
**Q: How do you calculate the urgent task notification?**
A: "When the dashboard loads, we fetch all tasks via GET `/api/tasks`. The frontend calculates the time difference between the current time and each task's due date. If any task's due time is within the next 10 minutes (600 seconds), we increment a counter. If this counter is greater than zero, we automatically display a modal popup listing the urgent tasks. This calculation runs on every dashboard load and could be enhanced with real-time updates using SSE or periodic polling."

**Q: Are the KPI metrics real-time?**
A: "The KPIs update whenever the dashboard component loads or refreshes. Currently, admins can manually refresh to see updated counts. For truly real-time metrics, we could integrate with our existing SSE infrastructure to push updates when events are approved, new events are submitted, or tasks are completed. This would update the KPIs automatically without requiring page refresh."

**Q: How do you optimize dashboard performance with large datasets?**
A: "We employ several optimization strategies. First, we use React's built-in optimization with proper component memoization to prevent unnecessary re-renders. Second, the API endpoints use database queries with appropriate indexes on status and date columns for fast filtering. Third, for data visualizations, we limit the date range and aggregate data (e.g., events per week rather than per day) to reduce data points. For very large datasets, we could implement pagination on the activity feed and lazy loading for charts."

**Q: Can admins customize what appears on their dashboard?**
A: "Currently, all admins see the same dashboard layout. However, the architecture supports customization. We could implement user preferences stored in the database or localStorage, allowing admins to toggle KPI cards, choose chart types, or set task filter preferences. We could also implement role-based dashboards - for example, a resource manager might see resource-focused metrics while an event coordinator sees approval-focused metrics."

---

# CUE CARD 11: AUTHENTICATION & AUTHORIZATION
**Category:** Security Feature
**Location:** `app/admin/login/page.tsx` (Frontend)
**Backend:** `backend/auth.js` + `backend/authMiddleware.js`

## What It Does:
Secures the system by authenticating users and authorizing access to protected features based on roles.

## Key Features:
- **Admin Login** - Username/password authentication
- **JWT Token Generation** - Secure token-based auth
- **Password Hashing** - Bcrypt for password security
- **Token Expiration** - 1-hour session timeout
- **Role-Based Access Control** - Admin vs. Student roles
- **Protected Routes** - Middleware guards API endpoints
- **Token Storage** - localStorage for session persistence
- **Authorization Header** - Token sent with protected requests
- **Login Validation** - Joi schema for input validation

## Technical Implementation:
- **Frontend:**
  - Login form component
  - RoleContext for role state management
  - Token storage in localStorage
  - Axios interceptors for auth headers
- **Backend:**
  - Express.js auth routes
  - Bcrypt for password hashing (10 salt rounds)
  - JWT for token generation/verification
  - authMiddleware.js for route protection
  - Joi for input validation
- **Database:** `admins` table with username and password_hash
- **Security Library:**
  - bcryptjs for hashing
  - jsonwebtoken for JWT
  - Joi for validation

## Authentication Flow:

### Registration (Initial Setup):
1. Admin creates account (via direct DB insert or admin panel)
2. Password hashed with bcrypt: `bcrypt.hash(password, 10)`
3. Hash stored in `admins.password_hash` field
4. Username stored in `admins.username` field (unique)

### Login Process:
1. **User Input:** Admin enters username and password
2. **Client Validation:** Check fields not empty
3. **Submit:** POST request to `/api/auth/login`
   ```json
   {
     "username": "admin",
     "password": "password123"
   }
   ```
4. **Server Validation:** Joi schema validates input format
5. **Database Query:** Find admin by username
6. **Password Verification:**
   ```javascript
   bcrypt.compare(password, admin.password_hash)
   ```
7. **JWT Generation:** If password matches:
   ```javascript
   jwt.sign(
     { id: admin.id, username: admin.username, role: 'admin' },
     JWT_SECRET,
     { expiresIn: '1h' }
   )
   ```
8. **Response:** Return JWT token to client
9. **Client Storage:** Store token in localStorage
   ```javascript
   localStorage.setItem('token', token)
   ```
10. **Redirect:** Navigate to dashboard

### Authorization Flow (Protected Requests):

1. **Client Request:** User accesses protected feature
2. **Token Retrieval:** Get token from localStorage
3. **Header Attachment:**
   ```javascript
   headers: { Authorization: `Bearer ${token}` }
   ```
4. **Server Receives:** authMiddleware intercepts request
5. **Token Extraction:** Parse token from Authorization header
6. **Token Verification:**
   ```javascript
   jwt.verify(token, JWT_SECRET)
   ```
7. **Decode Payload:** Extract user ID and role
8. **Attach to Request:** `req.user = decoded`
9. **Next Middleware:** Allow request to proceed
10. **Route Handler:** Access req.user for user info

### Token Expiration:
1. Token expires after 1 hour
2. Server returns 401 Unauthorized
3. Client detects 401 status
4. Clears localStorage token
5. Redirects to login page
6. User must re-authenticate

## Security Features:

### Password Security:
- **Never Stored Plain:** Only bcrypt hash stored
- **Salt Rounds:** 10 rounds (2^10 iterations)
- **One-Way Hash:** Cannot reverse to get password
- **Unique Hash:** Same password hashes differently each time

### Token Security:
- **Signed:** JWT signed with secret key
- **Tamper-Proof:** Modification invalidates signature
- **Expiration:** 1-hour limit reduces exposure window
- **Payload:** Contains minimal data (id, username, role)
- **Secret Key:** Stored in environment variable

### Protection Mechanisms:
- **authMiddleware:** Guards all sensitive endpoints
- **Input Validation:** Joi schemas prevent injection
- **Error Handling:** Generic messages prevent user enumeration
- **HTTPS Required:** Production uses encrypted transport

## Protected Endpoints:
All endpoints requiring authentication:
- POST `/api/events`
- PUT `/api/events/:id`
- DELETE `/api/events/:id`
- PUT `/api/notifications/:id/approve`
- PUT `/api/notifications/:id/decline`
- POST `/api/resources`
- PUT `/api/resources/:id`
- DELETE `/api/resources/:id`
- POST `/api/venues`
- PUT `/api/venues/:id`
- DELETE `/api/venues/:id`
- DELETE `/api/reports/:id`
- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

## Role-Based Access:
- **Admin Role:**
  - Full CRUD on events
  - Approve/decline notifications
  - Manage resources and venues
  - Delete reports
  - Task management
  - Access admin dashboard

- **Student Role (Future):**
  - View calendar
  - Submit event requests (pending approval)
  - Upload reports
  - View own submissions
  - Limited dashboard

## What to Say to Panelists:
"Security is a fundamental concern for any system handling sensitive data and important operations. Our authentication system uses industry-standard bcrypt for password hashing, ensuring that even if the database were compromised, passwords cannot be reverse-engineered. We never store passwords in plain text - only the bcrypt hash with 10 salt rounds. Upon successful login, the server generates a JSON Web Token (JWT) signed with a secret key and valid for one hour. This token is stored in the client's localStorage and attached to every subsequent request via the Authorization header. On the backend, our authMiddleware intercepts protected endpoints, verifies the JWT signature, checks expiration, and extracts user information before allowing the request to proceed. This ensures that only authenticated users can perform sensitive operations like approving events or deleting resources. The token expiration provides a balance between user convenience and security - users stay logged in during active sessions but must re-authenticate after prolonged inactivity. We also implement input validation using Joi schemas to prevent injection attacks and maintain consistent data formats."

## Demo Points:
- Show login page
- Enter credentials (demonstrate validation)
- Show successful login and token storage (browser DevTools)
- Access protected feature (show Authorization header in Network tab)
- Demonstrate token in localStorage
- Explain JWT payload (decode at jwt.io)
- Show authMiddleware code
- Demonstrate logout (token removal)
- Try accessing protected route without token (show 401 error)

## Technical Questions You Might Get:
**Q: Why use JWT instead of session cookies?**
A: "JWT is stateless - the server doesn't need to store session data, making it scalable across multiple servers without shared session storage. The token itself contains all necessary information (user ID, role) encoded in the payload. This is particularly beneficial for our architecture where the frontend and backend are potentially on different domains. Additionally, JWTs work seamlessly with mobile apps and APIs. However, we acknowledge the tradeoff: JWTs cannot be invalidated before expiration without implementing a token blacklist."

**Q: How do you prevent brute force login attempts?**
A: "Currently, the system relies on strong passwords and password hashing. For production deployment, we would implement several brute-force protection mechanisms: rate limiting on the login endpoint (e.g., 5 attempts per 15 minutes per IP), account lockout after repeated failed attempts, CAPTCHA after a threshold of failures, and logging of failed attempts for security monitoring. We could use libraries like express-rate-limit and implement account lockout logic in the database with a locked_until timestamp field."

**Q: What happens if the JWT secret is compromised?**
A: "If the JWT_SECRET is compromised, an attacker could forge valid tokens for any user. Mitigation strategies include: immediately rotating the secret (which invalidates all existing tokens), storing the secret securely in environment variables never committed to version control, using a key management service (KMS) in production, implementing token versioning to allow selective invalidation, and monitoring for unusual token usage patterns. For critical systems, we could implement token refresh with separate short-lived access tokens and longer-lived refresh tokens stored securely."

**Q: How do you handle authorization for different admin roles?**
A: "Currently, all admins have the same permissions. For granular role-based access control, we would extend the admins table with a role field (e.g., 'super_admin', 'event_manager', 'resource_manager'). The JWT payload would include this role, and authMiddleware would be enhanced to check not just authentication but also authorization: `requireRole(['super_admin', 'event_manager'])`. This allows different admin types to access only their authorized features, following the principle of least privilege."

---

# CUE CARD 12: TASK MANAGEMENT (TO-DO LIST)
**Category:** Productivity Feature - Admin Protected
**Location:** `components/EnhancedTodoList.tsx` + `components/TodoList.tsx`
**Backend:** `backend/tasks.js`

## What It Does:
Provides administrators with a to-do list to track tasks, set due dates, and manage workload efficiently.

## Key Features:
- **Create Tasks** - Add new to-do items
- **Title & Description** - Brief title with detailed notes
- **Due Date & Time** - Set specific deadlines
- **Mark Complete** - Checkbox for completion tracking
- **Delete Tasks** - Remove completed or obsolete tasks
- **Urgency Alerts** - Popup for tasks due within 10 minutes
- **Expandable List** - Collapse/expand to save screen space
- **Date Sorting** - Tasks ordered by due date
- **Persistent Storage** - Database-backed task list

## Technical Implementation:
- **Components:**
  - EnhancedTodoList.tsx - Expandable accordion style
  - TodoList.tsx - Basic list display
- **API Endpoints:**
  - GET `/api/tasks` (optional date filter)
  - POST `/api/tasks` (create)
  - PUT `/api/tasks/:id` (mark complete)
  - DELETE `/api/tasks/:id` (remove)
- **Database Table:** `tasks`
- **State Management:** React useState for task list and form
- **Protected:** authMiddleware required

## Task Fields:
- `id` - Primary key
- `title` - Task title (required)
- `note` - Task description/details (optional)
- `due_date` - Due date and time (DATETIME)
- `completed` - Boolean (0=pending, 1=complete)
- `created_at` - Creation timestamp

## How It Works:

### Create Task:
1. Admin clicks "Add Task" button
2. Modal/form appears with fields:
   - Title (text input, required)
   - Note (textarea, optional)
   - Due Date (date picker)
   - Due Time (time picker)
3. Fill form and submit
4. POST request to `/api/tasks`:
   ```json
   {
     "title": "Review event approvals",
     "note": "Check pending gymnasium requests",
     "due_date": "2025-11-12T14:30:00"
   }
   ```
5. Backend validates and inserts record
6. Returns task ID and success
7. Frontend adds task to list
8. List re-sorts by due date

### View Tasks:
1. Component mounts on dashboard
2. GET request to `/api/tasks`
3. Backend queries: `SELECT * FROM tasks ORDER BY due_date ASC`
4. Returns array of tasks
5. Frontend displays tasks in list
6. Each task shows:
   - Checkbox (completion status)
   - Title
   - Note (if present)
   - Due date/time
   - Delete button
7. Overdue tasks highlighted (red text or icon)
8. Completed tasks shown with strikethrough (or hidden)

### Mark Complete:
1. User clicks checkbox on task
2. PUT request to `/api/tasks/:id`:
   ```json
   { "completed": true }
   ```
3. Backend updates: `UPDATE tasks SET completed=1 WHERE id=:id`
4. Returns success
5. Frontend toggles task visual state:
   - Adds strikethrough
   - Grays out text
   - Optionally moves to bottom of list

### Delete Task:
1. User clicks delete/trash icon
2. Confirmation prompt (optional)
3. DELETE request to `/api/tasks/:id`
4. Backend deletes: `DELETE FROM tasks WHERE id=:id`
5. Returns success
6. Frontend removes task from list
7. List re-renders

### Urgent Task Alert:
1. Dashboard loads, fetches tasks
2. Frontend calculates time to each due date:
   ```javascript
   const now = new Date()
   const dueDate = new Date(task.due_date)
   const minutesUntilDue = (dueDate - now) / 60000
   ```
3. Filter tasks where `minutesUntilDue <= 10 && minutesUntilDue > 0`
4. If urgent tasks exist:
   - Display modal/popup
   - List urgent task titles
   - Show due times
   - Provide "Mark Complete" quick action
5. User can dismiss or take action

## What to Say to Panelists:
"The Task Management system helps administrators stay organized and meet deadlines. Admins can create tasks with specific due dates and times, providing structure to their workflow. For example, 'Review pending event requests by 2 PM today' or 'Order additional chairs by Friday'. Each task can have a descriptive note field for additional context. The system sorts tasks by due date, ensuring upcoming deadlines are prominently displayed. A unique feature is the urgent task notification - if any task is due within the next 10 minutes, a popup modal alerts the admin as soon as they access the dashboard, preventing missed deadlines. Completed tasks can be marked with a checkbox, providing satisfaction and visual tracking of progress, then deleted once no longer needed. The enhanced version features an expandable/collapsible design, allowing admins to hide the task list when not needed, saving valuable dashboard screen real estate."

## Demo Points:
- Show task list on dashboard
- Click "Add Task" and fill form
- Set due date and time (e.g., 5 minutes from now)
- Submit and show task added to list
- Refresh dashboard to trigger urgent task popup
- Show task highlighted as urgent
- Mark task as complete (checkbox)
- Show strikethrough on completed task
- Delete completed task
- Demonstrate expand/collapse functionality

## Technical Questions You Might Get:
**Q: How do you handle recurring tasks?**
A: "Currently, tasks are one-time items. To implement recurring tasks, we would add fields for recurrence_pattern (daily, weekly, monthly) and recurrence_end_date. When a recurring task is marked complete, instead of just updating the completed field, we would create a new task with the due_date advanced by the recurrence interval. For example, a daily task due today would generate a new task due tomorrow. This maintains a history of completed occurrences while creating future instances."

**Q: Can tasks be assigned to specific admins?**
A: "Currently, all tasks are visible to all admins. For multi-admin environments, we would add an assigned_to field (foreign key to admins.id). The task list would filter to show only the logged-in admin's tasks by default, with an option to view all tasks. The authMiddleware already provides req.user.id, so we'd use that to filter: `SELECT * FROM tasks WHERE assigned_to=:userId`. Task creation would default to assigning to the creator but allow reassignment."

**Q: How do you prevent the urgent task popup from becoming annoying?**
A: "We could implement several improvements: First, use localStorage to remember if the user dismissed the popup during this session, showing it only once until page refresh. Second, add a 'snooze' option that postpones the alert for 5 minutes. Third, only show the popup for tasks that newly became urgent since the last check, not all urgent tasks every time. Fourth, replace the modal with a less intrusive notification banner or badge count on the dashboard. The key is balancing urgency with user experience."

**Q: How do you handle time zones?**
A: "Currently, the system uses the server's time zone for storing due dates. For production systems with users in different time zones, we would store all timestamps in UTC in the database and convert to the user's local time zone on the frontend using JavaScript's Date methods or a library like moment-timezone. We'd capture the user's time zone during login (from browser) or let them set it in preferences, then convert all displayed times accordingly."

---

# CUE CARD 13: REAL-TIME UPDATES (Server-Sent Events)
**Category:** Infrastructure Feature
**Location:** `backend/sse.js` + Frontend SSE consumers

## What It Does:
Provides real-time, server-to-client push notifications without requiring page refreshes or polling.

## Key Features:
- **Server-Sent Events (SSE)** - Unidirectional server-to-client streaming
- **Client Connection Management** - Track connected clients
- **Event Broadcasting** - Send updates to all connected clients
- **Notification Delivery** - Real-time event approval/decline alerts
- **Auto-Reconnection** - Built-in reconnection on disconnect
- **Keep-Alive** - Periodic heartbeat to maintain connection

## Technical Implementation:
- **Protocol:** SSE (Server-Sent Events) - W3C standard
- **Backend Endpoint:** GET `/api/sse`
- **Content-Type:** `text/event-stream`
- **Connection:** Long-lived HTTP connection
- **Client Library:** Native EventSource API
- **Transport:** HTTP/1.1 chunked transfer encoding

## How It Works:

### Connection Establishment:
1. **Client Initiates:** Frontend creates EventSource
   ```javascript
   const eventSource = new EventSource('/api/sse')
   ```
2. **Server Accepts:** Backend responds with SSE headers:
   ```
   Content-Type: text/event-stream
   Cache-Control: no-cache
   Connection: keep-alive
   ```
3. **Client Registered:** Backend adds client to clients array
4. **Keep-Alive:** Server sends periodic comments to prevent timeout
   ```
   : heartbeat\n\n
   ```
5. **Connection Persists:** Stays open for real-time updates

### Broadcasting Events:

**Scenario: Event Approved**

1. **Admin Action:** Admin approves event in Notifications page
2. **API Call:** PUT `/api/notifications/:id/approve`
3. **Backend Processing:**
   - Updates notification status
   - Updates event status
4. **SSE Broadcast:**
   ```javascript
   broadcastNotification({
     type: 'event_approved',
     eventId: 123,
     eventName: 'University Festival',
     message: 'Event has been approved'
   })
   ```
5. **Format SSE Message:**
   ```
   data: {"type":"event_approved","eventId":123,"eventName":"University Festival"}\n\n
   ```
6. **Send to All Clients:** Iterates clients array, writes to each response stream
7. **Clients Receive:** All connected EventSource instances trigger 'message' event
8. **Frontend Handlers:** Each client processes the notification:
   ```javascript
   eventSource.addEventListener('message', (event) => {
     const data = JSON.parse(event.data)
     if (data.type === 'event_approved') {
       // Show toast notification
       // Refresh notification list
       // Update calendar
     }
   })
   ```
9. **UI Updates:** Affected components refresh data

### Client Connection Management:

**Connection Array:**
```javascript
let clients = []
```

**Add Client:**
```javascript
clients.push(res)  // res = Express response object
```

**Remove Client:**
```javascript
res.on('close', () => {
  clients = clients.filter(client => client !== res)
})
```

**Broadcast Function:**
```javascript
function broadcastNotification(data) {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`)
  })
}
```

### Event Types:
- `event_approved` - Event approval notification
- `event_declined` - Event decline notification
- `new_event` - New event submission
- `notification` - General notification

### Auto-Reconnection:
- EventSource automatically reconnects on connection drop
- Exponential backoff prevents server overload
- Last-Event-ID header for resuming stream (if implemented)

## What to Say to Panelists:
"To provide a modern, responsive user experience, we implemented real-time updates using Server-Sent Events. SSE is a W3C standard that enables servers to push updates to clients over a persistent HTTP connection. When an admin opens the Notifications page, the frontend establishes an SSE connection to our backend. This connection remains open, allowing the server to instantly push notifications when events occur - such as new event submissions or approvals. For example, if one admin approves an event, all other connected admins immediately see the notification move from the Pending tab to the Approved tab without manually refreshing. This is crucial for collaborative environments where multiple administrators might be working simultaneously. SSE is simpler than WebSockets for our use case because communication is unidirectional - server to client only - and it uses standard HTTP, making it compatible with existing infrastructure without requiring WebSocket support. The EventSource API includes automatic reconnection, ensuring users stay connected even if network hiccups occur."

## Demo Points:
- Open Notifications page in two browser windows (different admin sessions)
- Show EventSource connection in DevTools Network tab (event-stream)
- Approve an event in one window
- Immediately show notification update in second window (no refresh)
- Explain SSE connection persistence
- Show keep-alive comments in Network tab
- Demonstrate auto-reconnection (disconnect network, reconnect)

## Technical Questions You Might Get:
**Q: Why SSE instead of WebSockets?**
A: "SSE is ideal for our use case because communication is unidirectional - server pushing to clients. WebSockets are bidirectional, which adds complexity we don't need since clients communicate with the server via regular HTTP requests. SSE uses standard HTTP, works through proxies and firewalls more reliably, and includes built-in automatic reconnection. It's simpler to implement and debug. We'd choose WebSockets if we needed bidirectional real-time communication, like a chat feature."

**Q: How do you scale SSE with multiple server instances?**
A: "In a load-balanced environment with multiple servers, each server maintains its own clients array, so clients connected to server A won't receive broadcasts from server B. To solve this, we would implement a pub/sub system using Redis. When a server needs to broadcast, it publishes to a Redis channel. All servers subscribe to this channel and forward messages to their connected clients. This ensures broadcasts reach all clients regardless of which server instance they're connected to."

**Q: What happens if a client's connection drops?**
A: "The EventSource API automatically attempts to reconnect using exponential backoff. On the backend, when a client disconnects, the connection's 'close' event fires, and we remove that client from the clients array, preventing attempts to send to a closed connection. When the client reconnects, it establishes a new SSE connection and is re-added to the clients array. For critical applications, we could implement Last-Event-ID headers to allow clients to resume from where they left off."

**Q: How do you prevent memory leaks with long-lived connections?**
A: "We handle cleanup in several ways: First, we listen for the 'close' event on each response object and remove disconnected clients from the array. Second, we could implement a connection timeout (e.g., 1 hour) forcing reconnection to clear any stale state. Third, we could periodically scan the clients array and remove invalid or closed connections. Fourth, on the frontend, we properly close EventSource connections when components unmount using cleanup functions in useEffect hooks."

---

# CUE CARD 14: DATA VISUALIZATION & ANALYTICS
**Category:** Insights Feature
**Location:** `components/ChartSection.tsx` + `components/ResourceCharts.tsx`

## What It Does:
Visualizes system data through interactive charts and graphs, providing insights into event trends, resource utilization, and system usage patterns.

## Key Features:
- **Event Timeline Charts** - Visualize events over time
- **Resource Utilization Graphs** - Track equipment and venue usage
- **Approval Pattern Analysis** - Trends in approvals vs. declines
- **Interactive Tooltips** - Hover for detailed data
- **Responsive Design** - Charts adapt to screen size
- **Multiple Chart Types** - Line, bar, pie charts
- **KPI Metric Cards** - Highlighted key numbers

## Technical Implementation:
- **Library:** Recharts 3.0.2 (React charting library)
- **Components:**
  - ChartSection.tsx - Dashboard charts
  - ResourceCharts.tsx - Resource-specific charts
  - KPICard.tsx - Metric display cards
- **Data Sources:**
  - Aggregated from events, resources, venues
  - Calculated from notifications (approval patterns)
- **Chart Types:**
  - LineChart - Event timeline
  - BarChart - Resource allocation
  - PieChart - Venue distribution
  - AreaChart - Cumulative trends

## Charts Implemented:

### 1. Event Timeline (Line Chart)
**What It Shows:**
- Number of events over time (by month or week)
- Trend line showing growth or decline
- Approved vs. pending events

**Data Processing:**
```javascript
// Group events by month
const eventsByMonth = events.reduce((acc, event) => {
  const month = new Date(event.start_date).toLocaleString('default', { month: 'short' })
  acc[month] = (acc[month] || 0) + 1
  return acc
}, {})
```

**Why It's Useful:**
- Identify peak event seasons
- Forecast resource needs
- Track system adoption growth

### 2. Resource Utilization (Bar Chart)
**What It Shows:**
- Equipment items on X-axis
- Total quantity vs. available quantity on Y-axis
- Utilization percentage

**Data Display:**
- Green bars: Available quantity
- Red bars: Allocated quantity
- Percentage label: Utilization rate

**Why It's Useful:**
- Identify over-utilized equipment
- Inform procurement decisions
- Balance resource allocation

### 3. Venue Distribution (Pie Chart)
**What It Shows:**
- Percentage of events by venue
- Which venues are most popular
- Underutilized venues

**Data:**
- EMRC: 30% of events
- Gymnasium: 25%
- HRM Hall: 20%
- Quadrangle: 15%
- Sport Hall: 10%

**Why It's Useful:**
- Optimize venue scheduling
- Identify capacity needs
- Guide facility planning

### 4. Approval Patterns (Area Chart)
**What It Shows:**
- Approval vs. decline rate over time
- Average approval time
- Pending backlog trends

**Insights:**
- Administrative efficiency metrics
- Bottleneck identification
- Workload distribution

## How It Works:

### Data Fetching:
1. Chart component mounts
2. Fetches relevant data (events, resources, etc.)
3. Processes data for chart format
4. Updates chart state

### Data Transformation:
```javascript
// Example: Transform events for timeline chart
const chartData = events.reduce((acc, event) => {
  const date = new Date(event.start_date)
  const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

  if (!acc[monthYear]) {
    acc[monthYear] = { date: monthYear, approved: 0, pending: 0 }
  }

  if (event.status === 'approved') {
    acc[monthYear].approved++
  } else if (event.status === 'pending') {
    acc[monthYear].pending++
  }

  return acc
}, {})

// Convert to array for Recharts
const chartArray = Object.values(chartData)
```

### Rendering:
```jsx
<LineChart width={600} height={300} data={chartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="approved" stroke="#10b981" />
  <Line type="monotone" dataKey="pending" stroke="#f59e0b" />
</LineChart>
```

### Interactive Features:
- **Hover Tooltip:** Shows exact values
- **Legend Toggle:** Click to show/hide data series
- **Responsive:** Adjusts width based on container
- **Animation:** Smooth transitions on load and update

## What to Say to Panelists:
"Data visualization transforms raw numbers into actionable insights. We integrated Recharts, a powerful React charting library, to create interactive visualizations across the system. The Event Timeline chart helps administrators identify trends - for example, seeing increased event submissions before holidays allows proactive resource planning. The Resource Utilization bar chart provides at-a-glance visibility into equipment availability, highlighting items that are frequently at capacity and might need additional procurement. The Venue Distribution pie chart reveals which facilities are most popular, informing decisions about maintenance priorities and scheduling policies. All charts are interactive - hovering over data points displays precise values, and legends can be clicked to filter data series. The charts are responsive, adapting to different screen sizes for mobile access. This data-driven approach supports informed decision-making rather than relying on intuition alone."

## Demo Points:
- Navigate to dashboard showing charts
- Hover over chart elements to show tooltips
- Click legend items to toggle data series
- Explain what each chart reveals about system usage
- Point out specific insights (e.g., "See how Gymnasium is our most-used venue")
- Show chart responsiveness by resizing window
- Explain data aggregation logic

## Technical Questions You Might Get:
**Q: How do you ensure chart performance with large datasets?**
A: "We implement several optimization strategies. First, we aggregate data before rendering - instead of plotting individual events (potentially thousands), we group by month or week, reducing data points. Second, we use Recharts' built-in virtualization for large datasets. Third, we implement data pagination or date range filters, allowing users to chart specific time periods rather than all historical data. Fourth, we memoize chart data using React.useMemo to prevent unnecessary recalculations on re-renders."

**Q: Can admins export chart data?**
A: "Currently, charts are view-only. However, we could easily implement export functionality. For image export, we'd use a library like html2canvas to capture the chart as PNG. For data export, we'd provide CSV download of the underlying chart data using a simple conversion function. We could add an 'Export' button to each chart offering both options, useful for including visualizations in reports or presentations."

**Q: How do you handle empty data or missing dates?**
A: "Recharts gracefully handles empty datasets by showing an empty chart with axes. For missing dates in time series, we fill gaps with zero values or null, depending on desired visualization. For example, if no events occurred in February, we'd include a February data point with count: 0 to maintain timeline continuity. We also implement conditional rendering to show a 'No data available' message instead of an empty chart if the dataset is entirely empty."

**Q: Why choose Recharts over other charting libraries?**
A: "Recharts is purpose-built for React with a component-based API that aligns with React's declarative paradigm. It's lightweight compared to D3.js, easier to learn, and provides excellent responsive design out of the box. Alternatives like Chart.js require wrapper libraries for React and use imperative APIs. Recharts' composability allows us to build complex charts from simple components, and its TypeScript support provides type safety. For our use case - dashboard analytics rather than highly custom visualizations - Recharts offers the ideal balance of capability and simplicity."

---

# GENERAL DEFENSE STRATEGIES

## Handling Questions About System Limitations:

**Be Honest and Constructive:**
"Every system has limitations, and we've documented ours thoroughly. [Specific limitation] is a known constraint, but we've outlined potential solutions in our thesis. For production deployment, we would implement [enhancement]."

## Comparing to Existing Systems:

**Differentiate Your Work:**
"While Google Calendar offers comprehensive scheduling, Schedulink is tailored specifically for [your institution's] needs, integrating resource management, approval workflows, and reporting - features not available in generic calendar apps. Our system provides a complete event management solution rather than just scheduling."

## Explaining Technical Choices:

**Justify Decisions:**
"We chose Next.js over traditional React because the App Router provides excellent performance through server-side rendering, built-in API routes eliminate the need for a separate Express server for the frontend, and the file-based routing simplifies code organization. This aligns with modern web development best practices."

## Demonstrating Technical Depth:

**Go Beyond Surface:**
Don't just say "We used React." Say "We used React with functional components and hooks like useState for local state management, useEffect for side effects like data fetching, and custom hooks like useEventForm to encapsulate and reuse form logic across multiple components."

## Handling "Why Not..." Questions:

**Acknowledge Alternatives:**
"That's a valid alternative approach. We considered [alternative] but chose [our approach] because [specific reasons based on requirements, team expertise, time constraints, or technical benefits]."

---

# QUICK REFERENCE: System Statistics

**Update these with your actual numbers:**

- **Total Features:** 14 major features
- **Lines of Code:** ~5,000+ (estimate based on file sizes)
- **API Endpoints:** 30+
- **Database Tables:** 10 tables
- **Frontend Components:** 20+ React components
- **Technology Stack:** Next.js, React, TypeScript, Tailwind CSS, Express, MySQL, Cloudinary
- **Security:** JWT authentication, bcrypt hashing, input validation
- **Real-time:** Server-Sent Events for live updates
- **Cloud Integration:** Cloudinary for file storage
- **Visualization:** Recharts for analytics
- **Development Time:** [Your actual timeframe]
- **Team Size:** [Number of members]

---

# FINAL TIPS FOR DEFENSE

1. **Know Your Code:** Be able to explain any part of the system
2. **Practice Demo:** Rehearse live demonstration multiple times
3. **Prepare Backup:** Have screenshots/video in case of technical issues
4. **Stay Calm:** Take a breath before answering difficult questions
5. **Be Honest:** If you don't know, admit it professionally
6. **Show Enthusiasm:** Demonstrate pride in your work
7. **Use Technical Terms:** Speak professionally with correct terminology
8. **Make Eye Contact:** Engage with panelists
9. **Time Management:** Keep answers concise but complete
10. **Team Coordination:** If group defense, coordinate who answers what

---

# GOOD LUCK!

You've built a comprehensive, production-quality system. Approach the defense with confidence. You know Schedulink better than anyone - trust your knowledge and preparation.
