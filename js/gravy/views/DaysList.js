define([
  'wrap!zepto',
  'wrap!underscore',
  'wrap!backbone',
  'wrap!handlebars',
  'moment',
  'text!gravy/templates/daysList.html'
], function(
  $,
  _,
  Backbone,
  Handlebars,
  moment,
  template
) {
  return Backbone.View.extend({

    template: Handlebars.compile(template),

    dayClasses: ['a', 'b', 'c', 'd', 'e'],

    render: function() {
      var context = {
        days: this.collection.map(function(day, index) {
          return {
            date: moment(day.get('date')).calendar(),
            vendors: day.listVendors(),
            cycle: this.dayClasses[index % this.dayClasses.length]
          };
        }, this)
      };
      this.$el.html(this.template(context));
    }
  });
});
