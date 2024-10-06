import mongoose from 'mongoose';
const { Schema } = mongoose;

const blackListSchema = new Schema({
    token: String,
  });

export const BlacklistedToken = mongoose.model('BlacklistedToken', blackListSchema);