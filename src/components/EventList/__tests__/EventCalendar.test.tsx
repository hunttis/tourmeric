jest.mock('history')
jest.mock('../../Common/DocumentUtils');

import React from 'react';
import { shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import EventCalendar from '../EventCalendar/EventCalendar';
import { mockEvents, mockCategories, mockSettings } from '../__mocks__/mockData';


describe('EventList tests', () => {

  it('Compares EventList to snapshot', () => {

    const history = createBrowserHistory();

    const eventList = shallow(<EventCalendar
      settings={mockSettings}
      events={mockEvents}
      eventsongoing={mockEvents}
      categories={mockCategories}
      activeLanguage='fi'
      location={{ pathname: '/events/2018/10' }}
      history={history}
      openinghoursexceptions={{}}
      isAdmin={false}
      setReturnLocation={() => {}}
    />);

    expect(eventList).toMatchSnapshot();
  });
});
