import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { MonitoringService } from './monitoring.service';

@ApiTags('monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly monitoringService: MonitoringService,
  ) {}

  @Get('health')
  @HealthCheck()
  @ApiOperation({ summary: "Vérifier la santé de l'application" })
  checkHealth() {
    return this.healthCheckService.check([
      () => this.monitoringService.checkDatabaseConnection(),
    ]);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Obtenir les métriques Prometheus' })
  getMetrics() {
    // Les métriques sont automatiquement exposées par le module Prometheus
    return { message: 'Les métriques sont disponibles à /metrics' };
  }
}
