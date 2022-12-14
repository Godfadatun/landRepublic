/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
import { createConnection } from 'typeorm';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import logger from './utils/logger';
import router from './routes';
import swagger from './routes/swagger';
import { PORT, BASE_URL } from './utils/secrets';
import { Log, log } from './utils/logs';


dotenv.config();
const port = PORT || '3000';

async function startServer(): Promise<void> {
  const app: Application = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(cors());
  app.use(helmet());

  app.use('/api', router);
  app.use('/swagger', swagger);

  app.use((req, res, _next): void => {
    res.status(404).send({
      status: false,
      error: 'resource not found',
    });
  });

  // handle unexpected errors
  app.use((err: any, req: Request, res: Response, _next: NextFunction): void => {
    res.status(err.status || 500).send({
      success: false,
      error: 'Internal server error.',
    });
  });

  await createConnection()
    .then(() => logger.info('Database connected'))
    .catch((err) => {
      logger.error('Database connection failed');
      logger.error(JSON.stringify(err));
      console.log({ err });

      process.exit(1);
    });

  app.listen(port, () => {
    logger.info(`App is listening on port ${port} !`);
  });

}

startServer();
