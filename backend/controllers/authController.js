import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isEmailAvailable, isPasswordValid } from '../utils/auth.js';

export async function createUser(first_name, last_name, email, password) {
  

    console.log("Checking email:", email);
    const isAvailable = await isEmailAvailable(email);
    if (!isAvailable) {
      return { success: false, message: "Email already exists in database" };
    }
    const passwordValid = await isPasswordValid(password);
    if (!passwordValid) {
      return { success: false, message: "Password is not valid" };
    }
  
    try {
      const user_instance = new User({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
      });
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user_instance.password = hashedPassword;
      await user_instance.save();
      console.log("User saved successfully!");
      return { success: true, message: "User saved successfully!" };
    } catch (error) {
      console.error("Error saving user:", error);
      return { success: false, message: "Error saving user." };
    }
  }


export async function authenticateUser(email, password) {
    const userInstance = await User.findOne({ email: email });
    console.log(userInstance);
    if (
      userInstance !== null &&
      (await bcrypt.compare(password, userInstance.password))
    ) {
      return userInstance;
    } else {
      return null;
    }
  }