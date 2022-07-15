import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.model';
import Signup from '../models/signup.model';
import HttpError from '../models/http-error.model';
import deleteImage from '../utils/file-manager';

interface JwtPayload {
  exp: string;
}

dotenv.config();

const signup = (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, gender, password, userType } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new HttpError(errors.array()[0].msg, 422);
  bcrypt
    .hash(password, +(process.env.SALT_ROUNDS as string))
    .then(hashedPassword => {
      const request = new Signup({
        user: {
          email,
          firstName,
          lastName,
          gender,
          password: hashedPassword,
          userType,
          image: process.env.DEFAULT_IMAGE,
        },
      });
      return request.save();
    })
    .then(request =>
      res.status(201).json({ message: 'Signup Requested', signup: request })
    )
    .catch(err => next(err));
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new HttpError(errors.array()[0].msg, 422);
  User.findOne({ email })
    .then(user => {
      if (!user) throw new HttpError('No such User', 401);
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) throw new HttpError('Wrong password', 401);
          const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string, {
            expiresIn: '1H',
          });
          const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
          const expiresIn = (decoded as unknown as JwtPayload).exp;
          return res
            .status(201)
            .json({
              message: 'Successfully logged in',
              token,
              user,
              expiresIn,
            });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

const update = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName, gender } = req.body;
  const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    image && deleteImage(image.path);
    throw new HttpError(errors.array()[0].msg, 422);
  }
  if (!image) throw new HttpError('please pick a file of type image', 401);
  bcrypt
    .hash(password, +(process.env.SALT_ROUNDS as string))
    .then(hashedPassword => {
      return User.findById(req.query.userId).then(user => {
        if (!user) throw new HttpError('User not found', 401);
        user.email = email || user.email;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.password = hashedPassword || user.password;
        user.gender = gender || user.gender;
        user.image = image!.path || user.image;
        return user.save();
      });
    })
    .then(user => res.status(201).json({ message: 'Profile updated', user }))
    .catch(err => next(err));
};

export default {
  signup,
  login,
  update,
};
