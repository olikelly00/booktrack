import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
console.log("MongoDB URI:", process.env.MONGODB_URI); // Debug print to verify URI

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(helmet());

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
  })
  .then(async () => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

app.listen(port, () => {
  console.log(`We are now listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello world! Welcome to BookTrack!");
});

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

async function createUser(first_name, last_name, email, password) {
  

  console.log("Checking email:", user_instance.email);
  const isAvailable = await isEmailAvailable(user_instance.email);
  if (!isAvailable) {
    return { success: false, message: "Email already exists in database" };
  }
  const passwordValid = await isPasswordValid(user_instance.password);
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
    // Save the user instance to the database
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

async function isEmailAvailable(email) {
  console.log("HELLO");
  const user = await User.findOne({ email: email });
  return user === null;
}

async function isPasswordValid(password) {
  return password.length >= 8;
}
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { first_name, last_name, email, password } = req.body;
  console.log("Received form data:", first_name, last_name, email, password);
  const result = await createUser(first_name, last_name, email, password);
  if (result.success) {
    res.status(201).send(result.message);
  } else {
    res.status(400).send(result.message);
  }
});

async function authenticateUser(email, password) {
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

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log("Received form data:", email, password);
  const userInstance = await authenticateUser(email, password);
  if (userInstance) {
    let id = userInstance._id;
    const new_jwt_token = jwt.sign({ id }, process.env.JWT_TOKEN, {
      expiresIn: 3600,
    });
    res
      .status(200)
      .send({ message: "User logged in successfully", token: new_jwt_token });
  } else {
    res.status(400).send("Login failed");
  }
});
