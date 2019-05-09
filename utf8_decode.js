var utf8Decode = (function() {
  "use strict";

  var index,
      length;

  var nextByte = function(text) {
    if (!text[index]) {
      throw new Error('Invalid UTF-8 sequence');
    }
    var codePoint = text[index++].codePointAt(0) & 0xFF;
    if ((codePoint & 0xC0) === 0x80) {
      return codePoint & 0x3F;
    }
    throw new Error('Invalid UTF-8 sequence');
  };    

  var baseDecode = function(text) {
    var codePoint,
        byte1,
        byte2,
        byte3,
        byte4;  
 
    if (!text[index]) {
      return false;
    }
    byte1 = text[index++].codePointAt(0) & 0xFF;
    if ((byte1 & 0x80) === 0) {
      codePoint = byte1 & 0x7F;
      if (codePoint >= 0 && codePoint <= 0x7F) {
        return String.fromCodePoint(codePoint);
      }
      throw new Error('Invalid UTF-8 sequence');
    }    
    if ((byte1 & 0xE0) === 0xC0) {
      byte2 = nextByte(text);
      codePoint = ((byte1 & 0x1F) << 6) | byte2;
      if (codePoint >= 0x80 && codePoint <= 0x7FF) {
        return String.fromCodePoint(codePoint);
      }
      throw new Error('Invalid UTF-8 sequence');
    }
    if ((byte1 & 0xF0) === 0xE0) {
      byte2 = nextByte(text);
      byte3 = nextByte(text);
      codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
      if (codePoint >= 0x800 && codePoint <= 0xFFFF) {
        return String.fromCodePoint(codePoint);
      }
      throw new Error('Invalid UTF-8 sequence');
    }
    if ((byte1 & 0xF8) === 0xF0) {
      byte2 = nextByte(text);
      byte3 = nextByte(text);
      byte4 = nextByte(text);
      codePoint = ((byte1 & 0x07) << 18) | (byte2 << 12) | (byte3 << 6) | byte4;
      if (codePoint >= 0x10000 && codePoint <= 0x10FFFF) {
        return String.fromCodePoint(codePoint);
      }
      throw new Error('Invalid UTF-8 sequence');
    }
    throw new Error('Invalid UTF-8 sequence');
  };

  return function(text) {
    if (text === undefined || typeof text === 'string' && !text.length) {
      return '';
    }
    text = String(text);
    var result = [],
        char;

    index = 0;
    length = text.length;
    while (char = baseDecode(text)) {
      result.push(char);
    }
    return result.join('');
  };
})();

