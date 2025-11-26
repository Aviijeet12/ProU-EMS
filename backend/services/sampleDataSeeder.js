import Employee from '../models/Employee.js';
import Task from '../models/Task.js';

/**
 * Seed sample employees and tasks for a newly registered user.
 * Runs only once per user — checks if user already has data.
 */
export const seedSampleDataForUser = async (userId) => {
  try {
    // Check if user already has employees to avoid duplicate seeding
    const existing = await Employee.findOne({ createdBy: userId });
    if (existing) {
      return; // Already seeded
    }

    // Sample Employees
    const sampleEmployees = await Employee.insertMany([
      {
        name: 'John Doe',
        email: `john.doe.${userId}@example.com`,
        role: 'Software Engineer',
        department: 'Development',
        status: 'Active',
        createdBy: userId,
      },
      {
        name: 'Sarah Johnson',
        email: `sarah.johnson.${userId}@example.com`,
        role: 'UI/UX Designer',
        department: 'Design',
        status: 'Active',
        createdBy: userId,
      },
      {
        name: 'Michael Smith',
        email: `michael.smith.${userId}@example.com`,
        role: 'HR Manager',
        department: 'Human Resources',
        status: 'Inactive',
        createdBy: userId,
      },
    ]);

    // Sample Tasks (linked to employees)
    await Task.insertMany([
      {
        title: 'Onboarding Setup',
        description: 'Prepare workstation and access credentials.',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'Pending',
        priority: 'High',
        assignedEmployeeId: sampleEmployees[0]._id,
        createdBy: userId,
      },
      {
        title: 'UI Redesign Review',
        description: 'Discuss new wireframes and design updates.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'In-progress',
        priority: 'Medium',
        assignedEmployeeId: sampleEmployees[1]._id,
        createdBy: userId,
      },
    ]);

  } catch (err) {
    console.error('Sample data seeding failed:', err);
  }
};
