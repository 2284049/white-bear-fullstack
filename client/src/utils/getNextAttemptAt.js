import addDate from "date-fns/add";
import formatDate from "date-fns/format";

export default (level, lastAttemptAt) => {
   const levelDuration = {
      1: { minutes: 10 },
      2: { hours: 3 },
      3: { days: 1 },
      4: { days: 3 },
      5: { weeks: 1 },
      6: { weeks: 2 },
      7: { weeks: 5 },
      8: { weeks: 20 },
      9: { years: 1 },
      10: { years: 2 },
      11: { years: 4 },
      12: { years: 8 },
   };
   // to calculate the next attempt at time, we take the last attempt time
   // and we add time to it based on the level
   // addDate() will give us a string
   const nextAttemptAt = addDate(lastAttemptAt, levelDuration[level]);
   // we need to convert this string to milliseconds past the epoch
   // we can use the date fns library formatDate function
   const timestamp = Number(formatDate(nextAttemptAt, "T"));
   // formateDate() needs 2 arguments: date & the format
   // T = timestamp
   // go to date-fns.org and look at their formats for other formats
   // formatDate() returns it as a string, we need to convert it to a number
   return timestamp;
};

// times are based on the "forgetting curve"
// we are using business logic to figure out when they should see that card again
// We are using the Date FNS library to format dates
// Date FNS had an "add" function
