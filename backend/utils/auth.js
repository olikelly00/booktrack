import { User } from '../models/User.js';

export async function isEmailAvailable(email) {
  const user = await User.findOne({ email });
  return !user;
}

export async function isPasswordValid(password) {
  return password.length >= 8;
}

async function addToBlacklist(token) {
    const blacklistedToken = new BlacklistedToken({ token: token });
    await blacklistedToken.save();
    console.log('Token added to blacklist successfully!');
  }
