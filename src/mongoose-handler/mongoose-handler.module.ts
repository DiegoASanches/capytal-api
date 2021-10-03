import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentService } from './../environment/environment.service';

const environmentService = new EnvironmentService();
const mongoConnection: string = environmentService.mongo();
@Module({
  imports: [MongooseModule.forRoot(mongoConnection, { useNewUrlParser: true })],
})
export class MongooseHandlerModule {}
