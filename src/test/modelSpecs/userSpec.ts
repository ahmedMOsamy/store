import { BaseAuthUser, BaseUser, User, storeUser } from '../../models/user'

const userClient = new storeUser()

describe('User Model', () => {
  const user: BaseAuthUser = {
    username: 'ahmedsamy',
    firstname: 'ahmed',
    lastname: 'samy',
    password: 'password123'
  }

  async function createUser(user: BaseAuthUser) {
    return userClient.create(user)
  }

  async function deleteUser(id: number) {
    return userClient.deleteUser(id)
  }

  it('should have an index method', () => {
    expect(userClient.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(userClient.read).toBeDefined()
  })

  it('should have a create method', () => {
    expect(userClient.create).toBeDefined()
  })

  it('should have a remove method', () => {
    expect(userClient.deleteUser).toBeDefined()
  })

  it('create method should create a user', async () => {
    const createdUser: User = await createUser(user)

    if (createdUser) {
      const { username, firstname, lastname } = createdUser

      expect(username).toBe(user.username)
      expect(firstname).toBe(user.firstname)
      expect(lastname).toBe(user.lastname)
    }

    await deleteUser(createdUser.id)
  })

  it('index method should return a list of users', async () => {
    const createdUser: User = await createUser(user)
    const userList = await userClient.index()

    expect(userList).toEqual([createdUser])

    await deleteUser(createdUser.id)
  })

  it('show method should return the correct users', async () => {
    const createdUser: User = await createUser(user)
    const userInDb = await userClient.read(createdUser.id as number)

    expect(userInDb).toEqual(createdUser)

    await deleteUser(createdUser.id as number)
  })

  it('update method should update the user', async () => {
    const createdUser: User = await createUser(user)
    const updatedUser: BaseUser = {
      firstname: 'mohamed',
      lastname: 'omer'
    }

    const { firstname, lastname } = await userClient.update(createdUser.id, updatedUser)
    expect(firstname).toEqual(updatedUser.firstname)
    expect(lastname).toEqual(updatedUser.lastname)

    await deleteUser(createdUser.id)
  })
  it('remove method should remove the user', async () => {
    const createdUser: User = await createUser(user)

    await deleteUser(createdUser.id)

    const userList = await userClient.index()

    expect(userList).toEqual([])
  })

  it('authenticates the user with a password', async () => {
    const createdUser: User = await createUser(user)

    const authenticatedUser = await userClient.authenticate(user.username, user.password)

    if (authenticatedUser) {
      const { username, firstname, lastname } = authenticatedUser

      expect(username).toBe(user.username)
      expect(firstname).toBe(user.firstname)
      expect(lastname).toBe(user.lastname)
    }

    await deleteUser(createdUser.id)
  })
})
