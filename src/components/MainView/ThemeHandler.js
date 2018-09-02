import { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class ThemeHandler extends Component {

  componentWillMount() {
    const settings = _.get(this.props, 'settings');
    if (!settings) {
      return;
    }
    this.handleTitleBarColorChange(null, settings.titleBarColor, null, settings.titleBarColor2, null, settings.titleBarPercentage, null, settings.titleBarAngle);
    this.handleTitleTextColor(null, settings.titleTextColor);
    this.handleSubtitleTextColor(null, settings.subtitleTextColor);
  }

  componentWillReceiveProps(nextProps) {
    let currentsettings = _.get(this.props, 'settings');
    if (!currentsettings) {
      currentsettings = {};
    }
    let nextSettings = _.get(nextProps, 'settings');
    if (!nextSettings) {
      nextSettings = {};
    }
    if (!currentsettings || !nextSettings) {
      return;
    }
    this.handleTitleBarColorChange(currentsettings.titleBarColor, nextSettings.titleBarColor, currentsettings.titleBarColor2, nextSettings.titleBarColor2, currentsettings.titleBarPercentage, nextSettings.titleBarPercentage, currentsettings.titleBarAngle, nextSettings.titleBarAngle);
    this.handleTitleTextColor(currentsettings.titleTextColor, nextSettings.titleTextColor);
    this.handleSubtitleTextColor(currentsettings.subtitleTextColor, nextSettings.subtitleTextColor);
  }

  handleTitleBarColorChange(oldValue1, newValue1, oldValue2, newValue2, oldPercentage, newPercentage, oldAngle, newAngle) {
    if (oldValue1 === newValue1 && oldValue2 === newValue2 && oldPercentage === newPercentage && oldAngle === newAngle) {
      return;
    }

    if (_.isEmpty(newValue2)) { // Single color
      const text = !_.isEmpty(newValue1) && `.hero.titlebar {background-color: ${newValue1} !important};`;
      const styleTag = document.getElementById('barcolorStyle') || document.createElement('style');
      styleTag.innerHTML = text;
      styleTag.id = 'barcolorStyle';
      document.head.appendChild(styleTag);
    } else { // Linear gradient
      const percentageText = newPercentage ? `${newPercentage}%` : '';
      const angleText = newAngle ? `${newAngle}deg` : '135deg';
      const text = !_.isEmpty(newValue1) && `.hero.titlebar {background: linear-gradient(${angleText}, ${newValue1} ${percentageText}, ${newValue2}) !important};`;
      const styleTag = document.getElementById('barcolorStyle') || document.createElement('style');
      styleTag.innerHTML = text;
      styleTag.id = 'barcolorStyle';
      document.head.appendChild(styleTag);
    }
  }

  handleStyleChange(name, oldValue, newValue, cssSelector, modifiedAttribute) {
    if (oldValue === newValue) {
      return;
    }

    const text = !_.isEmpty(newValue) && `${cssSelector} {${modifiedAttribute}: ${newValue} !important};`;
    const styleTag = document.getElementById(name) || document.createElement('style');
    styleTag.innerHTML = text;
    styleTag.id = name;
    document.head.appendChild(styleTag);
  }

  handleTitleTextColor(oldColor, newColor) {
    this.handleStyleChange('titleTextStyle', oldColor, newColor, 'div#titletext', 'color');
  }

  handleSubtitleTextColor(oldColor, newColor) {
    this.handleStyleChange('subtitleTextStyle', oldColor, newColor, 'div#subtitletext', 'color');
  }

  render() {
    return null;
  }

}

ThemeHandler.defaultProps = {
  settings: { theme: 'default' },
};

ThemeHandler.propTypes = {
  settings: PropTypes.object,
};
