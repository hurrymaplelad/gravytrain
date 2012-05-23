/**
 * Groups the merged stream of pickups by day.
 * Exposes an iterator interface to walk the
 * grouped days.
 */
define([
  'wrap!backbone',
  'gravy/models/PickupDay'
], function(
  Backbone,
  PickupDay
) {
  return Backbone.Model.extend({

    initialize: function() {
      this.pickupQueue = this.get('pickupQueue');
    },

    next: function() {
      var pickup = this.pickupQueue.pop(),
          date = pickup.get('date'),
          day = new PickupDay({
            date: date
          });

      do {
        day.addPickup(pickup);
        pickup = this.pickupQueue.pop();
      } while (pickup && this.sameDay(date, pickup.get('date')));

      // put back the first pickup of the next day
      if (pickup) {
        this.pickupQueue.push(pickup);
      }
      return day;
    },

    hasNext: function() {
      return !this.pickupQueue.isEmpty();
    },

    sameDay: function(date1, date2) {
     return (
       date1.getDate() === date2.getDate() &&
       date1.getMonth() === date2.getMonth() &&
       date1.getFullYear() === date2.getFullYear()
     );
    }
  });
});
