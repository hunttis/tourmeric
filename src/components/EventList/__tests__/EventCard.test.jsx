import React from 'react';
import { shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import EventCard from '../EventCard/EventCard';
import { mockEventId, mockUserId, mockProfile, mockEvents, mockSettings, mockUploadedLogos, mockParticipations, mockCategories } from '../__mocks__/mockData';

describe('EventCard Tests', () => {

  it('Compares EventCard to snapshot', () => {

    const history = createBrowserHistory();

    const card = shallow(<EventCard
      eventId={mockEventId}
      userId={mockUserId}
      profile={mockProfile}
      events={mockEvents}
      settings={mockSettings}
      participations={mockParticipations}
      categories={mockCategories}
      openModal={() => {}}
      uploadedCategoryLogos={mockUploadedLogos}
      history={history}
    />);

    expect(card.exists()).toBe(true);

    const eventHeader = card.find('.eventheader');
    expect(eventHeader.text()).toBe('WH40K:Warhammer thing');
    expect(card).toMatchSnapshot();
  });

});
