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
	this._id=new String("re4scr"+Math.floor(Math.random()*1000000000));

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

	/**
	 * The region row numbers of this screen.
	 * @property _regionRows
	 * @type number
	 */
	this._regionRows=regionRows;	

	/**
	 * The region col numbers of this screen.
	 * @property _regionRows
	 * @type number
	 */
	this._regionCols=regionCols;
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
			this._primary[i][j]=new re4.vm.Screen._Region(document.getElementById(regId),re4.vm.Screen.REGION_WIDTH,re4.vm.Screen.REGION_HEIGHT,"000000");
			this._secondary[i][j]=new re4.vm.Screen._Region(document.getElementById(regId),re4.vm.Screen.REGION_WIDTH,re4.vm.Screen.REGION_HEIGHT,"000000");
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
		this._primary[i][regionCols-1]=new re4.vm.Screen._Region(document.getElementById(regId),lastWidth,re4.vm.Screen.REGION_HEIGHT,"000000");
		this._secondary[i][regionCols-1]=new re4.vm.Screen._Region(document.getElementById(regId),lastWidth,re4.vm.Screen.REGION_HEIGHT,"000000");
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
		this._primary[regionRows-1][i]=new re4.vm.Screen._Region(document.getElementById(regId),re4.vm.Screen.REGION_WIDTH,lastHeight,"000000");
		this._secondary[regionRows-1][i]=new re4.vm.Screen._Region(document.getElementById(regId),re4.vm.Screen.REGION_WIDTH,lastHeight,"000000");
	}

	var regId=this._id+"reg"+(regionRows-1)+"_"+(regionCols-1);
	this._primary[regionRows-1][regionCols-1]=new re4.vm.Screen._Region(document.getElementById(regId),lastWidth,lastHeight,"000000");
	this._secondary[regionRows-1][regionCols-1]=new re4.vm.Screen._Region(document.getElementById(regId),lastWidth,lastHeight,"000000");

	for(var i=0;i<this._primary.length;i++)
	{
		for(var j=0;j<this._primary[i].length;j++)
		{
			this._primary[i][j].reDraw();
		}
	}
};

/**
 * Width config of region.
 * @property REGION_WIDTH
 * @static
 * @final
 * @type number
 */
re4.vm.Screen.REGION_WIDTH=10;

/**
 * Height config of region.
 * @property REGION_HEIGHT
 * @static
 * @final
 * @type number
 */
re4.vm.Screen.REGION_HEIGHT=10;

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
 * Copy the secondary buffer to the primary buffer.
 * @method flipDisplay
 */
re4.vm.Screen.prototype.flipDisplay=function()
{
	var dir;
	for(var i=0;i<this._primary.length;i++)
	{
		for(var j=0;j<this._primary[i].length;j++)
		{
			dir=false;
			for(var k=0;k<this._primary[i][j].height;k++)
			{
				for(var l=0;l<this._primary[i][j].width;l++)
				{
					if(this._primary[i][j].pix[k][l]!=this._secondary[i][j].pix[k][l])
					{
						this._primary[i][j].pix[k][l]=this._secondary[i][j].pix[k][l];
						dir=true;
					}
				}
			}
			this._primary[i][j].isDirty=dir;
		}
	}
	var ret= this._drawPrimary();
	return ret;

};

/**
 * Fill the primary buffer with the specified color.
 * 
 * @method fillPrimary
 * @param {re4.vm.Color} color The fill-in color
 */
