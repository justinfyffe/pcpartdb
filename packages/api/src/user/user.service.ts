import { Injectable } from '@nestjs/common';
import {
  CreateUserRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
} from '@pcpartdb/shared/user';
import { WEBSITE_NAME } from '@pcpartdb/shared/website';
import * as bcrypt from 'bcryptjs';
import { Context } from '../shared/context';
import { generateToken } from '../shared/crypto';
import { sendEmail } from '../shared/email';
import {
  badRequestError,
  internalServerError,
  notFoundError,
} from '../shared/error';
import { decodeJwt, generateJwt, JwtType, verifyJwt } from '../shared/jwt';
import { mapToUserDto, mapToUserEntity } from './user.mapper';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async count(ctx: Context) {
    return await this.userRepository.count(ctx);
  }

  async list(ctx: Context) {
    const rows = await this.userRepository.list(ctx);
    return rows.map((row) => mapToUserDto(row));
  }

  async get(id: number, ctx: Context) {
    const row = await this.userRepository.findById(id, ctx);
    if (row == null) {
      throw notFoundError({ user: id });
    }

    return mapToUserDto(row);
  }

  async create(data: CreateUserRequest, ctx: Context) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser != null) {
      throw badRequestError({
        property: 'email',
        constraint: 'emailExists',
      });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    let isStaff = data.isStaff ?? false;
    if ((await this.userRepository.count()) === 0) {
      // First user, let's make them an admin
      isStaff = true;
    }

    const entity = mapToUserEntity({
      email: data.email,
      passwordHash,
      isStaff,
    });
    const result = await this.userRepository.create(entity, ctx);

    return mapToUserDto(result);
  }

  async update(id: number, data: UpdateUserRequest, ctx: Context) {
    const user = await this.userRepository.findById(id, ctx);
    if (user == null) {
      throw notFoundError({ user: id });
    }

    if (
      user.isStaff &&
      !data.isStaff &&
      (await this.userRepository.countStaff(ctx)) <= 1
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
    const result = await this.userRepository.update(id, entity, ctx);

    return mapToUserDto(result);
  }

  async delete(id: number, ctx: Context) {
    const user = await this.userRepository.findById(id, ctx);
    if (user == null) {
      throw notFoundError({ user: id });
    }

    if ((await this.userRepository.countStaff(ctx)) <= 1) {
      throw badRequestError({
        property: 'isStaff',
        constraint: 'LAST_STAFF_USER',
      });
    }

    await this.userRepository.delete(id, ctx);
    return id;
  }

  async requestPasswordReset(data: RequestPasswordResetRequest, ctx: Context) {
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
    const user = await this.userRepository.findById(id, ctx);
    if (user == null) {
      throw notFoundError({ user: id });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    await this.userRepository.update(id, { passwordHash }, ctx);
  }
}
