/**
 * Wireframe rendering engine of re4 
 * @module re4.wire
 * @namespace re4.wire
 */

re4.fw.requires(["re4.fw","re4.math","re4.math.Point4D","re4.math.Vector4D","re4.wire" ]);

/**
 * A polygon depended on a vertex list
 * @class Poly4D
 * 
 * @constructor
 * @param {re4.wire.Poly4D.STATE} state  state information
 * @param {re4.wire.Poly4D.ATTRIBUTE} attr physical attributes of polygon
 * @param {String} color color of polygon  
 * @param {Array of re4.math.Point4D} vlist the vertex list itself
 * @param {Array of number} vert the indices into the vertex list
 * 
 */
re4.wire.Poly4D=function(state,attr,color,vlist,vert)
{
	re4.fw.veriArgs([state,attr,color],[re4.fw.isEnumeratedBy,re4.fw.isEnumeratedBy,re4.fw.isString],[re4.wire.Poly4D.STATE,re4.wire.Poly4D.ATTRIBUTE]);
	re4.fw.isArrayOf(vlist,re4.fw.isInstanceOf,re4.math.Point4D);
	re4.fw.isArrayOfPrims(vert,re4.fw.isNumber);

	/**
	 * state information
	 * @property _state
	 * @type re4.wire.Poly4D.STATE
	 */
	this._state=state;

	/**
	 * physical attributes of polygon
	 * @property _attr
	 * @type Enumerated by re4.wire.Poly4D.ATTRIBUTE
	 */
	this._attr=attr;

	/**
	 * color color of polygon
	 * @property _color
	 * @type number
	 */
	this._color=color;

	/**
	 * the depended vertex list itself
	 * @property _vlist
	 * @type Array of re4.math.Point4D
	 */
	this._vlist=vlist;

	/**
	 * the indices into the vertex list
	 * @property _vert
	 * @type Array[3] of number
	 */
	if(vert.length!=3)
	{
		throw new Error("vertex number of re4.wire.Poly4D must be 3");
	}
	else
	{
		this._vert=vert;
	}


};

/**
 * Get the out layed vertex specified by the index.  
 * @method getVertex
 * @param {number} index Index of the vertex, can be 0,1 or 2. 
 * @return {re4.math.Vector4D} vertex
 */
re4.wire.Poly4D.prototype.getVertex=function(index)
{
	if(index>=0 && index<=2)
	{
		return this._vlist[this._vert[index]];
	}
	else
	{
		throw new Error("Poly4D has 3 vertex only(indexed from 0~2), but you required: "+index);
	}
};

/**
 * Get state information 
 * @method getState
 * @return {Enumerated by re4.wire.Poly4D.STATE} state
 */
/**
 * Get physical attributes of polygon
 * @method getAttr
 * @return {Enumerated by re4.wire.Poly4D.ATTRIBUTE} state
 */
/**
 * Get  color color of polygon 
 * @method getColor
 * @return {String} color
 */
/**
 * Get the depended vertex list itself
 * @method getVlist
 * @return {re4.math.Point4D[3]} vlist
 */

re4.fw.installGetters(re4.wire.Poly4D.prototype,["_state","_attr","_color","_vlist" ]);

/**
 * Set state information 
 * @param {Enumerated by  re4.wire.Object4D.STATE} state 
 * @method setState
 */
/**
 * Set physical attributes of polygon
 * @method setAttr
 */
/**
 * Set  color color of polygon 
 * @method setColor
 */
/**
 * Set the depended vertex list itself
 * @method setVlist
 */
re4.fw.installSetters(re4.wire.Poly4D.prototype,["_state","_attr","_color","_vlist" ]);
/**
 * Attributes of polygons and polygon faces.
 * This is an Enumerator:SIDED_2,TRANSPARENT,BIT_8_COLOR,RGB_16,RGB_24,SHADE_PURE,SHADE_FLAT,SHADE_GOURAUD,SHADE_PHONG
 * @class Poly4D.ATTRIBUTE
 * @final
 * @type Enumerator
 */
re4.wire.Poly4D.ATTRIBUTE=new Object();

