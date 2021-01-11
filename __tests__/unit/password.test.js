import {
  describe, it, expect, beforeAll, afterAll,
} from '@jest/globals';
import { compare } from 'bcryptjs';
import User from '../../src/app/schemas/Users.js';
import factory from '../factories/factory';
import Mongo from '../../src/database/mongo';

let user = {};
let createdUser = {};

describe('User Password Test Suite', () => {
  beforeAll(async () => {
    user = await factory.attrs('User');
    createdUser = await User.create(user);
  });

  afterAll(async () => {
    await createdUser.remove();

    await Mongo.close();
    await Mongo.isConnected();
  });

  it('0 - Should connect to the database', async () => {
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Connected');
  });

  it('1 - Should be able to encrypt password', async () => {
    const { password } = createdUser;

    const isHashed = password.startsWith('$2a$10$');
    expect(isHashed).toBe(true);
  });

  it('2 - Should compare password', async () => {
    const findUser = await User.findOne({ email: user.email }).select('+password');

    const isMatched = await compare(user.password, findUser.password);

    expect(isMatched).toBe(true);
  });
});
