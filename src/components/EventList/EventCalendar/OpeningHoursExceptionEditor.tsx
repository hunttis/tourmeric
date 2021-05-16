import React, { Component } from "react";
import { FormattedMessage, IntlShape, injectIntl } from "react-intl";
import firebase from "firebase/app";
import { format } from "date-fns";
import _ from "lodash";
import SelectElement from "../../AdminTools/EventEditor/SelectElement";
import { OpeningHoursException } from "../../../models/OpeningHours";

interface OpeningHoursExceptionEditorProps {
  day: Date;
  existingExceptions: { [key: string]: OpeningHoursException };
  closeEditor: () => void;
  intl: IntlShape;
}

export class OpeningHoursExceptionEditorComponent extends Component<
  OpeningHoursExceptionEditorProps
> {
  delayedSave = _.debounce(async (path, item, value) => {
    await firebase.update(`${path}`, { [item]: value });
  }, 500);

  async deleteException(path: string) {
    await firebase.set(`${path}`, {});
    this.props.closeEditor();
  }

  async setShopClosed(path: string, item: string, value: boolean) {
    await firebase.update(`${path}`, { openingHours: null });
    this.delayedSave(path, item, value);
  }

  render() {
    const { day, existingExceptions, closeEditor, intl } = this.props;
    const todayString = format(day, "yyyy-MM-dd");
    const exceptionForToday = existingExceptions[todayString];
    const pathForToday = `/openinghoursexceptions/${todayString}/`;

    const openOk = exceptionForToday && !_.isNil(exceptionForToday.status);
    const descriptionOk = exceptionForToday && exceptionForToday.name;
    const hoursOk =
      exceptionForToday &&
      (exceptionForToday.status === "closed" ||
        (exceptionForToday.status === "open" &&
          exceptionForToday.openingHours));

    return (
      <div>
        <SelectElement
          labelContent="open"
          defaultValue={exceptionForToday ? exceptionForToday.status : "none"}
          dropdownItems={{
            open: `${intl.formatMessage({ id: "open" })}`,
            closed: `${intl.formatMessage({ id: "closed" })}`,
          }}
          isOk={exceptionForToday && !_.isNil(exceptionForToday.status)}
          targetName="status"
          path={pathForToday}
          isLocked={false}
          isHorizontal={false}
        />

        {openOk && (
          <div className="field">
            <div className="label">
              <label className="label">
                <FormattedMessage id="description" />
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control">
                  <input
                    type="text"
                    className="input"
                    defaultValue={
                      exceptionForToday ? exceptionForToday.name : ""
                    }
                    onChange={(event) =>
                      this.delayedSave(pathForToday, "name", event.target.value)
                    }
                  />
                </p>
              </div>
            </div>
          </div>
        )}

        {openOk &&
          descriptionOk &&
          exceptionForToday &&
          exceptionForToday.status === "open" && (
            <div className="field ">
              <div className="label">
                <label className="label">
                  {intl.formatMessage({ id: "hours" })}
                </label>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    defaultValue={
                      exceptionForToday ? exceptionForToday.openingHours : ""
                    }
                    placeholder={`${intl.formatMessage({
                      id: "openinghoursexample",
                    })}`}
                    onChange={(event) =>
                      this.delayedSave(
                        pathForToday,
                        "openingHours",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}
        {hoursOk && (
          <button
            className="button is-info is-outlined"
            onClick={() => closeEditor()}
          >
            <FormattedMessage id="done" />
          </button>
        )}
        {exceptionForToday && (
          <button
            className="button is-danger is-outlined"
            onClick={() => this.deleteException(pathForToday)}
          >
            <FormattedMessage id="deleteexception" />
          </button>
        )}
      </div>
    );
  }
}

export const OpeningHoursExceptionEditor = injectIntl(
  OpeningHoursExceptionEditorComponent
);
