import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AiAgentsService } from './ai-agents.service';
import { VerifyListingDto } from './dto/verify-listing.dto';
import { SearchBrokerDto } from './dto/search-broker.dto';

@Controller('ai-agents')
export class AiAgentsController {
    constructor(private readonly aiAgentsService: AiAgentsService) {

    }

    @Post('verify')
    @UsePipes(new ValidationPipe({ transform: true })) // Bật validation
    async verifyListing(@Body() dto: VerifyListingDto) {
        return this.aiAgentsService.verifyApartmentListing(dto)
    }

    @Post('search')
    @UsePipes(new ValidationPipe({ transform: true })) // Bật validation
    async searchBroker(@Body() dto: SearchBrokerDto) {
        return this.aiAgentsService.searchBroker(dto);
    }
}
