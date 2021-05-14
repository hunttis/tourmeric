import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AdminTools from '../../components/AdminTools/AdminTools-container';
import AdminToolsEvents from '../../components/AdminTools/AdminToolsEvents-container';
import AdminSiteSettings from '../../components/AdminTools/SiteSettings/AdminSiteSettings-container';

import EventCalendar from '../../components/EventList/EventCalendar/EventCalendar-container';
import Login from '../../components/MainView/Account/Login-container';
import StoreInfo from '../../components/StoreInfo/StoreInfo-container';
import Register from '../../components/MainView/Account/Register-container';
import Today from '../../components/MainView/Today/Today-container';
import CompanyInfo from '../../components/MainView/CompanyInfo/CompanyInfo-container';
import SingleEvent from '../../components/EventList/EventCard/SingleEvent-container';
import EventPlayerList from '../../components/EventList/EventCard/EventPlayerList-container';
import Articles from '../../components/MainView/Articles/Articles-container';
import UserInfo from '../../components/UserInfo/UserInfo-container';

interface Props {
  isAdmin: boolean;
}

const MainviewRoutes = ({ isAdmin }: Props) => (
  <>
    <Switch>
      <Route path="/today" component={Today} />
      <Route path="/event/:id/printplayerlist" component={EventPlayerList} />
      <Route path="/event/:id" component={SingleEvent} />
      <Route path="/events" component={EventCalendar} />
      <Route path="/storeinfo" component={StoreInfo} />
      <Route path="/userinfo" component={UserInfo} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/companyinfo" component={CompanyInfo} />
      <Route path="/articles" component={Articles} />
    </Switch>
    {isAdmin &&
      <Switch>
        <Route path="/admin/tools" component={AdminTools} />
        <Route path="/admin/events" component={AdminToolsEvents} />
        <Route path="/admin/sitesettings" component={AdminSiteSettings} />
      </Switch>
    }
  </>
);


export default MainviewRoutes;
