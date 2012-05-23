/**
 * An infinite stream of Dates generated from an RRULE.
 * Built on an iCal library burried in a demo in a branch
 * of an obscure Google project:
 * http://code.google.com/p/google-caja/source/browse/branches/no-namespaces/src/com/google/caja/demos/calendar/
 */
define([
  'wrap!underscore',
  'wrap!backbone',
  'wrap!cajita/rrule',
  'wrap!cajita/time',
  'wrap!cajita/timezone'
], function(
  _,
  Backbone,
  rrule,
  time,
  timezone
) {

  /**
   * Wraps RRULE in the interface expected by cajita/rrule.
   *
   * Derived from rrule_test StubContentLine.
   */
  var RRuleAdapter = function(rule) {
    _.each(rule, function(value, key) {
      this[key] = value.split(',');
    }, this);
  }
  RRuleAdapter.prototype.getAttribute = function(k) {
    return this.hasOwnProperty(k) ? this[k].slice(0) : null;
  }


  var DateStream = function(rule, startDate) {
    this.startDate = startDate;
    this.iterator = rrule.createRecurrenceIterator(
      new RRuleAdapter(rule),
      this.toCajitaDate(startDate),
      timezone.utc
    );
  }
  _.extend(DateStream.prototype, {

    next: function() {
      var date = this.iterator.next();
      return this.toJsDate(date);
    },

    toJsDate: function(cajitaDate) {
      var jsDate = new Date();
      jsDate.setUTCFullYear(time.year(cajitaDate));
      jsDate.setUTCMonth(time.month(cajitaDate) - 1);
      jsDate.setUTCDate(time.day(cajitaDate));
      jsDate.setUTCHours(this.startDate.getUTCHours());
      jsDate.setUTCMinutes(this.startDate.getUTCMinutes());
      jsDate.setUTCSeconds(0);
      return jsDate;
    },

    toCajitaDate: function(jsDate) {
      return time.date(
        jsDate.getUTCFullYear(),
        jsDate.getUTCMonth() + 1,
        jsDate.getUTCDate()
      );
    }
  });

  return DateStream;
});
