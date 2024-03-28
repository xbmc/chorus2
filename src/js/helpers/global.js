/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Our generic global helpers so we dont have add complexity to our app.
*/
helpers.global = {};


//# Shuffle an array.
helpers.global.shuffle = function(array) {
  let i = array.length - 1;
  while (i > 0) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    i--;
  }
  return array;
};


//# Get a random number within a range.
helpers.global.getRandomInt = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;


//# Get a timestamp in seconds
helpers.global.time = function() {
  const timestamp = new Date().getTime();
  return timestamp / 1000;
};


//# Boolean check for a needle in a haystack (like php in_array)
helpers.global.inArray = (needle, haystack) => _.indexOf(haystack, needle) > -1;


//# Set loading state
helpers.global.loading = (state = 'start') => {
  const op = state === 'start' ? 'add' : 'remove';
  if (this.Kodi != null) {
    return this.Kodi.execute("body:state", op, "loading");
  }
};


//# Format a number with the desired number of leading zeros
helpers.global.numPad = function(num, size) {
  const s = "000000000" + num;
  return s.substr(s.length - size);
};


//# Convert seconds to time
helpers.global.secToTime = function(totalSec = 0) {
  totalSec = Math.round(totalSec);
  const hours = parseInt(totalSec / 3600) % 24;
  const minutes = parseInt(totalSec / 60) % 60;
  const seconds = totalSec % 60;
  return {
    hours,
    minutes,
    seconds
  };
};


//# Convert time to seconds
helpers.global.timeToSec = function(time) {
  const hours = parseInt(time.hours) * (60 * 60);
  const minutes = parseInt(time.minutes) * 60;
  return parseInt(hours) + parseInt(minutes) + parseInt(time.seconds);
};


//# Convert EPG time to JS date
helpers.global.dateStringToObj = function(datetime) {
  if (!datetime) {
    return new Date(0); // Will equal start of epoch?
  } else {
    //# This will add the offset which should make the time correct as the EPG date time is UTC
    return new Date(datetime.replace(" ","T"));
  }
};

//# format a nowplaying time object for display
helpers.global.formatTime = function(time) {
  if ((time == null)) {
    return 0;
  } else {
    // Format time to hh:mm:ss or mm:ss
    let hrStr = "";
    if (time.hours > 0) {
      if (time.hours < 10) { hrStr = "0"; }
      hrStr += time.hours + ':';
    }
    return hrStr + (time.minutes<10 ? '0' : '') + time.minutes + ':' + (time.seconds<10 ? '0' : '') + time.seconds;
  }
};


//# Basic helper that returns a new object with a key/value set
helpers.global.paramObj = function(key, value) {
  const obj = {};
  obj[key] = value;
  return obj;
};


//# Escape a RegEx
helpers.global.regExpEscape = str => str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");


//# Check if a string starts with a given string
helpers.global.stringStartsWith = (start, data) => new RegExp('^' + helpers.global.regExpEscape(start)).test(data);


//# Strip a string from the beginning of another string
helpers.global.stringStripStartsWith = (start, data) => data.substring(start.length);


//# Turn an array of strings into a collective sentence.
//# eg. ['foo', 'bar', 'other'] = 'foo, bar and other'
//# Pluralise = 'foos, bars and others'
//# Returns HTML
helpers.global.arrayToSentence = function(arr, pluralise = true) {
  let str = '';
  const prefix = pluralise ? 's' : '';
  const last = arr.pop();
  if (arr.length > 0) {
    for (var i in arr) {
      var item = arr[i];
      str += '<strong>' + _.escape(item + prefix) + '</strong>';
      str += parseInt(i) !== (arr.length - 1) ? ', ' : '';
    }
    str += ' ' + t.gettext('and') + ' ';
  }
  return str += '<strong>' + _.escape(last + prefix) + '</strong>';
};


// Encode/Decode a string which is typically a file path that we want to use
// as an id and for classes. Url encoded file paths as classes break Sizzle.
helpers.global.hashEncode = value => Base64.encode(value);
helpers.global.hashDecode = value => Base64.decode(value);


//# Round the rating
helpers.global.rating = rating => Math.round(rating * 10) / 10;


//# Set the title
helpers.global.appTitle = function(playingItem = false) {
  let titlePrefix = '';
  if (_.isObject(playingItem) && (playingItem.label != null)) {
    titlePrefix = '▶ ' + playingItem.label + ' | ';
  }
  return document.title = titlePrefix + config.get('static', 'appTitle');
};

//# Open the local video player window
helpers.global.localVideoPopup = (path, height = 590) => window.open(path, "_blank", `toolbar=no, scrollbars=no, resizable=yes, width=925, height=${height}, top=100, left=100`);

//# Strip tags from a string
helpers.global.stripTags = function(string) {
  if (string != null) {
    return string.replace(/(<([^>]+)>)/ig,"");
  } else {
    return '';
  }
};

//# Round to decimal places.
helpers.global.round = (x, places = 0) => parseFloat(x.toFixed(places));

//# Given a position and total, return percent to 2 decimal places
helpers.global.getPercent = (pos, total, places = 2) => Math.floor((pos / total) * (100 * Math.pow(10, places))) / 100;

//# Trigger save dialog to save a text file
helpers.global.saveFileText = function(content, filename = 'untitled.txt') {
  try {
    const isFileSaverSupported = !!new Blob;
    if (isFileSaverSupported) {
      content = content.replace(String.fromCharCode(65279), "" );
      const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
      return saveAs(blob, filename, true);
    }
  } catch (error) {
    return Kodi.execute("notification:show", tr('Saving is not supported by your browser'));
  }
};

helpers.global.removeBBCode = string => string.replace(/\[\/?(?:b|i|u|s|left|center|right|quote|code|list|img|spoil|color).*?\]/ig, '');
