/* eslint-disable import/first */

jest.mock('history');
jest.mock('../../Common/DocumentUtils');
jest.mock('../../../init-app');

// import React from 'react';
// import { shallow } from 'enzyme';
// import { createBrowserHistory } from 'history';
// import EventCalendar from '../EventCalendar/EventCalendar';
// import { mockEvents, mockCategories, mockSettings, mockLocation } from '../__mocks__/mockData';


describe('EventList tests', () => {

  it('Compares EventList to snapshot', () => {

    // const history = createBrowserHistory();

    // const eventList = shallow(<EventCalendar
    //   settings={mockSettings}
    //   events={mockEvents}
    //   eventsongoing={mockEvents}
    //   categories={mockCategories}
    //   activeLanguage="fi"
    //   location={mockLocation}
    //   history={history}
    //   openinghoursexceptions={{}}
    //   setReturnLocation={() => {}}
    // />);

    // expect(eventList).toMatchSnapshot();
  });

});
