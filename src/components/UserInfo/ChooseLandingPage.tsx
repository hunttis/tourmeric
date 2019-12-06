import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import _ from 'lodash';
import { FirebaseProfile, FirebaseAuth, PageOption } from '~/models/ReduxState';

interface Props {
  profile: FirebaseProfile;
  auth: FirebaseAuth;
}

interface State {
  landingPage: PageOption;
  landingSubpage: string | null;
}

export default class ChooseLandingPage extends Component<Props, State> {

  pageOptions = {
    today: [],
    events: [],
    storeinfo: [],
    userinfo: [],
    companyinfo: [],
    admintools: ['users', 'highlights', 'storeinfo', 'news', 'companyinfo', 'storecreditcategories', 'storecreditreport'],
    admintoolsevents: ['unpublished', 'published', 'category', 'categorylogouploader', 'participations'],
    adminsitesettings: ['pagetitles', 'localization', 'themes', 'features', 'privacypolicy', 'footer'],
  };

  constructor(props: Props) {
    super(props);

    const { profile } = this.props;
    const landingPage = _.get(profile, 'landingPage', '');
    const landingSubpage = _.get(profile, 'landingSubpage', '');

    this.state = { landingPage, landingSubpage };
  }

  changeLandingPage(landingPage: PageOption) {
    this.setState({ landingPage, landingSubpage: null });
  }

  changeLandingSubpage(landingSubpage: string) {
    this.setState({ landingSubpage });
  }

  saveLandingpage() {
    const { landingPage, landingSubpage } = this.state;
    firebase.update(`/users/${this.props.auth.uid}`, { landingPage, landingSubpage });
  }

  render() {
    const { landingPage, landingSubpage } = this.state;

    return (
      <>
        <h1 className="title"><Translate id="chooseyourlandingpage" /></h1>
        <div className="field">
          <label className="label">
            <Translate id="page" />
          </label>
          <div className="field-body">
            <Translate>
              {({ translate }) => (
                <select className="input" defaultValue={landingPage} onChange={(event) => this.changeLandingPage(event.target.value as PageOption)}>
                  <option>{translate('select')}</option>
                  {Object.keys(this.pageOptions).map((pageOption, index) => <option key={`pageoption-${index}`} value={pageOption}>{translate(pageOption)}</option>)}
                </select>
              )}
            </Translate>
          </div>
        </div>
        <p>&nbsp;</p>
        {!_.isEmpty(_.get(this.pageOptions, landingPage)) &&
          <>
            <div className="field">
              <label className="label">
                <Translate id="page" />
              </label>
              <div className="field-body">
                <Translate>
                  {({ translate }) => (
                    <select className="input" defaultValue={landingSubpage!} onChange={(event) => this.changeLandingSubpage(event.target.value)}>
                      <option>{translate('select')}</option>
                      {_.get(this.pageOptions, landingPage, []).map((subpageOption: string, index: number) => <option key={`subpageoption-${index}`} value={subpageOption}>{translate(subpageOption)}</option>)}
                    </select>
                  )}
                </Translate>
              </div>
            </div>
          </>
        }
        {_.isEmpty(_.get(this.pageOptions, landingPage)) &&
          <>
            <div className="field">
              <label className="label">
                <Translate id="subpage" />
              </label>
              <div className="field-body">
                <Translate>
                  {({ translate }) => (
                    <select disabled className="input" defaultValue={landingSubpage!} onChange={(event) => this.changeLandingSubpage(event.target.value)}>
                      <option>{translate('nosubpage')}</option>
                    </select>
                  )}
                </Translate>
              </div>
            </div>
          </>
        }
        <button className="button" onClick={() => this.saveLandingpage()}>
          <Translate id="savelandingpage" />
        </button>
      </>
    );

  }

}
