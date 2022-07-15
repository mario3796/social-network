import mongoose from 'mongoose';

interface Post {
  _id?: string;
  title: string;
  content: string;
  user: string;
  comments: {
    _id?: string;
    content: string;
    user: string;
  }[];
}

const postSchema = new mongoose.Schema<Post>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [
    {
      content: {
        type: String,
        required: true,
      },
      user: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
});

export default mongoose.model('Post', postSchema);
