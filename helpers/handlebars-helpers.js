const { format, isValid, parseISO } = require('date-fns');

module.exports = {
  formatDate: (date, formatStr = "MM/dd/yyyy") => { // Added a default format string for cases where formatStr is not provided
    //console.log("Date passed to formatDate:", date); // Log every date passed into the function
    //console.log("Format string passed to formatDate:", formatStr);
    
  // Ensure formatStr is a string
  if (typeof formatStr !== 'string') {
    //console.warn('formatStr is not a string, using default "MM/dd/yyyy"');
    formatStr = "MM/dd/yyyy";
  }


    // Parse the date string into a Date object if it's a string
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    // Check if the date is valid before formatting
    if (!isValid(dateObj)) {
      console.warn('Invalid date passed to formatDate:', date);
      return 'Invalid date'; // Or return the unformatted date or an empty string as you prefer
    }
    
    return format(dateObj, formatStr);
  },
  // You can add other helper functions here as well
};
