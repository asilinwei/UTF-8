function utf8Encode(text) {
  "use strict";
  
  if (text === undefined) {
    return '';
  }
  var chars = String(text).match(/[\s\S]/gu) || [],
      length = chars.length,
      fromCodePoint = String.fromCodePoint,
      result = [];

  for (var i = 0; i < length; i += 1) {
    var code = chars[i].codePointAt(0);
    if (code <= 0x007f) {
      result.push(fromCodePoint(code));
    } else if (code <= 0x07ff) {
      result.push(fromCodePoint(0xc0 | (code >> 6)), fromCodePoint(0x80 | (code & 0x3f)));
    } else if (code <= 0xffff) {
      if (code >= 0xd800 && code <= 0xdfff) {
        throw new Error('U+' + code.toString(16).toUpperCase() + ' is not a Unicode Scalar Value');
      }
      result.push(fromCodePoint(0xe0 | (code >> 12)), fromCodePoint(0x80 | ((code >> 6) & 0x3f)), fromCodePoint(0x80 | (code & 0x3f)));
    } else {
      result.push(fromCodePoint(0xf0 | (code >> 18)), fromCodePoint(0x80 | ((code >> 12) & 0x3f)), fromCodePoint(0x80 | ((code >> 6) & 0x3f)), fromCodePoint(0x80 | (code & 0x3f)));
    }
  } 
  return result.join('');   
}

