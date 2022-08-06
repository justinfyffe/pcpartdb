import Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UserRequest,
} from '../../types/user';
import { generateToken } from '../shared/crypto/crypto.utils';
import { sendEmail } from '../shared/email/email.utils';
import {
  badRequestError,
  internalServerError,
  notFoundError,
} from '../shared/errors/errors';
import {
  decodeJwt,
  generateJwt,
  JwtType,
  verifyJwt,
} from '../shared/jwt/jwt.utils';
import { ServiceContext } from '../shared/service/context';
import { validate } from '../shared/types/validate';
import { UserRepository } from './user.repository';

const createUserValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required(),
  isStaff: Joi.boolean(),
}).options({ abortEarly: false });

const updateUserValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .allow(null, '')
    .optional(),
  isStaff: Joi.boolean(),
}).options({ abortEarly: false });

const requestPasswordResetValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
}).options({ abortEarly: false });

const resetPasswordValidator = Joi.object({
  token: Joi.string().required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required(),
}).options({ abortEarly: false });

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async list(ctx: ServiceContext) {
    return await this.userRepository.list(ctx);
  }

  async get(id: number, ctx: ServiceContext) {
    const user = await this.userRepository.findById(id, ctx);
    if (user == null) {
      throw notFoundError({ user: id });
    }

    return user;
  }

  async create(data: UserRequest, ctx: ServiceContext) {
    validate(data, createUserValidator);

    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser != null) {
      throw badRequestError({
        property: 'email',
        constraint: 'emailExists',
      });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    let isStaff = false;
    if ((await this.userRepository.count()) === 0) {
      // First user, let's make them an admin
      isStaff = true;
    }

    return await this.userRepository.save(
      {
        email: data.email,
        passwordHash,
        isStaff,
      },
      ctx,
    );
  }

  // TODO: don't allow removing last staff user
  async update(id: number, data: UserRequest, ctx: ServiceContext) {
    validate(data, updateUserValidator);

    const user = await this.userRepository.findById(id, ctx);
    if (user == null) {
      throw notFoundError({ user: id });
    }

    let passwordHash = user.passwordHash;
    if (data.password != null && data.password.length > 0) {
      const salt = await bcrypt.genSalt();
      passwordHash = await bcrypt.hash(data.password, salt);
    }

    return await this.userRepository.save(
      { email: data.email, passwordHash, isStaff: data.isStaff ?? false },
      ctx,
    );
  }

  // TODO: don't allow deleting last staff user
  async delete(id: number, ctx: ServiceContext) {
    const user = await this.userRepository.findById(id, ctx);
    if (user == null) {
      throw notFoundError({ user: id });
    }

    await this.userRepository.delete(id, ctx);
    return id;
  }

  async requestPasswordReset(
    data: RequestPasswordResetRequest,
    ctx: ServiceContext,
  ) {
    validate(data, requestPasswordResetValidator);

    const user = await this.userRepository.findByEmail(data.email, ctx);
    if (user == null) {
      // Don't error out so users cannot detect which accounts exist on the website.
      return;
    }

    const jwt = generateJwt(
      JwtType.ResetPassword,
      {
        id: user.id,
        nonce: generateToken(16),
      },
      { expiresIn: '1h' },
    );

    const websiteEmail = process.env.WEBSITE_EMAIL;
    if (!websiteEmail) {
      throw internalServerError();
    }

    await sendEmail({
      from: `Finest PC <${websiteEmail}>`,
      to: data.email,
      subject: 'Finest PC Password Reset Request',
      text: `There has been a request to reset your password at Finest PC. You can reset your password at the following location:\n\n${process.env.WEBSITE_URL}/reset-password?token=${jwt}.\n\nIf you did not make this request, then ignore this email.`,
    });
  }

  async resetPassword(data: ResetPasswordRequest, ctx: ServiceContext) {
    validate(data, resetPasswordValidator);

    if (!verifyJwt(JwtType.ResetPassword, data.token)) {
      throw badRequestError({ property: 'token', constraint: 'invalidToken' });
    }

    const { id } = decodeJwt<{ id: number }>(data.token);
    const user = await this.userRepository.findById(id, ctx);
    if (user == null) {
      throw notFoundError({ user: id });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    await this.userRepository.save({ ...user, passwordHash });
  }
}
