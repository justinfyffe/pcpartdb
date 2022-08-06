import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { ContactRequest } from '../../types/contact';
import { transaction } from '../db/database';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private service: ContactService) {}

  @Post()
  async send(@Body() body: ContactRequest, @Res() response: Response) {
    await transaction((trx) => this.service.send(body, { trx }));
    response.status(204).send({});
  }
}
