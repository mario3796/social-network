import { Request, Response, NextFunction } from 'express';
import Post from '../models/post.model';

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
    const { content, user } = req.body;
    Post.findById(req.params.postId)
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
    const { content, user } = req.body;
    const commentId = req.params.commentId;
    Post.findById(req.params.postId)
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
    Post.findById(req.params.postId)
      .then(post => {
        post!.comments = post!.comments.filter(
          comment => comment._id?.toString() !== commentId
        );
        return post?.save();
      })
      .then(post => res.status(200).json({ message: 'Comment Deleted', post }))
      .catch(err => next(err));
  };

export default {
    addPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment
}