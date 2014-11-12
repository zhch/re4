re4.fw.requires(["re4.fw","re4.math","re4.math.Vector3D","re4.math.Point3D"]);

/**
 * Math engine of re4 
 * @module re4.math
 * @namespace re4.math
 */

/**
 * Plane3D
 * @class Plane3D
 * @constructor
 * @param {re4.math.Point3D} p0  Point on the plane
 * @param {re4.math.Vector3D} v Normal to the plane (not necessarily a unit vector)
 * @param {boolean} normalV If the constructor shall normalize the normal vector
 */
re4.math.Plane3D=function(p0,v,normalV)
{
	re4.fw.veriArgs(arguments, [re4.fw.isInstanceOf,re4.fw.isInstanceOf,re4.fw.isBoolean],[re4.math.Point3D,re4.math.Vector3D]);
	/**
	 * Point on the plane
	 * @property _p0
	 * @type re4.math.Point3D
	 */
	this._p0=p0;	// point on the plane
	
	/**
	 * Normal to the plane
	 * @property _n
	 * @type re4.math.Vector3D
	 */
	this._n=v;	// normal to the plane (not necessarily a unit vector)
	if(normalV)
	{
		this._n.normalizeThis();
	}

};
//re4.fw.installGetters(re4.math.Plane3D.prototype,["_p0","_n"]);
//re4.fw.installSetters(re4.math.Plane3D.prototype,["_p0","_n"]);