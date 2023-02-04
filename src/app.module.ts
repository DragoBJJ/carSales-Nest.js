import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import {UserEntity} from "./users/user.entity";
import {ReportEntity} from "./reports/report.entity";

@Module({
  imports: [TypeOrmModule.forRoot({
  type: 'sqlite',
    database: "db.sqlite",
    entities: [UserEntity,ReportEntity],
    synchronize: true
  }), ReportsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
