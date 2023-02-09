import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UserEntity } from '../users/user.entity';
import { GetEstimateDto } from './dto/get-estimate-dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity) private report: Repository<ReportEntity>,
  ) {}
  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.report
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
  create(reportDto: CreateReportDto, user: UserEntity) {
    const usersRepo = this.report.create({ ...reportDto, user });
    return this.report.save(usersRepo);
  }
  async changeApproval(id: string, approved: boolean) {
    const oldReport = await this.report.findOne({
      where: { id: parseInt(id) },
    });
    if (!oldReport) throw new NotFoundException('Report Not Found');
    const newReport = {
      ...oldReport,
      approved,
    };
    return this.report.save(newReport);
  }
}