/**
 * Default attribute, meaning an empty attribute.
 * @property EMPTY
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.ATTRIBUTE.EMPTY=0x0000;

/**
 * 2-sided.
 * @property SIDED_2
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.ATTRIBUTE.SIDED_2=0x0001;

/**
 * Transparent.
 * @property TRANSPARENT
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.ATTRIBUTE.TRANSPARENT=0x0002;

/**
 * 8 bit color.
 * @property BIT_8_COLOR
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.ATTRIBUTE.BIT_8_COLOR=0x0004;

/**
 * 16 bit rgb color.
 * @property RGB_16
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.ATTRIBUTE.RGB_16=0x0008;

/**
 * 24 bit rgb color.
 * @property RGB_24
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.ATTRIBUTE.RGB_24=0x0010;

/**
 * Shade pure.
 * @property SHADE_PURE
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.ATTRIBUTE.SHADE_PURE=0x0020;

/**
 * Shade flat.
 * @property SHADE_FLAT
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.ATTRIBUTE.SHADE_FLAT=0x0040;

/**
 * SHADE_GOURAUD.
 * @property SHADE_GOURAUD
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.ATTRIBUTE.SHADE_GOURAUD=0x0080;

/**
 * SHADE_PHONG.
 * @property SHADE_PHONG
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.ATTRIBUTE.SHADE_PHONG=0x0100;

/**
 * States of polygons and faces.
 * This is an Enumerator:ACTIVE,CLIPPED,BACKFACE
 * @class Poly4D.STATE
 * @final
 * @type Enumerator
 */
re4.wire.Poly4D.STATE=new Object();
/**
 * ACTIVE.
 * @property ACTIVE
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.STATE.ACTIVE=0x0001;

/**
 * CLIPPED.
 * @property CLIPPED
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.STATE.CLIPPED=0x0002;

/**
 * BACKFACE.
 * @property BACKFACE
 * @type number
 * @static
 * @final
 */
re4.wire.Poly4D.STATE.BACKFACE=0x0004;

/**
 * A self contained polygon used for the render list
 * @class Poly4DSelf
 * 
 * @constructor
 * @param {re4.wire.Poly4D.STATE} state  state information
 * @param {re4.wire.Poly4D.ATTRIBUTE} attr physical attributes of polygon
 * @param {String} color Color of polygon  
 * @param {Array of re4.math.Point4D} vlist the vertices of this triangles
 * @param {re4.wire.Poly4DSelf} next the next polygon in list??
 * @param {re4.wire.Poly4DSelf} prev the previous polygon in list??
 * 
 */
re4.wire.Poly4DSelf=function(state,attr,color,vlist,next,prev)
{
	re4.fw.veriArgs([state,					attr,						color,					next,					prev],
			[re4.fw.isEnumeratedBy,	re4.fw.isEnumeratedBy,		re4.fw.isString	,	re4.fw.isInstanceOf,	re4.fw.isInstanceOf],
			[re4.wire.Poly4D.STATE,	re4.wire.Poly4D.ATTRIBUTE,						re4.wire.Poly4DSelf,	re4.wire.Poly4DSelf]);
	re4.fw.isArrayOf(vlist,re4.fw.isInstanceOf,re4.math.Point4D);

	/**
	 * state information
	 * @property _state
	 * @type Enumerated by re4.wire.Poly4D.STATE
	 */
	this._state=state;

	/**
	 * physical attributes of polygon
	 * @property _attr
	 * @type re4.wire.Poly4D.ATTRIBUTE
	 */
	this._attr=attr;

	/**
	 * color color of polygon
	 * @property _color
	 * @type String
	 */
	this._color=color;

	/**
	 * the vertices of this triangles
	 * @property _vlist
	 * @type re4.math.Point4D[3]
	 */
	if(vlist.length!=3)
	{
		throw new Error("vertex number of re4.wire.Poly4DSelf must be 3");
	}
	else
	{
		this._vlist=new Array(3);
		this._vlist[0]=new re4.math.Vector4D(vlist[0].getX(),vlist[0].getY(),vlist[0].getZ(),vlist[0].getW());
		this._vlist[1]=new re4.math.Vector4D(vlist[1].getX(),vlist[1].getY(),vlist[1].getZ(),vlist[1].getW());
		this._vlist[2]=new re4.math.Vector4D(vlist[2].getX(),vlist[2].getY(),vlist[2].getZ(),vlist[2].getW());
	}


	/**
	 * the vertices after transformation if needed
	 * @property _tvlist
	 * @type re4.math.Point4D[3]
	 */
	this._tvlist=new Array(3);

	/**
	 * The next polygon in list??
	 * @property _next
	 * @type re4.wire.Poly4DSelf
	 */
	this._next=next;

	/**
	 * The previous polygon in list??
	 * @property _prev
	 * @type re4.wire.Poly4DSelf
	 */
	this._prev=prev;

};

