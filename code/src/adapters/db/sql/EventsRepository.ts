/* eslint-disable new-cap */
import {
  BaseEntity,
  Column,
  createConnection,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import EventDomain from '../../../domains/Event';
import OwnerDomain from '../../../domains/Owner';
import IEventsRepository from '../IEventsRepository';

@Entity()
export class Owner extends BaseEntity {
    @PrimaryGeneratedColumn()
      id: number;

    @Column('varchar')
      email: string;

    @Column('varchar')
      firstName: string;

    @Column('varchar')
      lastName: string;

    @Column('varchar')
      phone: string;

    public toDomain(): OwnerDomain {
      return new OwnerDomain(
          this.email,
          this.firstName,
          this.lastName,
          this.phone,
      );
    }
}


@Entity()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn()
      id: number;

    @Column('text')
      venueName: string;

    @Column('datetime')
      eventDate: Date;

    @OneToOne((type) => Owner, {onDelete: 'CASCADE', cascade: true})
    @JoinColumn()
      owner: Owner;

    public toDomain(): EventDomain {
      return {
        id: this.id.toString(),
        venueName: this.venueName,
        eventDate: this.eventDate,
        ownerContact: this.owner.toDomain(),
      };
    }
}

export class EventsRepositorySql implements IEventsRepository {
  constructor(private _eventsRepository: Repository<Event>) {}

  public static async create(): Promise<IEventsRepository> {
    const connection = await createConnection({
      type: 'sqlite',
      database: './db/db.sqlite',
      entities: [
        Event,
        Owner,
      ],
      synchronize: true,
    });
    const eventsRepo = await connection.getRepository(Event);
    return new EventsRepositorySql(eventsRepo);
  }

  public async getEvents(): Promise<EventDomain[]> {
    const events = await this._eventsRepository.find({relations: ['owner']});
    return events.map((e) => e.toDomain());
  }

  public async getEvent(id: string): Promise<EventDomain> {
    const event = await this._eventsRepository.findOne(id, {relations: ['owner']});
    return event.toDomain();
  }

  public async createEvent(event: EventDomain): Promise<EventDomain> {
    const owner = new Owner();
    owner.email = event.ownerContact.email;
    owner.firstName = event.ownerContact.firstName;
    owner.lastName = event.ownerContact.lastName;
    owner.phone = event.ownerContact.phone;
    const newEvent = new Event();
    newEvent.venueName = event.venueName;
    newEvent.eventDate = event.eventDate;
    newEvent.owner = owner;
    await this._eventsRepository.save(newEvent);
    return newEvent.toDomain();
  }

  public async updateEvent(event: EventDomain): Promise<EventDomain> {
    const existingEvent = await this._eventsRepository.findOne(event.id, {relations: ['owner']});
    const owner = existingEvent.owner;
    existingEvent.venueName = event.venueName;
    existingEvent.eventDate = event.eventDate;
    owner.email = event.ownerContact.email;
    owner.firstName = event.ownerContact.firstName;
    owner.lastName = event.ownerContact.lastName;
    owner.phone = event.ownerContact.phone;
    await this._eventsRepository.save(existingEvent);
    return existingEvent.toDomain();
  }

  public async deleteEvent(id: string): Promise<void> {
    await this._eventsRepository.delete(id);
  }
}
