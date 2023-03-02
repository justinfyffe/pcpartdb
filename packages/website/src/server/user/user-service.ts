import { userRepository } from '@pcpartdb/database';
import {
  badRequestError,
  internalServerError,
  notFoundError,
} from '@pcpartdb/website/server/shared/api/status';
import { Context } from '@pcpartdb/website/server/shared/context';
import { generateToken } from '@pcpartdb/website/server/shared/crypto/crypto-utils';
import { sendEmail } from '@pcpartdb/website/server/shared/email/email-utils';
import {
  decodeJwt,
  generateJwt,
  JwtType,
  verifyJwt,
} from '@pcpartdb/website/server/shared/jwt/jwt-utils';
import {
  CreateUserRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
} from '@pcpartdb/website/shared/user';
import { WEBSITE_NAME } from '@pcpartdb/website/shared/website';
import * as bcrypt from 'bcryptjs';
import { mapToUserDto, mapToUserEntity } from './user-mappers';

class UserService {
  async count(ctx: Context) {
    return await userRepository.count(ctx);
  }

  async list(ctx: Context) {
    const rows = await userRepository.list(ctx);
    return rows.map((row) => mapToUserDto(row));
  }

  async get(id: number, ctx: Context) {
    const row = await userRepository.findById(id, ctx);
    if (row == null) {
      throw notFoundError({ user: id });
    }

    return mapToUserDto(row);
  }

  async create(data: CreateUserRequest, ctx: Context) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser != null) {
      throw badRequestError({
        property: 'email',
        constraint: 'emailExists',
      });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    let isStaff = data.isStaff ?? false;
    if ((await userRepository.count()) === 0) {
      // First user, let's make them an admin
      isStaff = true;
    }

    const entity = mapToUserEntity({
      email: data.email,
      passwordHash,
      isStaff,
    });
    const result = await userRepository.create(entity, ctx);

    return mapToUserDto(result);
  }

  async update(id: number, data: UpdateUserRequest, ctx: Context) {
    const user = await userRepository.findById(id, ctx);
    if (user == null) {
      throw notFoundError({ user: id });
    }

    if (
      user.isStaff &&
      !data.isStaff &&
      (await userRepository.countStaff(ctx)) <= 1
    ) {
      throw badRequestError({
        property: 'isStaff',
        constraint: 'LAST_STAFF_USER',
      });
    }

    let passwordHash = user.passwordHash;
    if (data.password != null && data.password.length > 0) {
      const salt = await bcrypt.genSalt();
      passwordHash = await bcrypt.hash(data.password, salt);
    }

    const entity = mapToUserEntity({
      email: data.email,
      passwordHash,
      isStaff: data.isStaff,
    });
    const result = await userRepository.update(id, entity, ctx);

    return mapToUserDto(result);
  }

  async delete(id: number, ctx: Context) {
    const user = await userRepository.findById(id, ctx);
    if (user == null) {
      throw notFoundError({ user: id });
    }

    if ((await userRepository.countStaff(ctx)) <= 1) {
      throw badRequestError({
        property: 'isStaff',
        constraint: 'LAST_STAFF_USER',
      });
    }

    await userRepository.delete(id, ctx);
    return id;
  }

  async requestPasswordReset(data: RequestPasswordResetRequest, ctx: Context) {
    const user = await userRepository.findByEmail(data.email, ctx);
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
      from: `${WEBSITE_NAME} <${websiteEmail}>`,
      to: data.email,
      subject: `${WEBSITE_NAME} Password Reset Request`,
      text: `There has been a request to reset your password at ${WEBSITE_NAME}. You can reset your password at the following location:\n\n${process.env.WEBSITE_URL}/reset-password?token=${jwt}.\n\nIf you did not make this request, then ignore this email.`,
    });
  }

  async resetPassword(data: ResetPasswordRequest, ctx: Context) {
    if (!verifyJwt(JwtType.ResetPassword, data.token)) {
      throw badRequestError({ property: 'token', constraint: 'invalidToken' });
    }

    const { id } = decodeJwt<{ id: number }>(data.token);
    const user = await userRepository.findById(id, ctx);
    if (user == null) {
      throw notFoundError({ user: id });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    await userRepository.update(id, { passwordHash }, ctx);
  }
}

export const userService = new UserService();
