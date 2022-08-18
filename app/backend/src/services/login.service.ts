import 'dotenv';
import Joi = require('joi');
import jwt = require('jsonwebtoken');
import bcrypt = require('bcryptjs');
import throwCustomError from '../utils/throwCustomError';
import Users from '../database/models/user';

export type objectPayload = {
  email: string,
  password: string,
};

class LoginService {
  static validateBody(data: unknown): objectPayload {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(data);

    if (error) throwCustomError('validationError', error.message);

    return value;
  }

  static async validateUserAndPassword(user: objectPayload): Promise<void> {
    const { email, password } = user;
    const returnedUser = await Users.findOne({ where: { email }, raw: true });
    if (returnedUser === null) {
      return throwCustomError('notFoundError', 'Incorrect email or password');
    }

    if (returnedUser !== null) {
      const passValidation = bcrypt.compareSync(password, returnedUser.password);
      if (passValidation === null) {
        return throwCustomError('unauthorizedError', 'password incorrect');
      }
    }
  }

  static async login(user: objectPayload): Promise<string> {
    const authBody = LoginService.validateBody(user);
    await LoginService.validateUserAndPassword(authBody);
    const token = jwt.sign({ data: user }, process.env.JWT_SECRET || 'secret');
    return token;
  }
}

export default LoginService;
