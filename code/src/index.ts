// eslint-disable-next-line no-unused-vars
import NodeHttpServer from './transports/NodeHttpServer';
import {EventsService} from './services/EventsService';
import ExpressHttpServer from './transports/ExpressHttpServer';
import {EventsRepositorySql} from './adapters/db/sql/EventsRepository';

const start = async () => {
  const repository = await EventsRepositorySql.create();
  const service = new EventsService(repository);

  // const httpServer = new NodeHttpServer(3000, service);
  const httpServer = new ExpressHttpServer(3000, service);
  httpServer.start();
};

start();
