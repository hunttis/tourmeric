import React from 'react';
import { shallow } from 'enzyme';
import { EventModal } from '../EventModal';
import { mockEventId, mockParticipations, mockUnorderedEvents, mockCategories, mockSettings } from '../__mocks__/mockData';
import '../../../__mocks__/setupTests';

describe('EventModal tests', () => {

  it('Compares EventModal to snapshot', () => {

    const closeModalFunction = () => {};

    const modal = shallow(<EventModal
      eventId={mockEventId}
      events={mockUnorderedEvents}
      settings={mockSettings}
      closeModal={closeModalFunction}
      participations={mockParticipations}
      categories={mockCategories}
    />);

    expect(modal).toMatchSnapshot();
  });
});
