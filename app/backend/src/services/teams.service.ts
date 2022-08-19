import 'dotenv';
// import throwCustomError from '../utils/throwCustomError';
import Teams from '../database/models/teams';

export interface ITeam {
  id?: number,
  teamName: string
}

class TeamService {
  static async getAll(): Promise<ITeam[]> {
    const teams = await Teams.findAll();
    return teams;
  }
}

export default TeamService;
