import React from 'react';
import { shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import EventCard from '../EventCard/EventCard';
import { mockEventId, mockUserId, mockProfile, mockEvents, mockSettings, mockUploadedLogos, mockParticipations, mockCategories } from '../__mocks__/mockData';
import '../../../__mocks__/setupTests';

describe('EventCard Tests', () => {

  it('Compares EventCard to snapshot', () => {

    const history = createBrowserHistory();

    const mockEventsAsObject = {
      [mockEvents[0].key]: { ...mockEvents[0].value },
      [mockEvents[1].key]: { ...mockEvents[1].value },
    };

    const card = shallow(<EventCard
      eventId={mockEventId}
      userId={mockUserId}
      profile={mockProfile}
      events={mockEvents}
      eventsongoing={mockEvents}
      settings={mockSettings}
      participations={mockParticipations}
      categories={mockCategories}
      openModal={() => {}}
      uploadedCategoryLogos={mockUploadedLogos}
      history={history}
      setReturnLocation={() => {}}
    />);

    expect(card.exists()).toBe(true);

    const eventHeader = card.find('.eventheader');
    expect(eventHeader.text()).toBe('WH40K: Warhammer thing');
    expect(card).toMatchSnapshot();
  });

});
