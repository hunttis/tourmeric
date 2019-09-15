// import { connect } from 'react-redux';
// import { compose } from 'redux';

// import { ReduxState } from '~/models/ReduxState';

// interface Props {
//   articleId: string;
// }

// export default compose(
//   connect((state: ReduxState, props: Props) => {
//     console.log('foo', props);
//     return {
//       article: state.firebase.data.articles[props.articleId],
//       uploadedArticleImages: state.firebase.data.uploadedArticleImages,
//       settings: state.firebase.data.settings,
//     };
//   }),
//   connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
// )(ArticleEditMode) as React.ComponentType<any>;
