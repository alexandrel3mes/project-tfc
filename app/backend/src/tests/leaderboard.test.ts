import * as sinon from 'sinon';
import * as chai from 'chai';
import "express-async-errors";
// @ts-ignore
import chaiHttp = require('chai-http');
import Teams from '../database/models/teams';
import ITeams from '../interfaces/ITeams';
import ILeaderboard from '../interfaces/ILeaderboard';
import LoginService from '../services/login.service';
import { app } from '../app';
import { Response } from 'superagent';
import authorize from '../middlewares/authorize'
import throwCustomError from '../utils/throwCustomError'
import * as bcrypt from 'bcryptjs'
import TeamService from '../services/teams.service';
import Matches from '../database/models/matches';

chai.use(chaiHttp);

const { expect } = chai;

const leaderMock: ILeaderboard[] = [
  {
    name: 'Santos',
    totalPoints: 9,
    totalGames: 3,
    totalVictories: 3,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 9,
    goalsOwn: 3,
    goalsBalance: 6,
    efficiency: '100.00'
  },
  {
    name: 'Palmeiras',
    totalPoints: 7,
    totalGames: 3,
    totalVictories: 2,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 10,
    goalsOwn: 5,
    goalsBalance: 5,
    efficiency: '77.78'
  },
  {
    name: 'Corinthians',
    totalPoints: 6,
    totalGames: 2,
    totalVictories: 2,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 6,
    goalsOwn: 1,
    goalsBalance: 5,
    efficiency: '100.00'
  },
  {
    name: 'Grêmio',
    totalPoints: 6,
    totalGames: 2,
    totalVictories: 2,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 4,
    goalsOwn: 1,
    goalsBalance: 3,
    efficiency: '100.00'
  },
]

const teamMock: ITeams = {
  id: 1,
  teamName: 'Avaí/Kindermann'
}


describe('Leaderboard', () => {
  let chaiHttpResponse: Response;

  describe('/leaderboard/home', () => {
    beforeEach(() => {
      sinon.stub(Matches, "findAll").resolves(leaderMock as any[])
    })

    afterEach(() => {
      sinon.restore();
    })

    it('should return status 200', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/home')

      expect(chaiHttpResponse.status).to.equal(200);
    })

/*     it('should return home leaderboard list', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/home')

      const leader = chaiHttpResponse.body
      console.log(leader)

      expect(leader).deep.equal(leaderMock);
      sinon.restore();
    }) */
  })

  describe('/leaderboard/away', () => {
    beforeEach(() => {
      sinon.stub(Matches, "findAll").resolves(leaderMock as any[])
    })

    afterEach(() => {
      sinon.restore();
    })

    it('should return status 200', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/away')

      expect(chaiHttpResponse.status).to.equal(200);
    })

/*     it('should return home leaderboard list', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/home')

      const leader = chaiHttpResponse.body
      console.log(leader)

      expect(leader).deep.equal(leaderMock);
      sinon.restore();
    }) */
  })

  describe('/leaderboard/', () => {
    beforeEach(() => {
      sinon.stub(Matches, "findAll").resolves(leaderMock as any[])
    })

    afterEach(() => {
      sinon.restore();
    })

    it('should return status 200', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/')

      expect(chaiHttpResponse.status).to.equal(200);
    })

/*     it('should return home leaderboard list', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/home')

      const leader = chaiHttpResponse.body
      console.log(leader)

      expect(leader).deep.equal(leaderMock);
      sinon.restore();
    }) */
  })

/* describe('/team:id error testing', () => {
    it('Should return 404 if there`s no team', async () => {
      sinon.stub(Teams, "findByPk").resolves(null)
      chaiHttpResponse = await chai.request(app)
        .get('/team/20')

      expect(chaiHttpResponse.status).to.equal(404)
      sinon.restore()
    })
  }) */
})
