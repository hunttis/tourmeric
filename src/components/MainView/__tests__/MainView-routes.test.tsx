import React from 'react';
import { render } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import MainviewRoutes from '../MainView-routes';

jest.mock('react-redux-firebase');

jest.mock('~/components/AdminTools/AdminTools-container', () => 'AdminTools');
jest.mock('~/components/AdminTools/AdminToolsEvents-container', () => 'AdminToolsEvents');
jest.mock('~/components/AdminTools/SiteSettings/AdminSiteSettings-container', () => 'AdminSiteSettings');
jest.mock('~/components/EventList/EventCalendar/EventCalendar-container', () => 'EventCalendar');
jest.mock('~/components/MainView/Today/News-container', () => 'News');
jest.mock('~/components/MainView/Today/Today-container', () => 'Today');
jest.mock('~/components/UserInfo/UserInfo-container', () => 'UserInfo');
jest.mock('~/components/EventList/EventCard/SingleEvent-container', () => 'SingleEvent');
jest.mock('~/components/EventList/EventCard/EventPlayerList-container', () => 'EventPlayerList');
jest.mock('~/components/StoreInfo/StoreInfo-container', () => 'StoreInfo');
jest.mock('~/components/MainView/Account/Register-container', () => 'Register');
jest.mock('~/components/MainView/Account/Login-container', () => 'Login');
jest.mock('~/components/MainView/Articles/Articles-container', () => 'Articles');
jest.mock('~/components/MainView/CompanyInfo/CompanyInfo-container', () => 'CompanyInfo');

describe('MainView Routes tests for NON-ADMIN USER', () => {

  it('Should Render null with an empty path', () => {
    const result = render(
      <MemoryRouter initialEntries={['/']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should Render Today-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/today']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should Render EventPlayerList-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/event/123456/printplayerlist']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should Render Single Event-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/event/123456']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should Render EventCalendar-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/events']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should Render StoreInfo-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/storeinfo']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should Render UserInfo-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/userinfo']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should Render Login-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/login']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should Render Register-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/register']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should Render CompanyInfo-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/companyinfo']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should Render Articles-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/articles']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should NOT render AdminTools-Component, because user is not admin', () => {
    const result = render(
      <MemoryRouter initialEntries={['/admin/tools']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should NOT render AdminToolsEvents-Component, because user is not admin', () => {
    const result = render(
      <MemoryRouter initialEntries={['/admin/events']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should NOT render SiteSettings-Component, because user is not admin', () => {
    const result = render(
      <MemoryRouter initialEntries={['/admin/sitesettings']}>
        <MainviewRoutes isAdmin={false} />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

});

describe('MainView Tests for Admin user', () => {

  it('Should render AdminTools-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/admin/tools']}>
        <MainviewRoutes isAdmin />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should render AdminToolsEvents-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/admin/events']}>
        <MainviewRoutes isAdmin />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });

  it('Should render SiteSettings-Component', () => {
    const result = render(
      <MemoryRouter initialEntries={['/admin/sitesettings']}>
        <MainviewRoutes isAdmin />
      </MemoryRouter>,
    );

    expect(result).toMatchSnapshot();
  });
});
