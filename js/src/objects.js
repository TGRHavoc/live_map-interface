// ************************************************************************** //
//			LiveMap Interface - The web interface for the livemap
//					Copyright (C) 2017  Jordan Dalton
//
//	  This program is free software: you can redistribute it and/or modify
//	  it under the terms of the GNU General Public License as published by
//	  the Free Software Foundation, either version 3 of the License, or
//	  (at your option) any later version.
//
//	  This program is distributed in the hope that it will be useful,
//	  but WITHOUT ANY WARRANTY; without even the implied warranty of
//	  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//	  GNU General Public License for more details.
//
//	  You should have received a copy of the GNU General Public License
//	  along with this program in the file "LICENSE".  If not, see <http://www.gnu.org/licenses/>.
// ************************************************************************** //

function EuclideanProjection() {
    var EUCLIDEAN_RANGE = 256;
    this.pixelOrigin_ = new google.maps.Point(EUCLIDEAN_RANGE / 2, EUCLIDEAN_RANGE / 2);
    this.pixelsPerLonDegree_ = EUCLIDEAN_RANGE / 360;
    this.pixelsPerLonRadian_ = EUCLIDEAN_RANGE / (2 * Math.PI);
    this.scaleLat = 2;
    this.scaleLng = 2;
    this.offsetLat = 0;
    this.offsetLng = 0;
}

EuclideanProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
    var point = opt_point || new google.maps.Point(0, 0);
    var origin = this.pixelOrigin_;
    point.x = (origin.x + (latLng.lng() + this.offsetLng) * this.scaleLng * this.pixelsPerLonDegree_);
    point.y = (origin.y + (-1 * latLng.lat() + this.offsetLat) * this.scaleLat * this.pixelsPerLonDegree_);
    return point;
};

EuclideanProjection.prototype.fromPointToLatLng = function(point) {
    var me = this;
    var origin = me.pixelOrigin_;
    var lng = (((point.x - origin.x) / me.pixelsPerLonDegree_) / this.scaleLng) - this.offsetLng;
    var lat = ((-1 * (point.y - origin.y) / me.pixelsPerLonDegree_) / this.scaleLat) - this.offsetLat;
    return new google.maps.LatLng(lat, lng, true);
};

function Coordinates(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function MarkerObject(reference, position, type, description, data) {
    this.reference = reference;
    this.position = position;
    this.type = type;
    this.description = description;
    this.data = data;
};
