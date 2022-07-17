import Client from '../database'
import bcrypt from 'bcrypt'

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env

export interface BaseUser {
  firstname: string
  lastname: string
}

export interface BaseAuthUser extends BaseUser {
  username: string
  password: string
}

export interface User extends BaseAuthUser {
  id: number
}

export class storeUser {
  async create(user: BaseAuthUser): Promise<User> {
    const { firstname, lastname, username, password } = user

    try {
      const conn = await Client.connect()
      const sql =
        'INSERT INTO users (firstname, lastname, username, password_digest) VALUES($1, $2, $3, $4) RETURNING *'
      const hash = bcrypt.hashSync(password + BCRYPT_PASSWORD, parseInt(SALT_ROUNDS as string, 10))
      const result = await conn.query(sql, [firstname, lastname, username, hash])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`unable to create new user ${firstname} ${lastname}. ${err}`)
    }
  }

  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT id, username, firstname, lastname FROM users'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (e) {
      throw new Error(`Could not get users. ${e}`)
    }
  }
  async read(id: number): Promise<User> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT id, username, firstname, lastname FROM users WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (e) {
      throw new Error(`Could not find user ${id}. ${e}`)
    }
  }
  async update(id: number, newUserData: BaseUser): Promise<User> {
    const { firstname, lastname } = newUserData
    try {
      const conn = await Client.connect()
      const sql = 'UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *'

      const result = await conn.query(sql, [firstname, lastname, id])
      conn.release()
      return result.rows[0]
    } catch (e) {
      throw new Error(`Could not update user ${firstname} ${lastname}. ${e}`)
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const conn = await Client.connect()
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING id, username, firstname, lastname'
      await conn.query(sql, [id])
      conn.release()
      return true
    } catch (e) {
      throw new Error(`Could not delete user ${id}. ${e}`)
    }
  }
  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM users WHERE username=$1'
      const result = await conn.query(sql, [username])
      if (result.rows.length > 0) {
        const user = result.rows[0]

        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password_digest)) {
          return user
        }
      }
      conn.release()
      return null
    } catch (e) {
      throw new Error(`Could not find user ${username}. ${e}`)
    }
  }
}