re4.vm.Screen.prototype.fillPrimary=function(color)
{
	re4.fw.verifyArgs ( [re4.fw.isString]);
	for(var i=0;i<this._regionRows;i++)
	{
		for(var j=0;j<this._regionCols;j++)
		{
			for(var k=0;k<this._primary[i][j].height;k++)
			{
				for(var l=0;l<this._primary[i][j].width;l++)
				{
					this._primary[i][j].pix[k][l]=color;
				}
			}
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
	re4.fw.verifyArgs ( [re4.fw.isString]);
	for(var i=0;i<this._regionRows;i++)
	{
		for(var j=0;j<this._regionCols;j++)
		{
			for(var k=0;k<this._primary[i][j].height;k++)
			{
				for(var l=0;l<this._primary[i][j].width;l++)
				{
					this._secondary[i][j].pix[k][l]=color;
				}
			}
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
	re4.fw.verifyArgs ( [re4.fw.isNumber,re4.fw.isNumber,re4.fw.isString,re4.fw.isEnumeratedBy] , [re4.vm.Screen.BUFFER_SELECT] );
	if(x>=0 && x<this._width && y>=0 && y<this._height)
	{
		if(buffer==re4.vm.Screen.BUFFER_SELECT.PRIMARY)
		{
			this._primary[Math.floor(y/re4.vm.Screen.REGION_HEIGHT)][Math.floor(x/re4.vm.Screen.REGION_WIDTH)].pix[y%re4.vm.Screen.REGION_HEIGHT][x%re4.vm.Screen.REGION_WIDTH]=color;
			this._drawPrimary();
		}
		else
		{
			this._secondary[Math.floor(y/re4.vm.Screen.REGION_HEIGHT)][Math.floor(x/re4.vm.Screen.REGION_WIDTH)].pix[y%re4.vm.Screen.REGION_HEIGHT][x%re4.vm.Screen.REGION_WIDTH]=color;
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
	re4.fw.verifyArgs ( [re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isString,re4.fw.isEnumeratedBy] , [re4.vm.Screen.BUFFER_SELECT] );
	var x1=parseInt(x0);
	var y1=parseInt(y0);
	var x2=parseInt(xt);
	var y2=parseInt(yt);
	var opBuffer;
	if(buffer==re4.vm.Screen.BUFFER_SELECT.PRIMARY)
	{
		opBuffer=this._primary;
	}
	else
	{
		opBuffer=this._secondary;
	}
	if(x1!=x2)
	{
		var slope=(y2-y1)/(x2-x1);
		var coord;

		if(Math.abs(y2-y1)>Math.abs(x2-x1))
		{
			for(var i=Math.max(Math.min(y1,y2),0);i<=Math.min(Math.max(y1,y2),this._height-1);i++)
			{
				coord=parseInt((i-y1)/slope+x1);
				if(coord>=0 && coord<this._width)
				{
					try
					{
						opBuffer[Math.floor(i/re4.vm.Screen.REGION_HEIGHT)][Math.floor(coord/re4.vm.Screen.REGION_WIDTH)].pix[i%re4.vm.Screen.REGION_HEIGHT][coord%re4.vm.Screen.REGION_WIDTH]=color;
					}
					catch(e)
					{
						re4.fw.debug(e,"A:x="+coord+",y="+i+",regRow="+Math.floor(i/re4.vm.Screen.REGION_HEIGHT)+",regCol="+Math.floor(coord/re4.vm.Screen.REGION_WIDTH)+",pixRow="+i%re4.vm.Screen.REGION_HEIGHT+",pixCol="+coord%re4.vm.Screen.REGION_WIDTH);

					}
				}
			}
		}
		else
		{
			for(var i=Math.max(Math.min(x1,x2),0);i<=Math.min(Math.max(x1,x2),this._width-1);i++)
			{
				coord=parseInt(slope*(i-x1))+y1;
				if(coord>=0 && coord<this._height)
				{
					try
					{
						opBuffer[Math.floor(coord/re4.vm.Screen.REGION_HEIGHT)][Math.floor(i/re4.vm.Screen.REGION_WIDTH)].pix[coord%re4.vm.Screen.REGION_HEIGHT][i%re4.vm.Screen.REGION_WIDTH]=color;
					}
					catch(e)
					{
						re4.fw.debug(e,"B:x="+i+",y="+coord+",regRow="+Math.floor(coord/re4.vm.Screen.REGION_HEIGHT)+",regCol="+Math.floor(i/re4.vm.Screen.REGION_WIDTH)+",pixRow="+coord%re4.vm.Screen.REGION_HEIGHT+",pixCol="+i%re4.vm.Screen.REGION_WIDTH);

					}
				}
			}
		}


	}
	else if(x1>=0 && x1<this._width)
	{
		for(var i=re4.math.max(re4.math.min(y1,y2),0);i<=re4.math.min(re4.math.max(y1,y2),this._height-1);i++)
		{
			opBuffer[Math.floor(i/re4.vm.Screen.REGION_HEIGHT)][Math.floor( x1/re4.vm.Screen.REGION_WIDTH)].pix[i%re4.vm.Screen.REGION_HEIGHT][ x1%re4.vm.Screen.REGION_WIDTH]=color;
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

/**
 * Private inner class used by screen to manage regions.<br />
 * A region is a minimal render update unit of screen.
 * @class Screen._Region
 * @constructor
 * @param {DOM Element} target  The IMG element 
 * @param {number} width Region width
 * @param {number} height Region height
 * @param {String} color Init color of the region
 * 
 */
re4.vm.Screen._Region=function(target,width,height,color)
{
	re4.fw.verifyArgs ([re4.fw.isElement,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isString]);
	this.container=target;
	this.width=width;
	this.height=height;
	this.pix=new Array(height);
	for(var i=0;i<height;i++)
	{
		this.pix[i]=new Array(width);
		for(var j=0;j<width;j++)
		{
			this.pix[i][j]=color;
		}
	}
	this.isDirty=true;
	this.bmp=null;
	this.dataURI=null;

};

/**
 * Rerender this region.
 * 
 * @method reDraw
 */
re4.vm.Screen._Region.prototype.reDraw=function()
{
	if(this.isDirty)
	{
		/*
		 * pixes to bmp
		 */
		var count=0;
		var tmp=new Array();
		for(var i=0;i<this.pix.length;i++)
		{
			for(var j=this.pix[i].length-1;j>=0;j--)
			{
				tmp[count]=this.pix[i][j];
				count++;
			}
		}		
		this.bmp=bmp_rgb(this.width,this.height,tmp);//!!ATTENTION!! Function bmp_rgb swallows data of the third parameter!

		/*
		 * bmp to base64
		 */
		this.dataURI=datauri("image/bmp",this.bmp);

		this.container.src=this.dataURI;

		this.isDirty=false;
		return true;
	}
	else
	{
		return false;
	}
};



