import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Dayflow HRMS Backend Active`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`=================================`);
});
