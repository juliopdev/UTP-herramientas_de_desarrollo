import { app } from './app.js';
import { config } from './config.js';

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`🚀 Servidor BaaS Lite corriendo en: http://localhost:${config.port}`);
  console.log(`📊 Entorno: ${config.env}`);
});
