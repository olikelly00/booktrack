import express from 'express';
import { createUser } from '../controllers/authController.js';  
import { authenticateUser } from '../controllers/authController.js';
import jwt from 'jsonwebtoken';
import { BlacklistedToken } from '../models/Blacklist.js';


const router = express.Router();

router.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const result = await createUser(first_name, last_name, email, password);
  if (result.success) {
    res.status(201).send(result.message);
  } else {
    res.status(400).send(result.message);
  }
});


router.post("/login", async (req, res) => {
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

  router.get('/validatetoken', async (req, res) => {
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



    
  router.post('/addtokentoblacklist', async (req, res) => {
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
  

  export default router;
