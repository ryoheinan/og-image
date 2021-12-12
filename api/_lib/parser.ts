import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { fontSize, marginTop, textColor, md, background } = query || {};

    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }
    if (Array.isArray(marginTop)) {
        throw new Error('Expected a single fontSize');
    }
    if (Array.isArray(textColor)) {
        throw new Error('Expected a single textColor');
    }
    if (Array.isArray(background)) {
        throw new Error('Expected a single background');
    }

    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        textColor: textColor ? decodeURIComponent(textColor) : '#000000',
        md: md === '1' || md === 'true',
        fontSize: fontSize || '96px',
        marginTop: marginTop ? decodeURIComponent(marginTop) : 'center',
        background: background ? decodeURIComponent(background) : undefined,
    };
    return parsedRequest;
}
