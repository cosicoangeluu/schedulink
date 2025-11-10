# Activity Diagrams - Schedulink System

## 1. Admin Management Flow

```mermaid
flowchart TD
    Start([Start]) --> AdminLogin[Admin logs into system]
    AdminLogin --> System1{System validates credentials}
    System1 -->|Invalid| Error1[Display error message]
    Error1 --> AdminLogin
    System1 -->|Valid| Dashboard[Display Admin Dashboard]
    Dashboard --> SelectAction{Admin selects action}

    SelectAction -->|Manage Users| ViewUsers[System displays user list]
    ViewUsers --> ModifyUser{Admin modifies user}
    ModifyUser -->|Add User| AddForm[Fill user details]
    ModifyUser -->|Edit User| EditForm[Update user details]
    ModifyUser -->|Delete User| ConfirmDel[Confirm deletion]

    AddForm --> SystemSave1[System saves new user]
    EditForm --> SystemSave1
    ConfirmDel --> SystemDel[System deletes user]

    SystemSave1 --> Notify1[System sends notification to user]
    SystemDel --> Notify1
    Notify1 --> StudentReceive1[Student receives notification]
    StudentReceive1 --> Success1[Display success message]
    Success1 --> End([End])
```

## 2. Admin TODO List Management Flow

```mermaid
flowchart TD
    Start([Start]) --> AdminDashboard[Admin opens dashboard]
    AdminDashboard --> SystemLoad[System loads TODO list]
    SystemLoad --> DisplayTODO[Display TODO list to Admin]

    DisplayTODO --> AdminAction{Admin selects action}

    AdminAction -->|Add Task| AddTask[Admin enters new task details]
    AdminAction -->|Update Status| SelectTask[Admin selects a task]
    AdminAction -->|Edit Task| SelectEdit[Admin selects task to edit]
    AdminAction -->|Delete Task| SelectDelete[Admin selects task to delete]

    AddTask --> SystemValidateAdd{System validates input}
    SystemValidateAdd -->|Invalid| ErrorAdd[Display error message]
    ErrorAdd --> AddTask
    SystemValidateAdd -->|Valid| SystemSaveNew[System saves new task]
    SystemSaveNew --> SystemRefresh[System refreshes TODO list]

    SelectTask --> UpdateStatus[Admin updates task status]
    UpdateStatus --> StatusType{Status type}
    StatusType -->|Mark Complete| SystemComplete[System marks task as completed]
    StatusType -->|Mark In Progress| SystemProgress[System updates to in progress]
    StatusType -->|Mark Pending| SystemPending[System updates to pending]

    SystemComplete --> SystemLog[System logs status change]
    SystemProgress --> SystemLog
    SystemPending --> SystemLog
    SystemLog --> SystemRefresh

    SelectEdit --> EditForm[Admin modifies task details]
    EditForm --> SystemValidateEdit{System validates changes}
    SystemValidateEdit -->|Invalid| ErrorEdit[Display validation errors]
    ErrorEdit --> EditForm
    SystemValidateEdit -->|Valid| SystemUpdate[System updates task]
    SystemUpdate --> SystemRefresh

    SelectDelete --> ConfirmDelete{Admin confirms deletion}
    ConfirmDelete -->|Cancel| DisplayTODO
    ConfirmDelete -->|Confirm| SystemDelete[System deletes task]
    SystemDelete --> SystemRefresh

    SystemRefresh --> DisplayUpdated[Display updated TODO list]
    DisplayUpdated --> Success[Show success message]
    Success --> End([End])
```

## 3. Add Resources/Venue/Equipment Flow

