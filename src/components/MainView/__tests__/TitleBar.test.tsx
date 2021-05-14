/* eslint-disable import/first */

import React from 'react';
import { shallow } from 'enzyme';
import rrf from 'react-redux-firebase';
import TitleBar from '../TitleBar';
import { emptyMockSettings as settings } from '../../../components/EventList/__mocks__/mockData';
import { Settings } from '../../../models/Settings';

jest.mock('react-redux-firebase');
jest.mock('~/components/HighLights/HighLights-container', () => { const HighLights = () => <div />; return HighLights; });
jest.mock('~/components/StoreInfo/OpeningHours-container', () => { const OpeningHours = () => <div />; return OpeningHours; });

describe('TitleBar tests', () => {
  beforeEach(() => {
    rrf.isLoaded = jest.fn(() => true);
  });

  it('Renders titlebar before anything is loaded', () => {
    rrf.isLoaded = jest.fn(() => false);

    const testSettings: Settings = {
      // features: {
      //   highlights: {
      //     active: false,
      //     introtext: false,
      //   },
      //   events: {
      //     active: false,
      //     introtext: false,
      //   },
      //   storeinfo: {
      //     active: false,
      //     introtext: false,
      //   },
      // },
      ...settings,
    };

    const result = shallow(
      <TitleBar
        settings={testSettings}
        dispatch={jest.fn}
        returnToFrontpage={jest.fn}
      />,
    );

    expect(result.find('.is-loading').length).toBe(1);
    expect(result.find('#loading').length).toBe(1);
    expect(result).toMatchSnapshot();
  });

  it('something something', () => {
    const testSettings = {
      ...settings,
    };
    const result = shallow(<TitleBar
      settings={testSettings}
      dispatch={jest.fn}
      returnToFrontpage={jest.fn}
    />);

    expect(result).toMatchSnapshot();
  });
});
