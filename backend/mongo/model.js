import { Schema, mongoose } from 'mongoose';

/******* User Schema *******/
const UserSchema = new Schema({
  name: { type: String, required: [true, 'name field is required.'] },
  email: { type: String, required: [true, 'email field is required.'] },
  friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});
const UserModel = mongoose.model('User', UserSchema);

export { UserModel };
