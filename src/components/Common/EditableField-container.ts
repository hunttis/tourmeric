import { connect } from "react-redux";
import { compose } from "redux";

import { EditableField } from "./EditableField";
import { ReduxState } from "../../models/ReduxState";
import { injectIntl } from "react-intl";

export default compose(
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile }))
)(injectIntl(EditableField)) as React.ComponentType<any>;
