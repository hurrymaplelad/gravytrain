/**
 * Aggregates all the Vendors with pickups on a single day.
 */
define([
  'wrap!underscore',
  'wrap!backbone'
], function(
  _,
  Backbone
) {
  return Backbone.Model.extend({

    initialize: function() {
      // maps vendor ids to list of Pickups this day
      this.vendorPickups = {};
    },

    addPickup: function(pickup) {
      var vendor = pickup.get('schedule').get('vendor'),
          id = vendor._id,
          pickups;

      if (this.vendorPickups.hasOwnProperty(id)) {
        this.vendorPickups[id].push(pickup);
      } else {
        this.vendorPickups[id] = [pickup];
      }
    },

    listVendors: function() {
      return _.chain(
        this.vendorPickups
      ).values(
      ).map(
        _.first
      ).map(function(pickup) {
        return pickup.get('schedule').get('vendor');
      }).sortBy(
        'name'
      ).value();
    }
  });
});
