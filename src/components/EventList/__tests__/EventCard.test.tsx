import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import EventCard from '../EventCard/EventCard';
import { mockUserId, mockEvents, mockSettings, mockParticipations, mockCategories, mockUnorderedEvents } from '../__mocks__/mockData';

describe('EventCard Tests', () => {

  it('Compares EventCard to snapshot', () => {

    const mockEventsAsObject = {
      [mockEvents[0].key]: { ...mockEvents[0].value },
      [mockEvents[1].key]: { ...mockEvents[1].value },
    };

    const card = shallow(<EventCard
      eventId="mockEvent2"
      userId={mockUserId}
      events={mockUnorderedEvents}
      eventsongoing={mockEventsAsObject}
      settings={mockSettings}
      participations={mockParticipations}
      categories={mockCategories}
      history={jest.genMockFromModule('history')}
      setReturnLocation={() => {}}
      isAdmin={false}
    />);

    expect(card.exists()).toBe(true);

    // const eventHeader = card.find('.eventheader');
    const cardInJson = toJson(card);
    expect(cardInJson).toMatchSnapshot();
  });

});
