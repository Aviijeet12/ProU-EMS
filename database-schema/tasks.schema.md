# Tasks Collection Schema

## Collection Name
tasks

## Purpose
Stores task objects assigned to users or employees.

## Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Task identifier |
| title | String | Required | Task subject |
| description | String | Optional | Details of the task |
| status | String | Enum: ["pending","in-progress","completed"] | Task progress state |
| assignedTo | ObjectId (User or Employee) | Required | Who the task belongs to |
| createdBy | ObjectId (User) | Required | Admin who created task |
| createdAt | Date | Auto-generated | Creation date |
| updatedAt | Date | Auto-generated | Last update |

## Notes
- Admin sees all tasks.
- Regular user sees only tasks assigned to them.
