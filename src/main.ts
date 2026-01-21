import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, BadRequestException, ValidationError } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as helmet from 'helmet';
import * as express from 'express';

function extractErrors(errors: ValidationError[], parentPath = ''): string[] {
  const result: string[] = [];

  for (const error of errors) {
    const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints) {
      result.push(
        `${propertyPath}: ${Object.values(error.constraints).join(', ')}`
      );
    }

    if (error.children && error.children.length > 0) {
      result.push(...extractErrors(error.children, propertyPath));
    }
  }

  return result;
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('Starting application...');

  const app = await NestFactory.create(AppModule);
  logger.log('Application created');

  // Security: Add security headers using Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));
  logger.log('Security headers configured');

  // Security: Set request body size limits to prevent DoS attacks
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));
  logger.log('Request body size limits configured');

  // Security: Enable CORS with proper validation
  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    logger.warn('WARNING: FRONTEND_URL environment variable is not set. Using default localhost.');
  }

  const allowedOrigins = frontendUrl
    ? frontendUrl.split(',').map(url => url.trim())
    : ['http://localhost:3001'];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, Accept',
    credentials: true,
  });
  logger.log(`CORS enabled for origins: ${allowedOrigins.join(', ')}`);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = extractErrors(errors);
        logger.error(`Validation failed: ${messages.join('; ')}`);
        return new BadRequestException(messages);
      },
    }),
  );
  logger.log('Global validation pipe configured');

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  logger.log('Global exception filter configured');

  // Global response transformation
  app.useGlobalInterceptors(new TransformInterceptor());
  logger.log('Global response transformation configured');

  // API prefix - comment this out to remove the prefix
  app.setGlobalPrefix('api');
  // logger.log('Global prefix set to "api"');

  try {
    const swagger = await import('@nestjs/swagger');
    const config = new swagger.DocumentBuilder()
      .setTitle('ZOF MRP API')
      .setDescription('The ZOF MRP API documentation')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();
    const document = swagger.SwaggerModule.createDocument(app, config);
    swagger.SwaggerModule.setup('api/docs/swagger.html', app, document);
    logger.log('Swagger documentation is available at /api/docs/swagger.html');
  } catch (error) {
    logger.warn('Swagger module not available, documentation will not be generated');
  }

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Fabric type endpoints are available at: http://localhost:${port}/fabrictype`);
}
bootstrap();
