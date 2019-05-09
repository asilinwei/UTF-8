var utf8Decode = (function() {
  "use strict";

  var index,
      length;

  var nextByte = function(text) {
    index += 1;
    if (!text[index]) {
      throw new Error('Invalid UTF-8 sequence');
    }
    var codePoint = text[index].codePointAt(0) & 0xFF;
    if ((codePoint & 0xC0) === 0x80) {
      return codePoint & 0x3F;
    }
    throw new Error('Invalid UTF-8 sequence');
  };    

  var baseDecode = function(text) {
    var codePoint,
        byte1 = text.codePointAt(0) & 0xFF,
        byte2,
        byte3,
        byte4;  

    if ((byte1 & 0x80) === 0) {
      return String.fromCodePoint(byte1 & 0x7F);
    }    
    if ((byte1 & 0xE0) === 0xC0) {
      byte2 = nextByte(text);
      return String.fromCodePoint(((byte1 & 0x1F) << 6) | byte2);
    }
    if ((byte1 & 0xF0) === 0xE0) {
      byte2 = nextByte(text);
      byte3 = nextByte(text);
      return String.fromCodePoint(((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3);
    }
    if ((byte1 & 0xF8) === 0xF0) {
      byte2 = nextByte(text);
      byte3 = nextByte(text);
      byte4 = nextByte(text);
      return String.fromCodePoint(((byte1 & 0x07) << 18) | (byte2 << 12) | (byte3 << 6) | byte4);
    }
    throw new Error('Invalid UTF-8 sequence');
  };

  return function(text) {
    if (text === undefined || typeof text === 'string' && !text.length) {
      return '';
    }
    text = String(text);
    if (text.length > 4) {
      throw new Error('Only support decode the UTF-8 sequence to a character');
    }
    index = 0;
    length = text.length;
    return baseDecode(text);
  };
})();

