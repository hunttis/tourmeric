import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { UserEntry } from '../UserEntry';
import { mockUser } from '../../../../components/EventList/__mocks__/mockData';

describe('UserEntry Tests', () => {

  it('Compares UserEntry to snapshot', () => {

    const mockOpenModal = () => { };

    const userEntry = shallow(<UserEntry
      userData={mockUser}
      openEditModal={mockOpenModal}
      openDisableModal={() => { }}
      openCreditModal={() => { }}
      userId="testid-123"
    />);

    expect(userEntry.exists()).toBe(true);
    expect(toJson(userEntry)).toMatchSnapshot();

  });

  // TODO: Write tests for clicking the modals

});
