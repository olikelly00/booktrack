import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OpenAI from "openai";

import { v4 as uuidv4 } from "uuid";


dotenv.config();
console.log("MongoDB URI:", process.env.MONGODB_URI); // Debug print to verify URI

const app = express();
const port = process.env.PORT || 3000;

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



app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log("Received form data:", email, password);
  const userInstance = await authenticateUser(email, password);
  if (userInstance) {
    let id = userInstance._id;
    const new_jwt_token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600,
    });
    res
      .status(200)
      .send({ message: "User logged in successfully", id: id, token: new_jwt_token });
  } else {
    res.status(400).send("Login failed");
  }
});


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
  // if (isTokenBlacklisted(token)) {
  //   return res.sendStatus(401);
  // }
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

// async function isTokenBlacklisted(token) {
//   // const blacklistedToken = await BlacklistedToken.findOne({ token: token });
//   // return blacklistedToken !== null;
//   return false
// };

export async function getMediaByUserId(userId) {
  const media = await Media.find({ userId: userId }).sort({ dateAdded: -1 }); 
  console.log('Media:', media);
  return media;
}



app.get('/validatetoken', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);


  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    console.log(user);
    res.status(200).json(user);
  });
});

const blackListSchema = new Schema({
  token: String,
});

const BlacklistedToken = mongoose.model('BlacklistedToken', blackListSchema);

app.post('/addtokentoblacklist', async (req, res) => {
  const token = req.body.token;
  console.log('Token:', token);
  try {
    await addToBlacklist(token);
    res.status(200).json({ message: 'Token added successfully'});
  } catch (error) {
    console.error('Error adding token to blacklist:', error);
    res.status(400).send('Error adding token to blacklist.');
  }
});

async function addToBlacklist(token) {
  const blacklistedToken = new BlacklistedToken({ token: token });
  await blacklistedToken.save();
  console.log('Token added to blacklist successfully!');
}



app.get('/media', async (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader)
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  // if (isTokenBlacklisted(token)) {
  //   return res.sendStatus(403);
  // }
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
  // if (isTokenBlacklisted(token)) {
  //   return res.sendStatus(401);
  // }
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




const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});


let systemPrompt = `You are an AI that recommends books, TV shows, or films based on a user's previous media items. Your style is friendly, informal, and familiar. Your target audience is young adults.
1. Thought: Consider the user's previous media items and think about what they might like.
2. Action: Recommend a book, TV show, or film that you think the user might like.
3. Observation: Observe the user's reaction to your recommendation.
`;


export async function agent(userId, query) {
  // Fetch user's media history from your database
  const mediaItems = await getMediaByUserId(userId);

  let messagesArray = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: `I liked ${mediaItems.join(", ")}. ${query}`,
    },
  ];

  let userFeedback = "";
  const MAX_ITERATIONS = 6;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messagesArray,
    });
    console.log(messagesArray)
    const aiResponse = response.choices[0].message.content;


    messagesArray.push({
      role: "assistant",
      content: aiResponse,
    });

    if (i === 0) {
      userFeedback = "Can you explain why this show relates to my preferences? Please provide more specific connections to titles I've liked.";
    } else if (i === 1) {
      userFeedback = `I liked that, but can you suggest something less mainstream? I'd love something with a cult following.`;
    } else if (i === 2) {
      userFeedback = `Can you refine the recommendation to focus on books or shows with more character development?`;
    } else {
      userFeedback = `Now, can you summarise all of your recommendations from the messagesArray into one succinct paragraph, explain why they are recommended for this user based on the media items linked to their account? This is the only version the user will see, so make sure it covers all the points. Remember your tone is informal, friendly and casual as your audience is young adults.`;
    }

    messagesArray.push({
      role: "user",
      content: userFeedback,
    });

    if (userFeedback.includes("perfect")) {
      break;
    }
  }

  return messagesArray[messagesArray.length - 2].content;
}


app.post('/recommendation', async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const query = getMediaByUserId(userId);
    const recommendation = await agent(userId, query);
    res.json({ recommendation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate recommendation' });
  }
});

export async function updateMediaByUserId(userId, mediaId, updatedData) {
  const updatedMedia = await Media.findOneAndUpdate({ userId, _id: mediaId }, updatedData, { new: true });
  return updatedMedia;
}

app.put('/media/:id', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;

    const { id } = req.params; 
    const updatedData = req.body; 

    const updatedMedia = updateMediaByUserId(user.id, id, updatedData);

    if (!updatedMedia) {
      return res.status(404).json({ message: 'Media item not found' });
    }

    res.status(200).json(updatedMedia); 
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({ message: 'Error updating media' });
  }
});
