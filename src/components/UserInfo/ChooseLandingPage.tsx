import React, { Component } from "react";
import firebase from "firebase/app";
import _ from "lodash";
import {
  FirebaseProfile,
  FirebaseAuth,
  PageOption,
} from "../../models/ReduxState";
import { FormattedMessage, IntlShape } from "react-intl";

interface Props {
  profile: FirebaseProfile;
  auth: FirebaseAuth;
  intl: IntlShape;
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
    admintools: [
      "users",
      "highlights",
      "storeinfo",
      "news",
      "companyinfo",
      "storecreditcategories",
      "storecreditreport",
    ],
    admintoolsevents: [
      "unpublished",
      "published",
      "category",
      "categorylogouploader",
      "participations",
    ],
    adminsitesettings: [
      "pagetitles",
      "localization",
      "themes",
      "features",
      "privacypolicy",
      "footer",
    ],
  };

  constructor(props: Props) {
    super(props);

    const { profile } = this.props;
    const landingPage = _.get(profile, "landingPage", "");
    const landingSubpage = _.get(profile, "landingSubpage", "");

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
    firebase.update(`/users/${this.props.auth.uid}`, {
      landingPage,
      landingSubpage,
    });
  }

  render() {
    const { landingPage, landingSubpage } = this.state;
    const { intl } = this.props;

    return (
      <>
        <h1 className="title">
          <FormattedMessage id="chooseyourlandingpage" />
        </h1>
        <div className="field">
          <label className="label">
            <FormattedMessage id="page" />
          </label>
          <div className="field-body">
            <select
              className="input"
              defaultValue={landingPage}
              onChange={(event) =>
                this.changeLandingPage(event.target.value as PageOption)
              }
            >
              <option>{intl.formatMessage({ id: "select" })}</option>
              {Object.keys(this.pageOptions).map((pageOption, index) => (
                <option key={`pageoption-${index}`} value={pageOption}>
                  {intl.formatMessage({ id: pageOption })}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p>&nbsp;</p>
        {!_.isEmpty(_.get(this.pageOptions, landingPage)) && (
          <>
            <div className="field">
              <label className="label">
                <FormattedMessage id="page" />
              </label>
              <div className="field-body">
                <select
                  className="input"
                  defaultValue={landingSubpage!}
                  onChange={(event) =>
                    this.changeLandingSubpage(event.target.value)
                  }
                >
                  <option>{intl.formatMessage({ id: "select" })}</option>
                  {_.get(this.pageOptions, landingPage, []).map(
                    (subpageOption: string, index: number) => (
                      <option
                        key={`subpageoption-${index}`}
                        value={subpageOption}
                      >
                        {intl.formatMessage({ id: subpageOption })}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </>
        )}
        {_.isEmpty(_.get(this.pageOptions, landingPage)) && (
          <>
            <div className="field">
              <label className="label">
                <FormattedMessage id="subpage" />
              </label>
              <div className="field-body">
                <select
                  disabled
                  className="input"
                  defaultValue={landingSubpage!}
                  onChange={(event) =>
                    this.changeLandingSubpage(event.target.value)
                  }
                >
                  <option>{intl.formatMessage({ id: "nosubpage" })}</option>
                </select>
              </div>
            </div>
          </>
        )}
        <button className="button" onClick={() => this.saveLandingpage()}>
          <FormattedMessage id="savelandingpage" />
        </button>
      </>
    );
  }
}
