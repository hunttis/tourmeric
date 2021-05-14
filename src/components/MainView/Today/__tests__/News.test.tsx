/* eslint-disable import/first */

import React from 'react';
import { shallow } from 'enzyme';
import rrf from 'react-redux-firebase';
import { News } from '../News';
import { mockSettings } from '../../../../components/EventList/__mocks__/mockData';
import { Settings } from '../../../../models/Settings';
import { SingleNewsItem } from '../../../../models/ReduxState';

jest.mock('react-redux-firebase');

describe('News tests', () => {
  beforeEach(() => {
    rrf.isLoaded = jest.fn(() => true);
  });

  it('should render loading div', () => {

    rrf.isLoaded = jest.fn(() => false);

    const result = shallow(<News
      news={{} as any}
      settings={{} as Settings}
    />);

    expect(result).toMatchSnapshot();
  });

  it('should render empty news list', () => {
    rrf.isLoaded = jest.fn(() => true);

    const result = shallow(<News
      news={[] as any}
      settings={mockSettings}
    />);

    expect(result).toMatchSnapshot();
  });

  it('should render news list with two items', () => {
    rrf.isLoaded = jest.fn(() => true);

    const firstNewsItem: {key: string, value: SingleNewsItem} = {
      key: 'first',
      value: {
        createDate: '1-1-1990',
        date: '31-12-1990',
        linkName: 'Link',
        link: 'http://tosomesite.com',
        image: 'http://someimage/pic.png',
        active: true,
        name: 'First News Item',
        text: 'First News Item Text',
        summary: 'First Short summary',
      },
    };

    const secondNewsItem: {key: string, value: SingleNewsItem} = {
      key: 'second',
      value: {
        createDate: '1-1-2010',
        date: '31-12-2010',
        linkName: 'Other Link',
        link: 'http://tosomeothersite.com',
        image: 'http://someimage/pic2.png',
        active: true,
        name: 'Second News Item',
        text: 'Second News Item Text',
        summary: 'Second Short summary',
      },
    };

    const news: { key: string, value: SingleNewsItem }[] = [firstNewsItem, secondNewsItem];

    const result = shallow(<News
      news={news}
      settings={mockSettings}
    />);

    expect(result).toMatchSnapshot();
  });

});
