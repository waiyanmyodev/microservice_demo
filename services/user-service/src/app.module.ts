import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import userConfig from './config/user.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [userConfig],
      envFilePath: ['.env', '.env.local'],
    }),
    UserModule,
  ],
})
export class AppModule {}