```mermaid
flowchart TD
    Start([Start]) --> AdminSelect{Admin selects type}

    AdminSelect -->|Resource| ResourceForm[Fill resource details]
    AdminSelect -->|Venue| VenueForm[Fill venue details]
    AdminSelect -->|Equipment| EquipmentForm[Fill equipment details]

    ResourceForm --> UploadFiles[Upload resource files]
    VenueForm --> VenueDetails[Enter capacity, location, features]
    EquipmentForm --> EquipDetails[Enter equipment specifications]

    UploadFiles --> SystemValidate{System validates data}
    VenueDetails --> SystemValidate
    EquipDetails --> SystemValidate

    SystemValidate -->|Invalid| ErrorMsg[Display validation errors]
    ErrorMsg --> AdminSelect

    SystemValidate -->|Valid| SystemSave[System saves to database]
    SystemSave --> SystemNotify[System broadcasts availability]
    SystemNotify --> StudentNotified[Students receive notification]
    StudentNotified --> StudentView[Students can view new items]
    StudentView --> End([End])
```

## 4. Delete Event Flow

```mermaid
flowchart TD
    Start([Start]) --> AdminViewEvents[Admin views event list]
    AdminViewEvents --> SelectEvent[Admin selects event to delete]
    SelectEvent --> ConfirmDelete{Admin confirms deletion}

    ConfirmDelete -->|Cancel| AdminViewEvents
    ConfirmDelete -->|Confirm| SystemCheck{System checks dependencies}

    SystemCheck -->|Has active tasks| WarnAdmin[Display warning about active tasks]
    WarnAdmin --> ForceDelete{Admin force delete?}
    ForceDelete -->|No| AdminViewEvents
    ForceDelete -->|Yes| SystemDelete[System deletes event]

    SystemCheck -->|No dependencies| SystemDelete
    SystemDelete --> SystemDeleteTasks[System deletes related tasks]
    SystemDeleteTasks --> SystemDeleteBookings[System deletes bookings]
    SystemDeleteBookings --> SystemLog[System logs deletion]
    SystemLog --> SystemNotify[System notifies affected students]
    SystemNotify --> StudentsNotified[Students receive cancellation]
    StudentsNotified --> StudentUpdate[Student task lists updated]
    StudentUpdate --> Success[Display success message]
    Success --> End([End])
```

## 5. Edit Event Flow

```mermaid
flowchart TD
    Start([Start]) --> AdminViewEvents[Admin views event list]
    AdminViewEvents --> SelectEvent[Admin selects event to edit]
    SelectEvent --> SystemLoad[System loads event details]
    SystemLoad --> DisplayForm[Display edit form]
    DisplayForm --> AdminEdit[Admin modifies event details]

    AdminEdit --> ChangeType{What changed?}
    ChangeType -->|Date/Time| CheckConflicts[System checks conflicts]
    ChangeType -->|Venue| CheckVenue[System checks venue availability]
    ChangeType -->|Details| DirectSave[Prepare to save]

    CheckConflicts --> HasConflict{Conflicts found?}
    HasConflict -->|Yes| ShowConflicts[Display conflicts]
    ShowConflicts --> AdminResolve{Admin resolves?}
    AdminResolve -->|Cancel| AdminEdit
    AdminResolve -->|Force| DirectSave

    HasConflict -->|No| DirectSave
    CheckVenue --> VenueAvail{Venue available?}
    VenueAvail -->|No| ShowVenueError[Display venue conflict]
    ShowVenueError --> AdminEdit
    VenueAvail -->|Yes| DirectSave

    DirectSave --> SystemSave[System saves changes]
    SystemSave --> SystemLog[System logs modifications]
    SystemLog --> NotifyChanges{Significant changes?}

    NotifyChanges -->|Yes| SystemNotify[System notifies students]
    NotifyChanges -->|No| Success[Display success message]
    SystemNotify --> StudentsNotified[Students receive update]
    StudentsNotified --> StudentView[Students see updated event]
    StudentView --> Success
    Success --> End([End])
```

## 6. Report Upload Flow

