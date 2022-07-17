import jwt, { Secret } from 'jsonwebtoken'
import { User } from '../models/user'
import { NextFunction, Request, Response } from 'express'

const SECRET = process.env.TOKEN_SECRET as Secret

export function userToken(user: User) {
  return jwt.sign({ user }, SECRET)
}

export function validatToken(req: Request, res: Response, next: NextFunction): void | boolean {
  if (!req.headers.authorization) {
    res.status(401)
    res.json('login Error, please try again')

    return false
  }

  try {
    const token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, SECRET)

    next()
  } catch (err) {
    console.error(err)

    res.status(401)
    res.json('login Error, please try again')

    return false
  }
}
