import * as sinon from 'sinon';
import * as chai from 'chai';
import "express-async-errors";
// @ts-ignore
import chaiHttp = require('chai-http');
import Matches from '../database/models/matches';
import IMatches from '../interfaces/IMatches';
import { app } from '../app';
import { Response } from 'superagent';
import throwCustomError from '../utils/throwCustomError'
import * as bcrypt from 'bcryptjs'
import authorize from '../middlewares/authorize';
import { NextFunction } from 'express';

chai.use(chaiHttp);

const { expect } = chai;

const matchMock: IMatches = {
  id: 1,
  homeTeam: 16,
  homeTeamGoals: 1,
  awayTeam: 8,
  awayTeamGoals: 1,
  inProgress: false,
}

const matchesMock: IMatches[] = [
    {
      id: 1,
      homeTeam: 16,
      homeTeamGoals: 1,
      awayTeam: 8,
      awayTeamGoals: 1,
      inProgress: false,
      teamHome: {
        teamName: 'São Paulo'
      },
      teamAway: {
        teamName: 'Grêmio'
      }
    },
    {
      id: 2,
      homeTeam: 9,
      homeTeamGoals: 1,
      awayTeam: 14,
      awayTeamGoals: 1,
      inProgress: false,
      teamHome: {
        teamName: 'Internacional'
      },
      teamAway: {
        teamName: 'Santos'
      }
    },
    {
      id: 3,
      homeTeam: 4,
      homeTeamGoals: 3,
      awayTeam: 11,
      awayTeamGoals: 0,
      inProgress: false,
      teamHome: {
        teamName: 'Corinthians'
      },
      teamAway: {
        teamName: 'Napoli-SC'
      }
    },
    {
      id: 4,
      homeTeam: 3,
      homeTeamGoals: 0,
      awayTeam: 2,
      awayTeamGoals: 0,
      inProgress: false,
      teamHome: {
        teamName: 'Botafogo'
      },
      teamAway: {
        teamName: 'Bahia'
      }
    },
]

const updateGoalsPayload = {
  homeTeamGoals: 3,
  awayTeamGoals: 1
}

const createMatchesPayload = {
  homeTeam: 16,
  awayTeam: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2
}

const tokenMock = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGFzc3dvcmQiOiJzZWNyZXRfYWRtaW4ifSwiaWF0IjoxNjYwOTQ0NDkyfQ.Jii8gBwyjMqJ1U-SVoNUIxF4Lati9Eh62vzp58NckPIeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGFzc3dvcmQiOiJzZWNyZXRfYWRtaW4ifSwiaWF0IjoxNjYwOTQ0NDkyfQ.Jii8gBwyjMqJ1U-SVoNUIxF4Lati9Eh62vzp58NckPI';


describe('Matches', () => {
  let chaiHttpResponse: Response;

  describe('/matches', () => {
    beforeEach(() => {
      sinon.stub(Matches, "findAll").resolves(matchesMock as Matches[])
      sinon.stub(Matches, "create").resolves(matchMock as Matches)
    })

    afterEach(() => {
      sinon.restore();
    })

    it('should return status 200', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/matches')

      expect(chaiHttpResponse.status).to.equal(200);
    })

    it('should return matches list', async () => {

      chaiHttpResponse = await chai.request(app)
        .get('/matches')

      const matches = chaiHttpResponse.body

      expect(matches).deep.equal(matchesMock);
    })

/*     describe('create', () => {
      it('should return status 201', async () => {
        const login = await chai.request(app)
        .post('/login')
        .send({
          email: 'user@user.com',
          password: 'secret_user',
        })

        const tokenMock  = login.body.token

        chaiHttpResponse = await chai.request(app)
          .post('/matches').auth(tokenMock, { type: 'bearer' }).send(createMatchesPayload)

        console.log(login.body.token)
        expect(chaiHttpResponse.status).to.equal(201);
      })
    }) */
  })

  describe('/matches:id/finish', () => {
    beforeEach(() => {
      sinon.stub(Matches, "update").resolves()
    })

    afterEach(() => {
      sinon.restore();
    })

    it('should return status 200', async () => {

      chaiHttpResponse = await chai.request(app)
        .patch('/matches/3/finish')

      expect(chaiHttpResponse.status).to.equal(200);
    })

    it('should return finish message', async () => {

      chaiHttpResponse = await chai.request(app)
        .patch('/matches/3/finish')

      const message = chaiHttpResponse.body.message

      expect(message).deep.equal('Finished!');
    })
  })

  describe('/matches:id', () => {
    beforeEach(() => {
      sinon.stub(Matches, "update").resolves()
    })

    afterEach(() => {
      sinon.restore();
    })

    it('should return status 200', async () => {

      chaiHttpResponse = await chai.request(app)
        .patch('/matches/3/finish').send(updateGoalsPayload)

      expect(chaiHttpResponse.status).to.equal(200);
    })

    it('should return goals updated message', async () => {

      chaiHttpResponse = await chai.request(app)
        .patch('/matches/3').send(updateGoalsPayload)

      const message = chaiHttpResponse.body.message

      expect(message).deep.equal('Goals updated!');
    })
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
