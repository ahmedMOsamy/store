import express, { Request, Response } from 'express'
import { User, storeUser } from '../models/user'
import { validatToken, userToken } from './helpers'

const UserStore = new storeUser()

const create = async (req: Request, res: Response) => {
  try {
    const firstname = req.body.firstname as unknown as string
    const lastname = req.body.lastname as unknown as string
    const username = req.body.username as unknown as string
    const password = req.body.password as unknown as string
    if (
      firstname === undefined ||
      lastname === undefined ||
      username === undefined ||
      password === undefined
    ) {
      res.status(400)
      res.send(
        'Some required parameters are missing! eg. :firstname, :lastname, :username, :password'
      )
      return false
    }
    const user: User = await UserStore.create({
      firstname,
      lastname,
      username,
      password
    })
    res.json(userToken(user))
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}
const index = async (req: Request, res: Response) => {
  try {
    const users: User[] = await UserStore.index()
    res.json(users)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}
const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    if (id === undefined) {
      res.send('Missing required parameter :id.')
      return false
    }
    const user: User = await UserStore.read(id)
    res.json(user)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}
const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    const firstname = req.body.firstname as unknown as string
    const lastname = req.body.lastname as unknown as string
    if (firstname === undefined || lastname === undefined || id === undefined) {
      res.status(400)
      res.send(res.send('Some required parameters are missing! eg. :firstname, :lastname, :id'))
      return false
    }
    const user: User = await UserStore.update(id, { firstname, lastname })

    res.json(user)
  } catch (e) {
    res.status(400)
    res.json({ e })
  }
}
const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    if (id === undefined) {
      res.status(400)
      res.send('Missing required parameter :id.')
      return false
    }
    await UserStore.deleteUser(id)
    res.send(`User with id ${id} successfully deleted.`)
  } catch (e) {
    res.status(400)
    res.json({ e })
  }
}
const authenticate = async (req: Request, res: Response) => {
  try {
    const username = req.body.username as unknown as string
    const password = req.body.password as unknown as string
    if (username === undefined || password === undefined) {
      res.status(400)
      res.send('Some required parameters are missing! eg. :username, :password')
      return false
    }
    const user: User | null = await UserStore.authenticate(username, password)
    if (user === null) {
      res.status(401)
      res.send(`Wrong password for user ${username}.`)
      return false
    }
    res.json(userToken(user))
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}
const userRoutes = (app: express.Application) => {
  app.post('/users/create', create)
  app.get('/users', validatToken, index)
  app.get('/users/:id', validatToken, read)
  app.put('/users/:id', validatToken, update)
  app.delete('/users/:id', validatToken, deleteUser)
  app.post('/users/auth', authenticate)
}
export default userRoutes
