import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheckDto } from '@shared/common';
import { MicroserviceClientService } from './microservice-client.service';
import { Public } from './public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly microserviceClient: MicroserviceClientService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'API Gateway health check' })
  @ApiResponse({ status: 200, description: 'Health check successful' })
  getHealth() {
    return new HealthCheckDto('api-gateway');
  }

  @Public()
  @Get('services')
  @ApiOperation({ summary: 'All services health check' })
  @ApiResponse({ status: 200, description: 'Services health check' })
  async getServicesHealth() {
    try {
      const [authHealth, userHealth, postHealth] = await Promise.all([
        this.microserviceClient.authClient.send({ cmd: 'auth.health' }, {}).toPromise(),
        this.microserviceClient.userClient.send({ cmd: 'user.health' }, {}).toPromise(),
        this.microserviceClient.postClient.send({ cmd: 'post.health' }, {}).toPromise(),
      ]);

      return {
        success: true,
        timestamp: new Date().toISOString(),
        services: {
          'api-gateway': new HealthCheckDto('api-gateway'),
          'auth-service': authHealth,
          'user-service': userHealth,
          'post-service': postHealth,
        },
      };
    } catch (error) {
      return {
        success: false,
        timestamp: new Date().toISOString(),
        error: 'One or more services are unavailable',
        services: {
          'api-gateway': new HealthCheckDto('api-gateway'),
        },
      };
    }
  }
}