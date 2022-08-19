import 'dotenv';
import Joi = require('joi');
import jwt = require('jsonwebtoken');
import bcrypt = require('bcryptjs');
import throwCustomError from '../utils/throwCustomError';
import Users from '../database/models/user';

export interface IObjectPayload {
  email: string,
  password: string,
}

export interface IJWTVerify {
  data: IObjectPayload,
  iat: number,
}

class LoginService {
  static validateBody(data: unknown): IObjectPayload {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(data);

    if (error) throwCustomError('validationError', 'All fields must be filled');

    return value;
  }

  static async validateUserAndPassword(user: IObjectPayload): Promise<void> {
    const { email, password } = user;
    const returnedUser = await Users.findOne({ where: { email }, raw: true });
    if (returnedUser === null) {
      return throwCustomError('unauthorizedError', 'Incorrect email or password');
    }

    if (returnedUser !== null) {
      const passValidation = bcrypt.compareSync(password, returnedUser.password);
      if (passValidation === null) {
        return throwCustomError('unauthorizedError', 'Incorrect email or password');
      }
    }
  }

  static async login(user: IObjectPayload): Promise<string> {
    const authBody = LoginService.validateBody(user);
    await LoginService.validateUserAndPassword(authBody);
    const token = jwt.sign({ data: user }, process.env.JWT_SECRET || 'secret');
    return token;
  }

  static async getRole(user: IJWTVerify): Promise<string> {
    const { email } = user.data;
    const returnedUser = await Users
      .findOne({ where: { email }, raw: true });
    if (returnedUser !== null) return returnedUser.role.toString();
    return throwCustomError('unauthorizedError', 'Invalid token');
  }
}

export default LoginService;
