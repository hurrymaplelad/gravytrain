define([
  'wrap!zepto',
  'wrap!underscore',
  'wrap!backbone',
  'wrap!handlebars',
  'moment',
  'text!gravy/templates/app.html'
], function(
  $,
  _,
  Backbone,
  Handlebars,
  moment,
  template
) {
  // Customize moment.js formatting to exclude time.
  moment.calendar = {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    lastWeek: '[last] dddd',
    nextWeek: 'dddd',
    sameElse: 'L'
  };

  return Backbone.View.extend({

    el: $('.app'),

    /**
     * Distance filtering options are disabled if false.
     */
    distanceEnabled: true,

    events: {
      'change #distance': 'distanceChanged',
      'click #moreButton': 'moreClicked'
    },

    template: Handlebars.compile(template),

    render: function() {
      var context = {
        distanceEnabled: this.distanceEnabled
      };
      this.$el.html(this.template(context));
    },

    distanceChanged: function(event) {
      this.trigger('distanceChanged', Number(event.target.value));
    },

    moreClicked: function(event) {
      this.trigger('moreRequested');
    }
  });
});
