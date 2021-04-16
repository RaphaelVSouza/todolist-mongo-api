import {
  describe, it, expect, beforeAll, afterAll,
} from '@jest/globals';
import request from 'supertest';
import { resolve } from 'path';
import { factory } from '../factories/factory';
import Mongo from '../../../database/mongo';
import app from '../../../routes';
import { Avatar } from '../../models/Avatar';
import { IUserTest } from '../interfaces/user';


const avatarImage = resolve(__dirname, '..', 'images', 'avatar-test-image.png');
const newAvatarImage = resolve(__dirname, '..', 'images', 'new-avatar-test-image.png');

let user: IUserTest;
let verifyToken: string;
let accessToken: string;
let userId: string;


describe.only('API User Test Suite', () => {
  beforeAll(async () => {
    user = await factory.attrs('User') as IUserTest;
  });
  afterAll(async () => {
    await Mongo.close();

  });

  it('1 - Should be able to register a User on use POST in /register with an avatar', async () => {
    const {
      name, email, password, confirmPassword = user.password,
    } = user;
    const response = await request(app)
      .post('/register')
      .type('multipart/form-data')
      .field('name', name)
      .field('email', email)
      .field('password', password)
      .field('confirmPassword', confirmPassword)
      .attach('file', avatarImage)
      .set('Accept', 'application/json');
    [, verifyToken] = response.body.message.split(':');


    expect(response.status).toBe(200);
    expect(verifyToken.length).toBeGreaterThanOrEqual(20);
  });

  it('Should be able to verify email with valid token on use GET in /verify-email/:verifyToken', async () => {
    const response = await request(app)
      .get(`/verify-email/${verifyToken}`)
      .send()
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email verified successfully');
  });

  it('3 - Should be able to get an access token on use POST in /login with valid credentials', async () => {
    const { email, password } = user;
    const response = await request(app)
      .post('/login')
      .send({
        email,
        password,
      })
      .set('Accept', 'application/json');
    accessToken = response.body.accessToken;
    userId = response.body._id;
    const jwtRegex = /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/;
    expect(response.status).toBe(200);
    expect(accessToken).toMatch(jwtRegex);
  });

  it('4 - Should be able to delete a User Avatar on DELETE in /user-management/deletePhoto', async () => {
    const response = await request(app)
    .delete('/user-management/deletePhoto')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${accessToken}`);

    const message = response.body.message as object;

    expect(response.status).toBe(200);
    expect(message).toBe('Avatar is successfully removed')
  });

  it('5 - Should be able to edit a User Avatar on use PUT in /user-management/edit-account', async () => {
    const response = await request(app)
      .put('/user-management/edit-account')
      .type('multipart/form-data')
      .attach('file', newAvatarImage)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);

      console.log(response.body)
    const updatedAvatar = response.body.avatar.key;

    expect(response.status).toBe(200);
    expect(updatedAvatar).toMatch(/new-avatar-test-image\.png/);
  });

  it('6 - Should delete a User and Avatar on use DELETE in /user-management/delete-account', async () => {
    const response = await request(app)
      .delete('/user-management/delete-account')
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`);
    const isAvatarDeleted = await Avatar.findOne({ user_id: userId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User is successfully removed');
    expect(isAvatarDeleted).toBeFalsy();
  });
});
