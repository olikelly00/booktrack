import express from 'express';
import jwt from "jsonwebtoken";
import { addNewMedia, getMediaByUserId, updateMediaByUserId } from '../controllers/mediaController.js';
import Media from '../models/Media.js';


const router = express.Router();

router.post('/media', async (req, res) => {
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




router.get('/media', async (req, res) => {
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
  
  router.delete('/media/:id', async (req, res) => {
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
  

  router.put('/media/:id', async (req, res) => {
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

  export default router;
