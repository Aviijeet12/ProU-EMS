import jwt from 'jsonwebtoken';

const generateToken = (payload, expiresIn = '1d') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export default generateToken;
