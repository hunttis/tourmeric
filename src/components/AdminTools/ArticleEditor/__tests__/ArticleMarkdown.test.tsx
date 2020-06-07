import React from 'react';
import { shallow, render } from 'enzyme';
import { ArticleMarkdown } from '../ArticleMarkdown';
import { Article } from '~/models/ReduxState';

describe('ArticleMarkdown Tests', () => {

  const mockArticle: Article = {
    createDate: '01-01-2017',
    date: '01-01-2017',
    title: 'Test title',
    published: true,
  };

  it("has undefined markdown content and doesn't crash", () => {
    shallow(
      <ArticleMarkdown
        articleId="12345"
        article={mockArticle}
        uploadedArticleImages={[] as any}
      />,
    );
  });

  it('has empty markdown content', () => {
    const mockArticleWithContent = mockArticle;
    mockArticleWithContent.content = '';

    const result = render(
      <ArticleMarkdown
        articleId="12345"
        article={mockArticleWithContent}
        uploadedArticleImages={[] as any}
      />,
    );

    const preview = result.find('#preview');
    expect(preview).toMatchSnapshot();
  });

  it('has small article with title, subtitle and text', () => {
    const mockArticleWithContent = mockArticle;
    mockArticleWithContent.content = '# Title\n## Subtitle\nText\nMore text';

    const result = render(
      <ArticleMarkdown
        articleId="12345"
        article={mockArticleWithContent}
        uploadedArticleImages={[] as any}
      />,
    );

    const preview = result.find('#preview');
    expect(preview).toMatchSnapshot();
  });
});
