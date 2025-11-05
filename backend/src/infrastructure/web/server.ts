// src/infrastructure/web/server.ts
import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import setupRoutes from './router';

export const setupApp = (): express.Application => {
  const app = express();

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'] 
  }));
  app.use(morgan('dev'));
  app.use(express.json()); // Body parser for JSON requests
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  app.use('/api', setupRoutes()); 

  return app;
};