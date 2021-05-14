/* eslint-disable import/first */

import React from 'react';
import { shallow } from 'enzyme';
import rrf from 'react-redux-firebase';
import NewsItem from '../NewsItem';
import { SingleNewsItem } from '../../../../models/ReduxState';

jest.mock('react-redux-firebase');

describe('News tests', () => {
  beforeEach(() => {
    rrf.isLoaded = jest.fn(() => true);
  });

  it('should render a newsitem', () => {

    rrf.isLoaded = jest.fn(() => false);

    const singleNewsItem: {key: string, value: SingleNewsItem} = {
      key: 'first',
      value: {
        createDate: '1-1-1990',
        date: '31-12-1990',
        linkName: 'Link',
        link: 'http://tosomesite.com',
        image: 'http://someimage/pic.png',
        active: true,
        name: 'First News Item',
        text: 'First\nNews\nItem\nText',
        summary: 'First Short summary',
      },
    };

    const result = shallow(<NewsItem
      newsItem={singleNewsItem}
      dateFormat="DD-MM-YYYY"
    />);

    expect(result).toMatchSnapshot();

    result.setState({ activeNewsItem: true });

    expect(result).toMatchSnapshot();
  });

});
