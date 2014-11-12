/**
 * Virtual computer for re4 
 * @module re4.vm
 * @namespace re4.vm
 */

re4.fw.requires(["re4.fw","re4.vm"]);

/**
 * Initialize the video system and install a window on the DOM element with a specific resolution and bit depth.
 * 
 * @class Window
 * @constructor
 * @param {DOM Element} container  The container element of the window
 * @param {number} width Window width
 * @param {number} height Window height
 * @param {Enumerated By re4.vm.Color.MODE} depth Bit depth per pixel
 * 
 */
re4.vm.Window=function(container,width,height,depth)
{
	re4.fw.verifyArgs ([re4.fw.isElement,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isEnumeratedBy],[re4.vm.Color.MODE] );

	/**
	 * Unique id of this Window, container DOM element also use this id.
	 * @property _id
	 * @type String
	 */
	this._id=new String("re4win"+Math.random()*1000000000).split('.')[0];

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
	 * Depth.
	 * @property _depth
	 * @type number
	 */
	this._depth=depth;

	/**
	 * Secondary buffer.
	 * @property _secondary
	 * @type String
	 */
	this._secondary="";

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
	container.innerHTML="<div id=\""+this._id+"\" style=\"position:relative;width:"+this._width+"px;height:"+this._height+"px;background-color:black;\"></div>";

	/**
	 * The container div of this window, all graphic element should be added as child elements of this element.
	 * @property _container
	 * @type DOM Element
	 */
	this._container=document.getElementById(this._id);
};



/**
 * Lock the primary buffer so it will not be altered by system before unlock.
 * 
 * @method lockPrimary
 * @return {boolean} Weather locked successfully
 * 
 */
re4.vm.Window.prototype.lockPrimary=function()
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
re4.vm.Window.prototype.unlockPrimary=function()
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
re4.vm.Window.prototype.lockSecondary=function()
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
re4.vm.Window.prototype.unlockSecondary=function()
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
 * @return {boolean} Weather fliped successfully
 */
re4.vm.Window.prototype.flipDisplay=function()
{
	if(this._primaryLocked==false && this._secondaryLocked==false)
	{
		this._container.innerHTML=this._secondary;
		return true;
	}
	else
	{
		return false;
	}

};

/**
 * Fill the primary buffer with the specified color.
 * 
 * @method fillPrimary
 * @param {re4.vm.Color} color The fill-in color
 * @return {boolean} Whether filled successful
 */
re4.vm.Window.prototype.fillPrimary=function(color)
{
	re4.fw.verifyArgs ( [re4.fw.isInstanceOf] , [re4.vm.Color] );
	if(this._primaryLocked==false)
	{
		this._container.innerHTML="<div style=\"width:"+this._width+"px;height:"+this._height+"px;background-color:"+color.cssValue()+";\"></div>";
		return true;
	}
	else
	{
		return false;
	}
};

/**
 * Fill the secondary buffer with the specified color.
 * 
 * @method fillSecondary
 * @param {re4.vm.Color} color The fill-in color
 * @return {boolean} Whether filled successful
 */
re4.vm.Window.prototype.fillSecondary=function(color)
{
	re4.fw.verifyArgs ( [re4.fw.isInstanceOf] , [re4.vm.Color] );
	if(this._secondaryLocked==false)
	{
		this._secondary="<div style=\"width:"+this._width+"px;height:"+this._height+"px;background-color:"+color.cssValue()+";\"></div>";
		return true;
	}
	else
	{
		return false;
	}
};

