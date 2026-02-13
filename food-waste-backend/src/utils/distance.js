const geolib = require("geolib");

exports.getDistanceInKm = (loc1, loc2) => {
  return geolib.getDistance(
    { latitude: loc1.latitude, longitude: loc1.longitude },
    { latitude: loc2.latitude, longitude: loc2.longitude }
  ) / 1000;
};
