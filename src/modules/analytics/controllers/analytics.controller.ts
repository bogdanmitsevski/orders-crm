import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from '../domain/analytic.service';
import { AnalyticsDto } from './dtos/analytics.dto';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';

@ApiTags('analytics')
@ApiBasicAuth()
@UseGuards(BasicAuthGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get()
    @ApiOperation({ summary: 'Get basic order analytics' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Aggregated order analytics', type: AnalyticsDto })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Missing or invalid Basic Auth credentials' })
    getAnalytics(): Promise<AnalyticsDto> {
        return this.analyticsService.getAnalytics();
    }
}
