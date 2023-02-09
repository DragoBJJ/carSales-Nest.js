import { Expose, Transform } from 'class-transformer';
import { UserEntity } from '../../users/user.entity';
import { CreateReportDto } from './create-report.dto';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  approved: boolean;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userID: number;
}
