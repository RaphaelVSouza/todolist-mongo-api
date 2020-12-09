import mongoose from 'mongoose';
import User from '../../src/app/schemas/Users.js';
import factory from '../factories/factory';
import app from '../../src/app';
import request from 'supertest';
import truncate from '../utils/truncate';
import UserMail from '../../src/app/schemas/UserMails';


describe('User Acess Suite', function () {
  let db = null;
  beforeAll(async () => {
    const dbName = 'test_db';
    const url = `mongodb://localhost/${dbName}`
    await mongoose.connect(url,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )

    db = mongoose.connection;

  });

  afterEach(async () => {
    await User.deleteMany()
  });

  afterAll(async () => {
    await truncate(db)
    await db.close(true)

  });

  it('should be able to register',
    async () => {

      const user = await factory.attrs('User');
      user.confirmPassword = user.password;

      const response = await request(app)
        .post('/user-management/register')
        .send(user)
        .set('Accept', 'application/json');

      await expect(response.body).toHaveProperty('id');
    });

  it('should be able to encrypt password',
    async () => {

      const newUser = await factory.attrs('User');

      const { id } = await User.create(newUser);


      const createdUser = await User.findById(id).select('+password');
      const compared = await createdUser.comparePassword(newUser.password, createdUser.password);

      expect(compared).toBe(true);

    });

  it('should be able to confirm email within the valid expiration date',
    async () => {
      const user = await factory.attrs('User');
      user.confirmPassword = user.password;

      const response = await request(app)
        .post('/user-management/register')
        .send(user)
        .set('Accept', 'application/json');

      const { id } = response.body;
      const userMail = await UserMail.findOne({ user: response.body.id });


      await request(app)
        .get(`/user-management/verify_email/${userMail.verifyEmailToken}`)
        ;

      const { isVerified } = await User.findById(id);

      expect(isVerified).toBe(true);


    });

  it('should NOT be able to confirm email within the invalid expiration date ',
    async () => {
      const user = await factory.attrs('User');
      user.confirmPassword = user.password;

      const response = await request(app)
        .post('/user-management/register')
        .send(user)
        .set('Accept', 'application/json');

      const { id } = response.body;

      const userMail = await UserMail.findOne({ user: response.body.id });
      const now = new Date();
      now.setHours(now.getHours() - 2);
      userMail.verifyEmailExpires = now;


      await userMail.save();

      await request(app)
        .get(`/user-management/verify_email/${userMail.verifyEmailToken}`);

      const { isVerified } = await User.findById(id);

      expect(isVerified).toBe(false);

    });
  it('should be able to login when valid credentials', async () => {
    // Gerar usuário
    const user = await factory.attrs('User');
    user.confirmPassword = user.password;

    // Registrar usuário
    const response1 = await request(app)
      .post('/user-management/register')
      .send(user)
      .set('Accept', 'application/json');

    // Confirmar email

    const userMail = await UserMail.findOne({ user: response1.body.id });

    const response2 = await request(app)
      .get(`/user-management/verify_email/${userMail.verifyEmailToken}`)

    // Iniciar sessão

    const response3 = await request(app)
      .post('/user-management/login')
      .send({
        email: user.email,
        password: user.password
      })
      .set('Accept', 'application/json');

    expect(response3.status).toBe(200);

  });

  it('should NOT be able to login when valid credentials', async () => {
    // Gerar usuário
    const user = await factory.attrs('User');
    user.confirmPassword = user.password;

    // Registrar usuário
    const response1 = await request(app)
      .post('/user-management/register')
      .send(user)
      .set('Accept', 'application/json');

    // Confirmar email

    const userMail = await UserMail.findOne({ user: response1.body.id });

    await request(app)
      .get(`/user-management/verify_email/${userMail.verifyEmailToken}`)

    // Iniciar sessão

    const response2 = await request(app)
      .post('/user-management/login')
      .send({
        email: user.email,
        password: 'some invalid password'
      })
      .set('Accept', 'application/json');

    expect(response2.status).toBe(401);

  });

  it('should be able to access a protected route when passes a valid token', async () => {
    // Gerar usuário
    const user = await factory.attrs('User');
    user.confirmPassword = user.password;

    // Registrar usuário
    const response1 = await request(app)
      .post('/user-management/register')
      .send(user)
      .set('Accept', 'application/json');

    // Confirmar email

    const userMail = await UserMail.findOne({ user: response1.body.id });

    const response2 = await request(app)
      .get(`/user-management/verify_email/${userMail.verifyEmailToken}`)

    // Iniciar sessão

    const response3 = await request(app)
      .post('/user-management/login')
      .send({
        email: user.email,
        password: user.password
      })
      .set('Accept', 'application/json');

    const response4 = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${response3.body.accessToken}`
      );

    expect(response4.status).toBe(200);
  });

  it('should NOT be able to access a protected route when not passes a invalid token', async () => {
    // Gerar usuário
    const user = await factory.attrs('User');
    user.confirmPassword = user.password;

    // Registrar usuário
    const response1 = await request(app)
      .post('/user-management/register')
      .send(user)
      .set('Accept', 'application/json');

    // Confirmar email

    const userMail = await UserMail.findOne({ user: response1.body.id });

    const response2 = await request(app)
      .get(`/user-management/verify_email/${userMail.verifyEmailToken}`)

    // Iniciar sessão

    const response3 = await request(app)
      .post('/user-management/login')
      .send({
        email: user.email,
        password: user.password
      })
      .set('Accept', 'application/json');

    const response4 = await request(app)
      .get('/projects')
      .set('Authorization', `InvalidToken iw23j4o23ij4o23kffj3pr3`
      );

    expect(response4.status).toBe(401);
  });


  it('should be able to change name and email', async () => {

      let user = await factory.attrs('User');
      user.confirmPassword = user.password;

      const response1 = await request(app)
        .post('/user-management/register')
        .send(user)
        .set('Accept', 'application/json');

      const userMail = await UserMail.findOne({ user: response1.body.id });

      await request(app)
        .get(`/user-management/verify_email/${userMail.verifyEmailToken}`)

        const response3 = await request(app)
          .post('/user-management/login')
          .send({
            email: user.email,
            password: user.password
          })
          .set('Accept', 'application/json');

        const response4 = await request(app)
          .put('/user-management/edit')
          .send({
            name: 'new name',
            email: 'newemail@email.com',
          })
          .set('Authorization', `Bearer ${response3.body.accessToken}`);

        const changedUser = await User.findById(response4.body.id);

        expect(changedUser).toMatchObject({
          name: 'new name',
          email: 'newemail@email.com',
        })


      })

      // Need to fix
/*
      it('should be able to change password', async () => {

        let user = await factory.attrs('User');
        user.confirmPassword = user.password;

        const response1 = await request(app)
          .post('/user-management/register')
          .send(user)
          .set('Accept', 'application/json');

        const userMail = await UserMail.findOne({ user: response1.body.id });

        await request(app)
          .get(`/user-management/verify_email/${userMail.verifyEmailToken}`)

          const response3 = await request(app)
            .post('/user-management/login')
            .send({
              email: user.email,
              password: user.password
            })
            .set('Accept', 'application/json');

          const response4 = await request(app)
            .put('/user-management/edit')
            .send({
            oldPassword: user.password,
            password: 'new password123',
            confirmPassword: 'new password123',
            })
            .set('Authorization', `Bearer ${response3.body.accessToken}`);

          const changedUser = await User.findById(response4.body.id).select('+password');
            console.log(changedUser)
            const compare = await changedUser.comparePassword('new password123', changedUser.password);

          expect(compare).toBe(false);
        })
*/

});




