import type { Metadata } from 'next';
import './globals.css';
import Nav from '../src/components/nav';
export const metadata: Metadata = {
  title: 'Exam Builder Pro',
  description: 'Internal question bank and exam generator.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* MathJax 3 Configuration for raw LaTeX rendering */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                  displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                  processEscapes: true
                },
                options: {
                  ignoreHtmlClass: 'tex2jax_ignore',
                  processHtmlClass: 'math' 
                },
                startup: {
                  typeset: false // Triggered manually inside QuestionCard.tsx
                }
              };
            `,
          }}
        />
        <script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      </head>
      <body className="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen flex flex-col">
<Nav />
       <main>{children}</main> 
      </body>
    </html>
  );
}