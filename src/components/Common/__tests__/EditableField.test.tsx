import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import EditableField from '../EditableField';

describe('EditableField Tests', () => {

  it('Compares EditableField to snapshot', () => {

    const editableField = shallow(<EditableField
      labelContent="label"
      placeHolder="placeholder"
      defaultValue="defaultvalue"
      path="path"
      targetName="target"
      inputType="input"
      inputClasses="inputClasses"
      leftIcon="lefticon"
    />);

    expect(toJson(editableField)).toMatchSnapshot();
  });

  // TODO: Write a test for the save and normalize functions

});