/**
 * Get state information 
 * @method getState
 * @return {Enumerated by re4.wire.Poly4D.STATE} state
 */
/**
 * Get physical attributes of polygon
 * @method getAttr
 * @return {Enumerated by re4.wire.Poly4D.ATTRIBUTE} state
 */
/**
 * Get  color color of polygon 
 * @method getColor
 * @return {String} color
 */
/**
 * Get the depended vertex list itself
 * @method getVlist
 * @return {re4.math.Point4D[3]} vlist
 */
/**
 * Get the vertices after transformation if needed
 * @method getTvlist
 * @return {re4.math.Point4D[3]} tvlist
 */
/**
 * Get the next polygon in list??
 * @method getNext
 * @return {re4.wire.Poly4DSelf} next
 */
/**
 * Get the previous polygon in list??
 * @method getPrev
 * @return {re4.wire.Poly4DSelf} prev
 */
re4.fw.installGetters(re4.wire.Poly4DSelf.prototype,["_state","_attr","_color","_vlist","_tvlist","_next","_prev" ]);

/**
 * Set state information 
 * @method setState
 */
/**
 * Set physical attributes of polygon
 * @method setAttr
 */
/**
 * Set color color of polygon 
 * @method setColor
 */
/**
 * Set the depended vertex list itself
 * @method setVlist
 */
/**
 * Set the vertices after transformation if needed
 * @method setTvlist
 */
/**
 * Set the next polygon in list??
 * @method setNext
 * @return {re4.wire.Poly4DSelf} next
 */
/**
 * Set the previous polygon in list??
 * @method setPrev
 */
re4.fw.installSetters(re4.wire.Poly4DSelf.prototype,["_state","_attr","_color","_vlist","_tvlist","_next","_prev" ]);

/**
 * Get the specified vector of the polygon
 * @method getVector
 * @param {number}  index  Between 0~2
 * @return {re4.math.Vector4D} Vector
 */
re4.wire.Poly4DSelf.prototype.getVector=function(index)
{
	if(index>=0 && index<=2)
	{
		return this._vlist[index];
	}
	else
	{
		throw new Error("index must between 0~2");
	}
};

/**
 * Set the specified vector of the polygon with the offered vector
 * @method setVector
 * @param {number} index  Between 0~2
 * @param {re4.math.Vector4D} vector  Vector value
 */
re4.wire.Poly4DSelf.prototype.setVector=function(index,vector)
{
	if(re4.fw.isInstanceOf(vector,re4.math.Vector4D))
	{
		if(index>=0 && index<=2)
		{
			return this._vlist[index]=vector;
		}
		else
		{
			throw new Error("index must between 0~2");
		}
	}
	else
	{
		throw new Error("invalid param");
	}
};

/**
 * Get the specified transformed vector of the polygon
 * @method getTVector
 * @param {number} index  Between 0~2
 * @return {re4.math.Vector4D} Vector
 */
re4.wire.Poly4DSelf.prototype.getTVector=function(index)
{
	if(index>=0 && index<=2)
	{
		return this._tvlist[index];
	}
	else
	{
		throw new Error("index must between 0~2");
	}
};

/**
 * Set the specified vector of the polygon with the offered vector
 * @method setTVector
 * @param {number} index Between 0~2
 * @param {re4.math.Vector4D} vector  Vector value
 */
re4.wire.Poly4DSelf.prototype.setTVector=function(index,vector)
{
	if(re4.fw.isInstanceOf(vector,re4.math.Vector4D))
	{
		if(index>=0 && index<=2)
		{
			return this._tvlist[index]=vector;
		}
		else
		{
			throw new Error("index must between 0~2");
		}
	}
	else
	{
		throw new Error("invalid param");
	}
};
