/**
 * Math engine of re4 
 * @module re4.math
 * @namespace re4.math
 */

re4.fw.requires(["re4.fw","re4.math"]);


/**
 * Vectors with 2 elements
 * @class Vector2D
 * 
 * @constructor
 * @param {Number} x  the X coordinate 
 * @param {Number} y  the Y coordinate 
 */
re4.math.Vector2D = function(x, y)
{
	re4.fw.veriArgs(arguments,[re4.fw.isNumber,re4.fw.isNumber]);
	/**
	 * the X coordinate, the first element
	 * @property _x
	 * @type Number
	 */
	this._x=x;

	/**
	 * the Y coordinate, the second element
	 * @property _y
	 * @type Number
	 */
	this._y=y;
};

/**
 * @method getX
 * @return {Number} the X coordinate getter
 */
/**
 * @method getY
 * @return {Number} the Y coordinate getter
 */
re4.fw.installGetters(re4.math.Vector2D.prototype,["_x","_y"]);

/**
 * @method setX
 * @param {Number} x  the X coordinate 
 */
/**
 * @method setY
 * @param {Number} y  the Y coordinate
 */
re4.fw.installSetters(re4.math.Vector2D.prototype,["_x","_y"]);

/**
 * Get the specified element of the vector
 * @method get
 * @param {number} index Index of the element
 * @return {number} The vector element 
 */
re4.math.Vector2D.prototype.get=function(index)
{
	if(index==0)
	{
		return this._x;
	}
	else if(index==1)
	{
		return this._y;
	}
	else
	{
		throw new Error("invalid parameter");
	}

};

/**
 * set the 2Dvector into a zero vector  
 * @method zeroThis
 * @return {void}
 */
re4.math.Vector2D.prototype.zeroThis=function()
{
	this._x=0;
	this._y=0;
};

/**
 * initialize another vector
 * @method init
 * @param {re4.math.Vector2D} tar  the initialize target
 * @return {void}
 */
re4.math.Vector2D.prototype.init=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector2D]);
	v.setX(this._x);
	v.setY(this._y);
};

/**
 * initialize this vector with another vector
 * @method copy
 * @param {re4.math.Vector2D} src the initialize data source
 * @return {void}
 */
re4.math.Vector2D.prototype.copy=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector2D]);
	this._x=v.getX();
	this._y=v.getY();
};

/**
 * adds up 2 2d vectors, the two operands will kept untouched but return a new vector
 * @method add
 * @param {re4.math.Vector2D} v the vector to add
 * @return {re4.math.Vector2D} sum
 */
re4.math.Vector2D.prototype.add=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector2D]);
	return new re4.math.Vector2D(this._x+v.getX(),this._y+v.getY());
};

/**
 * sub this 2d vector by another one, the two operands will kept untouched but return a new vector
 * @method sub
 * @param {re4.math.Vector2D} v the vector to sub
 * @return {re4.math.Vector2D} subtraction result
 */
re4.math.Vector2D.prototype.sub=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector2D]);
	return new re4.math.Vector2D(this._x-v.getX(),this._y-v.getY());
};

/**
 * scales this vector by k, and stores the result into vscaled, the elements of this vector will kept untouched.
 * @method scaleTo
 * @param {number} k the scale factor
 * @param {re4.math.Vector2D} vscaled the result vector
 */
re4.math.Vector2D.prototype.scaleTo=function(k,vscaled)
{
	re4.fw.verifyArgs([re4.fw.isNumber,re4.fw.isInstanceOf],[re4.math.Vector2D]);
	vscaled.setX(this._x*k);
	vscaled.setY(this._Y*k);
};



/**
 * Computes the dot product of this vector and vb, and returns the scalar result.
 * @method dot
 * @param {re4.math.Vector2D} vb The other dot product operand.
 * @return {number} The scalar result
 */
re4.math.Vector2D.prototype.dot=function(vb)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector2D]);
	return this._x*vb.getX()+this._y*vb.getY();
};

/**
 * Computes the length of the vector using the standard square root of the sum of squares algorithm.
 * @method length
 * @return {number} The length
 */
re4.math.Vector2D.prototype.length=function()
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector2D]);
	return Math.sqrt(this._x*this._x+this._y*this._y);
};


/**
 * Normalizes the vector, that is, makes it a unit vector by dividing each component by the length
 * @method normalizeThis
 */
re4.math.Vector2D.prototype.normalizeThis=function()
{
	var len=this.length();
	this._x=this._x/len;
	this._y=this._y/len;
};

/**
 * Normalizes the vector, and stores it in vn,the elements of this vector will kept untouched.
 * @method normalizeTo
 * @param {re4.math.Vector2D} vn The result normalized vector to store.
 * 
 */
