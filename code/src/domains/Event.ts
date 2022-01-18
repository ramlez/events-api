import OwnerDomain from './Owner';

class EventDomain {
  id?: string;
  venueName: string;
  eventDate: Date;
  ownerContact: OwnerDomain;
}

export default EventDomain;
