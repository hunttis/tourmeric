import { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class ThemeHandler extends Component {

  componentWillMount() {
    this.handleTheme(null, this.props.settings.theme);
    this.handleTitleBarColorChange(null, this.props.settings.titleBarColor, null, this.props.settings.titleBarColor2, null, this.props.settings.titleBarPercentage, null, this.props.settings.titleBarAngle);
    this.handleTitleTextColor(null, this.props.settings.titleTextColor);
    this.handleSubtitleTextColor(null, this.props.settings.subtitleTextColor);
  }

  componentWillReceiveProps(nextProps) {
    this.handleTheme(this.props.settings.theme, nextProps.settings.theme);
    this.handleTitleBarColorChange(this.props.settings.titleBarColor, nextProps.settings.titleBarColor, this.props.settings.titleBarColor2, nextProps.settings.titleBarColor2, this.props.settings.titleBarPercentage, nextProps.settings.titleBarPercentage, this.props.settings.titleBarAngle, nextProps.settings.titleBarAngle);
    this.handleTitleTextColor(this.props.settings.titleTextColor, nextProps.settings.titleTextColor);
    this.handleSubtitleTextColor(this.props.settings.subtitleTextColor, nextProps.settings.subtitleTextColor);
  }

  handleTheme(oldTheme, newTheme) {

    if (oldTheme === newTheme) {
      return;
    }

    const link = document.getElementById('pagetheme') || document.createElement('link');
    link.href = `https://unpkg.com/bulmaswatch/${newTheme}/bulmaswatch.min.css`;
    link.rel = 'stylesheet';
    link.id = 'pagetheme';
    document.head.appendChild(link);
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
