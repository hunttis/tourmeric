import React from 'react';
import { shallow } from 'enzyme';
import EventModal from '../EventModal';
import { mockEventId, mockParticipations, mockSingleEvent } from '../__mocks__/mockData';

describe('EventModal tests', () => {

  it('Compares EventModal to snapshot', () => {

    const closeModalFunction = () => {};

    const modal = shallow(<EventModal
      eventId={mockEventId}
      closeModal={closeModalFunction}
    />);

    expect(modal).toMatchSnapshot();
  });
});
