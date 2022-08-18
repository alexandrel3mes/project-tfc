import 'dotenv';
import Joi = require('joi');
import jwt = require('jsonwebtoken');
import bcrypt = require('bcryptjs');
import throwCustomError = require('../utils/throwCustomError');
import Users from '../database/models/user';

export type objectPayload = {
  email: string,
  password: string,
};

class LoginService {
  static validateBody(data: unknown): void {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(data);

    if (error) throw error;

    return value;
  }

  static async validateUserAndPassword(user: objectPayload): Promise<void> {
    const returnedUser = await Users.findOne({ where: { email: user.email } });
    console.log(returnedUser);
    if (!returnedUser) {
      throwCustomError('notFoundError', 'user not found');
    }

    const passValidation = bcrypt.compareSync(user.password, returnedUser.password);
    if (!passValidation) {
      throwCustomError('unauthorizedError', 'password incorrect');
    }
  }

  static login(user: objectPayload): string {
    LoginService.validateBody(user);
    LoginService.validateUserAndPassword(user);
    const token = jwt.sign({ data: user }, process.env.JWT_SECRET || 'secret');
    return token;
  }
}

export default LoginService;
