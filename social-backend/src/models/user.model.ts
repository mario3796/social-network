import mongoose from 'mongoose';

export interface User {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  password: string;
  image: string;
  userType: string;
  sends: string[];
  receives: string[];
  friends: string[];
}

const userSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    image: String,
    sends: [
      {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    receives: [
      {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    friends: [
      {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
