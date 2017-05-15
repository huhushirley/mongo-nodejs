import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  token: String,
  userId: String,
  appName: String,
});

const User = mongoose.model('user', UserSchema);

export default User;
