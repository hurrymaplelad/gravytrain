# Gravy Train
Takes you right to the freshest local food.

## Getting Started

See it live at <http://hurrymaplelad.github.com/gravytrain/>

`js/gravy/GravyTrain.js` is where it all begins.

Lints with `gjslint --nojsdoc js/gravy/**/*.js`.

## TODO

- Test with only non-recurring pickups.

- Disable the more button when the DayIterator is exhausted.

- Geocode server-side and return closest subset of vendors.

- Persist distance choice in cookies or local storage.

- Incorporate processCutoffOffset.

- Add a detail page with a map so we stop violating Google Maps API TOS.

- Associate Pickup directly with vendor.  The Schedule association is frequently traversed and clumsy.

- Add build-time cache-busting.

- Combine source & lib trees at build / debug time instead of commit time.  
  Directories look a bit messy now but greatly simplify RequireJS configuration and match the Require module-space.

- Use git subrepos to simplify library updates and make obvious which files I'm not maintaining.

