import { BaseOrder, Order, OrderStore } from '../../models/order'
import { User, storeUser } from '../../models/user'
import { Product, ProductStore } from '../../models/product'

const storeOrders = new OrderStore()

describe('Order Model', () => {
  const storeClient = new storeUser()
  const storeProducts = new ProductStore()

  let order: BaseOrder, user_id: number, product_id: number

  async function createOrder(order: BaseOrder) {
    return storeOrders.create(order)
  }

  async function deleteOrder(id: number) {
    return storeOrders.deleteOrder(id)
  }

  beforeAll(async () => {
    const user: User = await storeClient.create({
      username: 'ahmedhani',
      firstname: 'ahmed',
      lastname: 'hani',
      password: 'password123'
    })
    user_id = user.id

    const productItem: Product = await storeProducts.create({
      name: 'panadol 500 tab',
      price: 16
    })

    product_id = productItem.id

    order = {
      products: [{ product_id, quantity: 5 }],
      user_id,
      status: true
    }
  })

  afterAll(async () => {
    await storeClient.deleteUser(user_id)
    await storeProducts.deleteProduct(product_id)
  })

  it('should have an index method', () => {
    expect(storeOrders.index).toBeDefined()
  })

  it('should have a add method', () => {
    expect(storeOrders.create).toBeDefined()
  })

  it('should have a show method', () => {
    expect(storeOrders.read).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(storeOrders.deleteOrder).toBeDefined()
  })

  it('index method should return a list of orders', async () => {
    const createdOrder: Order = await createOrder(order)
    const orderList = await storeOrders.index()

    expect(orderList).toEqual([createdOrder])

    await deleteOrder(createdOrder.id)
  })

  it('add method should add a order', async () => {
    const createdOrder: Order = await createOrder(order)

    expect(createdOrder).toEqual({
      id: createdOrder.id,
      ...order
    })

    await deleteOrder(createdOrder.id)
  })

  it('show method should return the correct orders', async () => {
    const createdOrder: Order = await createOrder(order)
    const orderInDb = await storeOrders.read(createdOrder.id)

    expect(orderInDb).toEqual(createdOrder)

    await deleteOrder(createdOrder.id)
  })

  it('update method should update the order', async () => {
    const createdOrder: Order = await createOrder(order)
    const newOrderData: BaseOrder = {
      products: [
        {
          product_id,
          quantity: 3
        }
      ],
      user_id,
      status: false
    }

    const { products, status } = await storeOrders.update(createdOrder.id, newOrderData)

    expect(products).toEqual(newOrderData.products)
    expect(status).toEqual(newOrderData.status)

    await deleteOrder(createdOrder.id)
  })

  it('delete method should remove the order', async () => {
    const createdOrder: Order = await createOrder(order)

    await deleteOrder(createdOrder.id)

    const orderList = await storeOrders.index()

    expect(orderList).toEqual([])
  })
})
