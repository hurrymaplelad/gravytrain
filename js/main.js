/**
 * cajita stub
 */
window.cajita = { freeze: function(x) { return x; } };

require.config({
  wrapJS: {
    'backbone': {
      attach: 'Backbone',
      deps: ['wrap!underscore', 'wrap!zepto']
    },
    'underscore': {
      attach: '_'
    },
    'zepto': {
      attach: 'Zepto'
    },
    'handlebars': {
      attach: 'Handlebars'
    },

    'STRd6/PriorityQueue': {
      attach: 'PriorityQueue'
    },

    'caolan/async': {
      attach: 'async'
    },

    'cajita/time': {
      attach: 'time'
    },
    'cajita/weekday': {
      attach: 'WeekDay'
    },
    'cajita/timezone': {
      attach: 'timezone',
      deps: ['wrap!cajita/time']
    },
    'cajita/time_util': {
      attach: 'time_util',
      deps: ['wrap!cajita/time']
    },
    'cajita/generators': {
      attach: 'generators',
      deps: [
        'wrap!cajita/time',
        'wrap!cajita/time_util'
      ]
    },
    'cajita/instanceGenerators': {
      attach: 'instanceGenerators',
      deps: [
        'wrap!cajita/time',
        'wrap!cajita/time_util'
      ]
    },
    'cajita/conditions': {
      attach: 'conditions'
    },
    'cajita/predicates': {
      attach: 'predicates'
    },
    'cajita/filters': {
      attach: 'filters'
    },
    'cajita/rrule': {
      attach: 'rrule',
      deps: [
       'wrap!cajita/time',
       'wrap!cajita/generators',
       'wrap!cajita/instanceGenerators',
       'wrap!cajita/conditions',
       'wrap!cajita/predicates',
       'wrap!cajita/filters',
       'wrap!cajita/weekday'
      ]
    }
  }
});

require([
  'gravy/GravyTrain'
], function(
  GravyTrain
) {
  GravyTrain.start();
});

