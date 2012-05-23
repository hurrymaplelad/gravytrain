/**
 * Merges the pickup streams of many schedules with
 * a priority queue.  Whenever we pop a pickup,
 * we enqueue the next pickup from the stream
 * it came from.
 *
 * Must be seeded before popping.
 */
define([
  'wrap!underscore',
  'wrap!backbone',
  'wrap!STRd6/PriorityQueue'
], function(
  _,
  Backbone,
  PriorityQueue
) {
  var PickupQueue = function() {
  };
  _.extend(PickupQueue.prototype, {

    /**
     * Add the first pickup from each schedule to an empty queue.
     */
    seed: function(pickups) {
      // empty the priority queue
      this.priorityQueue = new PriorityQueue({low: true});
      _(pickups).each(this.push, this);
    },

    push: function(pickup) {
      this.priorityQueue.push(pickup, pickup.get('date').getTime());
    },

    pop: function() {
      var pickup = this.priorityQueue.pop(),
          schedule = pickup.get('schedule');

      if (schedule.hasNext()) {
        this.push(schedule.nextPickup());
      }
      return pickup;
    },

    isEmpty: function() {
      return this.priorityQueue.empty();
    }
  });

  return PickupQueue;
});
