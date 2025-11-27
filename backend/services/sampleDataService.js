const Employee = require("../models/Employee");
const Task = require("../models/Task");

exports.seedDemoDataForUser = async (userId) => {
  try {
    // DEMO EMPLOYEES
    const employees = await Employee.insertMany([
      {
        name: "John Russell",
        email: "john.russell@example.com",
        phone: "9876543210",
        position: "Software Developer",
        owner: userId,
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "9123456780",
        position: "Frontend Engineer",
        owner: userId,
      },
      {
        name: "Michael Tan",
        email: "michael.tan@example.com",
        phone: "9988776655",
        position: "Backend Developer",
        owner: userId,
      },
      {
        name: "Sarah Williams",
        email: "sarah.williams@example.com",
        phone: "9090909090",
        position: "UI/UX Designer",
        owner: userId,
      },
      {
        name: "David Miller",
        email: "david.miller@example.com",
        phone: "9012345678",
        position: "QA Analyst",
        owner: userId,
      },
      {
        name: "Emily Brown",
        email: "emily.brown@example.com",
        phone: "9080706050",
        position: "Project Manager",
        owner: userId,
      },
      {
        name: "Arjun Patel",
        email: "arjun.patel@example.com",
        phone: "9098765432",
        position: "DevOps Engineer",
        owner: userId,
      },
      {
        name: "Lisa Chow",
        email: "lisa.chow@example.com",
        phone: "9001122334",
        position: "Business Analyst",
        owner: userId,
      },
    ]);

    // Map employee IDs for assignment
    const employeeIds = employees.map((e) => e._id);

    // DEMO TASKS
    await Task.insertMany([
      {
        title: "Fix Login Redirect Bug",
        description: "Investigate and fix incorrect redirection after login.",
        assignee: employeeIds[0],
        status: "in-progress",
        owner: userId,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Update Landing Page UI",
        description: "Revamp hero section and align CTA buttons.",
        assignee: employeeIds[1],
        status: "todo",
        owner: userId,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "API Documentation",
        description: "Document employee CRUD operations in internal wiki.",
        assignee: employeeIds[2],
        status: "completed",
        owner: userId,
        dueDate: new Date(),
      },
      {
        title: "UI Revision Round 2",
        description: "Apply feedback from client review meeting.",
        assignee: employeeIds[3],
        status: "in-progress",
        owner: userId,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Write Unit Tests for User Module",
        description: "Increase test coverage for authentication service.",
        assignee: employeeIds[4],
        status: "todo",
        owner: userId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Deployment Pipeline Optimization",
        description: "Reduce build time and optimize Docker layers.",
        assignee: employeeIds[6],
        status: "in-progress",
        owner: userId,
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Prepare Client Report",
        description: "Summarize project progress for Friday presentation.",
        assignee: employeeIds[5],
        status: "todo",
        owner: userId,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Database Schema Review",
        description: "Evaluate schema relationships and propose improvements.",
        assignee: employeeIds[7],
        status: "todo",
        owner: userId,
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Conduct Standup Meeting",
        description: "Lead daily standup for frontend team.",
        assignee: employeeIds[1],
        status: "completed",
        owner: userId,
        dueDate: new Date(),
      },
      {
        title: "UI Accessibility Fixes",
        description: "Improve color contrast and add ARIA labels.",
        assignee: employeeIds[3],
        status: "in-progress",
        owner: userId,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log(`Realistic demo employees/tasks seeded for user: ${userId}`);
  } catch (error) {
    console.error("Realistic Demo Data Seed Error:", error);
  }
};
