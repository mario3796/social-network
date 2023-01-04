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
  getRequests,
  addRequest,
  cancelRequest,
  acceptRequest,
  getFriends,
  deleteFriend,
  getUsers,
};
