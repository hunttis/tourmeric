import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import _ from 'lodash';

export default class ChooseLandingPage extends Component {

  pageOptions = {
    today: [],
    events: [],
    storeinfo: [],
    userinfo: [],
    companyinfo: [],
    admintools: ['users', 'highlights', 'storeinfo', 'news', 'companyinfo'],
    admintoolsevents: ['unpublished', 'published', 'category', 'categorylogouploader', 'participations'],
    adminsitesettings: ['pagetitles', 'localization', 'themes', 'features', 'privacypolicy'],
  };


  constructor(props) {
    super(props);

    const { profile } = this.props;
    const landingPage = _.get(profile, 'landingPage', '');
    const landingSubpage = _.get(profile, 'landingSubpage', '');

    this.state = { landingPage, landingSubpage };
  }

  changeLandingPage(landingPage) {
    this.setState({ landingPage, landingSubpage: null });
  }

  changeLandingSubpage(landingSubpage) {
    this.setState({ landingSubpage });
  }

  saveLandingpage() {
    const { landingPage, landingSubpage } = this.state;
    firebase.update(`/users/${this.props.auth.uid}`, { landingPage, landingSubpage });
  }

  render() {
    const { landingPage, landingSubpage } = this.state;

    return (
      <Fragment>
        <h1 className="title"><Translate id="chooseyourlandingpage" /></h1>
        <div className="field">
          <label className="label">
            <Translate id="page" />
          </label>
          <div className="field-body">
            <select className="input" defaultValue={landingPage} onChange={event => this.changeLandingPage(event.target.value)}>
              <option><Translate id="select" /></option>
              {Object.keys(this.pageOptions).map((pageOption, index) => <option key={`pageoption-${index}`} value={pageOption}><Translate id={pageOption} /></option>)}
            </select>
          </div>
        </div>
        <p>&nbsp;</p>
        {!_.isEmpty(this.pageOptions[landingPage]) &&
          <Fragment>
            <div className="field">
              <label className="label">
                <Translate id="page" />
              </label>
              <div className="field-body">
                <select className="input" defaultValue={landingSubpage} onChange={event => this.changeLandingSubpage(event.target.value)}>
                  <option><Translate id="select" /></option>
                  {this.pageOptions[landingPage].map((subpageOption, index) => (
                    <option key={`subpageoption-${index}`} value={subpageOption}><Translate id={subpageOption} /></option>
                  ))}
                </select>
              </div>
            </div>
          </Fragment>
        }
        {_.isEmpty(this.pageOptions[landingPage]) &&
          <Fragment>
            <div className="field">
              <label className="label">
                <Translate id="subpage" />
              </label>
              <div className="field-body">
                <select disabled className="input" defaultValue={landingSubpage} onChange={event => this.changeLandingSubpage(event.target.value)}>
                  <option><Translate id="nosubpage" /></option>
                </select>
              </div>
            </div>
          </Fragment>
        }
        <button className="button" onClick={() => this.saveLandingpage()}>
          <Translate id="savelandingpage" />
        </button>
      </Fragment>
    );

  }

}

ChooseLandingPage.propTypes = {
  profile: PropTypes.object,
  auth: PropTypes.object,
};
