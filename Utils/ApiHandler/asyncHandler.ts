import { Request, Response, NextFunction, RequestHandler } from 'express';

const asyncMiddleware = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncMiddleware;
