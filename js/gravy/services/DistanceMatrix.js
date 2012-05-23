/**
 * Calculates driving distance from the user to all the pickups
 * with a combo of HTML5 geolocation and the Google Maps
 * DistanceMatrix API:
 * https://developers.google.com/maps/documentation/javascript/distancematrix
 */
define([
  'wrap!zepto',
  'wrap!underscore',
  'wrap!caolan/async',
  'async!http://maps.googleapis.com/maps/api/js?sensor=true'
], function(
  $,
  _,
  async
) {

  return {
    service: new google.maps.DistanceMatrixService(),

    /**
     * Loads distances from device location to
     * pickup addresses into schedule.get('distance').
     *
     * Passes false to callback
     * if either user location or the distance service fail,
     * otherwise true.
     */
    loadDistances: function(schedules, callback) {
      var addresses = _(schedules).map(function(schedule) {
            return schedule.get('location')['address'];
          }),
          addressChunks;

      // remove duplicates
      addresses = _.uniq(addresses);

      // short ciruit if passed no schedules to simplify
      // app orchestration logic.
      if (schedules.length <= 0) {
        callback(false);
        return;
      }

      // Split addresses into groups of 25 (Google's limit)
      addressChunks = this.chunk(addresses, 25);

      // Get device location
      this.getUserLocation(_.bind(function(userLocation) {
        if (userLocation === null) {
          callback(false);
          return;
        }

        // Make Google service requests
        var tasks = _(addressChunks).map(function(chunk) {
          return _.bind(
            this.loadAddressChunk,
            this,
            userLocation,
            chunk
          );
        }, this);

        async.parallel(tasks, function(error, resultChunks) {
          if (error) {
            callback(false);
            return;
          }

          // Merge results
          var results = _.flatten(resultChunks, true),
              distanceTo = function(address) {
                var index = _(addresses).indexOf(address),
                    result = results[index];
                if (result.status == google.maps.DistanceMatrixElementStatus.OK) {
                  return result.distance;
                } else {
                  return null;
                }
              };

          // Assign distances to schedule locations
          _(schedules).each(function(schedule) {
            var location = schedule.get('location'),
                distance = distanceTo(location.address);

            if (distance !== null) {
              location.distance = distance;
            }
          });

          // Success!
          callback(true);
        });
      }, this));
    },

    /**
     * Task with node.js style callback for use with caolan/async.parrallel
     */
    loadAddressChunk: function(userLocation, addressChunk, callback) {
      this.service.getDistanceMatrix({
        origins: [userLocation],
        destinations: addressChunk,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
      }, function(response, status) {
        if (status == google.maps.DistanceMatrixStatus.OK) {
          callback(null, response.rows[0].elements);
        } else {
          callback(status);
        }
      });
    },

    /**
     * Thanks http://stackoverflow.com/questions/8566667/
     */
    chunk: function(array, size) {
      var grouping = _.groupBy(array, function(item, index) {
        return Math.floor(index / size);
      });
      return _(grouping).values();
    },

    /**
     * Passes null to callback if device geolocation is unsupported
     * or fails, otherwise a google.maps.LatLng
     *
     * TODO: cache result?
     */
    getUserLocation: function(callback) {
      if (!navigator.geolocation) {
        callback(null);
      }
      navigator.geolocation.getCurrentPosition(
        function(position) {
         callback(new google.maps.LatLng(
           position.coords.latitude,
           position.coords.longitude
         ));
        },
        function() {
          callback(null);
        }
      );
    }
  };
});
