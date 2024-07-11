import { Request } from 'express';

interface MyUserRequest extends Request {
    // Use `user?:` here instead of `user:`.
    user?: any;
  }