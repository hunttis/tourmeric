import React from "react";
import { FormattedMessage, IntlShape, injectIntl } from "react-intl";
import { ParticipationData } from "../../models/ReduxState";

interface Props {
  participations: ParticipationData[];
  maxParticipants: number;
  isAdmin: boolean;
  userToCancel: string | null;
  setUserToCancel: React.Dispatch<React.SetStateAction<null | string>>;
  intl: IntlShape;
}

const ParticipantListComponent = ({
  participations,
  maxParticipants,
  isAdmin,
  userToCancel,
  setUserToCancel,
}: Props) => (
  <div>
    {participations &&
      participations.map((participation, index) => {
        const coloration =
          index % 2 === 0 ? "speech-bubble-even" : "speech-bubble-odd";
        const placeHolder =
          isAdmin && participation.userId.startsWith("placeholder");
        const beingCancelled = participation.userId === userToCancel;
        return (
          <div
            className="columns is-mobile"
            key={`participantModal-${participation.userId}`}
          >
            <div
              className={`column is-narrow is-mobile has-text-left is-fixed-bottom commenter ${maxParticipants !==
                0 &&
                maxParticipants < index + 1 &&
                "has-text-warning"}`}
            >
              {isAdmin && (
                <button
                  className="button is-small is-danger cancel-participation-button"
                  disabled={beingCancelled}
                  onClick={() => setUserToCancel(participation.userId)}
                >
                  <i title="remove" className="fas fa-ban" />
                </button>
              )}
              <span className={`${beingCancelled ? "has-text-danger" : ""}`}>
                {" "}
                {index + 1}.
                <>
                  {beingCancelled ? (
                    <FormattedMessage id="confirmcancelbelowintheadmininterface" />
                  ) : (
                    `${
                      participation && participation.firstName
                        ? participation.firstName
                        : intl.formatMessage({ id: "nofirstname" })
                    } ${
                      participation && participation.lastName
                        ? participation.lastName
                        : intl.formatMessage({ id: "nolastname" })
                    }`
                  )}
                </>
              </span>

              <span className="icon">
                {placeHolder && (
                  <i
                    title="placeholder"
                    className="has-text-warning fas fa-map-pin"
                  />
                )}
              </span>
              {maxParticipants < index + 1 && (
                <span>
                  &nbsp;(
                  <FormattedMessage id="waitlist" />)
                </span>
              )}
            </div>
            {participation.comment && (
              <div
                className={`speech-bubble ${coloration} has-text-justified column`}
              >
                {participation.comment}
              </div>
            )}
            <hr />
          </div>
        );
      })}
  </div>
);

export const ParticipantList = injectIntl(ParticipantListComponent);
