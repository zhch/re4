/**
 * Math engine of re4 
 * @module re4.math
 * @namespace re4
 */

re4.fw.requires(["re4.fw"]);

/**
 * Math constants and basic static routines 
 * @class math
 * 
 * @static
 */
re4.fw.provides("re4.math");



/**
 * Circumference ratio:3.1415926....
 * @property PI
 * @type number
 * @final
 * @static
 */
re4.math.PI=Math.PI;
//discarded @2012-2-17
//re4.math.PI=new Object();
//re4.math.PI.MUL_1=Math.PI;
//re4.math.PI.MUL_2=Math.PI*2;
//re4.math.PI.DIV_2=Math.PI/2;
//re4.math.PI.DIV_4=Math.PI/4;
//re4.math.PI.INV=1/Math.PI;

/**
 * Calculate the maximum of the two numbers
 * @method max
 * @param {number} a  Number A
 * @param {number} b Number B
 * @return {number} The bigger number
 */
re4.math.max=Math.max;

/**
 * Calculate the minimum of the two numbers
 * @method min
 * @param {number} a  Number A
 * @param {number} b Number B
 * @return {number} The smaller number
 */
re4.math.min=Math.min;



/**
 * Convert degree angle into radians angle
 * @method degree2Radian
 * @param {number} ang Angle in degrees
 * @return {number} Angle in radians
 */
re4.math.degree2Radian=function(ang)
{
	re4.fw.verifyArgs([re4.fw.isNumber]);
	return ang*re4.math.PI/180;
};

/**
 * Convert radians angle into degree angle
 * @method radian2Degree
 * @param {number} ang Angle in radians
 * @return {number} Angle in degrees
 */
re4.math.radian2Degree=function(rads)
{
	re4.fw.verifyArgs([re4.fw.isNumber]);
	return rads*180/re4.math.PI;
};

/**
 * Sine function
 * @method sin
 * @param {number} ang Angle in radians
 * @return {number} Sine value
 */
re4.math.sin=Math.sin;

/**
 * Cosine function
 * @method cos
 * @param {number} ang Angle in radians
 * @return {number} Cosine value
 */
re4.math.cos=Math.cos;

/**
 * Tg function
 * @method tan
 * @param {number} ang Angle in radians
 * @return {number} tg value
 */
re4.math.tan=Math.tan;

/**
 * @method atan02PI
 * @static
 * @param {Number} x  the X coordinate 
 * @param {Number} y  the Y coordinate 
 * @return {Number} the atan between >=0 AND <2PI 
 */
re4.math.atan02PI=function(x,y)
{
	re4.fw.verifyArgs([re4.fw.isNumber,re4.fw.isNumber]);
	var theta=Math.atan2(x, y);
	if(theta<0)
	{
		theta=theta+re4.math.PI*2;
	}
	return theta;

};

/**
 * Transforms an angle to 0 to 2pi, by +/- 2pis
 * @method whirlTo2PI
 * @static
 * @param {Number} theta  the angle to transform 
 */
re4.math.whirlTo2PI=function(theta)
{
	re4.fw.verifyArgs([re4.fw.isNumber]);
	while(theta<0 || theta>(re4.math.PI*2))
	{
		if(theta<0)
		{
			theta=theta+re4.math.PI*2;
		}
		else 
		{
			theta=theta-re4.math.PI*2;
		}
	}
	return theta;
};

/**
 * re4.math.FIXP16 
 * @class math.FIXP16
 * @final
 * @static
 */
re4.math.FIXP16=new Object();

/**
 * re4.math.FIXP16.SHIFT
 * @property SHIFT
 * @type number
 * @final
 * @static
 */
re4.math.FIXP16.SHIFT=16;

/**
 * re4.math.FIXP16.MAG
 * @property MAG
 * @type number
 * @final
 * @static
 */
re4.math.FIXP16.MAG=65536;

/**
 * re4.math.FIXP16.DP_MASK
 * @property DP_MASK
 * @type number
 * @final
 * @static
 */
re4.math.FIXP16.DP_MASK=0x0000ffff;

/**
 * re4.math.FIXP16.WP_MASK
 * @property WP_MASK
 * @type number
 * @final
 * @static
 */
re4.math.FIXP16.WP_MASK=0xffff0000;

/**
 * re4.math.FIXP16.ROUND_U
 * @property ROUND_U
 * @type number
 * @final
 * @static
 */
re4.math.FIXP16.ROUND_U=0x00008000;

/**
 * Very small positive constants 
 * @class math.EPSILON
 * @final
 * @static
 */
re4.math.EPSILON=new Object();

/**
 * 0.0001
 * @property E4
 * @type number
 * @final
 * @static
 */
re4.math.EPSILON.E4=1E-4;

/**
 * 0.00001
 * @property E5
 * @type number
 * @final
 * @static
 */
re4.math.EPSILON.E5=1E-5;

/**
 * 0.000001
 * @property E6
 * @type number
 * @final
 * @static
 */
re4.math.EPSILON.E6=1E-6;


//confused,what dose this function mean:(page-390)
//#define RAND_RANGE(x,y) ( (x) + (rand()%((y)-(x)+1)))



