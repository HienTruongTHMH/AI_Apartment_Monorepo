import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, Req } from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingDto } from './dto/search-listing.dto';

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) { }

  @Post()
  create(@Body() createListingDto: CreateListingDto) {
    return this.listingService.create(createListingDto);
  }

  @Post('/upload/get-presigned-url')
  async getPresignedUrl(@Body() body: {fileName: string}) {
    return this.listingService.getPresignedUrl(body);
  }

  @Get()
  findAll() {
    return this.listingService.findAll();
  }

  @Get('search')
  search(@Query() searchDto: SearchListingDto) {
    return this.listingService.search(searchDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingService.update(id, updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingService.remove(id);
  }
}
