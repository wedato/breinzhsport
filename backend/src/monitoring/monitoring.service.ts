import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { HealthIndicatorResult, HealthIndicator } from '@nestjs/terminus';
import { Counter, Gauge, Histogram } from 'prom-client';
import {
  InjectMetric,
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

@Injectable()
export class MonitoringService extends HealthIndicator {
  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectMetric('http_requests_total')
    private readonly requestsCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly requestDuration: Histogram<string>,
    @InjectMetric('active_users')
    private readonly activeUsersGauge: Gauge<string>,
  ) {
    super();
  }

  // Vérifier la connexion à la base de données
  async checkDatabaseConnection(): Promise<HealthIndicatorResult> {
    try {
      await this.connection.query('SELECT 1');
      return this.getHealthStatus('database', true);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur de connexion à la base de données';
      return this.getHealthStatus('database', false, { message: errorMessage });
    }
  }

  // Méthode pour obtenir le statut de santé
  getHealthStatus(
    key: string,
    isHealthy: boolean,
    data?: Record<string, unknown>,
  ): HealthIndicatorResult {
    return {
      [key]: {
        status: isHealthy ? 'up' : 'down',
        ...(data || {}),
      },
    };
  }

  incrementRequestCount(
    method: string,
    route: string,
    statusCode: number,
  ): void {
    this.requestsCounter.inc({ method, route, statusCode });
  }

  recordRequestDuration(method: string, route: string, duration: number): void {
    this.requestDuration.observe({ method, route }, duration);
  }

  setActiveUsers(count: number): void {
    this.activeUsersGauge.set(count);
  }
}

// Définition des métriques Prometheus
export const prometheusProviders = [
  makeCounterProvider({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'statusCode'],
  }),
  makeHistogramProvider({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  }),
  makeGaugeProvider({
    name: 'active_users',
    help: 'Number of active users',
  }),
];
