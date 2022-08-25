import 'dotenv';
import TeamService from './teams.service';
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

  static calculateEfficiencyOverAll(points: number, matches: number): string {
    const eff = ((points / (matches * 3)) * 100);
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

  static remap(homeArr: gamesReturn[], awayArr: gamesReturn[]): gamesReturn[] {
    const remaped = homeArr.map((game) => {
      const filtered = awayArr.filter((match) => match.name === game.name);
      const obj = {
        name: game.name,
        totalPoints: game.totalPoints + filtered[0].totalPoints,
        totalGames: game.totalGames + filtered[0].totalGames,
        totalVictories: game.totalVictories + filtered[0].totalVictories,
        totalDraws: game.totalDraws + filtered[0].totalDraws,
        totalLosses: game.totalLosses + filtered[0].totalLosses,
        goalsFavor: game.goalsFavor + filtered[0].goalsFavor,
        goalsOwn: game.goalsOwn + filtered[0].goalsOwn,
        goalsBalance: game.goalsBalance + filtered[0].goalsBalance,
        efficiency: game.totalGames + filtered[0].efficiency,
      };
      return obj;
    });
    return remaped as gamesReturn[];
  }

  static redoEfficienty(gamesArr: gamesReturn[]): gamesReturn[] {
    const remapped = gamesArr.map((game) => {
      const obj = {
        name: game.name,
        totalPoints: game.totalPoints,
        totalGames: game.totalGames,
        totalVictories: game.totalVictories,
        totalDraws: game.totalDraws,
        totalLosses: game.totalLosses,
        goalsFavor: game.goalsFavor,
        goalsOwn: game.goalsOwn,
        goalsBalance: game.goalsBalance,
        efficiency: this.calculateEfficiencyOverAll(game.totalPoints, game.totalGames),
      };
      return obj;
    });
    return remapped as gamesReturn[];
  }

  static async getAllGamesOverAll(): Promise<gamesReturn[]> {
    const allHomeGames = await this.getAllHomeGames();
    const allAwayGames = await this.getAllAwayGames();
    const remapped = this.remap(allHomeGames, allAwayGames);
    const effRedo = this.redoEfficienty(remapped);
    return this.sortGamesResult(effRedo);
  }
}

export default LeaderboardService;
