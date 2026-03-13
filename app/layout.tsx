import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Exam Builder Pro',
  description: 'Internal question bank and exam generator.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* MathJax 3 Configuration */}
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
                  typeset: false // We trigger this manually in the React component
                }
              };
            `,
          }}
        />
        <script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      </head>
      <body className="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen">
        {/* The rest of our React components will be injected right here */}
        {children}
      </body>
    </html>
  )
}