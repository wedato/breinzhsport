import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../monitoring/monitoring.service';

interface RouteInfo {
  path?: string;
}

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly monitoringService: MonitoringService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = process.hrtime();

    // Capture la méthode et le chemin de la requête
    const method = req.method;
    const routeInfo = req.route as RouteInfo | undefined;
    const route = routeInfo?.path || req.path;

    // Intercepte la fin de la requête pour enregistrer les métriques
    res.on('finish', () => {
      // Calcule la durée de la requête
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const duration = seconds + nanoseconds / 1e9;

      // Enregistre les métriques
      this.monitoringService.incrementRequestCount(
        method,
        route,
        res.statusCode,
      );
      this.monitoringService.recordRequestDuration(method, route, duration);
    });

    next();
  }
}
