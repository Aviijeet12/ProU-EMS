import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import Employee from '../models/Employee.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

dotenv.config();
await connectDB();

const seed = async () => {
  try {
    await Promise.all([Employee.deleteMany(), Task.deleteMany(), User.deleteMany()]);

    const employees = await Employee.insertMany([
      {
        name: 'Ava Johnson',
        email: 'ava.johnson@example.com',
        role: 'Project Manager',
        department: 'Operations',
        status: 'Active',
      },
      {
        name: 'Ethan Patel',
        email: 'ethan.patel@example.com',
        role: 'Frontend Engineer',
        department: 'Engineering',
        status: 'On Leave',
      },
      {
        name: 'Mia Chen',
        email: 'mia.chen@example.com',
        role: 'HR Specialist',
        department: 'People',
        status: 'Active',
      },
    ]);

    await Task.insertMany([
      {
        title: 'Launch dashboard redesign',
        description: 'Coordinate with design to finalize revised dashboard experience',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'In-progress',
        priority: 'High',
        assignedEmployeeId: employees[0]._id,
      },
      {
        title: 'Audit onboarding flow',
        description: 'Identify blockers within onboarding tasks and propose fixes',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'Pending',
        priority: 'Medium',
        assignedEmployeeId: employees[1]._id,
      },
      {
        title: 'Update benefits handbook',
        description: 'Refresh People Ops handbook for 2025 policies',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Pending',
        priority: 'Low',
        assignedEmployeeId: employees[2]._id,
      },
    ]);

    const hashedPassword = await bcrypt.hash('ChangeMe123!', 10);
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
    });

    console.log('Seed data successfully inserted');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database', error);
    process.exit(1);
  }
};

await seed();
