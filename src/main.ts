import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

function extractErrors(errors: any[], parentPath = ''): string[] {
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

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, Accept',
    credentials: true,
  });
  logger.log('CORS enabled');

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
