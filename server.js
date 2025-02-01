const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();

// Custom renderer to generate header IDs safely.
// We convert both raw and text to strings so that string methods work properly.
const renderer = new marked.Renderer();
renderer.heading = function (text, level, raw, slugger) {
  // Use raw if available and a string; otherwise, use text.
  const base = typeof raw === 'string' ? raw : String(text);
  // Generate a slug: use the slugger if available; otherwise, a simple conversion.
  const slug = slugger
    ? slugger.slug(String(base))
    : String(base).toLowerCase().replace(/\W+/g, '-').replace(/^-|-$/g, '');
  return `<h${level} id="${slug}">${String(text)}</h${level}>`;
};

app.get('/', (req, res) => {
  const mdFilePath = path.join(__dirname, 'README.md');

  fs.readFile(mdFilePath, 'utf8', (err, markdownData) => {
    if (err) {
      console.error('Error reading Markdown file:', err);
      return res
        .status(500)
        .send('Internal Server Error: Could not read Markdown file.');
    }

    // Convert the Markdown file to HTML using our custom renderer.
    let htmlContent = marked.parse(markdownData, { renderer });

    // Remove any stray "[object Object]" strings that might have crept in.
    htmlContent = htmlContent.replace(/\[object Object\]/g, '');

    // Build the full HTML template.
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Design Patterns in TypeScript - Gabriel Ortega, Software Engineer</title>
        <!-- Google Fonts for modern typography -->
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" rel="stylesheet" />
        <!-- Highlight.js CSS for code block styling -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css">
        <style>
          /* Smooth scrolling for in-page anchor links */
          html {
            scroll-behavior: smooth;
          }
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
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
          .author {
            font-size: 0.9em;
            color: #777;
          }
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
          a {
            color: #2980b9;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
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
            box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
          }
          /* Headings in dark mode */
          .container.dark-mode h1,
          .container.dark-mode h2,
          .container.dark-mode h3,
          .container.dark-mode h4,
          .container.dark-mode h5,
          .container.dark-mode h6 {
            color: #fff;
          }
          /* Code block contrast in dark mode */
          body.dark-mode pre {
            background: #1e1e1e !important;
            color: #f8f8f2 !important;
          }
          body.dark-mode code {
            background: #1e1e1e !important;
            color: #f8f8f2 !important;
          }
          body.dark-mode a {
            color: #4fc3f7;
          }
          #toggleMode.dark-mode {
            color: #f9f9f9;
          }
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
        <!-- Load Highlight.js -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
        <script>
          // Initialize syntax highlighting for all code blocks.
          hljs.highlightAll();
          // Dark/light mode toggle functionality.
          const toggleButton = document.getElementById('toggleMode');
          toggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            document.querySelector('.container').classList.toggle('dark-mode');
            toggleButton.classList.toggle('dark-mode');
            // Update the toggle icon based on the mode.
            if (document.body.classList.contains('dark-mode')) {
              toggleButton.textContent = '☀️';
            } else {
              toggleButton.textContent = '🌙';
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
