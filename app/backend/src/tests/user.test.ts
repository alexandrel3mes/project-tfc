import * as sinon from 'sinon';
import * as chai from 'chai';
import "express-async-errors";
// @ts-ignore
import chaiHttp = require('chai-http');
import Users from '../database/models/user';
import IUser from '../interfaces/IUser';
import LoginService from '../services/login.service';
import { app } from '../app';
import { Response } from 'superagent';
import authorize from '../middlewares/authorize'
import throwCustomError from '../utils/throwCustomError'

chai.use(chaiHttp);

const { expect } = chai;

const userMock: IUser = {
  id: 3,
  username: 'alexandrel3mes',
  role: 'user',
  email: 'email@email.com',
  password: 'doaksdkasdkaed'
}

const userPayload = {
  email: 'email@email.com',
  password: 'doaksdkasdkaed'
}

const userWithoutEmail = {
  password: 'secret_admin'
}

class validationError extends Error {
  name = 'validationError'
  code = 400
}

const tokenMock = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGFzc3dvcmQiOiJzZWNyZXRfYWRtaW4ifSwiaWF0IjoxNjYwODY4OTUzfQ.WeSyoitmEElcyADEIh0AVlwnBt7o7jw-HscleDXTDpQ'

describe('User', () => {
  let chaiHttpResponse: Response;

  describe('/login', () => {
    beforeEach(() => {
      sinon.stub(Users, "findOne").resolves(userMock as Users)
      sinon.stub(LoginService, "login").resolves(tokenMock)
    })

    afterEach(() => {
      sinon.restore();
    })

    it('should return status 200', async () => {

      chaiHttpResponse = await chai.request(app)
        .post('/login').send(userPayload)

      expect(chaiHttpResponse.status).to.equal(200);
    })

    it('should return jwt token', async () => {

      chaiHttpResponse = await chai.request(app)
        .post('/login').send(userPayload)

      const token = chaiHttpResponse.body.token

      expect(token).to.equal(tokenMock);
    })
  })

/*   describe('/login/validate', () => {
    beforeEach(() => {
      sinon.stub(Users, "findOne").resolves(userMock as Users)
      sinon.stub(LoginService, "getRole").resolves('user')
    })

    afterEach(() => {
      sinon.restore();
    })

    it('should return status 200', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/login/validate')

      expect(chaiHttpResponse.status).to.equal(200);
    })

    it('should return user`s role', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/login/validate')

      expect(chaiHttpResponse.body.role).to.equal('user');
    })
  }) */

describe('Error testing', () => {
    it('Should return 400 if there`s no email', async () => {
      chaiHttpResponse = await chai.request(app)
        .post('/login')
        .send(userWithoutEmail)

      expect(chaiHttpResponse.status).to.equal(400)
    })

    it('Should return 401 if email is incorrect', async () => {
      chaiHttpResponse = await chai.request(app)
        .post('/login')
        .send(userPayload)

      expect(chaiHttpResponse.status).to.equal(401)
    })
  })
})
