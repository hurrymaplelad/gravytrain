/**
 * Setup and orchestrate the Gravy Train.
 */
define([
  'wrap!underscore',
  'wrap!backbone',
  'gravy/models/PickupQueue',
  'gravy/models/PickupDayIterator',
  'gravy/services/DistanceMatrix',
  'gravy/services/Menus',
  'gravy/views/App',
  'gravy/views/DaysList'
], function(
  _,
  Backbone,
  PickupQueue,
  PickupDayIterator,
  DistanceMatrix,
  Menus,
  App,
  DaysList
) {

  return {
    //
    // SETTINGS
    //
    /**
     * Number of days to show initially,
     * and add when more are requested.
     * TODO: also cap vendors in case we get a
     *       full day.
     */
    PAGE_SIZE: 10,

    start: function() {
      //
      // MODELS
      //
      this.maxDistance = Infinity, // meters
      this.visibleDays = new Backbone.Collection(),
      this.allSchedules = [],
      this.pickupQueue = new PickupQueue(),
      this.dayIterator = new PickupDayIterator({
        pickupQueue: this.pickupQueue
      }),

      //
      // VIEWS
      //
      this.appView = new App();
      this.daysList = new DaysList({
        collection: this.visibleDays
      });

      // wire up actors
      this.visibleDays.on(
        'reset',
        this.daysList.render,
        this.daysList
      );
      this.appView.on(
        'distanceChanged',
        this.setMaxDistance,
        this
      );
      this.appView.on(
        'moreRequested',
        this.showMore,
        this
      );

      // start loading
      Menus.load(_.bind(function(schedules) {
        this.allSchedules = schedules;
        DistanceMatrix.loadDistances(schedules, _.bind(function(success) {

          // disable distance selections if load failed
          this.appView.distanceEnabled = success;
          this.appView.render();
          // TODO: this is clunky.  Instead, render appView early
          //       but don't add it to the doc.  Instantiate
          //       daysList as a sub-view.
          this.daysList.setElement(this.appView.$('.pickupDays'));
          this.showSchedules(schedules);
        }, this));
      }, this));
    },

    //
    // COMMANDS
    //
    setMaxDistance: function(value) {
      // guard against spurious updates,
      // such as changing selector from "choose distance"
      // to "infinite".
      if (this.maxDistance === value) {
        return;
      }
      this.maxDistance = value;

      this.resetSchedules();
      this.showSchedules(
        this.filterSchedules(value)
      );
    },

    /**
     * Rewind all the schedules so we can iterate them again.
     */
    resetSchedules: function() {
      _(this.allSchedules).each(function(schedule) {
        schedule.reset();
      });
    },

    /**
     * Lazy user doesn't want to walk more than maxMeters.
     * Remove schedules that don't accomodate.  Deliveries
     * are OK.
     */
    filterSchedules: function(maxMeters) {
      return _(this.allSchedules).filter(function(schedule)  {
        var location = schedule.get('location');

        // always include deliveries
        if (schedule.isDelivery()) {
          return true;
        } else if (location.distance) {
          return location.distance.value <= maxMeters;
        } else {
          return false;
        }
      });
    },

    /**
     * Returns the next page sized array of PickupDays.
     */
    getPage: function() {
      return _.range(this.PAGE_SIZE).map(function() {
        return this.dayIterator.next();
      }, this);
    },

    /**
     * Replaces any visible days with the first page of
     * days from the given schedules.
     */
    showSchedules: function(schedules) {
      // put the first pickup from each schedule into
      // an empty queue.
      this.pickupQueue.seed(_(schedules).map(function(schedule) {
        return schedule.nextPickup();
      }));

      // add the first page of days to the list
      this.visibleDays.reset(this.getPage());
    },

    /**
     * Gluttonous user wants to see more pickup days.
     * Show them another page.
     */
    showMore: function() {
      // append a page of days
      this.visibleDays.reset(
        this.visibleDays.models.concat(this.getPage())
      );
    }
  };
});
