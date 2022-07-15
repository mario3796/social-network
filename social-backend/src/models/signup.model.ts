import mongoose from 'mongoose';
import { User } from './user.model';

interface Signup {
  _id: string;
  user: User;
}

const signupSchema = new mongoose.Schema<Signup>(
  {
    user: {},
  },
  { timestamps: true }
);

export default mongoose.model('Signup', signupSchema);
