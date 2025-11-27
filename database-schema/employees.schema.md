# Employees Collection Schema

## Collection Name
employees

## Purpose
Represents employee records managed by admin users.

## Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Employee identifier |
| name | String | Required | Employee full name |
| position | String | Optional | Role or job title |
| department | String | Optional | Team / division |
| status | String | Enum: ["active","inactive"] | Employment status |
| createdBy | ObjectId (User) | Required | Admin user who created record |
| createdAt | Date | Auto-generated | Creation timestamp |
| updatedAt | Date | Auto-generated | Last modification |

## Notes
- Only admins can create/update/delete employee records.
