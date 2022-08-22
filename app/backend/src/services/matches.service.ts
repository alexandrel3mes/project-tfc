import 'dotenv';
import Teams from '../database/models/teams';
// import throwCustomError from '../utils/throwCustomError';
import Matches from '../database/models/matches';
import { ITeam } from './teams.service';
import throwCustomError from '../utils/throwCustomError';

export interface IMatches {
  id?: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  teamHome?: ITeam,
  teamAway?: ITeam,
}

export interface IMatchesCreatePayload {
  homeTeam: string,
  homeTeamGoals: number,
  awayTeam: string,
  awayTeamGoals: number,
}

class MatchesService {
  static async getAll(): Promise<IMatches[]> {
    const matches = await Matches.findAll();
    const returnedMatches = Promise.all(matches.map(async (match) => {
      const { id, homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress } = match;
      const teamNames = await this.getTeamsName(homeTeam, awayTeam);
      if (teamNames) {
        return {
          id,
          homeTeam,
          homeTeamGoals,
          awayTeam,
          awayTeamGoals,
          inProgress,
          teamHome: { teamName: teamNames[0] },
          teamAway: { teamName: teamNames[1] },
        };
      }
    }));
    return returnedMatches as Promise<IMatches[]>;
  }

  static async teamExist(id: number): Promise<ITeam | undefined> {
    const team = await Teams.findOne({ where: { id } });
    if (team === null) throwCustomError('notFoundError', 'There is no team with such id!');
    if (team) return team;
  }

  static async getTeamsName(homeTeamId: number, awayTeamId: number): Promise<string[] | undefined> {
    const homeTeam = await Teams.findOne({ where: { id: homeTeamId } });
    const awayTeam = await Teams.findOne({ where: { id: awayTeamId } });
    if (homeTeam !== null && awayTeam !== null) return [homeTeam.teamName, awayTeam.teamName];
  }

  static teamsAreTheSame(home: string | number, away: string | number): void {
    const message = 'It is not possible to create a match with two equal teams';
    if (home === away) throwCustomError('unauthorizedError', message);
  }

  static async create(payload: IMatches): Promise<IMatches> {
    this.teamsAreTheSame(payload.homeTeam, payload.awayTeam);
    const home = await this.teamExist(payload.homeTeam);
    const away = await this.teamExist(payload.awayTeam);

    const createdMatch = await Matches.create({
      homeTeam: home?.id,
      homeTeamGoals: payload.homeTeamGoals,
      awayTeam: away?.id,
      awayTeamGoals: payload.awayTeamGoals,
      inProgress: true,
    });

    return createdMatch;
  }

/*   static async getById(id: number): Promise<ITeam | undefined> {
    const team = await Teams.findByPk(id);
    if (team === null) throwCustomError('notFoundError', 'Team does not exist');
    if (team !== null) return team;
  } */
}

export default MatchesService;
