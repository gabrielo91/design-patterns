const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();

/**
 * Custom renderer for headings.
 * In Marked v4, the heading function receives a token object.
 */
const renderer = new marked.Renderer();
renderer.heading = function (token) {
  // token is expected to have: depth, text, etc.
  const level = token.depth; // e.g., 1 for '#', 2 for '##', etc.
  const text = token.text; // plain text of the header
  // Generate a slug from the text (lowercase, non-word chars replaced with hyphens)
  const base = String(text);
  const slug = base.toLowerCase().replace(/\W+/g, '-').replace(/^-|-$/g, '');
  console.log(
    `Generated header: "${text}" (level ${level}) with slug: "${slug}"`
  );
  return `<h${level} id="${slug}">${text}</h${level}>`;
};

/**
 * Generate a Table of Contents (TOC) from Markdown headings.
 * Scans for lines beginning with '#' characters.
 */
function generateTOC(markdownData) {
  const lines = markdownData.split('\n');
  const tocItems = [];
  const headingRegex = /^(#{1,6})\s+(.*)/;
  lines.forEach((line) => {
    const match = line.match(headingRegex);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      // Use the same simple slug generation as above.
      const slug = title
        .toLowerCase()
        .replace(/\W+/g, '-')
        .replace(/^-|-$/g, '');
      tocItems.push({ level, title, slug });
    }
  });
  console.log('Generated TOC Items:', tocItems);
  if (tocItems.length === 0) {
    return ''; // No headings found.
  }
  let tocHtml =
    '<nav id="toc" style="margin-bottom:20px; padding:10px; border:1px solid #ddd; background:#f0f0f0; border-radius:4px;"><h2>Table of Contents</h2>';
  tocItems.forEach((item) => {
    tocHtml += `<div style="margin-left: ${
      (item.level - 1) * 20
    }px;"><a href="#${item.slug}">${item.title}</a></div>`;
  });
  tocHtml += '</nav>';
  return tocHtml;
}

app.get('/', (req, res) => {
  const mdFilePath = path.join(__dirname, 'README.md');

  fs.readFile(mdFilePath, 'utf8', (err, markdownData) => {
    if (err) {
      console.error('Error reading Markdown file:', err);
      return res
        .status(500)
        .send('Internal Server Error: Could not read Markdown file.');
    }

    // Generate the TOC from the raw markdown.
    const tocHtml = generateTOC(markdownData);

    // Parse the markdown using our custom renderer.
    // "mangle: false" prevents unwanted mangling.
    let htmlContent = marked.parse(markdownData, { renderer, mangle: false });
    htmlContent = htmlContent.replace(/\[object Object\]/g, '');

    // Prepend the TOC (or a note if none was generated)
    if (!tocHtml) {
      htmlContent =
        `<p><em>Note: No headings found for navigation. Please ensure your Markdown file uses proper header syntax (e.g., "## Creational Design Patterns").</em></p>` +
        htmlContent;
    } else {
      htmlContent = tocHtml + htmlContent;
    }

    // Build the full HTML template.
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Design Patterns in TypeScript - Gabriel Ortega, Software Engineer</title>
        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" rel="stylesheet" />
        <!-- Highlight.js light theme -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css">
        <style>
          /* Smooth scrolling */
          html { scroll-behavior: smooth; }
          /* Base (light mode) styles */
          body {
            font-family: 'Roboto', sans-serif;
            background: #f9f9f9;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
            transition: background 0.3s, color 0.3s;
          }
          .container {
            max-width: 960px;
            margin: 0 auto;
            background: #fff;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 4px;
            transition: background 0.3s, box-shadow 0.3s;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            color: #2c3e50;
          }
          .author { font-size: 0.9em; color: #777; }
          pre {
            background: #f4f4f4;
            padding: 10px;
            overflow-x: auto;
            border-radius: 4px;
          }
          code {
            background: #f4f4f4;
            padding: 2px 4px;
            font-family: monospace;
            border-radius: 3px;
          }
          a { color: #2980b9; text-decoration: none; }
          a:hover { text-decoration: underline; }
          /* Floating "Go to Menu" button */
          #goToMenu {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #2980b9;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 1000;
          }
          /* Toggle dark/light mode button (in header) */
          #toggleMode {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.5em;
            transition: color 0.3s;
          }
          /* Dark mode styles */
          body.dark-mode {
            background: #121212;
            color: #ccc;
          }
          .container.dark-mode {
            background: #1e1e1e;
            box-shadow: 0 2px 10px rgba(255,255,255,0.1);
          }
          .container.dark-mode h1,
          .container.dark-mode h2,
          .container.dark-mode h3,
          .container.dark-mode h4,
          .container.dark-mode h5,
          .container.dark-mode h6 {
            color: #fff;
          }
          body.dark-mode pre,
          body.dark-mode code {
            background: #1e1e1e !important;
            color: #dcdcdc !important;
            border: 1px solid #444;
          }
          body.dark-mode a { color: #4fc3f7; }
          #toggleMode.dark-mode { color: #f9f9f9; }
          /* Dark mode TOC styling */
          body.dark-mode #toc {
            background: #333;
            border-color: #555;
            color: #dcdcdc;
          }
          body.dark-mode #toc a { color: #4fc3f7; }
          /* TOC (menu) styling (light mode) */
          #toc {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            background: #f0f0f0;
            border-radius: 4px;
          }
          #toc h2 { margin-top: 0; }
          #toc a { color: #2980b9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>Design Patterns in TypeScript</h1>
              <div class="author">Gabriel Ortega, Software Engineer</div>
            </div>
            <button id="toggleMode" title="Toggle Dark/Light Mode">🌙</button>
          </div>
          ${htmlContent}
        </div>
        <!-- Floating "Go to Menu" Button -->
        <button id="goToMenu" title="Go to Menu">☰</button>
        <!-- Load Highlight.js -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
        <script>
          // Initialize syntax highlighting
          hljs.highlightAll();
          // Toggle dark/light mode
          const toggleButton = document.getElementById('toggleMode');
          toggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            document.querySelector('.container').classList.toggle('dark-mode');
            toggleButton.classList.toggle('dark-mode');
            // Update toggle icon based on mode.
            if (document.body.classList.contains('dark-mode')) {
              toggleButton.textContent = '☀️';
            } else {
              toggleButton.textContent = '🌙';
            }
          });
          // "Go to Menu" button: scroll to the TOC (if present)
          const goToMenuButton = document.getElementById('goToMenu');
          goToMenuButton.addEventListener('click', () => {
            const toc = document.getElementById('toc');
            if (toc) {
              toc.scrollIntoView({ behavior: 'smooth' });
            }
          });
        </script>
      </body>
      </html>
    `;

    res.send(fullHtml);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
