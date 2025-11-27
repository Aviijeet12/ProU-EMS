# Users Collection Schema

## Collection Name
users

## Purpose
Stores authentication credentials and role information for application users.

## Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier for each user |
| username | String | Required | Display name for user |
| email | String | Required, Unique | Used for login and identity |
| password | String | Required (hashed) | Stored using bcrypt hashing |
| role | String | Enum: ["admin","user"], Default: "user" | Determines authorization level |
| createdAt | Date | Auto-generated | Timestamp of creation |
| updatedAt | Date | Auto-generated | Timestamp of last update |

## Notes
- Regular users can only access their own tasks.
- Admins have full system access.
- Passwords are never stored in plain text.
