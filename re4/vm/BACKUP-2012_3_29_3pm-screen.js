/**
 * Virtual computer for re4 
 * @module re4.vm
 * @namespace re4.vm
 */

re4.fw.requires(["re4.fw","re4.vm","bmp_lib"]);

/**
 * Initialize the video system and install a window on the DOM element with a specific resolution and bit depth.
 * All methods of this class of objects, operate on data of themselves only.
 * @class Screen
 * @constructor
 * @param {DOM Element} container  The container element of the window
 * @param {number} width Window width
 * @param {number} height Window height
 * 
 */
re4.vm.Screen=function(container,width,height)
{
	re4.fw.verifyArgs ([re4.fw.isElement,re4.fw.isNumber,re4.fw.isNumber] );

	/**
	 * Unique id of this Window, container DOM element also use this id.
	 * @property _id
	 * @type String
	 */
	this._id=new String("re4scr"+Math.random()*1000000000).split('.')[0];

	/**
	 * Width.
	 * @property _width
	 * @type number
	 */
	this._width=width;

	/**
	 * Height.
	 * @property _height
	 * @type number
	 */
	this._height=height;

	/**
	 * Secondary buffer.
	 * @property _secondary
	 * @type [number,number,number][][]
	 */
	this._secondary=new Array(height);

	/**
	 * Primary buffer.
	 * @property _primary
	 * @type [number,number,number][][]
	 */
	this._primary=new Array(height);	
	for(var i=0;i<this._height;i++)
	{
		this._primary[i]=new Array();
		this._secondary[i]=new Array();
		for(var j=0;j<this._width;j++)
		{
			this._primary[i][j]=[0,0,0];
			this._secondary[i][j]=[0,0,0];
		}
	}

	/**
	 * Indicates that whether the primary buffer is locked.
	 * @property _primaryLocked
	 * @type boolean
	 */
	this._primaryLocked=false;

	/**
	 * Indicates that whether the secondary buffer is locked.
	 * @property _secondaryLocked
	 * @type boolean
	 */
	this._secondaryLocked=false;
	container.innerHTML="<img id=\""+this._id+"\" />";



	/**
	 * The container div of this window, all graphic element should be added as child elements of this element.
	 * @property _container
	 * @type DOM Element
	 */
	this._container=document.getElementById(this._id);
	bmp_lib.render(this._id,this._primary,null);

};

/**
 * This is private.
 * Set the specified color value to the specified coordinate in the specified buffer.
 * Hide the buffer write and lock operation details.
 * 
 * @method _setBuffer
 * @param {Enumerated by re4.vm.Screen.BUFFER_SELECT} buffer Which buffer to set
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @param {number[]} arrColor RGB color,expressed by array of number:[r,g,b]
 */
re4.vm.Screen.prototype._setBuffer=function(buffer,x,y,arrColor)
{
	if(x>=0 && x<this._width && y>=0 && y<this._height)
	{
		if(buffer==re4.vm.Screen.BUFFER_SELECT.PRIMARY )
		{

			if(x>=0 && x<this._width)
			{
				this._primary[y][x]=arrColor;
			}
			else
			{
				throw new Error("the primary buffer is locked");
			}
		}
		else
		{
			if(this._secondaryLocked==false)
			{
				this._secondary[y][x]=arrColor;
			}
			else
			{
				throw new Error("the secondary buffer is locked");
			}
		}
	}
};

/**
 * This is private.
 * Draw the primary buffer to the screen, hiding the drawing implement details.
 * 
 * @method _drawPrimary
 * 
 */
re4.vm.Screen.prototype._drawPrimary=function()
{
	bmp_lib.render(this._id,this._primary,null);
};

/**
 * Lock the primary buffer so it will not be altered by system before unlock.
 * 
 * @method lockPrimary
 * @return {boolean} Weather locked successfully
 * 
 */
re4.vm.Screen.prototype.lockPrimary=function()
{
	if(this._primaryLocked==false)
	{
		return this._primaryLocked=true;
	}
	else
	{
		return false;
	}
};

/**
 * Unlock the primary buffer.
 * 
 * @method unlockPrimary
 * @return {boolean} Weather unlocked successfully
 */
re4.vm.Screen.prototype.unlockPrimary=function()
{
	if(this._primaryLocked==true)
	{

		this._primaryLocked=false;
		return true;
	}
	else
	{
		return false;
	}
};



/**
 * Lock the second buffer so it will not be altered by system before unlock.
 * 
 * @method lockSecondary
 * @return {boolean} Weather locked successfully
 */
re4.vm.Screen.prototype.lockSecondary=function()
{
	if(this._secondaryLocked==false)
	{
		return this._secondaryLocked=true;
	}
	else
	{
		return false;
	}
};

/**
 * Unlock the second buffer.
 * 
 * @method unlockSecondary
 * @return {boolean} Weather unlocked successfully
 */
re4.vm.Screen.prototype.unlockSecondary=function()
{
	if(this._secondaryLocked==true)
	{

		this._primaryLocked=false;
		return true;
	}
	else
	{
		return false;
	}
};

/**
 * Copy the secondary buffer to the primary buffer.
 * Primary and secondary must be both unlocked before flip.
 * 
 * @method flipDisplay
 */
