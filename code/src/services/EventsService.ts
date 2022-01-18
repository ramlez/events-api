import IEventsRepository from '../adapters/db/IEventsRepository';
import EventDomain from '../domains/Event';

export interface IEventsService {
    getEvents(): Promise<EventDomain[]>;
    getEvent(id: string): Promise<EventDomain>;
    createEvent(event: EventDomain): Promise<EventDomain>;
    updateEvent(event: EventDomain): Promise<EventDomain>;
    deleteEvent(id: string): Promise<void>;
}

export class EventsService implements IEventsService {
  constructor(private _repository: IEventsRepository) {}

  public async getEvents(): Promise<EventDomain[]> {
    return await this._repository.getEvents();
  }

  public async getEvent(id: string): Promise<EventDomain> {
    return await this._repository.getEvent(id);
  }

  public async createEvent(event: EventDomain): Promise<EventDomain> {
    return await this._repository.createEvent(event);
  }

  public async updateEvent(event: EventDomain): Promise<EventDomain> {
    return await this._repository.updateEvent(event);
  }

  public async deleteEvent(id: string): Promise<void> {
    return await this._repository.deleteEvent(id);
  }
}
