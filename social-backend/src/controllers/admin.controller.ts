import { Request, Response, NextFunction } from 'express';

import User, { User as IUser } from '../models/user.model';
import Signup from '../models/signup.model';
import Post from '../models/post.model';
import deleteImage from '../utils/file-manager';

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({ _id: { $ne: req.query.userId } })
    .then(users => res.status(200).json({ message: 'Users Fetched', users }))
    .catch(err => next(err));
};

const getUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then(user => res.status(200).json({ message: 'User Fetched', user }))
    .catch(err => next(err));
};

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then(user => {
      user?.image &&
        user?.image !== process.env.DEFAULT_IMAGE &&
        deleteImage(user?.image);
      deleteFriends(user!);
      deleteRequests(user!);
      deletePosts(user?._id!);
      deleteComments(user?._id!);
      return user?.remove();
    })
    .then(user => res.status(200).json({ message: 'User Deleted' }))
    .catch(err => next(err));
};

const getRequests = (req: Request, res: Response, next: NextFunction) => {
  Signup.find()
    .then(requests =>
      res.status(200).json({ message: 'Requests Fetched', requests })
    )
    .catch(err => next(err));
};

const acceptRequest = (req: Request, res: Response, next: NextFunction) => {
  Signup.findById(req.params.requestId)
    .then(async request => {
      const user = new User({
        ...request?.user,
      });
      await request?.remove();
      return user.save();
    })
    .then(user => res.status(200).json({ message: 'Request Accepted', user }))
    .catch(err => next(err));
};

const rejectRequest = (req: Request, res: Response, next: NextFunction) => {
  Signup.findByIdAndDelete(req.params.requestId)
    .then(request => res.status(200).json({ message: 'Request Rejected' }))
    .catch(err => next(err));
};

const deletePosts = (user: string) => {
  Post.find({ user }).exec((err, posts) => {
    if (err) throw new Error(err.message);
    posts.forEach(post => {
      post.remove();
    });
  });
};

const deleteComments = (user: string) => {
  Post.find().exec((err, posts) => {
    if (err) throw new Error(err.message);
    posts.forEach(async post => {
      post.comments.filter(
        comment => comment._id?.toString() !== user.toString()
      );
      await post.save();
    });
  });
};

const deleteFriends = (user: IUser) => {
  user.friends.forEach(async friendId => {
    const friend = await User.findById(friendId);
    friend!.friends = friend!.friends.filter(
      element => element.toString() !== user._id?.toString()
    );
    await friend?.save();
  });
};

const deleteRequests = (user: IUser) => {
  user.sends.forEach(async userId => {
    const receiver = await User.findById(userId);
    receiver!.receives = receiver!.receives.filter(
      element => element.toString() !== user._id?.toString()
    );
    await receiver?.save();
  });
};

export default {
  getUsers,
  getUser,
  deleteUser,
  getRequests,
  acceptRequest,
  rejectRequest,
};
