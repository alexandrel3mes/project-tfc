import 'dotenv';
import Teams from '../database/models/teams';
// import throwCustomError from '../utils/throwCustomError';
import Matches from '../database/models/matches';
import { ITeam } from './teams.service';

export interface IMatches {
  id?: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  teamHome: ITeam,
  teamAway: ITeam,
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

  static async getTeamsName(homeTeamId: number, awayTeamId: number): Promise<string[] | undefined> {
    console.log(homeTeamId);
    const homeTeam = await Teams.findOne({ where: { id: homeTeamId } });
    const awayTeam = await Teams.findOne({ where: { id: awayTeamId } });
    if (homeTeam !== null && awayTeam !== null) return [homeTeam.teamName, awayTeam.teamName];
  }

/*   static async getById(id: number): Promise<ITeam | undefined> {
    const team = await Teams.findByPk(id);
    if (team === null) throwCustomError('notFoundError', 'Team does not exist');
    if (team !== null) return team;
  } */
}

export default MatchesService;
