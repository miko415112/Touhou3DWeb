import { Schema, mongoose } from 'mongoose';

/******* User Schema *******/
const UserSchema = new Schema({
  name: { type: String, required: [true, 'name field is required.'] },
  picture: { type: String, required: [true, 'picture field is required.'] },
  email: { type: String, required: [true, 'email field is required.'] },
  requests: [{ type: mongoose.Types.ObjectId, ref: 'Player' }],
  friends: [{ type: mongoose.Types.ObjectId, ref: 'Player' }],
});
const UserModel = mongoose.model('Player', UserSchema);

export { UserModel };
