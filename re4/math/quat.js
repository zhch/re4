re4.fw.requires(["re4.fw","re4.math"]);

/**
 * Math engine of re4 
 * @module re4.math
 * @namespace re4.math
 */

/**
 * DOCUMENT NOT CMPLETED!
 * Quaternion
 * @class Quaternion
 * 
 */

re4.math.Quaternion=function(x,y,z,w)
{
	re4.fw.veriArgs(arguments,[re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber]);
	this._x=x;
	this._y=y;
	this._z=z;
	this._w=w;
};
//gives us 3 ways to work with the components of the quaternion

re4.fw.installGetters(re4.math.Quaternion.prototype,["_x","_y","_z","_w"]);
re4.fw.installSetters(re4.math.Quaternion.prototype,["_x","_y","_z","_w"]);

//array indexed storage w,x,y,z order
re4.math.Quaternion.prototype.getM=function(index)
{
	re4.fw.veriArgs(arguments,[re4.fw.isNumber]);
	if(index==0 )
	{
		return this._w;
	}
	else if(index==1)
	{
		return this._x;
	}
	else if(index==2)
	{
		return this._y;
	}
	else if(index==3)
	{
		return this._z;
	}
	else
	{
		throw new Error("invalid array index of Quaternion: "+index);
	}
};
re4.math.Quaternion.prototype.setM=function(index,value)
{
	re4.fw.veriArgs(arguments,[re4.fw.isNumber,re4.fw.isNumber]);
	if(index==0 )
	{
		this._w=value;
	}
	else if(index==1)
	{
		this._x=value;
	}
	else if(index==2)
	{
		this._y=value;
	}
	else if(index==3)
	{
		return this._z=value;
	}
	else
	{
		throw new Error("invalid array index of Quaternion: "+index);
	}
};
re4.math.Quaternion.prototype.zero=function()
{
	this._x=this._y=this._z=this._w=0;
};

re4.math.Quaternion.prototype.initQuat=function(w,x,y,z)
{
	re4.fw.verifyArgs([re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber]);
	this._x=x;
	this._y=y;
	this._z=z;
	this._w=w;
	
};
re4.math.Quaternion.prototype.initByVector3D=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector3D]);
	this._w=0;
	this._x=v.getX();
	this._y=v.getY();
	this._z=v.getZ();
};
re4.math.Quaternion.prototype.init=function(tgt)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Quaternion]);
	tgt.setW(this._w);
	tgt.setX(this._x);
	tgt.setY(this._y);
	tgt.setZ(this._z);
	
};
re4.math.Quaternion.prototype.copy=function(src)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Quaternion]);
	this._w=src.getX();
	this._x=src.getY();
	this._y=src.getY();
	this._z=src.getZ();
	
};

