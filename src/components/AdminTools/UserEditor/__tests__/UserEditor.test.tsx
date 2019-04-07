import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import UserEditor from '../UserEditor';

describe('UserEditor Tests', () => {

  it('Compares UserEditor to snapshot', () => {

    const mockUsers: any = [];

    const userEditor = shallow(<UserEditor
      users={mockUsers}
      storecredit={{}}
    />);

    expect(userEditor.exists()).toBe(true);
    expect(toJson(userEditor)).toMatchSnapshot();

  });

  // TODO: Write separate tests for no users, one user, several users
  // TODO: Write tests for hitting the esc key.
  // TODO: Write tests for opening and closing the modals.
});
