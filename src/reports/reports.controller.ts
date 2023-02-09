import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guard/auth.guard';
import { CurrentUser } from '../users/decorator/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { ReportDto } from './dto/report.dto';
import { Serialize } from '../interceptor/serialize.interceptor';
import { ApproveReportDto } from './dto/approve-report.dto';
import { AdminGuard } from '../guard/admin.guard';
import { GetEstimateDto } from './dto/get-estimate-dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: UserEntity) {
    return this.reportService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(
    @Param('id') id: string,
    @Body() { approved }: ApproveReportDto,
  ) {
    return this.reportService.changeApproval(id, approved);
  }
}
