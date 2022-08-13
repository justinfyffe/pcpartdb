import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StaffGuard } from '../auth/staff.guard';

@Controller('products')
export class ProductController {
  @Get()
  list() {
    return {};
  }

  @Get(':id')
  get() {
    return {};
  }

  @Post()
  @UseGuards(StaffGuard)
  create() {}

  @Put(':id')
  @Patch(':id')
  @UseGuards(StaffGuard)
  update() {}

  @Delete(':id')
  @UseGuards(StaffGuard)
  delete() {}

  @Get('autocomplete')
  @UseGuards(StaffGuard)
  autocomplete() {
    return {};
  }
}
