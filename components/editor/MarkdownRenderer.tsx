import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface Props {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = '' }: Props) => {
  // Detect if the string is likely HTML (from Tiptap)
  const isHtml = content.includes('<') && content.includes('>');

  if (isHtml) {
    // 1) Convert possible Tiptap math spans into KaTeX HTML
    let html = content
      // data-content variant
      .replace(
        /<span[^>]*data-type="mathematics"[^>]*data-content="([^"]+)"[^>]*>.*?<\/span>/g,
        (_match, latex: string) => safeRenderInline(latex)
      )
      // data-latex variant
      .replace(
        /<span[^>]*data-type="mathematics"[^>]*data-latex="([^"]+)"[^>]*>.*?<\/span>/g,
        (_match, latex: string) => safeRenderInline(latex)
      );

    // 2) Render block math first: $$...$$ (supports multiline)
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_m, latex: string) => safeRenderBlock(latex));

    // 3) Render remaining inline math: $...$
    // Ensure we don't match $$...$$ pairs (already handled)
    html = html.replace(/(^|[^$])\$([^$]+?)\$([^$]|$)/g, (_m, pre: string, latex: string, post: string) => {
      return `${pre}${safeRenderInline(latex)}${post}`;
    });

    return (
      <div
        className={`markdown-preview ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Markdown path: use remark-math + rehype-katex
  return (
    <div className={`markdown-preview ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw as any]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

function safeRenderInline(latex: string): string {
  try {
    return katex.renderToString(latex, { throwOnError: false, displayMode: false });
  } catch {
    return `$${latex}$`;
  }
}

function safeRenderBlock(latex: string): string {
  try {
    return `<div class="math-block">${katex.renderToString(latex, { throwOnError: false, displayMode: true })}</div>`;
  } catch {
    return `$$${latex}$$`;
  }
}