re4.vm.Screen.prototype.flipDisplay=function()
{
	if(this._primaryLocked==false && this._secondaryLocked==false)
	{

		for(var i=0;i<this._height;i++)
		{
			for(var j=0;j<this._width;j++)
			{
				this._setBuffer(re4.vm.Screen.BUFFER_SELECT.PRIMARY,j,i,this._secondary[i][j]);
			}
		}
		this._drawPrimary();

	}
	else
	{
		throw new Error("primary and second buffer must be not locked");
	}
};

/**
 * Fill the primary buffer with the specified color.
 * 
 * @method fillPrimary
 * @param {re4.vm.Color} color The fill-in color
 */
re4.vm.Screen.prototype.fillPrimary=function(color)
{
	re4.fw.verifyArgs ( [re4.fw.isInstanceOf] , [re4.vm.Color] );

	for(var i=0;i<this._height;i++)
	{
		for(var j=0;j<this._width;j++)
		{
			this._setBuffer(re4.vm.Screen.BUFFER_SELECT.PRIMARY,j,i,color.arrayValue());
		}
	}
	this._drawPrimary();

};

/**
 * Fill the secondary buffer with the specified color.
 * 
 * @method fillSecondary
 * @param {re4.vm.Color} color The fill-in color
 */
re4.vm.Screen.prototype.fillSecondary=function(color)
{
	re4.fw.verifyArgs ( [re4.fw.isInstanceOf] , [re4.vm.Color] );

	for(var i=0;i<this._height;i++)
	{
		for(var j=0;j<this._width;j++)
		{
			this._setBuffer(re4.vm.Screen.BUFFER_SELECT.SECONDARY,j,i,color.arrayValue());

		}
	}
};


/**
 * Draw a point at the specified point within the specified buffer.
 * 
 * @method drawPoint
 * @param {number} x The X coordinate of the point
 * @param {number} y The Y coordinate of the point
 * @param {re4.vm.Color} color The color of the point 
 * @param {Enumerated by re4.vm.Window.BUFFER_SELECT} buffer Write to the primary/secondary buffer
 */
re4.vm.Screen.prototype.drawPoint=function(x,y,color,buffer)
{
	re4.fw.verifyArgs ( [re4.fw.isNumber,re4.fw.isNumber,re4.fw.isInstanceOf,re4.fw.isEnumeratedBy] , [re4.vm.Color,re4.vm.Screen.BUFFER_SELECT] );
	if(x>=0 && x<this._width && y>=0 && y<this._height)
	{
		this._setBuffer(buffer,parseInt(x),parseInt(y),color.arrayValue());
		if(buffer==re4.vm.Screen.BUFFER_SELECT.PRIMARY)
		{
			this._drawPrimary();
		}
	}
	else
	{
		//throw new Error("The window can not draw the specified point");
	}
};

/**
 * Draw a line segment from (x1,y1) to (x2,y2), within the specified buffer.
 * 
 * @method drawLine
 * @param {number} x1 The X coordinate of the start point
 * @param {number} y1 The Y coordinate of the start point
 * @param {number} x2 The X coordinate of the end point
 * @param {number} y2 The Y coordinate of the end point
 * @param {re4.vm.Color} color The color of the line 
 * @param {Enumerated by re4.vm.Window.BUFFER_SELECT} buffer Write to the primary/secondary buffer
 */
re4.vm.Screen.prototype.drawLine=function(x0,y0,xt,yt,color,buffer)
{
	re4.fw.verifyArgs ( [re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isInstanceOf,re4.fw.isEnumeratedBy] , [re4.vm.Color,re4.vm.Screen.BUFFER_SELECT] );
	var x1=parseInt(x0);
	var y1=parseInt(y0);
	var x2=parseInt(xt);
	var y2=parseInt(yt);
	if(x1!=x2)
	{
		var slope=(y2-y1)/(x2-x1);
		var coord;
		if(Math.abs(y2-y1)>Math.abs(x2-x1))
		{
			for(var i=Math.max(Math.min(y1,y2),0);i<=Math.min(Math.max(y1,y2),this._height);i++)
			{
				coord=parseInt((i-y1)/slope+x1);
				//alert("("+coord+","+i+")");
				this._setBuffer(buffer,coord, i,color.arrayValue());
			}
		}
		else
		{
			for(var i=Math.max(Math.min(x1,x2),0);i<=Math.min(Math.max(x1,x2),this._width);i++)
			{
				coord=parseInt(slope*(i-x1))+y1;
				//alert("("+i+","+coord+")");
				this._setBuffer(buffer, i,coord,color.arrayValue());
			}
		}

	}
	else
	{
		for(var i=re4.math.max(re4.math.min(y1,y2),0);i<=re4.math.min(re4.math.max(y1,y2),this._height);i++)
		{
			this._setBuffer(buffer, x1,i,color.arrayValue());
		}
	}
	if(buffer==re4.vm.Screen.BUFFER_SELECT.PRIMARY)
	{
		this._drawPrimary();
	}

};

/**
 * This is an Enumerator.
 * Select one of the buffers of one screen.
 * 
 * @class Screen.BUFFER_SELECT
 * @static
 * @final
 */
re4.vm.Screen.BUFFER_SELECT=new Object();

/**
 * Select the primary buffer of the screen.
 * @property PRIMARY
 * @type number
 * @static
 * @final
 */
re4.vm.Screen.BUFFER_SELECT.PRIMARY=1;

/**
 * Select the secondary buffer of the screen.
 * @property SECONDARY
 * @type number
 * @static
 * @final
 */
re4.vm.Screen.BUFFER_SELECT.SECONDARY=2;

