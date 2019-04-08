import React from 'react';
import { shallow } from 'enzyme';
import EventCard from '../EventCard/EventCard';
import {  mockUserId, mockProfile, mockEvents, mockSettings, mockUploadedLogos, mockParticipations, mockCategories, mockUnorderedEvents } from '../__mocks__/mockData';
import toJson from 'enzyme-to-json';

describe('EventCard Tests', () => {

  it('Compares EventCard to snapshot', () => {

    const mockEventsAsObject = {
      [mockEvents[0].key]: { ...mockEvents[0].value },
      [mockEvents[1].key]: { ...mockEvents[1].value },
    };

    const card = shallow(<EventCard
      eventId={'mockEvent2'}
      userId={mockUserId}
      profile={mockProfile}
      events={mockUnorderedEvents}
      eventsongoing={mockEventsAsObject}
      settings={mockSettings}
      participations={mockParticipations}
      categories={mockCategories}
      openModal={() => {}}
      uploadedCategoryLogos={mockUploadedLogos}
      history={jest.genMockFromModule('history')}
      setReturnLocation={() => {}}
    />);

    expect(card.exists()).toBe(true);

    // const eventHeader = card.find('.eventheader');
    const cardInJson = toJson(card);
    expect(cardInJson).toMatchSnapshot();
  });

});
