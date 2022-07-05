import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';

@Controller('products')
export class ProductController {
  @Get()
  getProduct() {
    return {};
  }

  @Post()
  createProduct() {}

  @Put(':id')
  @Patch(':id')
  updateProduct() {}

  @Delete(':id')
  deleteProduct() {}
}
