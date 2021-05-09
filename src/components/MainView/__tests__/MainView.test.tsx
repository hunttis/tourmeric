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

jest.mock('~/components/AdminTools/AdminTools-container', () => { const AdminTools = () => <div />; return AdminTools; });
jest.mock('~/components/AdminTools/AdminToolsEvents-container', () => { const AdminToolsEvents = () => <div />; return AdminToolsEvents; });
jest.mock('~/components/AdminTools/SiteSettings/AdminSiteSettings-container', () => { const AdminSiteSettings = () => <div />; return AdminSiteSettings; });
jest.mock('~/components/AdminTools/ArticleEditor/ArticleList-container', () => { const ArticleList = () => <div />; return ArticleList; });

jest.mock('~/components/MainView/InitialSetup', () => { const InitialSetup = () => <div />; return InitialSetup; });
jest.mock('~/components/MainView/FooterBar-container', () => { const FooterBar = () => <div />; return FooterBar; });
jest.mock('~/components/MainView/TitleBar-container', () => { const TitleBar = () => <div />; return TitleBar; });
jest.mock('~/components/MainView/ThemeHandler-container', () => { const ThemeHandler = () => <div />; return ThemeHandler; });

jest.mock('~/components/MainView/Account/Register-container', () => { const Register = () => <div />; return Register; });
jest.mock('~/components/MainView/Account/Login-container', () => { const Login = () => <div />; return Login; });
jest.mock('~/components/MainView/Navbar/Navbar-container', () => { const Navbar = () => <div />; return Navbar; });
jest.mock('~/components/MainView/Today/Today-container', () => { const Today = () => <div />; return Today; });
jest.mock('~/components/MainView/Articles/Articles-container', () => { const Articles = () => <div />; return Articles; });
jest.mock('~/components/MainView/CompanyInfo/CompanyInfo-container', () => { const CompanyInfo = () => <div />; return CompanyInfo; });

jest.mock('~/components/MainView/Loaders/ArticleLoader-container', () => { const ArticleLoader = () => <div />; return ArticleLoader; });
jest.mock('~/components/MainView/Loaders/EventLoader-container', () => { const EventLoader = () => <div />; return EventLoader; });
jest.mock('~/components/MainView/Loaders/CategoryLoader-container', () => { const CategoryLoader = () => <div />; return CategoryLoader; });
jest.mock('~/components/MainView/Loaders/ParticipationsLoader-container', () => { const ParticipationsLoader = () => <div />; return ParticipationsLoader; });
jest.mock('~/components/MainView/Loaders/UploadedCategoryLogosLoader-container', () => { const UploadedCategoryLogosLoader = () => <div />; return UploadedCategoryLogosLoader; });
jest.mock('~/components/MainView/Loaders/OpeningHoursExceptionLoader-container', () => { const OpeningHoursExceptionLoader = () => <div />; return OpeningHoursExceptionLoader; });
jest.mock('~/components/MainView/Loaders/UsersLoader-container', () => { const UsersLoader = () => <div />; return UsersLoader; });
jest.mock('~/components/MainView/Loaders/HighLightsLoader-container', () => { const HighLightsLoader = () => <div />; return HighLightsLoader; });
jest.mock('~/components/MainView/MainView-routes', () => { const MainViewRoutes = () => <div />; return MainViewRoutes; });
jest.mock('~/components/MainView/UserInfoNotice-container', () => { const UserInfoNotice = () => <div />; return UserInfoNotice; });

jest.mock('~/components/EventList/EventCalendar/EventCalendar-container', () => { const EventCalendar = () => <div />; return EventCalendar; });
jest.mock('~/components/EventList/EventCard/SingleEvent-container', () => { const SingleEventContainer = () => <div />; return SingleEventContainer; });
jest.mock('~/components/EventList/EventCard/EventPlayerList-container', () => { const EventPlayerList = () => <div />; return EventPlayerList; });

jest.mock('~/components/StoreInfo/StoreInfo-container', () => { const StoreInfo = () => <div />; return StoreInfo; });
jest.mock('~/components/StoreInfo/OpeningHours-container', () => { const OpeningHours = () => <div />; return OpeningHours; });
jest.mock('~/components/UserInfo/UserInfo-container', () => { const UserInfo = () => <div />; return UserInfo; });


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
