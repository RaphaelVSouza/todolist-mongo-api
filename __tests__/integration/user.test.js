import {
  describe, it, expect, beforeAll,
} from '@jest/globals';
import User from '../../src/app/schemas/Users.js';
import factory from '../factories/factory';
import Mongo from '../../src/database/mongo';

let user = {};
describe('MongoDB Test Suite', () => {
  beforeAll(async () => {
    user = await factory.attrs('User');
  });

  it('0 - Should connect to the database', async () => {
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Connected');
  });

  it('1 - Should create a User on database', async () => {
    const createdUser = await User.create(user);

    expect(createdUser).toHaveProperty('_id');
  });

  it('2 - Should find a User from database', async () => {
    const findUser = await User.findOne({ email: user.email });

    expect(findUser.email).toBe(user.email.toLowerCase());
  });

  it('3 - Should update a User from database', async () => {
    const query = { email: user.email };
    const update = { name: 'A New Name' };

    const isUpdated = await User.updateOne(query, update);

    expect(isUpdated.nModified && isUpdated.ok).toBe(1);
  });

  it('4 - Should delete a User from database', async () => {
    const query = { email: user.email };
    const isDeleted = await User.deleteOne(query);

    expect(isDeleted.ok).toBe(1);
  });

  it('5 - Should close Database connection', async () => {
    await Mongo.close();
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Disconnected');
  });
});
