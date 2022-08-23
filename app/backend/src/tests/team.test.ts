import * as sinon from 'sinon';
import * as chai from 'chai';
import "express-async-errors";
// @ts-ignore
import chaiHttp = require('chai-http');
import Teams from '../database/models/teams';
import ITeams from '../interfaces/ITeams';
import LoginService from '../services/login.service';
import { app } from '../app';
import { Response } from 'superagent';
import authorize from '../middlewares/authorize'
import throwCustomError from '../utils/throwCustomError'
import * as bcrypt from 'bcryptjs'
import TeamService from '../services/teams.service';

chai.use(chaiHttp);

const { expect } = chai;

const teamsMock: ITeams[] = [
  {
    id: 1,
    teamName: 'Avaí/Kindermann'
  },
  {
    id: 2,
    teamName: 'Bahia'
  },
  {
    id: 3,
    teamName: 'Botafogo'
  },
]

const teamMock: ITeams = {
  id: 1,
  teamName: 'Avaí/Kindermann'
}


describe('Team', () => {
  let chaiHttpResponse: Response;

  describe('/teams', () => {
    beforeEach(() => {
      sinon.stub(Teams, "findAll").resolves(teamsMock as Teams[])
    })

    afterEach(() => {
      sinon.restore();
    })

    it('should return status 200', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/teams')

      expect(chaiHttpResponse.status).to.equal(200);
    })

    it('should return teams list', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/teams')

      const teams = chaiHttpResponse.body

      expect(teams).deep.equal(teamsMock);
      sinon.restore();
    })
  })

  describe('/teams:id', () => {
    beforeEach(() => {
      sinon.stub(Teams, "findByPk").resolves(teamMock as Teams)
    })

    afterEach(() => {
      sinon.restore();
    })

    it('should return status 200', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/teams/1')

      expect(chaiHttpResponse.status).to.equal(200);
    })

    it('should return a unique team', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/teams/1')

      const team = chaiHttpResponse.body

      expect(team).deep.equal(teamMock);
      sinon.restore();
    })
  })

describe('/team:id error testing', () => {
    it('Should return 404 if there`s no team', async () => {
      sinon.stub(Teams, "findByPk").resolves(null)
      chaiHttpResponse = await chai.request(app)
        .get('/team/20')

      expect(chaiHttpResponse.status).to.equal(404)
      sinon.restore()
    })
  })
})