```mermaid
flowchart TD
    Start([Start]) --> StudentEvent[Student views completed event]
    StudentEvent --> SelectReport[Student selects 'Upload Report']
    SelectReport --> FillForm[Student fills report details]
    FillForm --> UploadFile[Student uploads report file]

    UploadFile --> SystemValidate{System validates}
    SystemValidate -->|Invalid format| ErrorFormat[Display format error]
    ErrorFormat --> UploadFile

    SystemValidate -->|File too large| ErrorSize[Display size error]
    ErrorSize --> UploadFile

    SystemValidate -->|Valid| SystemUpload[System uploads to cloud storage]
    SystemUpload --> SystemSave[System saves report metadata]
    SystemSave --> SystemNotify[System notifies Admin]
    SystemNotify --> AdminReceive[Admin receives notification]

    AdminReceive --> AdminReview[Admin reviews report]
    AdminReview --> AdminAction{Admin action}

    AdminAction -->|Approve| SystemApprove[System approves report]
    AdminAction -->|Reject| RejectForm[Admin enters feedback]
    AdminAction -->|Request changes| FeedbackForm[Admin requests revisions]

    RejectForm --> SystemReject[System rejects report]
    FeedbackForm --> SystemFeedback[System sends feedback]

    SystemApprove --> NotifyStudent[System notifies student]
    SystemReject --> NotifyStudent
    SystemFeedback --> NotifyStudent

    NotifyStudent --> StudentReceive[Student receives notification]
    StudentReceive --> NeedsRevision{Needs revision?}
    NeedsRevision -->|Yes| FillForm
    NeedsRevision -->|No| End([End])
```

## 7. Event Creation & Approval Flow

```mermaid
flowchart TD
    Start([Start]) --> InitiatorType{Who initiates?}

    InitiatorType -->|Admin| AdminCreate[Admin creates event]
    InitiatorType -->|Student| StudentCreate[Student creates event request]

    StudentCreate --> StudentForm[Student fills event details]
    StudentForm --> StudentVenue[Student selects venue]
    StudentVenue --> StudentEquip[Student selects equipment]
    StudentEquip --> StudentSubmit[Student submits for approval]
    StudentSubmit --> SystemValidate{System validates}

    SystemValidate -->|Invalid| ErrorMsg[Display validation errors]
    ErrorMsg --> StudentForm

    SystemValidate -->|Valid| SystemSaveDraft[System saves as pending]
    SystemSaveDraft --> SystemNotifyAdmin[System notifies Admin]
    SystemNotifyAdmin --> AdminReview[Admin reviews request]

    AdminReview --> AdminDecision{Admin decision}
    AdminDecision -->|Reject| AdminRejectReason[Admin enters rejection reason]
    AdminRejectReason --> SystemReject[System rejects event]
    SystemReject --> NotifyStudentReject[System notifies student]
    NotifyStudentReject --> StudentSeeReject[Student sees rejection]
    StudentSeeReject --> Revise{Student revises?}
    Revise -->|Yes| StudentForm
    Revise -->|No| End([End])

    AdminDecision -->|Request changes| AdminChanges[Admin specifies changes needed]
    AdminChanges --> SystemChanges[System sends change request]
    SystemChanges --> NotifyStudentChange[System notifies student]
    NotifyStudentChange --> StudentForm

    AdminDecision -->|Approve| AdminApprove[Admin approves event]
    AdminCreate --> AdminForm[Admin fills event details]
    AdminForm --> AdminVenue[Admin assigns venue]
    AdminVenue --> AdminEquip[Admin assigns equipment]
    AdminEquip --> AdminApprove

    AdminApprove --> SystemCreate[System creates event]
    SystemCreate --> SystemBookVenue[System books venue]
    SystemBookVenue --> SystemBookEquip[System reserves equipment]
    SystemBookEquip --> SystemAssignTasks[System creates default tasks]
    SystemAssignTasks --> SystemPublish[System publishes event]
    SystemPublish --> SystemNotifyAll[System notifies all students]
    SystemNotifyAll --> StudentsNotified[Students receive notification]
    StudentsNotified --> StudentViewEvent[Students can view event]
    StudentViewEvent --> End
```

## Flow Legend

**Actors:**
- **Admin**: System administrator with full privileges
- **System**: Backend processing and validation
- **Student**: End users (students/members)

**Actions:**
- Rectangles: Process/Action steps
- Diamonds: Decision points
- Rounded rectangles: Start/End points
- Arrows: Flow direction

**Notification Flow:**
- Admin → System → Student (for approvals, notifications)
- Student → System → Admin (for requests, submissions)
- System → All (for broadcasts)