re4.math.Vector2D.prototype.normalizeTo=function(vn)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector2D]);
	var len=this.length();
	vn.setX(this._x/len);
	vn.setY(this._y/len);
};

/**
 * Builds a vector from two points: init->term.
 * @method build
 * @static
 * @param {re4.math.Vector2D} init The vector init.
 * @param {re4.math.Vector2D} term The vector term.
 * @return {re4.math.Vector2D} The vector: init->term
 * 
 */
re4.math.Vector2D.build=function(init,term)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf,re4.fw.isInstanceOf],[re4.math.Vector2D,re4.math.Vector2D]);
	return new re4.math.Vector2D(term.getX()-init.getX(),term.getY()-init.getY());
};

/**
 * Computes the cosine of the angle between this vector and vb.
 * @method cosTh
 * @param {re4.math.Vector2D} vb The other vector.
 * @return {number} The cosine value
 */
re4.math.Vector2D.prototype.cosTh=function(vb)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector2D]);
	return this.dot(vb)/(this.length()*vb.length);

};

/**
 * 
 * Vectors with 3 elements
 * @class Vector3D
 * @constructor
 * @param {Number} x the X coordinate, first element
 * @param {Number} y the Y coordinate, second element
 * @param {Number} z the Z coordinate, third element
 */
re4.math.Vector3D = function(x, y, z)
{
	re4.fw.veriArgs(arguments,[re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber]);
	/**
	 * the X coordinate, the first element
	 * @property _x
	 * @type Number
	 */
	this._x = x;

	/**
	 * the Y coordinate, the second element
	 * @property _y
	 * @type Number
	 */
	this._y = y;

	/**
	 * the Z coordinate, the third element
	 * @property _z
	 * @type Number
	 */
	this._z = z;

};

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
re4.fw.installGetters(re4.math.Vector3D.prototype,["_x","_y","_z"]);

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
re4.fw.installSetters(re4.math.Vector3D.prototype,["_x","_y","_z"]);

/**
 * Get the specified element of the vector
 * @method get
 * @param {number} index Index of the element
 * @return {number} The vector element 
 */
re4.math.Vector3D.prototype.get=function(index)
{
	if(index==0)
	{
		return this._x;
	}
	else if(index==1)
	{
		return this._y;
	}
	else if(index==2)
	{
		return this._z;
	}
	else
	{
		throw new Error("invalid parameter");
	}

};

/**
 * set the 3Dvector into a zero vector  
 * @method zeroThis
 * @return {void}
 */
re4.math.Vector3D.prototype.zeroThis=function()
{
	this._x=0;
	this._y=0;
	this._z=0;
};

/**
 * initialize another vector
 * @method init
 * @param {re4.math.Vector3D} tar  the initialize target
 * @return {void}
 */
re4.math.Vector3D.prototype.init=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector3D]);
	v.setX(this._x);
	v.setY(this._y);
	v.setZ(this._z);
};

/**
 * initialize this vector with another vector
 * @method copy
 * @param {re4.math.Vector3D} src the initialize data source
 * @returns {void}
 */
re4.math.Vector3D.prototype.copy=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector3D]);
	this._x=v.getX();
	this._y=v.getY();
	this._z=v.getZ();
};

/**
 * adds up 2 3d vectors
 * @method add
 * @param {re4.math.Vector3D} v the vector to add
 * @return {re4.math.Vector3D} sum
 */
re4.math.Vector3D.prototype.add=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector3D]);
	return new re4.math.Vector2D(this._x+v.getX(),this._y+v.getY(),this._z+v.getZ());
};

/**
 * sub this 3d vector by another one, the two operands will kept untouched but return a new vector
 * @method sub
 * @param {re4.math.Vector3D} v the vector to sub
 * @return {re4.math.Vector3D} subtraction result
 */
re4.math.Vector3D.prototype.sub=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector3D]);
	return new re4.math.Vector3D(this._x-v.getX(),this._y-v.getY(),this._z-v.getZ());
};

/**
 * scales this vector by k, and stores the result into vscaled, the elements of this vector will kept untouched.
 * @method scaleTo
 * @param {number} k the scale factor
 * @param {re4.math.Vector3D} vscaled the result vector
 */
re4.math.Vector3D.prototype.scaleTo=function(k,vscaled)
{
	re4.fw.verifyArgs([re4.fw.isNumber,re4.fw.isInstanceOf],[re4.math.Vector3D]);
	vscaled.setX(this._x*k);
	vscaled.setY(this._y*k);
	vscaled.setZ(this._z*k);
};

/**
 * Computes the dot product of this vector and vb, and returns the scalar result.
 * @method dot
 * @param {re4.math.Vector3D} vb The other dot product operand.
 * @return {number} The scalar result
 */
