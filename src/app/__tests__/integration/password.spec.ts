import { compare } from 'bcryptjs'
import { User } from '../../models/Users'
import { factory } from '../factories/factory'
import Mongo from '../../../database/mongo'
import { IUserTest } from '../interfaces/user'

let user: IUserTest
const password = '123'

describe('User Password Test Suite', () => {
  beforeAll(async () => {
    user = (await factory.create('User', { password })) as IUserTest
  })

  afterAll(async () => {
    await user.remove()

    await Mongo.close()
  })

  it('1 - Should be able to encrypt password', async () => {
    const { password } = user

    const isHashed = password.startsWith('$2a$10$')
    expect(isHashed).toBe(true)
  })

  it('2 - Should compare password', async () => {
    const findedUser = await User.findOne({ email: user.email }).select(
      '+password'
    )

    const isMatched = await compare(password, findedUser.password)

    expect(isMatched).toBe(true)
  })
})
