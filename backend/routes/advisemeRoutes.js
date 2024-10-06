
import express from 'express';
import { getMediaByUserId } from '../controllers/mediaController.js';
import { agent } from '../controllers/advisemeController.js';

const router = express.Router();


router.post('/recommendation', async (req, res) => {
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
  
  
  export default router;