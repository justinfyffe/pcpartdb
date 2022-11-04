import { ApiContext } from '@server/shared/api/context';
import { controller } from '@server/shared/api/controller';
import type { ContactRequest } from '@shared/contact';
import { contactService } from './contact-service';

export const sendContact = controller(async (ctx: ApiContext) => {
  const body = ctx.req.body as ContactRequest;
  await contactService.send(body, ctx);
});
