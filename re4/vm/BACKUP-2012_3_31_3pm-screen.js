/**
 * Virtual computer for re4 
 * @module re4.vm
 * @namespace re4.vm
 */

re4.fw.requires(["re4.fw","re4.vm"]);

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

	/*
	 * Decide the region col and row numbers
	 */
	var regionRows=Math.ceil(this._height/re4.vm.Screen.REGION_HEIGHT);
	var regionCols=Math.ceil(this._width/re4.vm.Screen.REGION_WIDTH);	
	var html="";
	for(var i=0;i<regionRows;i++)
	{
		for(var j=0;j<regionCols;j++)
		{
			var regId=this._id+"reg"+i+"_"+j;
			html=html+"<img id=\""+regId+"\" />";
		}
		html=html+"<br />";
	}
	container.innerHTML=html;

	/**
	 * Primary buffer.
	 * @property _primary
	 * @type Two-dimension array of(Two-dimension array of [number,number,number])
	 * 
	 */
	/**
	 * Secondary buffer.
	 * @property _secondary
	 * @type [number,number,number][][]
	 */
	this._primary=new Array(regionRows); 
	this._secondary=new Array(regionRows);
	for(var i=0;i<regionRows-1;i++)
	{
		this._primary[i]=new Array(regionCols);
		this._secondary[i]=new Array(regionCols);
		for(j=0;j<regionCols-1;j++)
		{
			var regId=this._id+"reg"+i+"_"+j;
			this._primary[i][j]=new re4.vm.Screen._Region(document.getElementById(regId),re4.vm.Screen.REGION_WIDTH,re4.vm.Screen.REGION_HEIGHT,new re4.vm.Color(0,0,0));
			this._secondary[i][j]=new re4.vm.Screen._Region(document.getElementById(regId),re4.vm.Screen.REGION_WIDTH,re4.vm.Screen.REGION_HEIGHT,new re4.vm.Color(0,0,0));
		}
	}

	var lastWidth,lastHeight;

	if(this._width%re4.vm.Screen.REGION_WIDTH==0)
	{
		lastWidth=re4.vm.Screen.REGION_WIDTH
	}
	else
	{
		lastWidth=this._width%re4.vm.Screen.REGION_WIDTH;
	}
	for(var i=0;i<regionRows-1;i++)
	{
		var regId=this._id+"reg"+i+"_"+(regionCols-1);
		this._primary[i][regionCols-1]=new re4.vm.Screen._Region(document.getElementById(regId),lastWidth,re4.vm.Screen.REGION_HEIGHT,new re4.vm.Color(0,0,0));
		this._secondary[i][regionCols-1]=new re4.vm.Screen._Region(document.getElementById(regId),lastWidth,re4.vm.Screen.REGION_HEIGHT,new re4.vm.Color(0,0,0));
	}

	this._primary[regionRows-1]=new Array(regionCols);
	this._secondary[regionRows-1]=new Array(regionCols);
	if(this._height%re4.vm.Screen.REGION_HEIGHT==0)
	{
		lastHeight=re4.vm.Screen.REGION_HEIGHT;
	}
	else
	{
		lastHeight=this._height%re4.vm.Screen.REGION_HEIGHT;
	}
	for(var i=0;i<regionCols-1;i++)
	{
		var regId=this._id+"reg"+(regionRows-1)+"_"+i;
		this._primary[regionRows-1][i]=new re4.vm.Screen._Region(document.getElementById(regId),re4.vm.Screen.REGION_WIDTH,lastHeight,new re4.vm.Color(0,0,0));
		this._secondary[regionRows-1][i]=new re4.vm.Screen._Region(document.getElementById(regId),re4.vm.Screen.REGION_WIDTH,lastHeight,new re4.vm.Color(0,0,0));
	}

	var regId=this._id+"reg"+(regionRows-1)+"_"+(regionCols-1);
	this._primary[regionRows-1][regionCols-1]=new re4.vm.Screen._Region(document.getElementById(regId),lastWidth,lastHeight,new re4.vm.Color(0,0,0));
	this._secondary[regionRows-1][regionCols-1]=new re4.vm.Screen._Region(document.getElementById(regId),lastWidth,lastHeight,new re4.vm.Color(0,0,0));

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

	for(var i=0;i<this._primary.length;i++)
	{
		for(var j=0;j<this._primary[i].length;j++)
		{
			this._primary[i][j].reDraw();
		}
	}
};

