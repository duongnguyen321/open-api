import MarkdownIt from 'markdown-it';

export default function mdToHtml(markdown: string, html: boolean = false) {
  const md = new MarkdownIt({
    html,
    xhtmlOut: true,
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
    langPrefix: 'language-',
  });
  const result = md?.render(markdown);
  return result;
}
