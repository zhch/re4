re4.fw.requires(["re4.fw","re4.math","re4.math.Point2D","re4.math.Point3D"]);

/**
 * Math engine of re4 
 * @module re4.math
 * @namespace re4.math
 */

/**
 * DOCUMENT NOT CMPLETED!
 * ParaLine2D
 * @class ParaLine2D
 * 
 */
re4.math.ParaLine2D=function(p0,p1)
{
	re4.fw.veriArgs(arguments,[re4.fw.isInstanceOf,re4.fw.isInstanceOf],[re4.math.Point2D,re4.math.Point2D]);
	this._p0=p0;
	this._p1=p1;
};
re4.fw.installGetters(re4.math.ParaLine2D.prototype,["_p0","_p1"]);
re4.fw.installSetters(re4.math.ParaLine2D.prototype,["_p0","_p1"]);


/**
 * DOCUMENT NOT CMPLETED!
 * ParaLine3D
 * @class ParaLine3D
 * 
 */
re4.math.ParaLine3D=function(p0,p1)
{
	re4.fw.veriArgs(arguments,[re4.fw.isInstanceOf,re4.fw.isInstanceOf],[re4.math.Point3D,re4.math.Point3D]);
	this._p0=p0;
	this._p1=p1;
};
re4.fw.installGetters(re4.math.ParaLine3D.prototype,["_p0","_p1"]);
re4.fw.installSetters(re4.math.ParaLine3D.prototype,["_p0","_p1"]);
re4.math.ParaLine2D.NO_INTERSECT			=re4.math.ParaLine3D.NO_INTERSECT			=0;
re4.math.ParaLine2D.INTERSECT_IN_SEGMENT	=re4.math.ParaLine3D.INTERSECT_IN_SEGMENT	=1;
re4.math.ParaLine2D.INTERSECT_OUT_SEGMENT	=re4.math.ParaLine3D.INTERSECT_OUT_SEGMENT	=2;
re4.math.ParaLine2D.INTERSECT_EVERYWHERE	=re4.math.ParaLine3D.INTERSECT_EVERYWHERE	=3;