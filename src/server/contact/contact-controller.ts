import { Body, Controller, Post, Res } from '@nestjs/common';
import { transaction } from '@server/db/database';
import type { ContactRequest } from '@shared/contact';
import type { Response } from 'express';
import { ContactService } from './contact-service';

@Controller('contact')
export class ContactController {
  constructor(private service: ContactService) {}

  @Post()
  async send(@Body() body: ContactRequest, @Res() response: Response) {
    await transaction((trx) => this.service.send(body, { trx }));
    response.status(204).send({});
  }
}
