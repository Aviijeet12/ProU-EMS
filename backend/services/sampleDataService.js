import Employee from '../models/Employee.js';
import Task from '../models/Task.js';

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const buildSampleEmployees = (userId) => {
  const suffix = userId.toString().slice(-5);
  return [
    {
      name: 'Ava Johnson',
      email: `ava.johnson+${suffix}@example.com`,
      role: 'Project Manager',
      department: 'Operations',
      status: 'Active',
      createdBy: userId,
    },
    {
      name: 'Ethan Patel',
      email: `ethan.patel+${suffix}@example.com`,
      role: 'Frontend Engineer',
      department: 'Engineering',
      status: 'Active',
      createdBy: userId,
    },
    {
      name: 'Mia Chen',
      email: `mia.chen+${suffix}@example.com`,
      role: 'HR Specialist',
      department: 'People Operations',
      status: 'Active',
      createdBy: userId,
    },
  ];
};

const buildSampleTasks = (userId, employees) => [
  {
    title: 'Launch dashboard redesign',
    description: 'Coordinate with design to deliver the updated dashboard experience.',
    dueDate: addDays(7),
    status: 'In-progress',
    priority: 'High',
    assignedEmployeeId: employees[0]._id,
    createdBy: userId,
  },
  {
    title: 'Audit onboarding flow',
    description: 'Review current onboarding flow and surface the top three friction points.',
    dueDate: addDays(14),
    status: 'Pending',
    priority: 'Medium',
    assignedEmployeeId: employees[1]._id,
    createdBy: userId,
  },
  {
    title: 'Update benefits handbook',
    description: 'Refresh the People Ops handbook with the 2025 policy changes.',
    dueDate: addDays(21),
    status: 'Pending',
    priority: 'Low',
    assignedEmployeeId: employees[2]._id,
    createdBy: userId,
  },
];

export const seedSampleDataForUser = async (userId) => {
  const existingEmployees = await Employee.countDocuments({ createdBy: userId });
  if (existingEmployees > 0) {
    return;
  }

  const employees = await Employee.insertMany(buildSampleEmployees(userId));

  const existingTasks = await Task.countDocuments({ createdBy: userId });
  if (existingTasks === 0 && employees.length) {
    await Task.insertMany(buildSampleTasks(userId, employees));
  }
};
