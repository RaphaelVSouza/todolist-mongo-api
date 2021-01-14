import {
  describe, it, expect, beforeAll,
} from '@jest/globals';
import request from 'supertest';
import User from '../../src/app/schemas/Users.js';
import factory from '../factories/factory';
import Mongo from '../../src/database/mongo';
import app from '../../src/app';

let user = {};
let resetToken = '';
const newPassword = 'MY_NEW_PASSWORD_123';

describe('API Password Test Suite', () => {
  beforeAll(async () => {
    user = await factory.create('User');
    user.isVerified = true;
    await user.save();
  });

  it('0 - Should connect to the database', async () => {
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Connected');
  });

  it('1 - Should be able to get a reset password token on use POST in /forgot-password', async () => {
    const { email } = user;
    const response = await request(app)
      .post('/forgot-password')
      .send({
        email,
      })
      .set('Accept', 'application/json');
    [, resetToken] = response.body.message.split(':');

    expect(response.status).toBe(200);
    expect(resetToken.length).toBeGreaterThanOrEqual(20);
  });

  it('2 - Should be able to reset password with the reset token on use PUT in /reset-password/:resetToken', async () => {
    const response = await request(app)
      .put(`/reset-password/${resetToken}`)
      .send({
        password: newPassword,
        confirmPassword: newPassword,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password changed successfully!');
  });

  it('3 - Should be able to get an access token on use POST in /login with the new password ', async () => {
    const { email } = user;
    const response = await request(app)
      .post('/login')
      .send({
        email,
        password: newPassword,
      })
      .set('Accept', 'application/json');
    const { accessToken } = response.body;
    const jwtRegex = /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/;
    expect(response.status).toBe(200);
    expect(accessToken).toMatch(jwtRegex);
  });

  it('5 - Should close Database connection', async () => {
    await Mongo.close();
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Disconnected');
  });
});
