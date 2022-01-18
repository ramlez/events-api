import {Response, Request, NextFunction} from 'express';

export function headersMiddleware(req, res: Response, next) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Accept-Methods', 'GET, POST, PUT, DELETE');

  next();
}

export function loggingMiddleware(req: Request, res: Response, next) {
  next();
  console.log(`${req.method} at ${req.path}`);
}

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  next();
  if (err != null) {
    console.log('An Error occurred: ' + err.message);
    res.status(500);
    res.send({message: 'An internal server error has occurred'});
  }
}
