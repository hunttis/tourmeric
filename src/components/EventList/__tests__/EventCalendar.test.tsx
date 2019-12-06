/* eslint-disable import/first */

import rrf from 'react-redux-firebase';
import React from 'react';
import { shallow } from 'enzyme';
import { createBrowserHistory } from 'history';
import EventCalendar from '../EventCalendar/EventCalendar';
import { mockEvents, mockCategories, mockSettings, mockLocation, mockProfile } from '../__mocks__/mockData';
import '~/__mocks__/config';

jest.mock('~/components/Common/DocumentUtils');
jest.mock('~/components/EventList/EventCalendar/CalendarMonth', () => ({ CalendarMonth: () => 'CalendarMonth' }));
jest.mock('~/config', () => ({ get: () => ({ titleText: 'Titletext' }) }));

describe('EventList tests', () => {

  beforeEach(() => {
    rrf.isLoaded = () => true;
    rrf.isEmpty = () => true;
  });

  it('Renders EventCalendar, there are no events', () => {

    const history = createBrowserHistory();

    const eventList = shallow(<EventCalendar
      settings={mockSettings}
      events={mockEvents}
      eventsongoing={mockEvents}
      categories={mockCategories}
      activeLanguage={jest.fn as any}
      location={mockLocation}
      history={history}
      openinghoursexceptions={{}}
      setReturnLocation={() => {}}
      profile={mockProfile}
    />);

    expect(eventList).toMatchSnapshot();
  });

  it('Renders EventCalendar, month mode', () => {
    rrf.isLoaded = () => true;
    rrf.isEmpty = () => false;

    const history = createBrowserHistory();

    const eventList = shallow(<EventCalendar
      settings={mockSettings}
      events={mockEvents}
      eventsongoing={mockEvents}
      categories={mockCategories}
      activeLanguage={jest.fn as any}
      location={mockLocation}
      history={history}
      openinghoursexceptions={{}}
      setReturnLocation={() => {}}
      profile={mockProfile}
    />);

    eventList.setState({ viewMode: 'month' });

    expect(eventList).toMatchSnapshot();
  });

  it('Renders EventCalendar, day mode', () => {
    rrf.isLoaded = () => true;
    rrf.isEmpty = () => false;

    const history = createBrowserHistory();

    const eventList = shallow(<EventCalendar
      settings={mockSettings}
      events={mockEvents}
      eventsongoing={mockEvents}
      categories={mockCategories}
      activeLanguage={jest.fn as any}
      location={mockLocation}
      history={history}
      openinghoursexceptions={{}}
      setReturnLocation={() => {}}
      profile={mockProfile}
    />);

    eventList.setState({ viewMode: 'day' });

    expect(eventList).toMatchSnapshot();
  });

});
