import supertest from 'supertest'
import jwt, { Secret } from 'jsonwebtoken'

import app from '../../server'
import { BaseOrder } from '../../models/order'
import { BaseAuthUser } from '../../models/user'
import { BaseProduct } from '../../models/product'

const request = supertest(app)
const SECRET: string = process.env.TOKEN_SECRET as Secret as string

describe('Order Handler', () => {
  let token: string, order: BaseOrder, user_id: number, product_id: number, order_id: number

  beforeAll(async () => {
    const userData: BaseAuthUser = {
      username: 'saidsamy',
      firstname: 'said',
      lastname: 'sami',
      password: 'password123'
    }
    const productData: BaseProduct = {
      name: 'amaryl 3mg tab',
      price: 23
    }

    const { body: userBody } = await request.post('/users/create').send(userData)

    const token: string = userBody

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(token, SECRET)
    if (user_id !== user.id) {
      throw new Error('User id does not match!')
    }
    const { body: productBody } = await request
      .post('/products/create')
      .set('Authorization', 'bearer ' + token)
      .send(productData)
    product_id = productBody.id

    order = {
      products: [{ product_id, quantity: 5 }],
      user_id,
      status: true
    }
  })

  afterAll(async () => {
    await request.delete(`/users/${user_id}`).set('Authorization', 'bearer ' + token)
    await request.delete(`/products/${product_id}`).set('Authorization', 'bearer ' + token)
  })

  it('gets the create endpoint', () => {
    request
      .post('/orders/create')
      .send(order)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        const { body, status } = res
        expect(status).toBe(200)
        order_id = body.id
      })
  })

  it('gets the index endpoint', () => {
    request
      .get('/orders')
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200)
      })
  })

  it('gets the read endpoint', () => {
    request
      .get(`/orders/${order_id}`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200)
      })
  })

  it('gets the update endpoint', () => {
    const newOrder: BaseOrder = {
      ...order,
      status: false
    }
    request
      .put(`/orders/${order_id}`)
      .send(newOrder)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200)
      })
  })

  it('gets the delete endpoint', () => {
    request
      .delete(`/orders/${order_id}`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200)
      })
  })
})
