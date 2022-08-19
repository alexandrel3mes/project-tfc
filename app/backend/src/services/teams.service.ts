import 'dotenv';
import throwCustomError from '../utils/throwCustomError';
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

  static async getById(id: number): Promise<ITeam | undefined> {
    const team = await Teams.findByPk(id);
    if (team === null) throwCustomError('notFoundError', 'Team does not exist');
    if (team !== null) return team;
  }
}

export default TeamService;
