import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class MicroserviceClientService implements OnModuleInit, OnModuleDestroy {
  public authClient: ClientProxy;
  public userClient: ClientProxy;
  public postClient: ClientProxy;

  constructor(private configService: ConfigService) {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: this.configService.get<string>('gateway.services.auth.host'),
        port: this.configService.get<number>('gateway.services.auth.port'),
      },
    });

    this.userClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: this.configService.get<string>('gateway.services.user.host'),
        port: this.configService.get<number>('gateway.services.user.port'),
      },
    });

    this.postClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: this.configService.get<string>('gateway.services.post.host'),
        port: this.configService.get<number>('gateway.services.post.port'),
      },
    });
  }

  async onModuleInit() {
    await Promise.all([
      this.authClient.connect(),
      this.userClient.connect(),
      this.postClient.connect(),
    ]);
  }

  async onModuleDestroy() {
    await Promise.all([
      this.authClient.close(),
      this.userClient.close(),
      this.postClient.close(),
    ]);
  }
}