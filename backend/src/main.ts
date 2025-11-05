import { setupApp } from './infrastructure/web/server';
import { config } from './infrastructure/config';
import axios from 'axios';

const startServer = async () => {
  const app = setupApp();
  const port = config.port;
  const end_point = config.endpoint;
  console.log("Starting server... : ",port);
  

  app.listen(port, () => {
    console.log(`Server is running on ${end_point}`);
    console.log(`Access health check at ${end_point}/health`);
    console.log(`Access API at ${end_point}/api`);

    setInterval(async () => {
      try {
        const response = await axios.get(`${end_point}/health`);
        console.log("Health check:", response.data);
      } catch (err: any) {
        console.error("Health check failed:", err.message);
      }
    }, 15000);
  });
};



startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});