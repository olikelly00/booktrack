import Media from '../models/Media.js';



// FUNCTIONS TO CREATE NEW MEDIA INSTANCES AND ADD THEM TO DATABASE

export async function createMedia(req, res) {
  const { userId } = req.user;
  const newMedia = req.body;

  try {
    const media_instance = new Media({ userId, dateAdded: Date.now(), ...newMedia });
    const savedMedia = await addNewMedia(media_instance);
    res.status(200).json(savedMedia);
  } catch (error) {
    res.status(500).send("Error saving media");
  }
}


export async function addNewMedia(media_instance) {
    try {
      await media_instance.save();
      console.log('Media saved successfully!');
      return { new_media: media_instance };
    } catch (error) {
      console.error('Error saving media:', error);
      return { success: false, message: 'Error saving media.' };
    }
  };

  // FUNCTIONS TO FIND MEDIA INSTANCES BY USER ID

  export async function getMediaByUserId(userId) {
    const media = await Media.find({ userId: userId }).sort({ dateAdded: -1 }); 
    console.log('Media:', media);
    return media;
  }
  
// FUNCTION TO UPDATE MEDIA INSTANCE BY USER ID AND MEDIA ID

  export async function updateMediaByUserId(userId, mediaId, updatedData) {
    const updatedMedia = await Media.findOneAndUpdate({ userId, _id: mediaId }, updatedData, { new: true });
    return updatedMedia;
  }