import React from 'react';
import { shallow } from 'enzyme';
import { ParticipateButton } from '../ParticipateButton';
import { mockEventId, mockParticipations, mockUserId, mockProfile } from '../__mocks__/mockData';
import '../../../__mocks__/setupTests';

const eventApi = require('../../../api/eventApi');

describe('ParticipateButton tests', () => {

  beforeEach(() => {
    eventApi.checkParticipation = jest.fn();
    eventApi.participate = jest.fn();
    eventApi.cancelParticipation = jest.fn();
  });

  it('Compares ParticipateButton to snapshot when the user HAS NOT participated', () => {
    eventApi.checkParticipation = jest.fn().mockReturnValue(true);
    expect(eventApi.checkParticipation).toHaveBeenCalledTimes(0);

    const modal = shallow(<ParticipateButton
      userId={mockUserId}
      eventId={mockEventId}
      profile={mockProfile}
      participations={mockParticipations}
    />);

    expect(modal).toMatchSnapshot();
    expect(eventApi.checkParticipation).toHaveBeenCalledTimes(1);
  });

  it('Compares ParticipateButton to snapshot when the user HAS participated', () => {
    eventApi.checkParticipation = jest.fn().mockReturnValue(false);
    expect(eventApi.checkParticipation).toHaveBeenCalledTimes(0);

    const modal = shallow(<ParticipateButton
      userId={mockUserId}
      eventId={mockEventId}
      profile={mockProfile}
      participations={mockParticipations}
    />);

    expect(modal).toMatchSnapshot();
    expect(eventApi.checkParticipation).toHaveBeenCalledTimes(1);
  });


  it('Tries to click participation button', () => {
    eventApi.checkParticipation = jest.fn().mockReturnValue(false);
    expect(eventApi.checkParticipation).toHaveBeenCalledTimes(0);

    const modal = shallow(<ParticipateButton
      userId={mockUserId}
      eventId={mockEventId}
      profile={mockProfile}
      participations={mockParticipations}
    />);

    expect(modal).toMatchSnapshot();
    expect(eventApi.checkParticipation).toHaveBeenCalledTimes(1);
    modal.find('.participatebutton').simulate('click');
    expect(eventApi.participate).toHaveBeenCalledTimes(1);
  });

  it('Tries to click cancel participation button', () => {
    eventApi.checkParticipation = jest.fn().mockReturnValue(true);
    expect(eventApi.checkParticipation).toHaveBeenCalledTimes(0);

    const modal = shallow(<ParticipateButton
      userId={mockUserId}
      eventId={mockEventId}
      profile={mockProfile}
      participations={mockParticipations}
    />);

    expect(modal).toMatchSnapshot();
    expect(eventApi.checkParticipation).toHaveBeenCalledTimes(1);
    modal.find('.cancelbutton').simulate('click');
    expect(eventApi.cancelParticipation).toHaveBeenCalledTimes(1);
  });


});
