import EventDomain from '../../domains/Event';

interface IEventsRepository {
    getEvents(): Promise<EventDomain[]>;
    getEvent(id: string): Promise<EventDomain>;
    createEvent(event: EventDomain): Promise<EventDomain>;
    updateEvent(event: EventDomain): Promise<EventDomain>;
    deleteEvent(id: string): Promise<void>;
}

export default IEventsRepository;
