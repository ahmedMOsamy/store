import Client from '../database'

export interface OrderProduct {
  product_id: number
  quantity: number
}

export interface BaseOrder {
  products: OrderProduct[]
  user_id: number
  status: boolean
}

export interface Order extends BaseOrder {
  id: number
}

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM orders'
      const result = await conn.query(sql)
      const orderProductsSql = 'SELECT product_id, quantity FROM order_products WHERE order_id=($1)'
      const orders = []

      for (const order of result.rows) {
        const { rows: orderProductRows } = await conn.query(orderProductsSql, [order.id])
        orders.push({
          ...order,
          products: orderProductRows
        })
      }
      conn.release()
      return orders
    } catch (e) {
      throw new Error(`Could not get orders. ${e}`)
    }
  }

  async create(order: BaseOrder): Promise<Order> {
    const { products, status, user_id } = order
    try {
      const conn = await Client.connect()
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *'
      const result = await conn.query(sql, [user_id, status])
      const order = result.rows[0]
      const orderProductsSql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
      const orderProducts = []
      for (const product of products) {
        const { product_id, quantity } = product
        const result = await conn.query(orderProductsSql, [order.id, product_id, quantity])
        orderProducts.push(result.rows[0])
      }
      conn.release()
      return {
        ...order,
        products: orderProducts
      }
    } catch (e) {
      throw new Error(`Could not add new order for user ${user_id}. ${e}`)
    }
  }

  async read(id: number): Promise<Order> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM orders WHERE id=($1)'
      const result = await conn.query(sql, [id])
      const order = result.rows[0]
      const orderProductsSql = 'SELECT product_id, quantity FROM order_products WHERE order_id=($1)'
      const { rows: orderProductRows } = await conn.query(orderProductsSql, [id])
      conn.release()
      return {
        ...order,
        products: orderProductRows
      }
    } catch (e) {
      throw new Error(`Could not find order ${id}. ${e}`)
    }
  }

  async update(id: number, newOrderData: BaseOrder): Promise<Order> {
    const { products, status, user_id } = newOrderData
    try {
      const conn = await Client.connect()
      const sql = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *'
      const result = await conn.query(sql, [status, id])
      const order = result.rows[0]
      const orderProductsSql =
        'UPDATE order_products SET product_id = $1, quantity = $2 WHERE order_id = $3 RETURNING product_id, quantity'
      const orderProducts = []
      for (const product of products) {
        const { product_id, quantity } = product
        const result = await conn.query(orderProductsSql, [product_id, quantity, order.id])
        orderProducts.push(result.rows[0])
      }
      conn.release()
      return {
        ...order,
        products: orderProducts
      }
    } catch (e) {
      throw new Error(`Could not update order for user ${user_id}. ${e}`)
    }
  }
  async deleteOrder(id: number): Promise<OrderProduct> {
    try {
      const conn = await Client.connect()
      const orderProductsSql = 'DELETE FROM order_products WHERE order_id=($1)'
      await conn.query(orderProductsSql, [id])
      const sql = 'DELETE FROM orders WHERE id=($1)'
      const result = await conn.query(sql, [id])
      const order = result.rows[0]
      conn.release()
      return order
    } catch (e) {
      throw new Error(`Could not delete order ${id}. ${e}`)
    }
  }
}
