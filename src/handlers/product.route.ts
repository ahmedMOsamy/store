import { Application, Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import { validatToken } from './helpers'

const StoreProduct = new ProductStore()

const index = async (req: Request, res: Response) => {
  try {
    const products: Product[] = await StoreProduct.index()
    res.json(products)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const name = req.body.name as unknown as string
    const price = req.body.price as unknown as number
    if (name === undefined || price === undefined) {
      res.status(400)
      res.send('Some required parameters are missing! eg. :name, :price')
      return false
    }
    const product: Product = await StoreProduct.create({ name, price })
    res.json(product)
  } catch (e) {
    res.status(400)
    res.json(e)
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
    const product: Product = await StoreProduct.read(id)
    res.json(product)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    const name = req.body.name as unknown as string
    const price = req.body.price as unknown as number
    if (name === undefined || price === undefined || id === undefined) {
      res.status(400)
      res.send('Some required parameters are missing! eg. :name, :price, :id')
      return false
    }
    const product: Product = await StoreProduct.update(id, { name, price })
    res.json(product)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    if (id === undefined) {
      res.status(400)
      res.send('Missing required parameter :id.')
      return false
    }
    await StoreProduct.deleteProduct(id)
    res.send(`Product with id ${id} successfully deleted.`)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}
const productRoutes = (app: Application) => {
  app.get('/products', index)
  app.post('/products/create', validatToken, create)
  app.get('/products/:id', read)
  app.put('/products/:id', validatToken, update)
  app.delete('/products/:id', validatToken, deleteProduct)
}
export default productRoutes
