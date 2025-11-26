import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import generateToken from '../utils/generateToken.js';
import { seedSampleDataForUser } from './sampleDataService.js';

const sanitizeUser = (user) => ({
  id: user.id || user._id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
});

export const registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });

  try {
    await seedSampleDataForUser(user._id);
  } catch (error) {
    console.warn('Failed to seed sample data for user', error);
  }

  const token = generateToken({ id: user._id });

  return { user: sanitizeUser(user), token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken({ id: user._id });
  return { user: sanitizeUser(user), token };
};
