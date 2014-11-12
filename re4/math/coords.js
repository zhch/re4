/**
 * Math engine of re4 
 * @module re4.math
 * @namespace re4.math
 */

re4.fw.requires(["re4.fw","re4.math"]);

/**
 * 2D polar coordinates
 * @class Polar2D
 * @constructor
 * @param {Number} r  the radi of the point 
 * @param {Number} theta the angle in rads 
 * 
 */
re4.math.Polar2D=function(r,theta)
{
	re4.fw.veriArgs(arguments,[re4.fw.isNumber,re4.fw.isNumber]);
	/**
	 * the radi of the point
	 * @property _r
	 * @type Number
	 */
	this._r=r;

	/**
	 * the angle in rads,theta must be in the interval from 0 to 2PI inclusive.
	 * @property _theta
	 * @type Number
	 */
	this._theta=re4.math.whirlTo2PI(theta); 

};
/**
 * Transform rectangle coordinates into polar2d coordinates
 * @method getPoint2D
 * @return {re4.math.Point2D} ret
 */
re4.math.Polar2D.prototype.getPoint2D=function()
{
	return new re4.math.Point2D(this._r*re4.math.cos(this._theta),this._r*re4.math.sin(this._theta));
};

/**
 * 3D cylindrical coordinates
 * @class Cylindrical3D
 * @constructor
 * @param {Number} r  the radi of the point 
 * @param {Number} theta the angle about the z axis, in rads
 * @param {Number} z the z-height of the point
 */
re4.math.Cylindrical3D=function(r,theta,z)
{
	re4.fw.verifyArgs([re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber]);
	/**
	 * the radi of the point
	 * @property _r
	 * @type Number
	 */
	this._r=r;

	/**
	 * theta the angle about the z axis, theta must be in the interval from 0 to 2PI inclusive.
	 * @property _theta
	 * @type Number
	 */
	this._theta=re4.math.whirlTo2PI(theta);

	/**
	 * the z-height of the point
	 * @property _z 
	 * @type Number
	 */
	this._z=z;
};

/**
 * Transform Cylindrical3D coord into point3d
 * @method getPoint3D
 * @return {re4.math.Point3D} the point3d
 * 
 */
re4.math.Cylindrical3D.prototype.getPoint3D=function()
{
	return new re4.math.Point3D(this._r*re4.math.cos(theta),this._r*re4.math.sin(theta),this._z);
};


/**
 * 3D Spherical coordinates
 * @class Spherical3D
 * @constructor
 * @param {Number} rho  the distance to the point from the origin 
 * @param {Number} phi the angle that the directed line segment from the origin (o) to p makes with the positive z-axis
 * @param {Number} theta the angle that the projection of the line from o to p makes on the x-y plane, 
 * which is just the standard 2D polar theta. Also, theta must be in the interval from 0 to 2PI inclusive.
 */
re4.math.Spherical3D=function(rho,phi,theta)
{
	re4.fw.verifyArgs([re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber]);

	if(rho>=0 && phi>=0 && phi<=re4.math.PI && theta>=0 && theta<=re4.math.PI*2)
	{
		/**
		 * the distance to the point from the origin 
		 * @property _rho
		 * @type Number
		 */
		this._rho=rho;

		/**
		 * the angle that the directed line segment from the origin (o) to p makes with the positive z-axis
		 * @property _phi
		 * @type Number
		 */
		this._phi=phi;

		/**
		 * theta the angle that the projection of the line from o to p makes on the x-y plane, 
		 * which is just the standard 2D polar theta. Also, theta must be in the interval from 0 to 2PI inclusive.
		 * @property _theta
		 * @type Number
		 */
		this._theta=theta;
	}
	else
	{
		throw new Error("Invalid argument(s) to initialize a Spherical3D");
	}
};

/**
 * Transform the Spherical3D coord into a Point3D coord
 * @method getPoint3D
 * @return {re4.math.Point3D} the point3d
 */
re4.math.Spherical3D.prototype.getPoint3D=function()
{
	return new re4.math.Point3D(this._rho*re4.math.sin(this._phi)*re4.math.cos(this._theta),this._rho*re4.math.sin(this._phi)*re4.math.sin(this._theta),this._rho*re4.math.cos(this._phi)); 
};