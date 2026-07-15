import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingDto } from './dto/search-listing.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequireProfile } from 'src/auth/decorators/require-profile.decorator';

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  @Post()
  create(@Body() createListingDto: CreateListingDto, @Req() req) {
    return this.listingService.create(createListingDto, req.user.accountId);
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