re4.math.Vector3D.prototype.dot=function(vb)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector3D]);
	return this._x*vb.getX()+this._y*vb.getY()+this._z*vb.getZ();
};

/**
 * Computes the length of the vector using the standard square root of the sum of squares algorithm.
 * @method length
 * @return {number} The length
 */
re4.math.Vector3D.prototype.length=function()
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector3D]);
	return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z);
};

/**
 * Normalizes the vector, that is, makes it a unit vector by dividing each component by the length
 * @method normalizeThis
 */
re4.math.Vector3D.prototype.normalizeThis=function()
{
	var len=this.length();
	this._x=this._x/len;
	this._y=this._y/len;
	this._z=this._z/len;
};

/**
 * Normalizes the vector, and stores it in vn,the elements of this vector will kept untouched.
 * @method normalizeTo
 * @param {re4.math.Vector3D} vn The result normalized vector to store.
 * 
 */
re4.math.Vector3D.prototype.normalizeTo=function(vn)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector3D]);
	var len=this.length();
	vn.setX(this._x/len);
	vn.setY(this._y/len);
	vn.setZ(this._z/len);
};

/**
 * Builds a vector from two points: init->term.
 * @method build
 * @static
 * @param {re4.math.Vector3D} init The vector init.
 * @param {re4.math.Vector3D} term The vector term.
 * @return {re4.math.Vector3D} The vector: init->term
 * 
 */
re4.math.Vector3D.build=function(init,term)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf,re4.fw.isInstanceOf],[re4.math.Vector3D,re4.math.Vector3D]);
	return new re4.math.Vector3D(term.getX()-init.getX(),term.getY()-init.getY(),term.getZ()-init.getZ());
};

/**
 * Computes the cosine of the angle between this vector and vb.
 * @method cosTh
 * @param {re4.math.Vector3D} vb The other vector.
 * @return {number} The cosine value
 */
re4.math.Vector3D.prototype.cosTh=function(vb)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector3D]);
	return this.dot(vb)/(this.length()*vb.length);

};

/**
 * 
 * Vectors with 4 elements
 * @class Vector4D
 * @constructor
 * @param {Number} x the X coordinate, first element
 * @param {Number} y the Y coordinate, second element
 * @param {Number} z the Z coordinate, third element
 * @param {Number} w the redundancy fourth element of homogeneous coord
 */
re4.math.Vector4D = function(x, y, z, w)
{
	if(re4.fw.veriArgs(arguments,[re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber]))
	{
		/**
		 * the X coordinate, the first element
		 * @property _x
		 * @type Number
		 */
		this._x = x;

		/**
		 * the Y coordinate, the first element
		 * @property _y
		 * @type Number
		 */
		this._y = y;

		/**
		 * the Z coordinate, the first element
		 * @property _z
		 * @type Number
		 */
		this._z = z;

		/**
		 * the redundancy fourth element of homogeneous coord
		 * @property _w
		 * @type Number
		 */
		this._w = w;
	}
	else
	{
		throw new Error("invalid argument(s)");
	}
};

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
re4.fw.installGetters(re4.math.Vector4D.prototype,["_x","_y","_z","_w"]);

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
re4.fw.installSetters(re4.math.Vector4D.prototype,["_x","_y","_z","_w"]);


/**
 * Get the specified element of the vector
 * @method get
 * @param {number} index Index of the element
 * @return {number} The vector element 
 */
re4.math.Vector4D.prototype.get=function(index)
{
	if(index==0)
	{
		return this._x;
	}
	else if(index==1)
	{
		return this._y;
	}
	else if(index==2)
	{
		return this._z;
	}
	else if(index==3)
	{
		return this._w;
	}
	else
	{
		throw new Error("invalid parameter");
	}

};

/**
 * set the 4Dvector into a zero vector, note the 4D vector sets w=1 
 * @method zeroThis
 * @return {void}
 */
re4.math.Vector4D.prototype.zeroThis=function()
{
	this._x=0;
	this._y=0;
	this._z=0;
	this._w=1;
};
/**
 * initialize another vector
 * @method init
 * @param {re4.math.Vector4D} tar  the initialize target
 * @return {void}
 */
re4.math.Vector4D.prototype.init=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector4D]);
	v.setX(this._x);
	v.setY(this._y);
	v.setZ(this._z);
	v.setW(this._w);
};

/**
 * initialize this vector with another vector
 * @method copy
 * @param {re4.math.Vector4D} src the initialize data source
 * @returns {void}
 */
re4.math.Vector4D.prototype.copy=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector4D]);
	this._x=v.getX();
	this._y=v.getY();
	this._z=v.getZ();
	this._w=v.getW();
};

/**
 * adds up 2 4d vectors
 * @method add
 * @param {re4.math.Vector4D} v the vector to add
 * @return {re4.math.Vector4D} sum
 */
