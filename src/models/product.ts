import Client from '../database'

export interface BaseProduct {
  name: string
  price: number
}

export interface Product extends BaseProduct {
  id: number
}
export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM products'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (e) {
      throw new Error(`Could not get products. ${e}`)
    }
  }

  async create(product: BaseProduct): Promise<Product> {
    const { name, price } = product
    try {
      const conn = await Client.connect()
      const sql = 'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *'
      const result = await conn.query(sql, [name, price])
      conn.release()
      return result.rows[0]
    } catch (e) {
      throw new Error(`Could not add new product ${name}. ${e}`)
    }
  }

  async read(id: number): Promise<Product> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM products WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (e) {
      throw new Error(`Could not find product ${id}. ${e}`)
    }
  }

  async update(id: number, newProductData: BaseProduct): Promise<Product> {
    const { name: newName, price } = newProductData
    try {
      const conn = await Client.connect()
      const sql = 'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *'
      const result = await conn.query(sql, [newName, price, id])
      conn.release()
      return result.rows[0]
    } catch (e) {
      throw new Error(`Could not update product ${name}. ${e}`)
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    try {
      const conn = await Client.connect()
      const sql = 'DELETE FROM products WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (e) {
      throw new Error(`Could not delete product ${id}. ${e}`)
    }
  }
}
