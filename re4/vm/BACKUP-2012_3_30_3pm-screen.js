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
	this._secondary=new Array(this._height);
	for(var i=0;i<this._height;i++)
	{
		this._secondary[i]=new Array(this._width);
		for(var j=0;j<this._width;j++)
		{
			this._secondary[i][j]=[0,0,0];
		}
	}	

	/**
	 * Primary buffer.
	 * @property _primary
	 * @type Two-dimension array of(Two-dimension array of [number,number,number])
	 * 
	 */
	/**
	 * Whether the primary buffer region is dirty.
	 * @property _isDirty
	 * @type boolean[][]
	 */

	/*
	 * Decide the region col and row numbers
	 */
	var regionRows,regionCols;

	if(this._width%re4.vm.Screen.REGION_WIDTH==0)
	{
		regionCols=parseInt(this._width/re4.vm.Screen.REGION_WIDTH);
	}
	else
	{
		regionCols=parseInt(this._width/re4.vm.Screen.REGION_WIDTH)+1;

	}
	if(this._height%re4.vm.Screen.REGION_HEIGHT==0)
	{
		regionRows=parseInt(this._height/re4.vm.Screen.REGION_HEIGHT);
	}
	else
	{
		regionRows=parseInt(this._height/re4.vm.Screen.REGION_HEIGHT)+1;
	}

	/*
	 * Create the main primary and isDirty
	 */
	this._isDirty=new Array(regionRows);
	this._primary=new Array(regionRows);

	/*
	 * Assign almost all the regions except the last col and last row
	 */
	for(var i=0;i<regionRows-1;i++)
	{
		this._isDirty[i]=new Array(regionCols);
		this._primary[i]=new Array(regionCols);
		for(var j=0;j<regionCols-1;j++)
		{
			this._isDirty[i][j]=false;
			this._primary[i][j]=new Array(re4.vm.Screen.REGION_HEIGHT);
			for(var k=0;k<this._primary[i][j].length;k++)
			{
				this._primary[i][j][k]=new Array(re4.vm.Screen.REGION_WIDTH);
				for(var l=0;l<this._primary[i][j][k].length;l++)
				{
					this._primary[i][j][k][l]=[0,0,0];
				}
			}
		}
	}

	/*
	 * Assign the last col except the last cell on the last row
	 */
	for(var i=0;i<regionRows-1;i++)
	{
		this._isDirty[i][regionCols-1]=false;
		if(re4.vm.Screen.REGION_WIDTH%10==0)
		{

			this._primary[i][regionCols-1]=new Array(re4.vm.Screen.REGION_WIDTH);
		}
		else
		{
			this._primary[i][regionCols-1]=new Array(re4.vm.Screen.REGION_WIDTH%10);
		}
		for(var j=0;j<this._primary[i][regionCols-1].length;j++)
		{
			this._primary[i][regionCols-1][j]=new Array(re4.vm.Screen.REGION_HEIGHT);
			for(var k=0;k<re4.vm.Screen.REGION_HEIGHT;k++)
			{
				this._primary[i][regionCols-1][j][k]=[0,0,0];
			}
		}

	}

	/*
	 * Assign the last row except the last cell on the last col
	 */
	this._isDirty[regionRows-1]=new Array(regionCols);
	this._primary[regionRows-1]=new Array(regionCols);
	for(var i=0;i<regionCols-1;i++)
	{
		this._isDirty[regionRows-1][i]=false;
		this._primary[regionRows-1][i]=new Array(re4.vm.Screen.REGION_WIDTH);
		for(var j=0;j<re4.vm.Screen.REGION_WIDTH;j++)
		{
			if(this._height%re4.vm.Screen.REGION_HEIGHT!=0)
			{
				this._primary[regionRows-1][i][j]=new Array(this._height%re4.vm.Screen.REGION_HEIGHT);
			}
			else
			{
				this._primary[regionRows-1][i][j]=new Array(re4.vm.Screen.REGION_HEIGHT);
			}
			for(var k=0;k<this._primary[regionRows-1][i][j].length;k++)
			{
				this._primary[regionRows-1][i][j][k]=[0,0,0];
			}
		}
	}

	/*
	 * Assign the last cell on the last row and the last col
	 */
	this._isDirty[regionRows-1][regionCols-1]=false;
	if(this._width%re4.vm.Screen.REGION_WIDTH!=0)
	{
		this._primary[regionRows-1][regionCols-1]=new Array(this._width%re4.vm.Screen.REGION_WIDTH);
	}
	else
	{
		this._primary[regionRows-1][regionCols-1]=new Array(re4.vm.Screen.REGION_WIDTH);
	}
	for(var i=0;i<this._primary[regionRows-1][regionCols-1].length;i++)
	{
		if(this._height%re4.vm.Screen.REGION_HEIGHT!=0)
		{
			this._primary[regionRows-1][regionCols-1][i]=new Array(this._height%re4.vm.Screen.REGION_HEIGHT);
		}
		else
		{
			this._primary[regionRows-1][regionCols-1][i]=new Array(re4.vm.Screen.REGION_HEIGHT);
		}
		for(var k=0;k<this._primary[regionRows-1][regionCols-1][i].length;k++)
		{
			this._primary[regionRows-1][regionCols-1][i][k]=[0,0,0];
		}
	}
	//re4.fw.debug(new Error(),"primary");
	/*
	for(var i=0;i<this._primary.length;i++)
	{
		for(var j=0;j<this._primary[i].length;j++)
		{
			for(var k=0;k<this._primary[i][j].length;k++)
			{
				for(var l=0;l<this._primary[i][j][k].length;l++)
				{
					re4.fw.debug(new Error(),i+","+j+","+k+","+l);
					re4.fw.debug(new Error(),this._primary[i][j][k][l]);
				}
			}
		}
	}
	 */
	//re4.fw.debug(new Error(),this._primary);

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
	var html="";
	for(var i=0;i<this._primary.length;i++)
	{
		for(var j=0;j<this._primary[i].length;j++)
		{
			var regId=this._id+"reg"+i+"_"+j;
			html=html+"<img id=\""+regId+"\" />";
		}
		html=html+"<br />";
	}
	container.innerHTML=html;
	for(var i=0;i<this._primary.length;i++)
	{
		for(var j=0;j<this._primary[i].length;j++)
		{
			var regId=this._id+"reg"+i+"_"+j;
			bmp_lib.render(regId,this._primary[i][j],null);
		}
	}






	/**
	 * The container div of this window, all graphic element should be added as child elements of this element.
	 * @property _container
	 * @type DOM Element
	 */
	//this._container=document.getElementById(this._id);
	//bmp_lib.render(this._id,this._primary,null);

};

