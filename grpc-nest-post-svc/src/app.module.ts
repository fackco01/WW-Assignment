import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-local';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
