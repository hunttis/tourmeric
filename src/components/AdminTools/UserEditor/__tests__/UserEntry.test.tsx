import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { UserEntry } from '../UserEntry';

describe('UserEntry Tests', () => {

  it('Compares UserEntry to snapshot', () => {

    const mockUserData = {}; // Todo mock user data
    const mockOpenModal = () => {};

    const userEntry = shallow(<UserEntry
      userData={mockUserData}
      openEditModal={mockOpenModal}
      openDisableModal={() => {}}
      openCreditModal={() => {}}
      userId="testid-123"
    />);

    expect(userEntry.exists()).toBe(true);
    expect(toJson(userEntry)).toMatchSnapshot();

  });

  // TODO: Write tests for clicking the modals

});
