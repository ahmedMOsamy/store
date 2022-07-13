import supertest from 'supertest'
import jwt, { Secret } from 'jsonwebtoken'

import app from '../../server'
import { BaseProduct } from '../../models/product'
import { BaseAuthUser } from '../../models/user'

const request = supertest(app)
const SECRET: string = process.env.TOKEN_SECRET as Secret as string

describe('Product Handler', () => {
  const product: BaseProduct = {
    name: 'panadol 500 tab',
    price: 16
  }

  let token: string, userId: number, productId: number

  beforeAll(async () => {
    const userData: BaseAuthUser = {
      username: 'ahmedhani',
      firstname: 'ahmed',
      lastname: 'hani',
      password: 'password123'
    }

    const { body } = await request.post('/users/create').send(userData)

    token = body

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(token as string, SECRET)
    userId = user.id
  })

  afterAll(async () => {
    await request.delete(`/users/${userId}`).set('Authorization', 'bearer ' + token)
  })

  it('gets the create endpoint', () => {
    request
      .post('/products/create')
      .send(product)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        const { body, status } = res

        expect(status).toBe(200)

        productId = body.id
      })
  })

  it('gets the index endpoint', () => {
    request.get('/products').then((res) => {
      expect(res.status).toBe(200)
    })
  })

  it('gets the read endpoint', () => {
    request.get(`/products/${productId}`).then((res) => {
      expect(res.status).toBe(200)
    })
  })

  it('gets the update endpoint', () => {
    const newProductData: BaseProduct = {
      ...product,
      name: 'alphentern tab',
      price: 36
    }

    request
      .put(`/products/${productId}`)
      .send(newProductData)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200)
      })
  })

  it('gets the delete endpoint', () => {
    request
      .delete(`/products/${productId}`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200)
      })
  })
})
