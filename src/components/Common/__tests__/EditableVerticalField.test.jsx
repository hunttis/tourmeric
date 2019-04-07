import React from 'react';
import { shallow } from 'enzyme';
import EditableVerticalField from '../EditableVerticalField';
import '../../../__mocks__/setupTests';

describe('EditableVerticalField Tests', () => {

  it('Compares EditableVerticalField to snapshot', () => {

    const editableField = shallow(<EditableVerticalField
      labelContent="label"
      placeHolder="placeholder"
      defaultValue="defaultvalue"
      path="path"
      targetName="target"
      inputType="input"
      inputClasses="inputClasses"
      leftIcon="lefticon"
    />);

    expect(editableField.exists()).toBe(true);
    expect(editableField).toMatchSnapshot();
  });

  // TODO: Write a test for the save and normalize functions
  // TODO: If possible, write tests for the mount and unmounting as well

});
