import React from 'react';
import { shallow } from 'enzyme';
import EventCard from '../EventCard';
import { mockEventId, mockUserId, mockProfile, mockEvents, mockSettings, mockUploadedLogos, mockParticipations, mockCategories } from '../__mocks__/mockData';

describe('EventCard Tests', () => {

  it('Compares EventCard to snapshot', () => {

    const card = shallow(<EventCard
      eventId={mockEventId}
      userid={mockUserId}
      profile={mockProfile}
      events={mockEvents}
      settings={mockSettings}
      participations={mockParticipations}
      categories={mockCategories}
      openModal={() => {}}
      uploadedCategoryLogos={mockUploadedLogos}
    />);

    expect(card.exists()).toBe(true);

    const eventHeader = card.find('.eventheader');
    expect(eventHeader.text()).toBe('WH40K:Warhammer thing');
    expect(card).toMatchSnapshot();
  });

});
