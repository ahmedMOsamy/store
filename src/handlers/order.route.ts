import { Application, Request, Response } from 'express'
import { OrderProduct, OrderStore, Order } from '../models/order'
import { validatToken } from './helpers'

const OrderStoreIns = new OrderStore()

const index = async (req: Request, res: Response) => {
  try {
    const orders: Order[] = await OrderStoreIns.index()
    res.json(orders)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const products = req.body.products as unknown as OrderProduct[]
    const status = req.body.status as unknown as boolean
    const user_id = req.body.user_id as unknown as number

    if (products === undefined || status === undefined || user_id === undefined) {
      res.status(400)
      res.send('Some required parameters are missing! eg. :products, :status, :user_id')
      return false
    }
    const order: Order = await OrderStoreIns.create({
      products,
      status,
      user_id
    })
    res.json(order)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
}

const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    if (id === undefined) {
      res.status(400)
      res.send('Missing required parameter :id.')
      return false
    }
    const order: Order = await OrderStoreIns.read(id)
    res.json(order)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    const products = req.body.products as unknown as OrderProduct[]
    const status = req.body.status as unknown as boolean
    const user_id = req.body.user_id as unknown as number

    if (
      products === undefined ||
      status === undefined ||
      user_id === undefined ||
      id === undefined
    ) {
      res.status(400)
      res.send('Some required parameters are missing! eg. :products, :status, :user_id, :id')
      return false
    }
    const order: Order = await OrderStoreIns.update(id, {
      products,
      status,
      user_id
    })
    res.json(order)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
}

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    if (id === undefined) {
      res.status(400)
      res.send('Missing required parameter :id.')
      return false
    }
    await OrderStoreIns.deleteOrder(id)
    res.send(`Order with id ${id} successfully deleted.`)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
}

const orderRoutes = (app: Application) => {
  app.get('/orders', validatToken, index)
  app.post('/orders/create', validatToken, create)
  app.get('/orders/:id', validatToken, read)
  app.put('/orders/:id', validatToken, update)
  app.delete('/orders/:id', validatToken, deleteOrder)
}
export default orderRoutes
