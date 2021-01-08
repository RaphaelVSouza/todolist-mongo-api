import mongoose from 'mongoose';
import request from 'supertest';
import {
  describe, it, expect, beforeAll,
} from '@jest/globals';
import User from '../../src/app/schemas/Users.js';
import factory from '../factories/factory';
import app from '../../src/app';
import truncate from '../utils/truncate';
import Mongo from '../../src/database/mongo';
import { compare }from 'bcryptjs';

let user = {};

describe('User Password Test Suite', () => {
  beforeAll(async () => {
    user = await factory.attrs('User');
  });

  it('0 - Should connect to the database', async () => {
    const connectionState = await Mongo.isConnected();
  
    expect(connectionState).toBe('Connected');
  });

  it('1 - Should be able to encrypt password', async () => {
    const { password } = await User.create(user)
  
  const isHashed = password.startsWith('$2a$10$')
    expect(isHashed).toBe(true);
    
  });

  it('2 - Should compare password', async () => {
    const findUser = await User.findOne({ email: user.email }).select('+password');
  
    const isMatched = await compare(user.password, findUser.password);

    expect(isMatched).toBe(true);
  });

  it('3 - Should close Database connection', async () => {
    await Mongo.close();
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Disconnected')
  });

});
