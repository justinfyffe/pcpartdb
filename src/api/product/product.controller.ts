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
  getProduct() {
    return {};
  }

  @Post()
  @UseGuards(StaffGuard)
  createProduct() {}

  @Put(':id')
  @Patch(':id')
  @UseGuards(StaffGuard)
  updateProduct() {}

  @Delete(':id')
  @UseGuards(StaffGuard)
  deleteProduct() {}
}
