import { Router } from 'express';
import postController from '../controllers/post.controller';

const router = Router();

router.get('/', postController.getPosts);

router.get('/:postId', postController.getPost);

router.post('/', postController.addPost);

router.put('/:postId', postController.updatePost);

router.delete('/:postId', postController.deletePost);

router.post('/:postId/comments', postController.addComment);

router.put('/:postId/comments/:commentId', postController.updateComment);

router.delete('/:postId/comments/:commentId', postController.deleteComment);

export default router