import React from 'react';
import showdown from 'showdown';

interface Props {
  markdown: string | undefined;
}

interface MarkdownMap {
  [key: string]: string;
}

const classMap: MarkdownMap = {
  h1: 'title',
  h2: 'subtitle',
  p: 'content has-text-justified',
  img: 'image articleimage',
  ul: 'articlelistitem',
  ol: 'articlelistitem',
};

const bindings = Object.keys(classMap)
  .map((key) => ({
    type: 'output',
    regex: new RegExp(`<${key}(.*)>`, 'g'),
    replace: `<${key} class="${classMap[key]}" $1>`,
  }));

const converter = new showdown.Converter({
  extensions: [...bindings],
});

export const MarkdownElement = ({ markdown }: Props) => (
  // eslint-disable-next-line react/no-danger
  <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(markdown || '') }} />
);

const convertMarkdownToHtml = (markdown: string) => converter.makeHtml(markdown);