re4.vm.Window.prototype._appendBuffer=function(buffer,html)
{

	if(buffer==re4.vm.Window.BUFFER_SELECT.PRIMARY )
	{
		if(this._primaryLocked==false)
		{
			this._primaryLocked=true;
			this._container.innerHTML=this._container.innerHTML+html;
			this._primaryLocked=false;
			return true;
		}
		else
		{
			throw new Error("The primary buffer is locked");
		}


	}
	else if(buffer==re4.vm.Window.BUFFER_SELECT.SECONDARY )
	{
		if(this._secondaryLocked==false)
		{
			this._secondaryLocked=true;
			this._secondary=this._secondary+html;
			return true;	
			this._secondaryLocked=false;
		}
		else
		{
			throw new Error("The secondary buffer is locked");
		}

	}
	else
	{
		return false;
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
 * @return {boolean} Whether successful drawed
 */
re4.vm.Window.prototype.drawPoint=function(x,y,color,buffer)
{
	re4.fw.verifyArgs ( [re4.fw.isNumber,re4.fw.isNumber,re4.fw.isInstanceOf,re4.fw.isEnumeratedBy] , [re4.vm.Color,re4.vm.Window.BUFFER_SELECT] );
	if(x>=0 && x<this._width && y>=0 && y<this._height)
	{
		var html=this._htmlPoint(x,y,color);
		this._appendBuffer(buffer,html);
	}
	else
	{
		throw new Error("The window can not draw the specified point");
	}
};

re4.vm.Window.prototype._htmlPoint=function(x,y,color)
{
	re4.fw.verifyArgs ( [re4.fw.isNumber,re4.fw.isNumber,re4.fw.isInstanceOf] , [re4.vm.Color] );
	var html="<div style=\"position:absolute;height:0px;left:"+x+"px;top:"+y+"px;border-right: 1px solid "+color.cssValue()+";border-bottom:1px solid "+color.cssValue()+"\" ></div>";
	return html;
};
re4.vm.Window.prototype._htmlRectangle=function(x,y,width,height,color)
{
	re4.fw.verifyArgs ( [re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isInstanceOf] , [re4.vm.Color] );
	var html="<div style=\"position:absolute;left:"+x+"px;top:"+y+"px;width:"+width+"px;height:"+height+"px;background-color:"+color.cssValue()+";\"></div>";
	return html;
};

re4.vm.Window.prototype.drawClipLine=function(startX,startY,termX,termY,color,buffer)
{
	re4.fw.verifyArgs ( [re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isInstanceOf,re4.fw.isEnumeratedBy] , [re4.vm.Color,re4.vm.Window.BUFFER_SELECT] );
	if(startX>=0 && startX<this._width && startY>=0 && startY<this._height && termX>=0 && termX<this._width && termY>=0 && termY<this._height)
	{
		if(startX==termX || startY==termY)
		{
			if(startX==termX && startY==termY)
			{
				this.drawPoint(startX,startY,color,buffer);
				return true;
			}
			else if(startX==termX )
			{
				this._appendBuffer(buffer,this._htmlRectangle(startX,Math.min(startY,termY),1,Math.abs(termY-startY),color));
				return true;
			}
			else
			{
				this._appendBuffer(buffer,this._htmlRectangle(Math.min(startX,termX),startY,Math.abs(termX-startX),1,color));
				return true;
			}

		}
		else
		{
			var html="";
			var x0,y0,xt,yt;
			if(startX<termX)
			{
				x0=startX;
				y0=startY;
				xt=termX;
				yt=termY;
			}
			else
			{
				x0=termX;
				y0=termY;
				xt=startX;
				yt=startY;
			}
			var slope=(termY-startY)/(termX-startX);
			var steep="y";
			if(Math.abs(slope)<1)
			{
				steep="x";
			}
			if(steep=="x")
			{
				re4.fw.debug(new Error(),"slope="+slope+",steep="+steep+","+y0+"->"+yt);

				for(var i=y0;;)
				{
					if(termY>y0)
					{
						html=html+this._htmlRectangle(1/slope*i-1/slope*startY+startX, i,(1/slope), 1, color);

					}
					else
					{
						html=html+this._htmlRectangle(1/slope*i-1/slope*startY+startX, i-(1/slope),(1/slope), 1, color);

					}
					if(i<yt)
					{
						i++
					}
					else if(i>yt)
					{
						i--;
					}
					else
					{
						break;
					}
					alert(html);
				}

			}
			else
			{
				re4.fw.debug(new Error(),"steep="+steep+","+x0+"->"+Math.max(startX,termX));

				for(var i=x0;;)
				{
					if(termY>y0)
					{
						html=html+this._htmlRectangle(i,slope*i-startX*slope+startY,1, slope, color);
					}
					else
					{
						html=html+this._htmlRectangle(i,slope*i-startX*slope+startY,1, slope, color);
					}
					if(i<xt)
					{
						i++;
					}
					else if(i>xt)
					{
						i--;
					}
					else
					{
						break;
					}
				}

			}
			this._appendBuffer(buffer, html);
			return true;
		}
	}
	else
	{
		throw new Error("The window can not draw the specified line");
	}
};



/**
 * This is private
 * Generate a right triangle rendered by an html div.
 * 
 * @method _htmlRightTriangle
 * @param {number} x The X coordinate of the point
 * @param {number} y The Y coordinate of the point
 * @param {number} width The width of the triangle
 * @param {number} height The height of the triangle
 * @param {re4.vm.Color} color The color of the point 
 * @param {Enumerated by re4.vm.Window._RIGHT_TRIANGLE} dir Direction of the right triangle
 * @return {String} The html code
 */
re4.vm.Window.prototype._htmlRightTriangle=function(x,y,width,height,color,dir)
{
	re4.fw.verifyArgs ( [re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isInstanceOf,re4.fw.isEnumeratedBy,re4.fw.isEnumeratedBy] , [re4.vm.Color,re4.vm.Window._RIGHT_TRIANGLE,re4.vm.Window.BUFFER_SELECT] );
	if(x>=0 && y>=0 && width>0 && height>0 && x+width<this._width && y+height<this._height)
	{
		var html="<div style=\"position:absolute;height:0px;left:"+x+"px;top:"+y+"px;";
		var hor="border-right: "+width+"px solid ";
		var ver;
		if(dir==re4.vm.Window._RIGHT_TRIANGLE.EAST_NORTH || dir==re4.vm.Window._RIGHT_TRIANGLE.WEST_SOUTH)
		{
			ver="border-bottom: "+height+"px solid ";
		}
		else
		{
			ver="border-top: "+height+"px solid ";
		}
		if(dir==re4.vm.Window._RIGHT_TRIANGLE.EAST_SOUTH || dir==re4.vm.Window._RIGHT_TRIANGLE.EAST_NORTH)
		{
			ver=ver+"transparent;";
			hor=hor+color.cssValue()+";";
		}
		else
		{
			hor=hor+"transparent;";
			ver=ver+color.cssValue()+";";
		}
		html=html+hor+ver+"\" ></div>";
		return html;
	}

	else
	{
		throw new Error("The window can not draw the specified right triangle");
	}
};

/**
 * This is an Enumerator.
 * Select on of the buffers of one window.
 * 
 * @class Window.BUFFER_SELECT
 * @static
 * @final
 */
re4.vm.Window.BUFFER_SELECT=new Object();

/**
 * Select the primary buffer of the window.
 * @property PRIMARY
 * @type number
 * @static
 * @final
 */
re4.vm.Window.BUFFER_SELECT.PRIMARY=1;

/**
 * Select the secondary buffer of the window.
 * @property SECONDARY
 * @type number
 * @static
 * @final
 */
re4.vm.Window.BUFFER_SELECT.SECONDARY=2;


/**
 * This is an Enumerator.This is private.
 * Right triangle categories.
 * 
 * @class Window._RIGHT_TRIANGLE
 * @static
 * @final
 */
re4.vm.Window._RIGHT_TRIANGLE=new Object();

/**
 * Right triangles whose right angle towards east north.
 * @property EAST_NORTH
 * @type number
 * @static
 * @final
 */
re4.vm.Window._RIGHT_TRIANGLE.EAST_NORTH=1;

/**
 * Right triangles whose right angle towards east south.
 * @property EAST_SOUTH
 * @type number
 * @static
 * @final
 */
re4.vm.Window._RIGHT_TRIANGLE.EAST_SOUTH=2;

/**
 * Right triangles whose right angle towards west north.
 * @property WEST_NORTH
 * @type number
 * @static
 * @final
 */
re4.vm.Window._RIGHT_TRIANGLE.WEST_NORTH=3;

/**
 * Right triangles whose right angle towards west south.
 * @property WEST_SOUTH
 * @type number
 * @static
 * @final
 */
re4.vm.Window._RIGHT_TRIANGLE.WEST_SOUTH=4;