import { readFileSync } from 'fs';
import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(
    `${__dirname}/../_fonts/NotoSansJP-Regular.woff2`
).toString('base64');
const bold = readFileSync(
    `${__dirname}/../_fonts/NotoSansJP-Bold.woff2`
).toString('base64');

function getCss(
    theme: string,
    fontSize: string,
    background: string | undefined
) {
    let foreground = 'black';

    if (theme === 'dark') {
        foreground = 'white';
    }
    return `
    @font-face {
        font-family: 'NotoSansJP';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'NotoSansJP';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    body {
        ${
            background
                ? `
          background-image: url('${background}');
          background-position: center;
          background-size: cover;
        `
                : ''
        }
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'NotoSansJP', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, background } = parsedReq;
    marked.setOptions({
        gfm: true,
        breaks: true,
    });

    // Compile
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize, background)}
    </style>
    <body>
        <div>
            <div class="heading">${emojify(
                md ? marked.parse(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`;
}