re4.vm.Screen.REGION_WIDTH=10;
re4.vm.Screen.REGION_HEIGHT=10;

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
re4.vm.Screen.prototype._setBuffer=function(buffer,x,y,color)
{
	if(x>=0 && x<this._width && y>=0 && y<this._height)
	{
		if(buffer==re4.vm.Screen.BUFFER_SELECT.PRIMARY )
		{
			if(this._primaryLocked==false)
			{
				this._primary[Math.floor(y/re4.vm.Screen.REGION_HEIGHT)][Math.floor(x/re4.vm.Screen.REGION_WIDTH)].set(x%re4.vm.Screen.REGION_WIDTH,y%re4.vm.Screen.REGION_HEIGHT,color);
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
				this._secondary[Math.floor(y/re4.vm.Screen.REGION_HEIGHT)][Math.floor(x/re4.vm.Screen.REGION_WIDTH)].set(x%re4.vm.Screen.REGION_WIDTH,y%re4.vm.Screen.REGION_HEIGHT,color);
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
	var count=0;
	for(var i=0;i<this._primary.length;i++)
	{
		for(var j=0;j<this._primary[i].length;j++)
		{
			if(this._primary[i][j].reDraw())
			{
				count++;
			}
		}
	}
	return count;
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
		var perf1,perf2;
		perf1=new Date();
		for(var i=0;i<this._primary.length;i++)
		{
			for(var j=0;j<this._primary[i].length;j++)
			{
				this._primary[i][j].copy(this._secondary[i][j]);
			}
		}
		perf2=new Date();
		re4.fw.debug(new Error(),"flip: data operations costed "+(perf2.getTime()-perf1.getTime())+" ms");
		perf1=new Date();
		var ret= this._drawPrimary();
		perf2=new Date();
		re4.fw.debug(new Error(),"flip: render costed "+(perf2.getTime()-perf1.getTime())+" ms");
		return ret;
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
	for(var y=0;y<this._height;y++)
	{
		for(var x=0;x<this._width;x++)
		{
			this._setBuffer(re4.vm.Screen.BUFFER_SELECT.PRIMARY, x, y, color);

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

	var count=0,perf1,perf2;
	for(var y=0;y<this._height;y++)
	{
		for(var x=0;x<this._width;x++)
		{
			count++;
			perf1=new Date();
			this._setBuffer(re4.vm.Screen.BUFFER_SELECT.SECONDARY, x, y, color);
			perf2=new Date();
			if(count<10)
			{
				re4.fw.debug(new Error(),"set buffer costed: "+(perf2.getTime()-perf1.getTime())+" ms");
			}
		}
	}
	re4.fw.debug(new Error(),"fill second set buffer for "+count+" times");

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
		this._setBuffer(buffer,parseInt(x),parseInt(y),color);
		if(buffer==re4.vm.Screen.BUFFER_SELECT.PRIMARY)
		{
			this._drawPrimary();
		}
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
				this._setBuffer(buffer,coord, i,color);
			}
		}
		else
		{
			for(var i=Math.max(Math.min(x1,x2),0);i<=Math.min(Math.max(x1,x2),this._width);i++)
			{
				coord=parseInt(slope*(i-x1))+y1;
				//alert("("+i+","+coord+")");
				this._setBuffer(buffer, i,coord,color);
			}
		}

	}
	else
	{
		for(var i=re4.math.max(re4.math.min(y1,y2),0);i<=re4.math.min(re4.math.max(y1,y2),this._height);i++)
		{
			this._setBuffer(buffer, x1,i,color);
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

re4.vm.Screen._Region=function(target,width,height,color)
{
	re4.fw.verifyArgs ([re4.fw.isElement,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isInstanceOf],[re4.vm.Color]);
	this._container=target;
	this._width=width;
	this._height=height;
	this._pix=new Array(height);
	this._pixDirty=null;
	for(var i=0;i<height;i++)
	{
		this._pix[i]=new Array(width);
		for(var j=0;j<width;j++)
		{
			this._pix[i][j]=color;
		}
	}
	this._isDirty=true;
	this._bmp=null;
	this._dataURI=null;

};


re4.vm.Screen._Region.prototype.isDirty=function()
{
	return this._isDirty;
};

re4.vm.Screen._Region.prototype.set=function(x,y,color)
{
	re4.fw.verifyArgs ([re4.fw.isNumber,re4.fw.isNumber,re4.fw.isInstanceOf],[re4.vm.Color]);
	if(x>=0 && x<this._width && y>=0 && y<this._height)
	{
		if(!this._pix[y][x].equals(color))
		{
			this._pix[y][x]=color;
			this._isDirty=true;
		}
	}
	else
	{
		throw new Error("index out of the region:indX="+indX+",indY="+indY);
	}

};

re4.vm.Screen._Region.prototype.get=function(x,y)
{
	re4.fw.verifyArgs ([re4.fw.isNumber,re4.fw.isNumber]);
	if(x>=0 && x<this._width && y>=0 && y<this._height)
	{
		return this._pix[y][x];
	}
	else
	{
		throw new Error("index out of the region:x="+x+"width="+this._width+",y="+y+",height="+this._height);
	}
};

re4.vm.Screen._Region.prototype.copy=function(second)
{	
	re4.fw.verifyArgs ([re4.fw.isInstanceOf],[re4.vm.Screen._Region]);
	var dir=false;
	for(var i=0;i<this._height;i++)
	{
		for(var j=0;j<this._width;j++)
		{
			if(!this._pix[i][j].equals(second.get(j,i)))
			{
				this._pix[i][j]=second.get(j,i);
				dir=true;
			}
		}
	}
	this._isDirty=dir;
};


re4.vm.Screen._Region.prototype.reDraw=function()
{
	if(this._isDirty)
	{
		this._pixToBMP();
		this._bmpToBase64();
		this._container.src=this._dataURI;
		this._isDirty=false;
		return true;
	}
	else
	{
		return false;
	}
};

re4.vm.Screen._Region.prototype._pixToBMP=function()
{
	var count=0;
	var tmp=new Array();
	for(var i=0;i<this._pix.length;i++)
	{
		for(var j=this._pix[i].length-1;j>=0;j--)
		{
			tmp[count]=this._pix[i][j].hexStrValue();
			count++;
		}
	}

	/*
	 * !!ATTENTION!! Function bmp_rgb swallows data of the third parameter!
	 */
	this._bmp=bmp_rgb(this._width,this._height,tmp);
};

re4.vm.Screen._Region.prototype._bmpToBase64=function()
{
	this._dataURI=datauri("image/bmp",this._bmp);
};
re4.fw.installGetters(re4.vm.Screen._Region.prototype,["_width","_height","_container"]);



