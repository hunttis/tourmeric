import React from 'react';
import { shallow } from 'enzyme';
import EventList from '../EventList';
import { mockEvents, mockParticipations, mockProfile, mockCategories, mockSettings, mockUploadedLogos } from '../__mocks__/mockData';

describe('EventList tests', () => {

  it('Compares EventList to snapshot', () => {

    const eventList = shallow(<EventList
      events={mockEvents}
      participations={mockParticipations}
      profile={mockProfile}
      categories={mockCategories}
      settings={mockSettings}
      uploadedCategoryLogos={mockUploadedLogos}
    />);

    expect(eventList).toMatchSnapshot();
  });
});
