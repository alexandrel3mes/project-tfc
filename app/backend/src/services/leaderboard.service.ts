import 'dotenv';
import TeamService from './teams.service';
// import MatchesService from './matches.service';
// import throwCustomError from '../utils/throwCustomError';
import Matches from '../database/models/matches';
import { IMatches } from './matches.service';

export interface gamesReturn {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: string,
}

class LeaderboardService {
  static calculateGoalsFavor(matchArr: IMatches[]): number {
    const goalsFavor = matchArr
      .map((match) => match.homeTeamGoals).reduce((prev, curr) => prev + curr, 0);
    return goalsFavor;
  }

  static calculateGoalsOwn(matchArr: IMatches[]): number {
    const goalsFavor = matchArr
      .map((match) => match.awayTeamGoals).reduce((prev, curr) => prev + curr, 0);
    return goalsFavor;
  }

  static calculateVictories(matchArr: IMatches[]): number {
    const totalVictories = matchArr
      .filter((match) => match.homeTeamGoals > match.awayTeamGoals).length;
    return totalVictories;
  }

  static calculateLosses(matchArr: IMatches[]): number {
    const totalLosses = matchArr
      .filter((match) => match.homeTeamGoals < match.awayTeamGoals).length;
    return totalLosses;
  }

  static calculateDraws(matchArr: IMatches[]): number {
    const totalDraws = matchArr
      .filter((match) => match.homeTeamGoals === match.awayTeamGoals).length;
    return totalDraws;
  }

  static calculateTotalPoints(matchArr: IMatches[]): number {
    const victories = this.calculateVictories(matchArr);
    const draws = this.calculateDraws(matchArr);
    return (victories * 3) + draws;
  }

  static calculateBalance(matchArr: IMatches[]): number {
    const favor = this.calculateGoalsFavor(matchArr);
    const own = this.calculateGoalsOwn(matchArr);
    return favor - own;
  }

  static calculateEfficiency(matchArr: IMatches[]): string {
    const victories = this.calculateVictories(matchArr);
    const eff = (victories * 100) / matchArr.length;
    return eff.toFixed(2);
  }

  static async getAllHomeGames(): Promise<gamesReturn[]> {
    const allTeams = await TeamService.getAll();
    const matchesByTeam = await Promise.all(allTeams.map(async (team) => {
      const allHomeMatches = await Matches
        .findAll({ where: { homeTeam: team.id, inProgress: false } });
      return {
        name: team.teamName,
        totalPoints: LeaderboardService.calculateTotalPoints(allHomeMatches),
        totalGames: allHomeMatches.length,
        totalVictories: LeaderboardService.calculateVictories(allHomeMatches),
        totalDraws: LeaderboardService.calculateDraws(allHomeMatches),
        totalLosses: LeaderboardService.calculateLosses(allHomeMatches),
        goalsFavor: LeaderboardService.calculateGoalsFavor(allHomeMatches),
        goalsOwn: LeaderboardService.calculateGoalsOwn(allHomeMatches),
        goalsBalance: LeaderboardService.calculateBalance(allHomeMatches),
        efficiency: LeaderboardService.calculateEfficiency(allHomeMatches),
      };
    }));

    return matchesByTeam.sort((a, b) => b.totalPoints - a.totalPoints);
  }
}

export default LeaderboardService;
