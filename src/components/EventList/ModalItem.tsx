import React, { Fragment } from 'react';
import { FormattedMessage, IntlShape } from "react-intl";

interface Props {
  translationKey: string;
  content?: string;
  contentArray?: string[];
}

export const ModalItem = ({ translationKey, content, contentArray }: Props) => (
  <>
    <>
      <div className="column is-12">
        <div className="subtitle has-text-info"><FormattedMessage id={translationKey} /></div>
      </div>

      {content &&
        <>
          <div className="column is-1" />
          <div className="column is-11">
            <p>
              {content}
            </p>
          </div>
        </>
      }
      {contentArray && contentArray.map((item: string, index: number) => (
        <Fragment key={`${translationKey} - ${index}`}>
          <div className="column is-1" />
          <div className="column is-11">
            <p>
              {item}
            </p>
          </div>
        </Fragment>
      ))

      }
    </>
    {!content && <span />}
  </>
);
