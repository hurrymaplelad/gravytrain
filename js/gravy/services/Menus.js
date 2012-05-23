/**
 * Loads Vendor pickup schedules from GoodEggs'
 * menu API.
 */
define([
  'wrap!zepto',
  'wrap!underscore',
  'gravy/models/PickupSchedule'
], function(
  $,
  _,
  PickupSchedule
) {

  return {
    /**
     * Loads menu JSON and transforms it into an
     * array of PickupSchedules.
     *
     */
    load: function(callback) {
      $.ajaxJSONP({
        url: 'http://www.goodeggs.com/menus?callback=?',
        success: _.bind(function(data) {
          callback(this._extractPickups(data));
        }, this),

        // placeholder to appease https://github.com/madrobby/zepto/issues/476
        complete: function() {}
      }
      );
    },


    /**
     * Transforms list of menus into list of pickups,
     * copying attributes from menus to their associated
     * pickups.
     *
     * We're working with JSON data here, not Backbone models.
     */
    _extractPickups: function(menus) {
      var pickups = [];

      _.each(menus, function(menu) {
        var mixins = {
          products: menu.products,
          vendor: menu.vendor
        };
        _.each(menu.pickups, function(pickup) {
          pickups.push(
            _.extend(pickup, mixins)
          );
        });
      });

      // Instantiate schedule models and
      // filter out invalid schedules.
      // TODO: log invalids?
      return _(pickups).map(function(pickup) {
        return new PickupSchedule(pickup);
      }).filter(function(schedule) {
        return schedule.isValid();
      });
    }
  };
});
