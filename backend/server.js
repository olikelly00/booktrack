import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
console.log("MongoDB URI:", process.env.MONGODB_URI); // Debug print to verify URI

const app = express();
const port = 3001;

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
    // await seedDatabase();
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

async function clearUserMedia() {
  await Media.deleteMany( {userId: '66fbfe865940205a8e11fbc3'} );
}

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log("Received form data:", email, password);
  const userInstance = await authenticateUser(email, password);
  if (userInstance) {
    let id = userInstance._id;
    // await clearUserMedia(id);
    const new_jwt_token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600,
    });
    res
      .status(200)
      .send({ message: "User logged in successfully", id: id, token: new_jwt_token });
      // seedDatabase()
  } else {
    res.status(400).send("Login failed");
  }
});

async function seedDatabase() {
mongoose.connect('mongodb+srv://oliverkelly1995:Tr1pl3t13579@booktrackdb.2muhy.mongodb.net/?retryWrites=true&w=majority&appName=booktrackdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected…")
    })
    .catch(err => console.log(err))

    const dummyData = [
      { title: 'The Green Mile', dateAdded: '2024-10-01T21:24:42.345Z', mediaType: 'film', starRating: 5, userId: '66fbfe865940205a8e11fbc3'},
      { title: 'Breaking Bad', dateAdded: '2024-10-01T21:24:42.345Z', mediaType: 'tv', starRating: 5, userId: '66fbfe865940205a8e11fbc3'},
      { title: 'The Shawshank Redemption', dateAdded: '2024-10-01T21:24:42.345Z', mediaType: 'film', starRating: 4, userId: '66fbfe865940205a8e11fbc3'},
      { title: 'Game of Thrones', dateAdded: '2024-10-01T21:24:42.345Z', mediaType: 'tv', starRating: 4, userId: '66fbfe865940205a8e11fbc3'},
      { title: 'Hamilton', dateAdded: '2024-10-01T21:24:42.345Z', mediaType: 'theater', starRating: 5, userId: '66fbfe865940205a8e11fbc3'},
      { title: 'The Great Gatsby', dateAdded: '2024-10-01T21:24:42.345Z', mediaType: 'book', starRating: 3, userId: '66fbfe865940205a8e11fbc3'},
      { title: 'To Kill a Mockingbird', mediaType: 'book', starRating: 4, userId: '66fbfe865940205a8e11fbc3'},
      { title: 'The Phantom of the Opera', dateAdded: '2024-10-01T21:24:42.345Z', mediaType: 'theater', starRating: 4, userId: '66fbfe865940205a8e11fbc3'},
      { title: 'The Phantom of the Opera', dateAdded: '2024-10-01T21:24:42.345Z', mediaType: 'theater', starRating: 4, userId: '66fbfe865940205a8e11fbc1'},
      { title: 'The Phantom of the Opera', dateAdded: '2024-10-01T21:24:42.345Z', mediaType: 'theater', starRating: 4, userId: '66fbfe865940205a8e11fbc2'},
      { title: 'The Phantom of the Opera', dateAdded: '2024-10-01T21:24:42.345Z', mediaType: 'theater', starRating: 4, userId: '66fbfe865940205a8e11fbc3'},
    ];
Media.insertMany(dummyData)
    .then(() => {
        console.log('Data has been inserted');
    })
    .catch(error => console.log(error));

  }
const mediaSchema = new Schema({
  userId: String,
  dateAdded: Date,
  title: String,
  mediaType: String,
  mediaIcon: String,
  blurb: String,
  starRating: Number,
  review: String,
});
  

const Media = mongoose.model('Media', mediaSchema);


app.post('/media', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // if there isn't any token

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;

    console.log(req.body);
    const newMedia = req.body;
    console.log('Received form data:', newMedia);
    const media_instance = new Media({
      userId: newMedia.userId,
      dateAdded: Date.now(),
      ...newMedia,
    });

    const payload = await addNewMedia(media_instance);
    res.status(200).json({
        "success": true,
        "payload": payload
    });
  } catch (error) {
    res.status(403).json({
        "error": error.message
    });
  }
});

async function addNewMedia(media_instance) {
  try {
    await media_instance.save();
    console.log('Media saved successfully!');
    return { new_media: media_instance };
  } catch (error) {
    console.error('Error saving media:', error);
    return { success: false, message: 'Error saving media.' };
  }
};


async function getMediaByUserId(userId) {
  const media = await Media.find({ userId: userId }).sort({ dateAdded: -1 }); 
  console.log('Media:', media);
  return media;
}

app.get('/media', async (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader)
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  console.log(process.env.ACCESS_TOKEN_SECRET);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    
    if (err) {
      console.log(err);

     return res.sendStatus(403);
    }
    console.log(user);
    const media = await getMediaByUserId(user.id);
    res.status(200).json(media);
  });
});

app.delete('/media/:id', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    console.log(req.params);
    const media = await Media.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(media);
    console.log('Media deleted successfully!');
  });
});

