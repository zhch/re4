/**
 * Virtual computer for re4 
 * @module re4.vm
 * @namespace re4.vm
 */

re4.fw.requires(["re4.fw","re4.vm"]);

/**
 * A 24 bit web color, rgb mode.
 * @class Color
 * 
 * @constructor
 * @param {number} r  R channel value, 8 bit value between 0~255
 * @param {number} g  G channel value, 8 bit value between 0~255
 * @param {number} b  B channel value, 8 bit value between 0~255
 */
re4.vm.Color=function(r,g,b)
{
	re4.fw.verifyArgs ([re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber]);
	if(r>=0 && r<=255 && g>=0 && g<=255 && b>=0 && b<=255)
	{
		/**
		 * R channel value, 8 bit value between 0~255.
		 * @property _r
		 * @type number
		 */
		this._r=r;

		/**
		 * G channel value, 8 bit value between 0~255.
		 * @property _g
		 * @type number
		 */
		this._g=g;

		/**
		 * B channel value, 8 bit value between 0~255.
		 * @property _b
		 * @type number
		 */
		this._b=b;
	}
	else
	{
		throw new Error("Invalid rgb value");
	}

};

re4.fw.installGetters(re4.vm.Color.prototype,["_r","_g","_b"]);
//re4.fw.installSetters(re4.vm.Color.prototype,["_r","_g","_b"]);


/**
 * Get css code expressed this color
 * @method cssValue
 * @return {String} The css code expressed this color
 */
re4.vm.Color.prototype.cssValue=function()
{
	return "rgb("+this._r+","+this._g+","+this._b+")";
};


/**
 * Get number array expressed this color
 * @method arrayValue
 * @return {number[]} The number array(24bit [r,g,b]) expressed this color
 */
re4.vm.Color.prototype.arrayValue=function()
{
	return [this._r,this._g,this._b];
};
//discarded @2012-3-12

//re4.vm.Color8Bit=function(table,index)
//{
//re4.fw.verifyArgs ([re4.fw.isArrayOfInstances,re4.fw.isNumber],[re4.vm.Color]);
//if(table.length<=index)
//{
//throw new Error("index is larger than the length of the Color Lookup Table");
//}
//else
//{
//re4.fw.debug(new Error(),"tab"+index+"="+[table[index].getR(),table[index].getG(),table[index].getB()]);
//re4.fw.debug(new Error(),table[index]);
//re4.fw.inherits(this,re4.vm.Color8Bit,re4.vm.Color,[table[index].getR(),table[index].getG(),table[index].getB()]);
//}
//};

re4.vm.Color.prototype.hexStrValue=function()
{
	var value=this._b.toString(16);
	if(value.length<2)
	{
		if(value.length==0)
		{
			value="00";
		}
		else if(value.length==1)
		{
			value="0"+value;
		}
	}
	value=this._g.toString(16)+value;
	if(value.length<4)
	{
		if(value.length==2)
		{
			value="00"+value;
		}
		else if(value.length==3)
		{
			value="0"+value;
		}
	}
	value=this._r.toString(16)+value;
	if(value.length<6)
	{
		if(value.length==4)
		{
			value="00"+value;
		}
		else if(value.length==5)
		{
			value="0"+value;
		}
	}
	return value;
};

re4.vm.Color.prototype.equals=function(color)
{
	re4.fw.verifyArgs ([re4.fw.isInstanceOf],[re4.vm.Color]);
	if(this._r==color.getR() && this._g==color.getG() && this._b==color.getB())
	{
		return true;
	}
	else
	{
		return false;
	}
};

/**
 * This is an Enumerator.
 * A flag determines the color mode.
 * @class re4.vm.Color.MODE
 * 
 */
re4.vm.Color.MODE=new Object();

/**
 * 8 bit color mode.
 * @property BIT8
 * @type number
 */
re4.vm.Color.MODE.BIT8=8;

/**
 * 16 bit color mode.
 * @property BIT16
 * @type number
 */
re4.vm.Color.MODE.BIT16=16;