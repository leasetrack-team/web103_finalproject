# Entity Relationship Diagram

The database is designed to manage residential units, users, maintenance requests, and technician assignments.

Tenants can submit maintenance requests associated with their units. Managers can assign one or more technicians to a maintenance request, and technicians can be assigned to multiple requests.


## List of Tables


The database contains the following tables:

- `unit`
- `user`
- `maintenance_request`
- `request_assignment`

### Table: `unit`

The `unit` table stores information about each residential unit.

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | Primary key that uniquely identifies the unit |
| status | enum | Current status of the unit |
| unit_number | varchar(50) | Unique number or identifier assigned to the unit |
| floor | integer | Floor where the unit is located |
| bedrooms | integer | Number of bedrooms in the unit |
| bathrooms | decimal | Number of bathrooms in the unit |
| created_at | timestamp | Date and time when the unit was created; defaults to the current date and time |

### Table: `user`

The `user` table stores information about tenants, technicians, and managers.

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | Primary key that uniquely identifies the user |
| unit_id | integer | Foreign key referencing `unit.id`; nullable for technicians and managers |
| full_name | varchar(50) | Full name of the user |
| email | varchar(255) | Unique email address of the user |
| hashed_password | varchar(255) | Encrypted version of the user's password |
| role | enum | Role assigned to the user |
| created_at | timestamp | Date and time when the user account was created; defaults to the current date and time |

### Table: `maintenance_request`

The `maintenance_request` table stores maintenance tickets submitted by tenants.

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | Primary key that uniquely identifies the maintenance request |
| tenant_id | integer | Foreign key referencing the user who submitted the request |
| unit_id | integer | Foreign key referencing the unit associated with the request |
| category | enum | Category of the maintenance issue |
| title | varchar(255) | Short title describing the maintenance issue |
| description | varchar(255) | Detailed description of the maintenance issue |
| urgency | enum | Urgency level of the request |
| status | enum (`RequestStatus`) | Current status of the maintenance request |
| created_at | timestamp | Date and time when the request was created; defaults to the current date and time |
| updated_at | timestamp | Date and time when the request was last updated |
| resolved_at | timestamp | Date and time when the request was resolved |
| closing_notes | varchar(255) | Final notes added after the maintenance request is completed |

### Table: `request_assignment`

The `request_assignment` table connects maintenance requests with the technicians assigned to complete them.

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | Primary key that uniquely identifies the assignment |
| request_id | integer | Foreign key referencing `maintenance_request.id` |
| technician_id | integer | Foreign key referencing the assigned technician in `user.id` |
| status | enum (`AssignmentStatus`) | Current status of the technician assignment |
| assigned_at | timestamp | Date and time when the technician was assigned; defaults to the current date and time |
| estimated_completion_date | timestamp | Estimated date and time when the assigned work will be completed |

### Entity Relationships

- One unit can be associated with zero or many users.
- Each user can be associated with zero or one unit.
- One unit can have zero or many maintenance requests.
- Each maintenance request belongs to one unit.
- One tenant can submit zero or many maintenance requests.
- Each maintenance request is submitted by one tenant.
- One maintenance request can have zero or many technician assignments.
- One technician can have zero or many request assignments.
- The `request_assignment` table creates a many-to-many relationship between maintenance requests and technicians.

### Enum Definitions

#### `Category`

- `plumbing`
- `hvac`
- `electrical`
- `carpentry`

#### `RequestStatus`

- `submitted`
- `assigned`
- `in_progress`
- `completed`
- `cancelled`

#### `AssignmentStatus`

- `assigned`
- `in_progress`
- `completed`
- `cancelled`

#### `UnitStatus`

- `occupied`
- `vacant`
- `under_maintenance`
- `inactive`

#### `UserRole`

- `tenant`
- `technician`
- `manager`

#### `Urgency`

- `low`
- `medium`
- `high`


## Entity Relationship Diagram

![Entity Relationship Diagram](https://i.imgur.com/c9kMy0F.png)