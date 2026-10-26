import React, { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  textColor?: string;
}

/**
 * Safely renders LaTeX math expression to HTML string using KaTeX
 */
function renderLatex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false
    });
  } catch (err) {
    return `<span class="katex-error" style="color: #ef4444;">${tex}</span>`;
  }
}

/**
 * Code Block component with Copy button
 */
const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      margin: '12px 0',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle, #e2e8f0)',
      backgroundColor: 'var(--bg-canvas, #0f172a)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        backgroundColor: 'var(--bg-surface-secondary, #1e293b)',
        fontSize: '0.74rem',
        color: 'var(--text-muted, #94a3b8)',
        borderBottom: '1px solid var(--border-subtle, #334155)'
      }}>
        <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: copied ? '#10b981' : 'var(--text-secondary, #cbd5e1)',
            cursor: 'pointer',
            fontSize: '0.72rem'
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre style={{
        margin: 0,
        padding: '12px 14px',
        overflowX: 'auto',
        fontSize: '0.84rem',
        lineHeight: 1.5,
        color: 'var(--text-primary, #f8fafc)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

/**
 * Parses inline formatting: LaTeX ($...$ or \(...\)), Bold (**...**), Italic (*...*), Code (`...`), Strikethrough (~~...~~)
 */
function renderInlineFormatting(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let current = text;
  let keyIdx = 0;

  // Pattern matches:
  // 1. Display math: $$...$$ or \[...\]
  // 2. Inline math: $...$ or \(...\)
  // 3. Bold italic: ***...***
  // 4. Bold: **...** or __...__
  // 5. Italic: *...* or _..._
  // 6. Strikethrough: ~~...~~
  // 7. Inline code: `...`
  // 8. Markdown link: [text](url)
  const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$(?!\$)[\s\S]*?\$|\\\([\s\S]*?\\\)|\*\*\*(.*?)\*\*\*|\*\*(.*?)\*\*|__(.*?)__|~~(.*?)~~|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*|_([^_]+)_)/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(current)) !== null) {
    // Plain text before match
    if (match.index > lastIndex) {
      nodes.push(current.substring(lastIndex, match.index));
    }

    const matchedStr = match[0];

    // 1. Display Math $$...$$ or \[...\]
    if (matchedStr.startsWith('$$') && matchedStr.endsWith('$$')) {
      const tex = matchedStr.slice(2, -2);
      const html = renderLatex(tex, true);
      nodes.push(
        <div
          key={`math-d-${keyIdx++}`}
          style={{ margin: '8px 0', textAlign: 'center' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (matchedStr.startsWith('\\[') && matchedStr.endsWith('\\]')) {
      const tex = matchedStr.slice(2, -2);
      const html = renderLatex(tex, true);
      nodes.push(
        <div
          key={`math-d-${keyIdx++}`}
          style={{ margin: '8px 0', textAlign: 'center' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    // 2. Inline Math $...$ or \(...\)
    else if (matchedStr.startsWith('$') && matchedStr.endsWith('$')) {
      const tex = matchedStr.slice(1, -1);
      const html = renderLatex(tex, false);
      nodes.push(
        <span
          key={`math-i-${keyIdx++}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (matchedStr.startsWith('\\(') && matchedStr.endsWith('\\)')) {
      const tex = matchedStr.slice(2, -2);
      const html = renderLatex(tex, false);
      nodes.push(
        <span
          key={`math-i-${keyIdx++}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    // 3. Bold Italic ***...***
    else if (matchedStr.startsWith('***') && matchedStr.endsWith('***')) {
      nodes.push(
        <strong key={`bi-${keyIdx++}`}>
          <em>{match[2]}</em>
        </strong>
      );
    }
    // 4. Bold **...** or __...__
    else if ((matchedStr.startsWith('**') && matchedStr.endsWith('**')) || (matchedStr.startsWith('__') && matchedStr.endsWith('__'))) {
      const boldText = match[3] || match[4] || '';
      nodes.push(
        <strong key={`b-${keyIdx++}`} style={{ fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
          {renderInlineFormatting(boldText)}
        </strong>
      );
    }
    // 5. Strikethrough ~~...~~
    else if (matchedStr.startsWith('~~') && matchedStr.endsWith('~~')) {
      nodes.push(<del key={`del-${keyIdx++}`}>{match[5]}</del>);
    }
    // 6. Inline Code `...`
    else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      nodes.push(
        <code
          key={`code-${keyIdx++}`}
          style={{
            backgroundColor: 'var(--bg-selected, #e0ede3)',
            color: 'var(--brand-primary, #176b50)',
            padding: '2px 5px',
            borderRadius: '4px',
            fontSize: '0.85em',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
          }}
        >
          {match[6]}
        </code>
      );
    }
    // 7. Markdown Link [text](url)
    else if (matchedStr.startsWith('[') && matchedStr.includes('](')) {
      const linkText = match[7];
      const linkUrl = match[8];
      nodes.push(
        <a
          key={`link-${keyIdx++}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--brand-primary, #176b50)',
            textDecoration: 'underline',
            fontWeight: 600
          }}
        >
          {linkText}
        </a>
      );
    }
    // 8. Italic *...* or _..._
    else if ((matchedStr.startsWith('*') && matchedStr.endsWith('*')) || (matchedStr.startsWith('_') && matchedStr.endsWith('_'))) {
      const italicText = match[9] || match[10] || '';
      nodes.push(
        <em key={`i-${keyIdx++}`} style={{ fontStyle: 'italic' }}>
          {renderInlineFormatting(italicText)}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Push remaining text
  if (lastIndex < current.length) {
    nodes.push(current.substring(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '', textColor }) => {
  const elements = useMemo(() => {
    if (!content) return null;

    const lines = content.split('\n');
    const result: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer = '';
    let codeLang = '';
    let inBlockquote = false;
    let blockquoteBuffer: string[] = [];
    let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = () => {
      if (!listBuffer) return;
      const { type, items } = listBuffer;
      const Tag = type;
      result.push(
        <Tag
          key={`list-${result.length}`}
          style={{
            margin: '8px 0 10px 20px',
            paddingLeft: '6px',
            lineHeight: 1.6
          }}
        >
          {items.map((it, idx) => (
            <li key={idx} style={{ marginBottom: '4px' }}>
              {renderInlineFormatting(it)}
            </li>
          ))}
        </Tag>
      );
      listBuffer = null;
    };

    const flushBlockquote = () => {
      if (blockquoteBuffer.length === 0) return;
      result.push(
        <blockquote
          key={`bq-${result.length}`}
          style={{
            margin: '10px 0',
            padding: '8px 14px',
            borderLeft: '3px solid var(--brand-primary, #176B50)',
            backgroundColor: 'var(--bg-selected, #e0ede3)',
            borderRadius: '0 6px 6px 0',
            color: 'var(--text-secondary, #52695b)',
            fontSize: '0.9em',
            fontStyle: 'italic'
          }}
        >
          {blockquoteBuffer.map((line, idx) => (
            <div key={idx}>{renderInlineFormatting(line)}</div>
          ))}
        </blockquote>
      );
      blockquoteBuffer = [];
      inBlockquote = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 1. Fenced Code Block Toggle (```)
      if (line.trim().startsWith('```')) {
        flushList();
        flushBlockquote();

        if (inCodeBlock) {
          // Closing code block
          result.push(
            <CodeBlock
              key={`code-${result.length}`}
              code={codeBuffer.trimEnd()}
              language={codeLang}
            />
          );
          inCodeBlock = false;
          codeBuffer = '';
          codeLang = '';
        } else {
          // Opening code block
          inCodeBlock = true;
          codeLang = line.trim().slice(3).trim();
          codeBuffer = '';
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer += (codeBuffer ? '\n' : '') + line;
        continue;
      }

      // 2. Blockquote (> line)
      if (line.trim().startsWith('>')) {
        flushList();
        inBlockquote = true;
        blockquoteBuffer.push(line.trim().slice(1).trim());
        continue;
      } else if (inBlockquote) {
        flushBlockquote();
      }

      // 3. Horizontal Rule (---, ***, ___)
      if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
        flushList();
        result.push(
          <hr
            key={`hr-${result.length}`}
            style={{
              margin: '16px 0',
              border: 'none',
              borderTop: '1px solid var(--border-default, #dce7de)'
            }}
          />
        );
        continue;
      }

      // 4. Headings
      const h1Match = line.match(/^#\s+(.+)$/);
      if (h1Match) {
        flushList();
        result.push(
          <h1
            key={`h1-${result.length}`}
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-primary, #182A22)',
              marginTop: '16px',
              marginBottom: '8px',
              borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
              paddingBottom: '6px'
            }}
          >
            {renderInlineFormatting(h1Match[1])}
          </h1>
        );
        continue;
      }

      const h2Match = line.match(/^##\s+(.+)$/);
      if (h2Match) {
        flushList();
        result.push(
          <h2
            key={`h2-${result.length}`}
            style={{
              fontSize: '1.18rem',
              fontWeight: 700,
              color: 'var(--text-primary, #182A22)',
              marginTop: '14px',
              marginBottom: '6px'
            }}
          >
            {renderInlineFormatting(h2Match[1])}
          </h2>
        );
        continue;
      }

      const h3Match = line.match(/^###\s+(.+)$/);
      if (h3Match) {
        flushList();
        result.push(
          <h3
            key={`h3-${result.length}`}
            style={{
              fontSize: '1.02rem',
              fontWeight: 700,
              color: 'var(--brand-primary, #176B50)',
              marginTop: '12px',
              marginBottom: '6px'
            }}
          >
            {renderInlineFormatting(h3Match[1])}
          </h3>
        );
        continue;
      }

      const h4Match = line.match(/^####\s+(.+)$/);
      if (h4Match) {
        flushList();
        result.push(
          <h4
            key={`h4-${result.length}`}
            style={{
              fontSize: '0.92rem',
              fontWeight: 700,
              color: 'var(--text-primary, #182A22)',
              marginTop: '10px',
              marginBottom: '4px'
            }}
          >
            {renderInlineFormatting(h4Match[1])}
          </h4>
        );
        continue;
      }

      // 5. Unordered List Items (- item or * item)
      const ulMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
      if (ulMatch) {
        if (!listBuffer || listBuffer.type !== 'ul') {
          flushList();
          listBuffer = { type: 'ul', items: [] };
        }
        listBuffer.items.push(ulMatch[2]);
        continue;
      }

      // 6. Ordered List Items (1. item)
      const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
      if (olMatch) {
        if (!listBuffer || listBuffer.type !== 'ol') {
          flushList();
          listBuffer = { type: 'ol', items: [] };
        }
        listBuffer.items.push(olMatch[2]);
        continue;
      }

      // Empty line closes active lists
      if (!line.trim()) {
        flushList();
        continue;
      }

      // 7. Regular Paragraph
      flushList();
      result.push(
        <p
          key={`p-${result.length}`}
          style={{
            margin: '4px 0',
            lineHeight: 1.5,
            color: textColor || 'var(--text-primary, #1e293b)'
          }}
        >
          {renderInlineFormatting(line)}
        </p>
      );
    }

    // Flush any leftover buffers
    flushList();
    flushBlockquote();

    if (inCodeBlock && codeBuffer) {
      result.push(
        <CodeBlock
          key={`code-end`}
          code={codeBuffer.trimEnd()}
          language={codeLang}
        />
      );
    }

    return result;
  }, [content, textColor]);

  return <div className={`markdown-content ${className}`}>{elements}</div>;
};
