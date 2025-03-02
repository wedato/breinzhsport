import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/monitoring/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
})
export class MonitoringModule {}
