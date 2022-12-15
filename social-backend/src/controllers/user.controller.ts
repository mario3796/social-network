import { Request, Response, NextFunction } from 'express';
import HttpError from '../models/http-error.model';
import Post from '../models/post.model';
import User from '../models/user.model';

const getProfile = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then(user => {
      return Post.find({ user: req.params.userId })
        .populate('user')
        .then(posts =>
          res.status(200).json({ message: 'Profile Fetched', user, posts })
        );
    })
    .catch(err => next(err));
};

const addPost = (req: Request, res: Response, next: NextFunction) => {
  const { title, content, user } = req.body;
  const post = new Post({
    title,
    content,
    user,
  });
  post
    .save()
    .then(post => res.status(201).json({ message: 'Post Added', post }))
    .catch(err => next(err));
};

const getPosts = (req: Request, res: Response, next: NextFunction) => {
  Post.find()
    .populate('user')
    .then(posts => res.status(200).json({ message: 'Posts Fetched', posts }))
    .catch(err => next(err));
};

const getPost = (req: Request, res: Response, next: NextFunction) => {
  Post.findById(req.params.postId)
    .populate('user')
    .populate('comments.user')
    .then(async post => {
      res.status(200).json({ message: 'Post Fetched', post });
    })
    .catch(err => next(err));
};

const updatePost = (req: Request, res: Response, next: NextFunction) => {
  Post.findById(req.params.postId)
    .then(post => {
      post!.title = req.body.title;
      post!.content = req.body.content;
      return post?.save();
    })
    .then(post => res.status(201).json({ message: 'Post Updated', post }))
    .catch(err => next(err));
};

const deletePost = (req: Request, res: Response, next: NextFunction) => {
  Post.findByIdAndDelete(req.params.postId)
    .then(post => res.status(200).json({ message: 'Post Deleted' }))
    .catch(err => next(err));
};

const addComment = (req: Request, res: Response, next: NextFunction) => {
  const { content, user, post } = req.body;
  Post.findById(post)
    .then(post => {
      post?.comments.push({
        content,
        user,
      });
      return post?.save();
    })
    .then(post => res.status(201).json({ message: 'Comment Added', post }))
    .catch(err => next(err));
};

const updateComment = (req: Request, res: Response, next: NextFunction) => {
  const { post, content, user } = req.body;
  const commentId = req.params.commentId;
  Post.findById(post)
    .then(post => {
      let commentIndex = post!.comments.findIndex(
        comment => comment._id?.toString() === commentId
      );
      post!.comments[commentIndex] = {
        _id: commentId,
        user,
        content,
      };
      return post?.save();
    })
    .then(post => res.status(200).json({ message: 'Comment Updated', post }))
    .catch(err => next(err));
};

const deleteComment = (req: Request, res: Response, next: NextFunction) => {
  const commentId = req.params.commentId;
  const post = req.query.post;
  Post.findById(post)
    .then(post => {
      post!.comments = post!.comments.filter(
        comment => comment._id?.toString() !== commentId
      );
      return post?.save();
    })
    .then(post => res.status(200).json({ message: 'Comment Deleted', post }))
    .catch(err => next(err));
};

const getRequests = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.query.userId)
    .populate('receives')
    .then(user =>
      res
        .status(200)
        .json({ message: 'Requests Fetched', requests: user?.receives })
    )
    .catch(err => next(err));
};

const addRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const receiver = await User.findById(req.body.requested);
    const sender = await User.findById(req.body.sender);
    receiver?.receives.push(sender?._id as string);
    sender?.sends.push(receiver?._id as string);
    await sender?.save();
    await receiver?.save();
    res.status(201).json({ message: 'Request Sent' });
  } catch (err: any) {
    next(err);
  }
};

const cancelRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sender = await User.findById(req.params.userId);
    const receiver = await User.findById(req.body.requested);
    receiver!.receives = receiver!.receives.filter(
      receive => receive.toString() !== sender!._id?.toString()
    );
    sender!.sends = sender!.sends.filter(
      send => send.toString() !== receiver!._id?.toString()
    );
    await receiver?.save();
    await sender?.save();
    res.status(200).json({ message: 'Request Canceled' });
  } catch (err: any) {
    next(err);
  }
};

const acceptRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sender = await User.findById(req.params.userId);
    const receiver = await User.findById(req.body.requested);
    receiver!.receives = receiver!.receives.filter(
      receive => receive.toString() !== sender!._id?.toString()
    );
    sender!.sends = sender!.sends.filter(
      send => send.toString() !== receiver!._id?.toString()
    );
    receiver!.friends.push(sender?._id as string);
    sender!.friends.push(receiver?._id as string);
    await receiver?.save();
    await sender?.save();
    res.status(201).json({ message: 'Request Accepted' });
  } catch (err: any) {
    const error = new HttpError(err.message, 404);
    next(error);
  }
};

const getFriends = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.query.userId)
    .populate('friends')
    .then(user =>
      res
        .status(200)
        .json({ message: 'Friends Fetched', friends: user?.friends })
    )
    .catch(err => next(err));
};

const deleteFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.body.userId);
    const friend = await User.findById(req.body.friendId);
    user!.friends = user!.friends.filter(
      e => e.toString() !== friend?._id?.toString()
    );
    friend!.friends = friend!.friends.filter(
      e => e.toString() !== user?._id?.toString()
    );
    await user?.save();
    await friend?.save();
    res.status(200).json({ message: 'Successfully UnFriended' });
  } catch (err: any) {
    const error = new HttpError(err.message, 404);
    next(error);
  }
};

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .then(users => res.status(200).json({ message: 'Users Fetched', users }))
    .catch(err => next(err));
};

export default {
  getProfile,
  addPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  getRequests,
  addRequest,
  cancelRequest,
  acceptRequest,
  getFriends,
  deleteFriend,
  getUsers,
};
