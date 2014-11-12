/**
 * Math engine of re4 
 * @module re4.math
 * @namespace re4.math
 */

re4.fw.requires(["re4.fw","re4.math","re4.math.Vector2D","re4.math.Vector3D","re4.math.Vector4D"]);

/**
 * 2D point
 * @class Point2D
 * @constructor
 * @param {Number} x  the X coordinate 
 * @param {Number} y  the Y coordinate 
 */
/**
 * the X coordinate, the first element
 * @property _x
 * @type Number
 */
/**
 * the Y coordinate, the second element
 * @property _y
 * @type Number
 */
re4.math.Point2D = re4.math.Vector2D;

/**
 * @method getX
 * @return {Number} the X coordinate getter
 */
/**
 * @method getY
 * @return {Number} the Y coordinate getter
 */
/**
 * @method setX
 * @param {Number} x  the X coordinate 
 * @return {Number} the X coordinate setter
 */
/**
 * @method setY
 * @param {Number} y  the Y coordinate
 * @return {Number} the Y coordinate setter
 */

/**
 * transform the rectangle coordinates into polar2d coordinates
 * @method getPolar2D
 * @return {re4.math.Polar2D} polar2d,the theta will between -pi to pi
 */
re4.math.Point2D.prototype.getPolar2D=function()
{
	var r=Math.sqrt(this._x*this._x+this._y*this._y);;
	var theta=Math.atan2(this._x, this._y);
	if(theta<0)
	{
		theta=2*re4.math.PI+theta;
	}
	return new re4.math.Polar2D(r,theta);
};

/**
 * 
 * Represents a point in 3D space
 * @class Point3D
 * @constructor
 * @param {Number} x the X coordinate, first element
 * @param {Number} y the Y coordinate, second element
 * @param {Number} z the Z coordinate, third element
 */
/**
 * the X coordinate, the first element
 * @property _x
 * @type Number
 */
/**
 * the Y coordinate, the second element
 * @property _y
 * @type Number
 */
/**
 * the Z coordinate, the third element
 * @property _z
 * @type Number
 */
re4.math.Point3D = re4.math.Vector3D;

/**
 * @method getX
 * @return {Number} the X coordinate getter
 */
/**
 * @method getY
 * @return {Number} the Y coordinate getter
 */
/**
 * @method getZ
 * @return {Number} the Z coordinate getter
 */
/**
 * @method setX
 * @param {Number} x  the X coordinate 
 * @return {Number} the X coordinate setter
 */
/**
 * @method setY
 * @param {Number} y  the Y coordinate
 * @return {Number} the Y coordinate setter
 */
/**
 * @method setZ
 * @param {Number} z  the Z coordinate
 * @return {Number} the Z coordinate setter
 */

/**
 * Transform Point3D into Cylindrical3D
 * @method getCylindrical3D
 * @return {re4.math.Cylindrical3D} the Cylindrical3D coord, the theta will between -pi to pi 
 */
re4.math.Point3D.prototype.getCylindrical3D=function()
{
	return new re4.math.Cylindrical3D(Math.sqrt(this._x*this._x+this._y*this._y),re4.math.atan02PI(this._x, this._y),this._z);
};

/**
 * Transform Point3D into Spherical3D
 * @method getSpherical3D
 * @return {re4.math.Spherical3D} the Spherical3D
 */
re4.math.Point3D.prototype.getSpherical3D=function()
{
	var rho=Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z);
	var phi=Math.asin(Math.sqrt(this._x*this._x+this._y*this._y)/Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z));
	if(this._z<0)
	{
		phi=re4.math.PI-phi;
	}
	var theta=re4.math.atan02PI (this._x,this._y);
	return new re4.math.Spherical3D(rho,phi,theta);

};

/**
 * 
 * points in 4 dimensions super space
 * @class Point4D
 * @constructor
 * @param {Number} x the X coordinate, first element
 * @param {Number} y the Y coordinate, second element
 * @param {Number} z the Z coordinate, third element
 * @param {Number} w the redundancy fourth element of homogeneous coord
 */
/**
 * the X coordinate, the first element
 * @property _x
 * @type Number
 */
/**
 * the Y coordinate, the first element
 * @property _y
 * @type Number
 */
/**
 * the Z coordinate, the first element
 * @property _z
 * @type Number
 */
/**
 * the redundancy fourth element of homogeneous coord
 * @property _w
 * @type Number
 */
re4.math.Point4D = re4.math.Vector4D;

/**
 * @method getX
 * @return {Number} the X coordinate getter
 */
/**
 * @method getY
 * @return {Number} the Y coordinate getter
 */
/**
 * @method getZ
 * @return {Number} the Z coordinate getter
 */
/**
 * @method getW
 * @return {Number} the fourth element getter
 */
/**
 * @method setX
 * @param {Number} x  the X coordinate 
 */
/**
 * @method setY
 * @param {Number} y  the Y coordinate
 */
/**
 * @method setZ
 * @param {Number} z  the Z coordinate
 */
/**
 * @method setW
 * @param {Number} z  the Z coordinate
 */
