import React from 'react';
import { shallow } from 'enzyme';
import UserEditor from '../UserEditor';
import '../../../../__mocks__/setupTests';

describe('UserEditor Tests', () => {

  it('Compares UserEditor to snapshot', () => {

    const mockUsers = [];

    const userEditor = shallow(<UserEditor
      users={mockUsers}
    />);

    expect(userEditor.exists()).toBe(true);
    expect(userEditor).toMatchSnapshot();

  });

  // TODO: Write separate tests for no users, one user, several users
  // TODO: Write tests for hitting the esc key.
  // TODO: Write tests for opening and closing the modals.
});
