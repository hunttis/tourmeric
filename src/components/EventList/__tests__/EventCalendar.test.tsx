import React from 'react';
import { shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import EventCalendar from '../EventCalendar/EventCalendar';
import { mockEvents, mockParticipations, mockProfile, mockCategories, mockSettings, mockUploadedLogos } from '../__mocks__/mockData';

describe('EventList tests', () => {

  it('Compares EventList to snapshot', () => {

    const history = createBrowserHistory();

    const eventList = shallow(<EventCalendar
      events={mockEvents}
      participations={mockParticipations}
      profile={mockProfile}
      categories={mockCategories}
      settings={mockSettings}
      uploadedCategoryLogos={mockUploadedLogos}
      history={history}
      location={{ pathname: '/events/2018/10' }}
      setReturnLocation={() => {}}
    />);

    expect(eventList).toMatchSnapshot();
  });
});
