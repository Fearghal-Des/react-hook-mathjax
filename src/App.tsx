import React from 'react';
import Markdown from 'react-markdown';
import { Components } from 'react-markdown';
import remarkMath from 'remark-math';
import MathJaxProvider from './mathjax-provider';
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import MathJaxNode from './mathjax-node';

interface MarkdownRenderProps {
    children: string;
}

interface CustomComponents extends Partial<Components> {
    math: React.ComponentType<{ value: string }>;
    inlineMath: React.ComponentType<{ value: string }>;
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ children }) => {
    const components: CustomComponents = {
        math: ({ value }) => <h1 style={{color: "blue"}}>{value}</h1>,
        inlineMath: ({ value }) => <h1 style={{color: "blue"}}>{value}</h1>
    };

    return (
        <MathJaxProvider>
            <Markdown
                remarkPlugins={[remarkMath]}

                components={components}
                rehypePlugins={[rehypeKatex]}
               

            >
                {children}
            </Markdown>
        </MathJaxProvider>
    );
};

export default function App() {
  const tex = `
  # Lift($$L$$) can be determined by Lift Coefficient ($$C_L$$) like the following
  equation.

  $$
  L = \\frac{1}{2} \\rho v^2 S C_L
  $$`;

  return (
      <div className="App">
          <MarkdownRender>{tex}</MarkdownRender>
      </div>
  );
}
