import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Hacer que ConfigService esté disponible globalmente
      envFilePath: '.env',
    }),
    MulterModule.register({
      dest: './uploads',
    }),
      EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
