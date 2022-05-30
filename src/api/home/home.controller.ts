import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get()
  @Render('pages/home')
  public home() {
    return {};
  }
}
