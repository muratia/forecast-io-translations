function join_with_shared_prefix(a, b, joiner) {
  var m = a,
      i = 0,
      j;

  /* HACK: This gets around "today through on Tuesday" or cases like it, which
   * are incorrect in English. */
  if(m === "today" || m === "tomorrow")
    m = "on " + m;

  while(i !== m.length &&
        i !== b.length &&
        m.charCodeAt(i) === b.charCodeAt(i))
    ++i;

  while(i && m.charCodeAt(i - 1) !== 32)
    --i;

  return a + joiner + b.slice(i);
}

function strip_prefix(period) {
  return period.slice(0, 9) === "gjatë natës" ? period.slice(4) :
         period.slice(0, 7) ===   "në " ? period.slice(7) :
                                              period;
}

module.exports = require("../template")({
  "clear": "pastër",
  "no-precipitation": "pa reshje",
  "mixed-precipitation": "reshje e përzier",
  "possible-very-light-precipitation": "reshje e lehtë e mundshme",
  "very-light-precipitation": "reshje shumë e lehtë",
  "possible-light-precipitation": "reshje e lehtë e mundshme",
  "light-precipitation": "reshje e lehtë",
  "medium-precipitation": "reshje",
  "heavy-precipitation": "reshje e rëndë",
  "possible-very-light-rain": "rigë e mundshme",
  "very-light-rain": "po rigon",
  "possible-light-rain": "shi i lehtë i mundshëm",
  "light-rain": "shi i lehtë",
  "medium-rain": "shi",
  "heavy-rain": "shi i lehtë",
  "possible-very-light-sleet": "miellazë e mundshme shumë e lehtë",
  "very-light-sleet": "miellazë shumë e lehtë",
  "possible-light-sleet": "miellazë e mundshme e lehtë",
  "light-sleet": "miellazë e lehtë",
  "medium-sleet": "miellazë",
  "heavy-sleet": "miellazë e rëndë",
  "possible-very-light-snow": "fluska bore të mundshme",
  "very-light-snow": "fluska",
  "possible-light-snow": "borë e lehtë e mundshme",
  "light-snow": "borë e lehtë",
  "medium-snow": "borë",
  "heavy-snow": "borë e rëndë",
  "light-wind": "puhi e lehtë",
  "medium-wind": "me erë",
  "heavy-wind": "rrezikshëm me erë",
  "low-humidity": "thatë",
  "high-humidity": "lagështi",
  "fog": "mjegull",
  "light-clouds": "pjesërisht me re",
  "medium-clouds": "kryesisht me re",
  "heavy-clouds": "qiell i vërenjtur",
  "today-morning": "këtë mëngjes",
  "later-today-morning": "më vonë në këtë mëngjes",
  "today-afternoon": "këtë pasdite",
  "later-today-afternoon": "më vonë në këtë pasdite",
  "today-evening": "këtë mbrëmje",
  "later-today-evening": "më vonë në këtë mbrëmje",
  "today-night": "sonte",
  "later-today-night": "më vonë sonte",
  "tomorrow-morning": "nesër në mëngjes",
  "tomorrow-afternoon": "nesër pasdite",
  "tomorrow-evening": "nesër në mbrëmje",
  "tomorrow-night": "nesër natën",
  "morning": "në këtë mëngjes",
  "afternoon": "në pasdite",
  "evening": "në mbrëmje",
  "night": "brenda natës",
  "today": "sot",
  "tomorrow": "nesër",
  "sunday": "të dielën",
  "monday": "të hënën",
  "tuesday": "të martën",
  "wednesday": "të mërkurën",
  "thursday": "të enjten",
  "friday": "të premten",
  "saturday": "të shtunën",
  "minutes": "$1 min.",
  "fahrenheit": "$1\u00B0F",
  "celsius": "$1\u00B0C",
  "inches": "$1 in.",
  "centimeters": "$1 cm.",
  "less-than": "nën $1",
  "dhe": function(a, b) {
    return join_with_shared_prefix(
      a,
      b,
      a.indexOf(",") !== -1 ? ", and " : " and "
    );
  },
  "through": function(a, b) {
    return join_with_shared_prefix(a, b, " through ");
  },
  "with": "$1, me $2",
  "range": "$1\u2013$2",
  "parenthetical": function(a, b) {
    return a + " (" + b + (a === "reshje e përzier" ? " e borës)" : ")");
  },
  "for-hour": "$1 për orën",
  "starting-in": "$1 duke niur në $2",
  "stopping-in": "$1 duke ndalur në $2",
  "starting-then-stopping-later": "$1 duke nisur në $2, duke u ndalur $3 më vonë",
  "stopping-then-starting-later": "$1 duke u ndalur në $2, duke nisur përsëri $3 më vonë",
  "for-day": "$1 përgjatë ditës",
  "starting": "$1 duke filluar $2",
  "until": function(condition, period) {
    return condition + " deri " + strip_prefix(period);
  },
  "until-starting-again": function(condition, a, b) {
    return condition + " deri " + strip_prefix(a) + ", starting again " + b;
  },
  "starting-continuing-until": function(condition, a, b) {
    return condition + " duke nisur " + a + ", dhe duke vazhduar deri " +
           strip_prefix(b);
  },
  "during": "$1 $2",
  "for-week": "$1 përgjatë the week",
  "over-weekend": "$1 përgjatë fundjavës",
  "temperatures-peaking": "temperaturat maksimumin e arrijnë $1 $2",
  "temperatures-rising": "temperaturat duke u rritur $1 $2",
  "temperatures-valleying": "temperaturat duke rënë më poshtë te $1 $2",
  "temperatures-falling": "temperaturat duke rënë te $1 $2",
  /* Capitalize the first letter of every word, except if that word is
   * "and". (This is a very crude bastardization of proper English titling
   * rules, but it is adequate for the purposes of this module.) */
  "title": function(str) {
    return str.replace(
      /\b(?:a(?!nd\b)|c(?!m\.)|i(?!n\.)|[^\Waci])/g,
      function(letter) {
        return letter.toUpperCase();
      }
    );
  },
  /* Capitalize the first word of the sentence and end with a period. */
  "sentence": function(str) {
    /* Capitalize. */
    str = str.charAt(0).toUpperCase() + str.slice(1);

    /* Add a period if there isn't already one. */
    if(str.charAt(str.length - 1) !== ".")
      str += ".";

    return str;
  }
});
