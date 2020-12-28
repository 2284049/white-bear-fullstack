function checkIsOver(str, num) {
   if (str.length > num) return true;
   else return false;
}

function safelyParseJson(value) {
   try {
      // try do this first (try to parse the value)
      JSON.parse(value);
   } catch {
      // if error, return the value back unparsed
      return value;
   }
   // if we tried it and it worked, do more
   return JSON.parse(value);
}

const MAX_CARD_CHARS = 240;

const defaultLevel = 1;

export { checkIsOver, MAX_CARD_CHARS, safelyParseJson, defaultLevel };
