/**
 * A one-time or recurring pickup for a single Vendor at a single Location.
 * Exposes methods to iterate over the pickups.
 *
 * TODO: Split into Recurring and non recurring Schedules to avoid
 *       overwritting hasNext?
 */
define([
  'wrap!underscore',
  'wrap!backbone',
  'gravy/models/Pickup',
  'gravy/models/DateStream'
], function(
  _,
  Backbone,
  Pickup,
  DateStream
) {

  return Backbone.Model.extend({
    initialize: function() {
      var rule;

      if (this.isValid()) {
        this.reset();
      }
    },

    /**
     * Returns true if a recurring pickup is scheduled or false
     * if there's only one pickup.
     */
    recurring: function() {
      return Boolean(this.dateStream);
    },

    isDelivery: function() {
      return this.get('location')['address'] === '';
    },

    validate: function() {
      if (!this.has('pickupWindow')) {
        return 'has no pickup time';
      }
    },

    nextPickup: function() {
      var date;
      if (this.recurring()) {
        date = this.dateStream.next();
      } else {
        date = this.startDate;
        this.hasNext = function() {
          return false;
        };
      }

      return new Pickup({
        date: date,
        schedule: this
      });
    },

    hasNext: function() {
      return true;
    },

    /**
     * Rewind the iterator so the next call for nextPickup()
     * will return the startDate.
     */
    reset: function() {
      delete this.hasNext;
      this.startDate = new Date(this.get('pickupWindow')['startAt']);
      rule = this.get('pickupWindow')['RRULE'];
      this.dateStream = rule ? new DateStream(rule, this.startDate) : null;
    }
  });
});
