import * as http from 'http';
import {IEventsService} from '../services/EventsService';

class NodeHttpServer {
  constructor(private readonly port: number, private readonly service: IEventsService) {}

  public start(): void {
    http.createServer((req, res) => {
      if (req.url.startsWith('/api/v1/events')) {
        if (req.method === 'GET') {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(this.service.getEvents()));
          return;
        }
        if (req.method === 'POST') {
          res.writeHead(201, {'Content-Type': 'application/json'});
          this.service.createEvent({
            id: '1',
            venueName: 'Event 1',
            eventDate: new Date(),
            ownerContact: {
              firstName: 'Owner 1',
              lastName: 'Owner 1',
              email: 'abc@cde.com',
              phone: '1234567890',
            },
          });
          res.end(JSON.stringify({message: 'event created'}));
          return;
        }
      }
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not found\n');
    }).listen(this.port);
  }
}

export default NodeHttpServer;
