const cookieSession = require('cookie-session');
import { INestApplication, ValidationPipe } from '@nestjs/common';

export const setupApp = (app: INestApplication) => {
  app.use(
    cookieSession({
      keys: ['cookie'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
};
