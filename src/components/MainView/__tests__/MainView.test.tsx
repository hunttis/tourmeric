import rrf from 'react-redux-firebase';
import React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import MainView from '../MainView';

import {
  mockSettings,
  mockProfile,
} from '~/components/EventList/__mocks__/mockData';
import { Settings } from '~/models/Settings';

jest.mock('~/components/AdminTools/AdminTools-container', () => 'AdminTools');
jest.mock('~/components/AdminTools/AdminToolsEvents-container', () => 'AdminToolsEvents');
jest.mock('~/components/AdminTools/SiteSettings/AdminSiteSettings-container', () => 'AdminSiteSettings');
jest.mock('~/components/AdminTools/ArticleEditor/ArticleList-container', () => 'ArticleList');

jest.mock('~/components/MainView/InitialSetup', () => 'InitialSetup');
jest.mock('~/components/MainView/FooterBar-container', () => 'FooterBar');
jest.mock('~/components/MainView/TitleBar-container', () => 'TitleBar');
jest.mock('~/components/MainView/ThemeHandler-container', () => 'ThemeHandler');

jest.mock('~/components/MainView/Account/Register-container', () => 'Register');
jest.mock('~/components/MainView/Account/Login-container', () => 'Login');
jest.mock('~/components/MainView/Navbar/Navbar-container', () => 'Navbar');
jest.mock('~/components/MainView/Today/Today-container', () => 'Today');
jest.mock('~/components/MainView/Articles/Articles-container', () => 'Articles');
jest.mock('~/components/MainView/CompanyInfo/CompanyInfo-container', () => 'CompanyInfo');

jest.mock('~/components/MainView/Loaders/ArticleLoader-container', () => 'ArticleLoader');
jest.mock('~/components/MainView/Loaders/EventLoader-container', () => 'EventLoader');
jest.mock('~/components/MainView/Loaders/CategoryLoader-container', () => 'CategoryLoader');
jest.mock('~/components/MainView/Loaders/ParticipationsLoader-container', () => 'ParticipationsLoader');
jest.mock('~/components/MainView/Loaders/UploadedCategoryLogosLoader-container', () => 'UploadedCategoryLogosLoader');
jest.mock('~/components/MainView/Loaders/OpeningHoursExceptionLoader-container', () => 'OpeningHoursExceptionLoader');
jest.mock('~/components/MainView/Loaders/UsersLoader-container', () => 'UsersLoader');
jest.mock('~/components/MainView/Loaders/HighLightsLoader-container', () => 'HighLightsLoader');
jest.mock('~/components/MainView/MainView-routes', () => 'MainViewRoutes');

jest.mock('~/components/EventList/EventCalendar/EventCalendar-container', () => 'EventCalendar');
jest.mock('~/components/EventList/EventCard/SingleEvent-container', () => 'SingleEventContainer');
jest.mock('~/components/EventList/EventCard/EventPlayerList-container', () => 'EventPlayerList');

jest.mock('~/components/StoreInfo/StoreInfo-container', () => 'StoreInfo');
jest.mock('~/components/StoreInfo/OpeningHours-container', () => 'OpeningHours');
jest.mock('~/components/UserInfo/UserInfo-container', () => 'UserInfo');


describe('MainView tests', () => {
  beforeEach(() => {
    rrf.isLoaded = jest.fn(() => true);
    rrf.isEmpty = jest.fn(() => false);
  });

  it('Renders MainView, initial setup only', () => {
    rrf.isLoaded = jest.fn(() => true);
    rrf.isEmpty = jest.fn(() => true);

    const result = shallow(
      <MainView
        settings={{} as Settings}
        dispatch={jest.fn}
        history={createMemoryHistory()}
        profile={mockProfile}
        location={createLocation('/')}
        isAdmin={false}
        initialize={jest.fn()}
        addTranslationForLanguage={jest.fn()}
      />,
    );

    expect(result).toMatchSnapshot();
  });

  it('Renders MainView, settings are not loaded', () => {
    rrf.isLoaded = jest.fn(() => false);
    rrf.isEmpty = jest.fn(() => true);

    const result = shallow(
      <MainView
        settings={mockSettings}
        dispatch={jest.fn}
        history={createMemoryHistory()}
        profile={mockProfile}
        location={createLocation('/')}
        isAdmin={false}
        initialize={jest.fn()}
        addTranslationForLanguage={jest.fn()}
      />,
    );

    expect(result).toMatchSnapshot();
  });

  it('Renders MainView, settings are loaded, ordinary logged out user', () => {

    const result = shallow(
      <MainView
        settings={mockSettings}
        dispatch={jest.fn}
        history={createMemoryHistory()}
        profile={mockProfile}
        location={createLocation('/')}
        isAdmin={false}
        initialize={jest.fn()}
        addTranslationForLanguage={jest.fn()}
      />,
    );

    expect(result).toMatchSnapshot();
  });


  it('Renders MainView, settings are loaded, admin', () => {

    const result = shallow(
      <MainView
        settings={mockSettings}
        dispatch={jest.fn}
        history={createMemoryHistory()}
        profile={mockProfile}
        location={createLocation('/')}
        isAdmin
        initialize={jest.fn()}
        addTranslationForLanguage={jest.fn}
      />,
    );

    result.setState({ userInfoOk: true });

    expect(result).toMatchSnapshot();
  });

  it('Renders MainView, settings are loaded, printpage', () => {

    const result = shallow(
      <MainView
        settings={mockSettings}
        dispatch={jest.fn}
        history={createMemoryHistory()}
        profile={mockProfile}
        location={createLocation('/print')}
        isAdmin
        initialize={jest.fn()}
        addTranslationForLanguage={jest.fn}
      />,
    );

    result.setState({ userInfoOk: true });

    expect(result).toMatchSnapshot();
  });
});
