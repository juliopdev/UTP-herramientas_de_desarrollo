// Adaptador serverless: monta la misma app Express de src/server.js dentro de una Netlify Function.
// (src/server.js no se modifica: arranca con app.listen, algo que Netlify no permite.)
import path from 'node:path';
import serverless from 'serverless-http';

let handlerPromise;

async function buildHandler() {
  // El disco de la función es de solo lectura salvo /tmp: la BD SQLite se crea allí y se siembra al arrancar.
  process.env.DB_PATH = process.env.DB_PATH || '/tmp/app.db';
  const root = process.env.LAMBDA_TASK_ROOT || process.cwd();
  process.chdir(root); // seedDatabaseIfEmpty() resuelve data/initialData.json relativo al cwd

  // Import dinámico: config.js lee DB_PATH al cargarse, por eso va después de fijar la variable.
  const { default: express } = await import('express');
  const { default: cors } = await import('cors');
  const { apiRouter } = await import('../../src/routes.js');
  const { seedDatabaseIfEmpty } = await import('../../src/db/index.js');

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set('view engine', 'ejs');
  app.set('views', path.join(root, 'views'));

  // Algunas rutas llegan con el prefijo de la función: se retira para que Express vea la ruta original.
  app.use((req, _res, next) => {
    req.url = req.url.replace(/^\/\.netlify\/functions\/api/, '') || '/';
    next();
  });

  seedDatabaseIfEmpty();
  app.use('/', apiRouter);
  app.use((req, res) => res.status(404).json({ success: false, error: 'Ruta no encontrada' }));
  return serverless(app);
}

export const handler = async (event, context) => {
  handlerPromise ??= buildHandler();
  return (await handlerPromise)(event, context);
};
