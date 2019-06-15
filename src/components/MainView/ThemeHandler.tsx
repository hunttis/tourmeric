import { Component } from 'react';
import _ from 'lodash';
import { Settings } from '~/models/Settings';

interface Props {
  settings: Settings;
}

export default class ThemeHandler extends Component<Props> {

  componentWillMount() {
    const { settings } = this.props;
    if (_.isEmpty(settings)) {
      return;
    }
    this.handleTitleBarColorChange(null, settings.titleBarColor, null, settings.titleBarColor2, null, settings.titleBarPercentage, null, settings.titleBarAngle);
    this.handleTitleTextColor(null, settings.titleTextColor);
    this.handleSubtitleTextColor(null, settings.subtitleTextColor);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { settings } = this.props;

    let nextSettings: any = _.get(nextProps, 'settings');
    if (!nextSettings) {
      nextSettings = {};
    }
    if (!settings || !nextSettings) {
      return;
    }
    this.handleTitleBarColorChange(settings.titleBarColor, nextSettings.titleBarColor, settings.titleBarColor2, nextSettings.titleBarColor2, settings.titleBarPercentage, nextSettings.titleBarPercentage, settings.titleBarAngle, nextSettings.titleBarAngle);
    this.handleTitleTextColor(settings.titleTextColor, nextSettings.titleTextColor);
    this.handleSubtitleTextColor(settings.subtitleTextColor, nextSettings.subtitleTextColor);
  }

  handleTitleBarColorChange(oldValue1: string | null, newValue1: string, oldValue2: string | null, newValue2: string, oldPercentage: string | null, newPercentage: string, oldAngle: string | null, newAngle: string) {
    if (((!oldValue1 && !newValue1) || (!oldValue2 && !newValue2)) && oldValue1 === newValue1 && oldValue2 === newValue2 && oldPercentage === newPercentage && oldAngle === newAngle) {
      return;
    }

    if (_.isEmpty(newValue2)) { // Single color
      const text = !_.isEmpty(newValue1) ? `.hero.titlebar {background-color: ${newValue1} !important};` : '';
      const styleTag = document.getElementById('barcolorStyle') || document.createElement('style');
      styleTag.innerHTML = text;
      styleTag.id = 'barcolorStyle';
      document.head.appendChild(styleTag);
    } else { // Linear gradient
      const percentageText = newPercentage ? `${newPercentage}%` : '';
      const angleText = newAngle ? `${newAngle}deg` : '135deg';
      const text = !_.isEmpty(newValue1) ? `.hero.titlebar {background: linear-gradient(${angleText}, ${newValue1} ${percentageText}, ${newValue2}) !important};` : '';
      const styleTag = document.getElementById('barcolorStyle') || document.createElement('style');
      styleTag.innerHTML = text;
      styleTag.id = 'barcolorStyle';
      document.head.appendChild(styleTag);
    }
  }

  handleStyleChange(name: string, oldValue: string | null, newValue: string, cssSelector: string, modifiedAttribute: string) {
    if (oldValue === newValue) {
      return;
    }

    const text = !_.isEmpty(newValue) ? `${cssSelector} {${modifiedAttribute}: ${newValue} !important};` : '';
    const styleTag = document.getElementById(name) || document.createElement('style');
    styleTag.innerHTML = text;
    styleTag.id = name;
    document.head.appendChild(styleTag);
  }

  handleTitleTextColor(oldColor: string | null, newColor: string) {
    this.handleStyleChange('titleTextStyle', oldColor, newColor, 'div#titletext', 'color');
  }

  handleSubtitleTextColor(oldColor: string | null, newColor: string) {
    this.handleStyleChange('subtitleTextStyle', oldColor, newColor, 'div#subtitletext', 'color');
  }

  render() {
    return null;
  }
}
