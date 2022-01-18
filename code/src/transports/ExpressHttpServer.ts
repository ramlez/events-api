import express, {NextFunction, Request, Response} from 'express';
import moment = require('moment');
import EventDomain from '../domains/Event';
import OwnerDomain from '../domains/Owner';
import {IEventsService} from '../services/EventsService';
import {
  errorMiddleware,
  headersMiddleware,
  loggingMiddleware,
} from './Middleware';

class ExpressHttpServer {
/**
  Express implementation of http server
  @constructor
  @param {number} port - port to listen
  @param {IEventsService} service - service to handle requests
*/
  constructor(
    private readonly port: number,
    private readonly service: IEventsService,
  ) {}

  public start(): void {
    const app = express();
    app.use(errorMiddleware);
    app.use(express.json());
    app.use(headersMiddleware);
    app.use(loggingMiddleware);

    app.get('/api/v1/events', this.getEvents.bind(this));
    app.post('/api/v1/events', this.createEvent.bind(this));
    app.get('/api/v1/events/:eventId', this.getEvent.bind(this));
    app.delete('/api/v1/events/:eventId', this.deleteEvent.bind(this));
    app.put('/api/v1/events/:eventId', this.updateEvent.bind(this));

    app.listen(this.port);
  }

  private async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await this.service.getEvents();
      const response: GetEventsResponse = events.map((e) => EventResponse.fromDomain(e));
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  }

  private async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const request = new CreateEventRequest(req.body);
      const event = await this.service.createEvent(request.toDomain());
      const response: CreateEventResponse = EventResponse.fromDomain(event);
      res.status(201);
      res.send(response);
    } catch (err) {
      next(err);
    }
  }

  private async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await this.service.getEvent(req.params.eventId);
      const response: GetEventResponse = EventResponse.fromDomain(event);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  }

  private async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.deleteEvent(req.params.eventId);
      res.status(204).send({message: 'event deleted'});
    } catch (err) {
      next(err);
    }
  }

  private async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await this.service.updateEvent(req.body);
      res.status(200).send(event);
    } catch (err) {
      next(err);
    }
  }
}

class OwnerResponse {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string,
  ) {}

  public static fromDomain(owner: OwnerDomain): OwnerResponse {
    return new OwnerResponse(
        owner.email,
        owner.firstName,
        owner.lastName,
        owner.phone,
    );
  }
}

class EventResponse {
  constructor(
    public readonly id: string,
    public readonly venueName: string,
    public readonly eventDate: string,
    public readonly ownerContact: OwnerResponse,
  ) {}

  public static fromDomain(event: EventDomain): EventResponse {
    const date = moment(event.eventDate).format('MMMM Do, YYYY');
    return new EventResponse(
        event.id,
        event.venueName,
        date,
        OwnerResponse.fromDomain(event.ownerContact),
    );
  }
}

type GetEventsResponse = EventResponse[];

class CreateOwnerContactRequest {
  public readonly email: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly phone: string;
  constructor(body: any) {
    this.email = body.email;
    this.firstName = body.firstName;
    this.lastName = body.lastName;
    this.phone = body.phone;
  }

  public toDomain(): OwnerDomain {
    return new OwnerDomain(
        this.email,
        this.firstName,
        this.lastName,
        this.phone,
    );
  }
}

class CreateEventRequest {
  public readonly venueName: string;
  public readonly eventDate: string;
  public readonly ownerContact: CreateOwnerContactRequest;
  constructor(body: any) {
    this.venueName = body.venueName;
    this.eventDate = body.eventDate;
    this.ownerContact = new CreateOwnerContactRequest(body.ownerContact);
  }

  public toDomain(): EventDomain {
    const eventDate = moment(this.eventDate, 'MMMM Do, YYYY').toDate();
    return {
      venueName: this.venueName,
      eventDate: eventDate,
      ownerContact: this.ownerContact.toDomain(),
    };
  }
}

type CreateEventResponse = EventResponse;
type GetEventResponse = EventResponse;

export default ExpressHttpServer;
