import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ReportEntity } from '../reports/report.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ default: true })
  admin: boolean;
  @OneToMany(() => ReportEntity, (report: ReportEntity) => report.user)
  reports: ReportEntity[];
}
