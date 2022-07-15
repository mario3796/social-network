import { Router } from 'express';
import { body, check } from 'express-validator';

import authController from '../controllers/auth.controller';
import fileUpload from '../middlewares/file-upload';
import User from '../models/user.model';

const router = Router();

router.post(
  '/signup',
  [
    check('email')
      .notEmpty()
      .withMessage('please fill the email field')
      .isEmail()
      .withMessage('please enter a valid email')
      .custom(value => {
        return User.findOne({ email: value }).then(user => {
          if (user) throw new Error('email already exists');
        });
      }),
    check('password')
      .notEmpty()
      .withMessage('please fill the password field')
      .isLength({ min: 5 })
      .withMessage('password must be not less than 5 characters'),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('passwords have to match');
      }
      return true;
    }),
    check('firstName')
      .notEmpty()
      .withMessage('please fill the first name field')
      .isAlpha()
      .withMessage('please enter a valid name'),
    check('lastName')
      .notEmpty()
      .withMessage('please fill the first name field')
      .isAlpha()
      .withMessage('please enter a valid name'),
    check('userType').notEmpty().withMessage('please select a user type'),
    check('gender').notEmpty().withMessage('please select a gender'),
  ],
  authController.signup
);

router.post(
  '/login',
  [
    check('email')
      .notEmpty()
      .withMessage('please fill the email field')
      .isEmail()
      .withMessage('please enter a valid email'),
    check('password')
      .notEmpty()
      .withMessage('please fill the password field')
      .isLength({ min: 5 })
      .withMessage('password must be not less than 5 characters'),
  ],
  authController.login
);

router.post(
  '/update',
  fileUpload.single('image'),
  [
    body('email')
      .isEmail()
      .withMessage('please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user && user._id?.toString() !== req.query?.userId)
            throw new Error('email already exists');
        });
      }),
    check('password')
      .notEmpty()
      .withMessage('please fill the password field')
      .isLength({ min: 5 })
      .withMessage('password must be not less than 5 characters'),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('passwords have to match');
      }
      return true;
    }),
  ],
  authController.update
);

export default router;
