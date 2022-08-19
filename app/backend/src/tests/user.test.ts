import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import Users from '../database/models/user';
import IUser from '../interfaces/IUser';
import { app } from '../app';
import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const userMock: IUser = {
  id: 3,
  username: 'alexandrel3mes',
  role: 'user',
  email: 'email@email.com',
  password: 'doaksdkasdkaed'
}

describe('Users', () => {
  describe('List', () => {
/*     beforeEach(() => {
      sinon.stub(Users, "findAll").resolves([userMock as Users]);
    }) */

    afterEach(() => {
      sinon.restore();
    })

    it('should return status 200', async () => {
      const response = await chai.request(app)
        .get('/users')

      expect(response.status).to.equal(200);
    })

    it('should return users', async () => {
      const response = await chai.request(app)
        .get('/users')

      const [user] = response.body as IUser[];

    })
  })
})
