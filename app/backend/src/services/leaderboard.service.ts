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
  static calculateGoalsHome(matchArr: IMatches[]): number {
    const goalsFavor = matchArr
      .map((match) => match.homeTeamGoals).reduce((prev, curr) => prev + curr, 0);
    return goalsFavor;
  }

  static calculateGoalsAway(matchArr: IMatches[]): number {
    const goalsFavor = matchArr
      .map((match) => match.awayTeamGoals).reduce((prev, curr) => prev + curr, 0);
    return goalsFavor;
  }

  static calculateHomeVictories(matchArr: IMatches[]): number {
    const totalVictories = matchArr
      .filter((match) => match.homeTeamGoals > match.awayTeamGoals).length;
    return totalVictories;
  }

  static calculateAwayVictories(matchArr: IMatches[]): number {
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
    const victories = this.calculateHomeVictories(matchArr);
    const draws = this.calculateDraws(matchArr);
    return (victories * 3) + draws;
  }

  static calculateTotalPointsWhenAway(matchArr: IMatches[]): number {
    const victories = this.calculateAwayVictories(matchArr);
    const draws = this.calculateDraws(matchArr);
    return (victories * 3) + draws;
  }

  static calculateBalance(matchArr: IMatches[]): number {
    const favor = this.calculateGoalsHome(matchArr);
    const own = this.calculateGoalsAway(matchArr);
    return favor - own;
  }

  static calculateBalanceWhenAway(matchArr: IMatches[]): number {
    const favor = this.calculateGoalsAway(matchArr);
    const own = this.calculateGoalsHome(matchArr);
    return favor - own;
  }

  static calculateEfficiency(matchArr: IMatches[]): string {
    const points = this.calculateTotalPoints(matchArr);
    const eff = ((points / (matchArr.length * 3)) * 100);
    return eff.toFixed(2);
  }

  static calculateEfficiencyWhenAway(matchArr: IMatches[]): string {
    const points = this.calculateTotalPointsWhenAway(matchArr);
    const eff = ((points / (matchArr.length * 3)) * 100);
    return eff.toFixed(2);
  }

  static sortGamesResult(gamesArr: gamesReturn[]): gamesReturn[] {
    return gamesArr
      .sort((a, b) => b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || a.goalsOwn - b.goalsOwn);
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
        totalVictories: LeaderboardService.calculateHomeVictories(allHomeMatches),
        totalDraws: LeaderboardService.calculateDraws(allHomeMatches),
        totalLosses: LeaderboardService.calculateAwayVictories(allHomeMatches),
        goalsFavor: LeaderboardService.calculateGoalsHome(allHomeMatches),
        goalsOwn: LeaderboardService.calculateGoalsAway(allHomeMatches),
        goalsBalance: LeaderboardService.calculateBalance(allHomeMatches),
        efficiency: LeaderboardService.calculateEfficiency(allHomeMatches),
      };
    }));

    return this.sortGamesResult(matchesByTeam);
  }

  static async getAllAwayGames(): Promise<gamesReturn[]> {
    const allTeams = await TeamService.getAll();
    const matchesByTeam = await Promise.all(allTeams.map(async (team) => {
      const allAwayMatches = await Matches
        .findAll({ where: { awayTeam: team.id, inProgress: false } });
      return {
        name: team.teamName,
        totalPoints: LeaderboardService.calculateTotalPointsWhenAway(allAwayMatches),
        totalGames: allAwayMatches.length,
        totalVictories: LeaderboardService.calculateAwayVictories(allAwayMatches),
        totalDraws: LeaderboardService.calculateDraws(allAwayMatches),
        totalLosses: LeaderboardService.calculateHomeVictories(allAwayMatches),
        goalsFavor: LeaderboardService.calculateGoalsAway(allAwayMatches),
        goalsOwn: LeaderboardService.calculateGoalsHome(allAwayMatches),
        goalsBalance: LeaderboardService.calculateBalanceWhenAway(allAwayMatches),
        efficiency: LeaderboardService.calculateEfficiencyWhenAway(allAwayMatches),
      };
    }));

    return this.sortGamesResult(matchesByTeam);
  }

  static async getAllGamesOverAll(): Promise<gamesReturn[]> {
    const homeGames = await this.getAllHomeGames();
    const awayGames = await this.getAllAwayGames();
    const allGames = [...homeGames, ...awayGames];
    /* const remappedGames = allGames.map((game) => {
      const obj = {
        name: game.name,
        totalPoints: LeaderboardService.calculateTotalPointsWhenAway(allAwayMatches),
        totalGames: allAwayMatches.length,
        totalVictories: LeaderboardService.calculateAwayVictories(allAwayMatches),
        totalDraws: LeaderboardService.calculateDraws(allAwayMatches),
        totalLosses: LeaderboardService.calculateHomeVictories(allAwayMatches),
        goalsFavor: LeaderboardService.calculateGoalsAway(allAwayMatches),
        goalsOwn: LeaderboardService.calculateGoalsHome(allAwayMatches),
        goalsBalance: LeaderboardService.calculateBalanceWhenAway(allAwayMatches),
        efficiency: LeaderboardService.calculateEfficiencyWhenAway(allAwayMatches) };
      return obj;
    }); */
    return allGames;
  }

/*   static async getAllGamesOverall(): Promise<gamesReturn[]> {
    const allTeams = await TeamService.getAll();
    const matchesByTeam = await Promise.all(allTeams.map(async (team) => {
      const allAwayMatches = await Matches
        .findAll({ where: { awayTeam: team.id, inProgress: false } });
      return {
        name: team.teamName,
        totalPoints: LeaderboardService.calculateTotalPointsWhenAway(allAwayMatches),
        totalGames: allAwayMatches.length,
        totalVictories: LeaderboardService.calculateAwayVictories(allAwayMatches),
        totalDraws: LeaderboardService.calculateDraws(allAwayMatches),
        totalLosses: LeaderboardService.calculateHomeVictories(allAwayMatches),
        goalsFavor: LeaderboardService.calculateGoalsAway(allAwayMatches),
        goalsOwn: LeaderboardService.calculateGoalsHome(allAwayMatches),
        goalsBalance: LeaderboardService.calculateBalanceWhenAway(allAwayMatches),
        efficiency: LeaderboardService.calculateEfficiencyWhenAway(allAwayMatches),
      };
    }));

    return this.sortGamesResult(matchesByTeam);
  } */
}

export default LeaderboardService;