re4.math.Vector4D.prototype.add=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector4D]);
	return new re4.math.Vector4D(this._x+v.getX(),this._y+v.getY(),this._z+v.getZ(),1);
};

/**
 * sub this 4d vector by another one, the two operands will kept untouched but return a new vector
 * @method sub
 * @param {re4.math.Vector4D} v the vector to sub
 * @return {re4.math.Vector4D} subtraction result
 */
re4.math.Vector4D.prototype.sub=function(v)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector4D]);
	return new re4.math.Vector4D(this._x-v.getX(),this._y-v.getY(),this._z-v.getZ(),this._w-v.getW());
};

/**
 * Scales this vector by k, and stores the result into vscaled, the elements of this vector will kept untouched.
 * @method scaleTo
 * @param {number} k the scale factor
 * @param {re4.math.Vector4D} vscaled the result vector
 */
re4.math.Vector4D.prototype.scaleTo=function(k,vscaled)
{
	re4.fw.verifyArgs([re4.fw.isNumber,re4.fw.isInstanceOf],[re4.math.Vector4D]);
	vscaled.setX(this._x*k);
	vscaled.setY(this._y*k);
	vscaled.setZ(this._z*k);
	vscaled.setW(this._w*k);
};

/**
 * scales this vector by k, the elements of this vector will kept untouched.
 * @method scale
 * @param {number} k the scale factor
 * @return {re4.math.Vector4D} The result vector
 */
re4.math.Vector4D.prototype.scale=function(k )
{
	re4.fw.verifyArgs([re4.fw.isNumber]);
	return new re4.math.Vector4D(this._x*k,this._y*k,this._z*k,1);
};

/**
 * Computes the dot product of this vector and vb, and returns the scalar result.
 * Note that for the VECTOR4D version, the w coordinate is disregarded.
 * @method dot
 * @param {re4.math.Vector4D} vb The other dot product operand.
 * @return {number} The scalar result
 */
re4.math.Vector4D.prototype.dot=function(vb)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector4D]);
	return this._x*vb.getX()+this._y*vb.getY()+this._z*vb.getZ();
};

re4.math.Vector4D.prototype.cross=function(vb)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector4D]);
	var k=this.length()*vb.length()*(Math.sqrt(1-Math.pow(this.cosTh(vb),2)));
	return (new re4.math.Vector4D(this._y*vb.getZ()-vb.getY()*this._z,-this._x*vb.getZ()+vb.getX()*this._z,this._x*vb.getY()-vb.getX()*this._y,1)).normalizeThis().scale(k);
};


/**
 * Computes the length of the vector using the standard square root of the sum of squares algorithm.
 * @method length
 * @return {number} The length
 */
re4.math.Vector4D.prototype.length=function()
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector4D]);
	return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z);

};

/**
 * Normalizes the vector, that is, makes it a unit vector by dividing each component by the length
 * @method normalizeThis
 * @return this
 */
re4.math.Vector4D.prototype.normalizeThis=function()
{
	var len=this.length();
	if(len!=0)
	{
		this._x=this._x/len;
		this._y=this._y/len;
		this._z=this._z/len;
	}
	else
	{
		throw new Error("zero vector cannot be normalized.");
	}

	return this;
};

/**
 * Normalizes the vector, and stores it in vn,the elements of this vector will kept untouched.
 * @method normalizeTo
 * @param {re4.math.Vector4D} vn The result normalized vector to store.
 * 
 */
re4.math.Vector4D.prototype.normalizeTo=function(vn)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector4D]);
	var len=this.length();
	if(len!=0)
	{
		vn.setX(this._x/len);
		vn.setY(this._y/len);
		vn.setZ(this._z/len);		
	}
	else
	{
		throw new Error("zero vector cannot be normalized.");
	}

};

/**
 * Builds a vector from two points: init->term.
 * @method build
 * @static
 * @param {re4.math.Vector4D} init The vector init.
 * @param {re4.math.Vector4D} term The vector term.
 * @return {re4.math.Vector4D} The vector: init->term
 * 
 */
re4.math.Vector4D.build=function(init,term)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf,re4.fw.isInstanceOf],[re4.math.Vector4D,re4.math.Vector4D]);
	return new re4.math.Vector4D(term.getX()-init.getX(),term.getY()-init.getY(),term.getZ()-init.getZ(),1);
};

/**
 * Computes the cosine of the angle between this vector and vb.
 * @method cosTh
 * @param {re4.math.Vector4D} vb The other vector.
 * @return {number} The cosine value
 */
re4.math.Vector4D.prototype.cosTh=function(vb)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Vector4D]);
	return this.dot(vb)/(this.length()*vb.length());

};
