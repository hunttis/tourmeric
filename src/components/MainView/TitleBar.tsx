import React, { Component } from "react";
import _ from "lodash";
import { FormattedMessage } from "react-intl";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { Dispatch } from "redux";
import Highlights from "../../components/HighLights/HighLights-container";
import OpeningHours from "../StoreInfo/OpeningHours-container";
import { Settings } from "../../models/Settings";

interface Props {
  settings: Settings;
  dispatch: Dispatch;
  returnToFrontpage: () => {};
}

export default class TitleBar extends Component<Props> {
  changeLanguage(newLanguage: string) {
    this.props.dispatch(setActiveLanguage(newLanguage));
    {
      // TODO Does this need replacement?
      /* Moment.globalLocale = newLanguage; */
    }
  }

  render() {
    const { settings, returnToFrontpage } = this.props;

    const highlightsActive = _.get(
      settings,
      "features.highlights.active",
      false
    );
    const introTextActive = _.get(
      settings,
      "features.storeinfo.introtext",
      false
    );
    const introText = _.get(settings, "introText", "");
    const introTextParagraphs = introText.split("\n");

    const pageTitle = _.get(settings, "pageTitle", "Pagetitle not set");
    const pageSubtitle = _.get(settings, "pageSubtitle", "");
    const settingsLoaded = isLoaded(settings) && !isEmpty(settings);

    if (settingsLoaded) {
      return (
        <>
          {/* Hero bar only visible in desktop */}
          <section className="hero titlebar is-hidden-mobile">
            <div className="hero-body is-hidden-mobile">
              <div className="columns is-marginless">
                <div className="column is-2 is-vcentered">
                  {settings.activeLogo && (
                    <a onClick={() => returnToFrontpage()}>
                      <div id="logo" className="is-paddingless is-marginless">
                        <figure className="image">
                          <img src={settings.activeLogo} alt="" />
                        </figure>
                      </div>
                    </a>
                  )}
                  {settings.pageTitle && (
                    <div id="titletext" className="title is-2">
                      {pageTitle}
                    </div>
                  )}
                </div>
                <div className="column button-container">
                  {highlightsActive && <Highlights />}
                </div>
                {introTextActive && (
                  <div className="column introtext-container">
                    <div className="introtext-box">
                      {introTextParagraphs.map(
                        (paragraph: string, index: number) => (
                          <p key={`introtextparagraph-${index}`}>
                            {paragraph}&nbsp;
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
              {pageSubtitle && (
                <div
                  id="subtitletext"
                  className="subtitle has-text-grey-light is-6 is-paddingless is-marginless"
                >
                  {pageSubtitle}
                </div>
              )}
              <div className="is-hidden-mobile">
                <OpeningHours />
              </div>
            </div>
          </section>
        </>
      );
    }

    return (
      <div className="title has-text-centered">
        <div className="level" />
        <button disabled className="button is-loading is-black">
          <FormattedMessage id="loading" />.
        </button>
      </div>
    );
  }
}