re4.vm.Screen.REGION_WIDTH=10;
re4.vm.Screen.REGION_HEIGHT=10;

re4.vm.Screen.prototype._setIsDirty=function(x,y,isDirty)
{
	var map=new Object();
	map[0]=Math.floor(y/re4.vm.Screen.REGION_HEIGHT);
	map[1]=Math.floor(x/re4.vm.Screen.REGION_WIDTH);

	//re4.fw.debug(new Error(),map);
	if(map[0]>=0 && map[0]<this._isDirty.length && map[1]>=0 && map[1]<this._isDirty[0].length)
	{
		this._isDirty[map[0]][map[1]]=isDirty;
	}
	else
	{
		throw new Error("isDirty map failed:x="+x+",y="+y+",map0="+map[0]+",map1="+map[1]);
	}
	return map;
};
re4.vm.Screen.prototype._getIsDirty=function(regRow,regCol)
{
	if(regRow>=0 && regRow<this._isDirty.length && regCol>=0 && regCol<this._isDirty[0].length)
	{
		return this._isDirty[regRow][regCol];
	}
	else
	{
		throw new Error("no such region:"+regRow+","+regCol);
	}
};
re4.vm.Screen.prototype._getRegion=function(x,y)
{
	var map=new Object();
	map[0]=Math.floor(y/re4.vm.Screen.REGION_HEIGHT);
	map[1]=Math.floor(x/re4.vm.Screen.REGION_WIDTH);
	if(map[0]>=0 && map[0]<this._primary.length && map[1]>=0 && map[1]<this._primary[0].length)
	{
		return this._primary[map[0]][map[1]];
	}
	else
	{
		throw new Error("region map failed:x="+x+",y="+y+",map0="+map[0]+",map1="+map[1]+",region_rows="+this._isDirty.length+",region_cols="+this._isDirty[0].length);
	}
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
			if(this._primaryLocked==false)
			{
				this._getRegion(x, y)[x%re4.vm.Screen.REGION_WIDTH][y%re4.vm.Screen.REGION_HEIGHT]=arrColor;
				//re4.fw.debug(new Error(),this._getRegion(x, y));
				this._setIsDirty(x,y,true);
				//re4.fw.debug(new Error(),this._isDirty);
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
	for(var i=0;i<this._isDirty.length;i++)
	{
		for(var j=0;j<this._isDirty[i].length;j++)
		{
			if(this._isDirty[i][j]==true)
			{
				var regId=this._id+"reg"+i+"_"+j;				
				bmp_lib.render(regId,this._primary[i][j],null);
				this._isDirty[i][j]=false;
				re4.fw.debug(new Error(),regId+" redrawed");
				re4.fw.debug(new Error(),this._primary[i][j]);
			}
		}
	}
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

