/* eslint-disable import/first */

import React from 'react';
import { shallow } from 'enzyme';
import rrf from 'react-redux-firebase';
import FooterBar from '../FooterBar';
import { Settings } from '~/models/Settings';
import { emptyMockSettings as settings } from '~/components/EventList/__mocks__/mockData';

jest.mock('react-redux-firebase');

describe('FooterBar tests', () => {
  beforeEach(() => {
    rrf.isLoaded = jest.fn(() => true);
  });

  it('renders when Settings are not loaded', () => {
    rrf.isLoaded = jest.fn(() => false);

    const testSettings = {
      showingSponsors: false,
      ...settings,
    };
    const footerBar = shallow(<FooterBar settings={testSettings} />);

    expect(footerBar.find('.sponsor').length).toBe(0);
    expect(footerBar.find('.column').length).toBe(0);
    expect(footerBar).toMatchInlineSnapshot('<div />');
  });

  it('Snapshot, sponsors not shown', () => {

    const testSettings = {
      showingSponsors: false,
      ...settings,
    };
    const footerBar = shallow(<FooterBar settings={testSettings} />);

    expect(footerBar.find('.sponsor').length).toBe(0);
    expect(footerBar.find('.column').length).toBe(2);
    expect(footerBar).toMatchSnapshot();
  });

  it('Snapshot, sponsors shown, one sponsor', () => {
    const testSettings: Settings = {
      footer: {
        first: { image: 'foo.png', link: 'http://link' },
      },
      showSponsors: true,
      ...settings,
    };
    const footerBar = shallow(<FooterBar settings={testSettings} />);
    expect(footerBar.find('.sponsor').length).toBe(1);
    expect(footerBar.find('.column').length).toBe(5);
  });

  it('Snapshot, sponsors shown, two sponsors', () => {
    const testSettings: Settings = {
      footer: {
        first: { image: 'foo.png', link: 'http://link' },
        second: { image: 'foo2.png', link: 'http://link2' },
      },
      showSponsors: true,
      ...settings,
    };
    const footerBar = shallow(<FooterBar settings={testSettings} />);
    expect(footerBar.find('.sponsor').length).toBe(2);
    expect(footerBar.find('.column').length).toBe(6);
  });

  it('Snapshot, sponsors shown, three sponsors', () => {
    const testSettings: Settings = {
      footer: {
        first: { image: 'foo.png', link: 'http://link' },
        second: { image: 'foo2.png', link: 'http://link2' },
        third: { image: 'foo3.png', link: 'http://link3' },
      },
      showSponsors: true,
      ...settings,
    };
    const footerBar = shallow(<FooterBar settings={testSettings} />);
    expect(footerBar.find('.sponsor').length).toBe(3);
    expect(footerBar.find('.column').length).toBe(7);
  });
});
