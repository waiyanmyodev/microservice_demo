import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import postConfig from './config/post.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postConfig],
      envFilePath: ['.env', '.env.local'],
    }),
    PostModule,
  ],
})
export class AppModule {}