# Database Relationships

## 1. User Authentication Flow
- A user registers or logs in
- JWT contains user id and role
- Role determines access level

## 2. User → Employee
Only Admin users can manage employee records.

Relationship:
User (admin) ---creates---> Employee

## 3. User/Employee → Task
Tasks may be assigned to:
- employees (if modeled that way)
- users (recommended for your app)

Relationship:
User/Admin ---assigns---> Task ---belongs to---> User/Employee

## Visibility Rules
| Role | Can View |
|------|----------|
| Admin | All tasks and all employees |
| User | Only tasks assigned to them |
