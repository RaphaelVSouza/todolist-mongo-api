import {
  describe, it, expect, beforeAll,
} from '@jest/globals';
import request from 'supertest';
import { factory } from '../factories/factory';
import Mongo from '../../../database/mongo';
import app from '../../../routes';
import { IUserTest } from '../interfaces/user';

let user: IUserTest;
let verifyToken: string;
let accessToken: string;

describe('API User Test Suite', () => {
  beforeAll(async () => {
    user = await factory.attrs('User') as IUserTest;
  });


  it('1 - Should be able to register a User on /register', async () => {
    const {
      name, email, password, confirmPassword = user.password,
    } = user;
    const response = await request(app)
      .post('/register')
      .send({
        name,
        email,
        password,
        confirmPassword,
      })
      .set('Accept', 'application/json');
    [, verifyToken] = response.body.message.split(':');

    expect(response.status).toBe(200);
    expect(verifyToken.length).toBeGreaterThanOrEqual(20);
  });

  it('Should be able to verify email with valid token', async () => {
    const response = await request(app)
      .get(`/verify-email/${verifyToken}`)
      .send()
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email verified successfully');
  });

  it('3 - Should be able to get an access token on /login with valid credentials', async () => {
    const { email, password } = user;
    const response = await request(app)
      .post('/login')
      .send({
        email,
        password,
      })
      .set('Accept', 'application/json');

    accessToken = response.body.accessToken;
    const jwtRegex = /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/;
    expect(response.status).toBe(200);
    expect(accessToken).toMatch(jwtRegex);
  });

  it('4 - Should be able to edit a User on /user-management/edit-account', async () => {
    const newName = 'New User Name';
    const response = await request(app)
      .put('/user-management/edit-account')
      .send({
        name: newName,
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.updatedUser.name).toBe(newName);
  });

  it('4 - Should delete a User on /user-management/delete-account', async () => {
    const response = await request(app)
      .delete('/user-management/delete-account')
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User is successfully removed');
  });

  it('5 - Should close Database connection', async () => {
    await Mongo.close();
    const connectionState = await Mongo.isConnected();

    expect(connectionState).toBe('Disconnected');
  });
});
