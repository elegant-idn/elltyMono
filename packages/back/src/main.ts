import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as cookieParser from 'cookie-parser';
import * as proxy from 'express-http-proxy';

// const bodyParser = require('body-parser');
const ICONFINDER_API_KEY = process.env.ICONFINDER_API_KEY;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.setGlobalPrefix('api');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Polotno back')
    .setDescription('The polotno API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addTag('auth')
    .addTag('user')
    .addTag('templates')
    .addTag('resources')
    .addTag('folders')
    .build();
  // app.enableCors({
  //     origin: "*"
  // });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['http://localhost:3333', 'https://www.ellty.com'],
    methods: '*',
    credentials: true,
  });
  //app.use(bodyParser.urlencoded({parameterLimit: 31457280, limit: "30mb"}))
  app.use(cookieParser());
  // proxy to iconfinder to prevent CORS and protect API key
  app.use(
    '/api/iconfinder',
    proxy('api.iconfinder.com', {
      https: true,
      proxyReqOptDecorator: function (proxyReqOpts) {
        proxyReqOpts.headers.authorization = 'Bearer ' + ICONFINDER_API_KEY;
        return proxyReqOpts;
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

mongoose.set('debug', true);
bootstrap();
