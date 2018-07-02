import React from 'react';
import { shallow } from 'enzyme';
import { UserEntry } from '../UserEntry';

describe('UserEntry Tests', () => {

  it('Compares UserEntry to snapshot', () => {

    const mockUserData = {}; // Todo mock user data
    const mockOpenModal = () => {};
    const mockDeleteModal = () => {};

    const userEntry = shallow(<UserEntry
      userData={mockUserData}
      openEditModal={mockOpenModal}
      openDeleteModal={mockDeleteModal}
    />);

    expect(userEntry.exists()).toBe(true);
    expect(userEntry).toMatchSnapshot();

  });

  // TODO: Write tests for clicking the modals

});
