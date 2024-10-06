import mongoose from 'mongoose';
const { Schema } = mongoose;

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

export default mongoose.model('Media', mediaSchema);