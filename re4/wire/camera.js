/**
 * Wireframe rendering engine of re4 
 * @module re4.wire
 * @namespace re4.wire
 */

re4.fw.requires(["re4.fw","re4.math","re4.math.Point3D","re4.math.Point4D","re4.math.Vector3D","re4.math.Vector4D","re4.math.Plane3D","re4.wire"]);

/**
 * Represents a simple camera, some extra stuff here.
 * @class Camera4D
 * @constructor
 * @param {Enumerated by  re4.wire.Camera4D.ATTRIBUTE} attr  Camera attribute
 * @param {re4.math.Vector4D} pos  World position of camera used by both camera models
 * @param {re4.math.Vector4D} dir  Euler angels or look at direction of camera for UVN
 * @param {re4.math.Vector4D} tar  UVN view target
 * @param {number} near  Near clipping plane
 * @param {number} far Far clipping plane
 * @param {number} fov Field of view for both horizontal and vertical axes
 * @param {number} vpWidth Witdh of view plane to project onto
 * @param {number} vpHeight Height of view plane to project onto
 */
re4.wire.Camera4D=function(attr,pos,dir,tar,near,far,fov,vpWidth,vpHeight)
{
	re4.fw.veriArgs(	[attr,							pos,				dir,				tar,				near,			far,			fov,			vpWidth,		vpHeight],
			[re4.fw.isEnumeratedBy,			re4.fw.isInstanceOf,re4.fw.isInstanceOf,re4.fw.isInstanceOf,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber],
			[re4.wire.Camera4D.ATTRIBUTE,	re4.math.Vector4D,	re4.math.Vector4D,	re4.math.Vector4D]);
	/**
	 * Camera attributes
	 * @property _attr
	 * @type {Enumerated by re4.wire.Camera4D.ATTRIBUTE}
	 */
	this._attr=attr;

	/**
	 * World position of camera used by both camera models
	 * @property _pos
	 * @type {re4.math.Vector4D}
	 */
	this._pos=new re4.math.Vector4D(pos.getX(),pos.getY(),pos.getZ(),pos.getW());

	/**
	 * Euler angels or look at direction of camera for UVN
	 * @property _dir
	 * @type {re4.math.Vector4D}
	 */
	this._dir=new re4.math.Vector4D(dir.getX(),dir.getY(),dir.getZ(),dir.getW());

	/**
	 * For UVN model
	 * @property _u
	 * @type {re4.math.Vector4D}
	 */
	this._u=new re4.math.Vector4D(1,0,0,1);

	/**
	 * For UVN model
	 * @property _v
	 * @type  {re4.math.Vector4D}
	 */
	this._v=new re4.math.Vector4D(0,1,0,1);

	/**
	 * For UVN model
	 * @property _n
	 * @type  {re4.math.Vector4D}
	 */
	this._n=new re4.math.Vector4D(0,0,1,1);

	/**
	 * UVN view target
	 * @property _tar
	 * @type  {re4.math.Vector4D}
	 */
	if(tar!=null)
	{
		this._tar=new re4.math.Vector4D(tar.getX(),tar.getY(),tar.getZ(),tar.getW());
	}
	else
	{
		this._tar=new re4.math.Vector4D(0,0,0,1);
	}

	/**
	 * Near clipping plane
	 * @property _clipZNear
	 * @type {number}
	 */
	this._clipZNear=near;

	/**
	 * Far clipping plane
	 * @property _clipZfar
	 * @type {number}
	 */
	this._clipZfar=far;

	/**
	 * Weight of viewport, viewport/window are synonomous.
	 * @property _viewPortWidth
	 * @type {number}
	 */
	this._viewPortWidth=vpWidth;

	/**
	 * Height of viewport, viewport/window are synonomous.
	 * @property _viewPortHeight
	 * @type {number}
	 */
	this._viewPortHeight=vpHeight;

	/**
	 * Center of viewport, final image destination.
	 * @property _viewPortCenterX
	 * @type {number}
	 */
	this._viewPortCenterX=(vpWidth-1)/2;

	/**
	 * Center of viewport, final image destination.
	 * @property _viewPortCenterY
	 * @type {number}
	 */
	this._viewPortCenterY=(vpHeight-1)/2;

	/**
	 * Aspect ratio, screen aspect width/height.
	 * @property _aspectRatio
	 * @type {number}
	 */
	this._aspectRatio=vpWidth/vpHeight;

	/**
	 * Storage for the world to camera transform matrix.
	 * @property _mcam
	 * @type 
	 */
	this._mcam=re4.math.Matrix4X4.fromGeneric(re4.math.Matrix4X4.IDEN_MAT);

	/**
	 * Storage for the camera to perspective transform matrix.
	 * @property _mper
	 * @type 
	 */
	this._mper=re4.math.Matrix4X4.fromGeneric(re4.math.Matrix4X4.IDEN_MAT);

	/**
	 * Storage for the perspective to screen transform matrix.
	 * @property _mscr
	 * @type 
	 */
	this._mscr=re4.math.Matrix4X4.fromGeneric(re4.math.Matrix4X4.IDEN_MAT);

	/**
	 * Field of view for both horizontal and vertical axes
	 * @property _fov
	 * @type 
	 */
	this._fov=fov;

	/**
	 * Witdh of view plane to project onto.
	 * @property _viewPlaneWidth
	 * @type 
	 */
	this._viewPlaneWidth=2;

	/**
	 * Height of view plane to project onto, equals _viewPlaneWidth/screen_aspect_ratio.
	 * @property _viewPlaneHeight
	 * @type 
	 */
	this._viewPlaneHeight=this._viewPlaneWidth/this._aspectRatio;
	
	/**
	 * Viewing distance
	 * @property _viewDist
	 * @type {number}
	 */	
	this._viewDist=(this._viewPlaneWidth/2)/(re4.math.tan(re4.math.degree2Radian(fov/2)));

	/**
	 * The right clipping plane
	 * @property _clipPlaneRt
	 * @type 
	 */

	/**
	 * The left clipping plane
	 * @property _clipPlaneLt
	 * @type 
	 */

	/**
	 * The top clipping plane
	 * @property _clipPlaneTp
	 * @type 
	 */

	/**
	 * The bottom clipping plane
	 * @property _clipPlaneBt
	 * @type 
	 */
	var po=new re4.math.Point3D(0,0,0);
	var vn;
	if(fov==90.0)
	{

		vn=new re4.math.Vector3D(1,0,-1);
		this._clipPlaneRt=new re4.math.Plane3D(po,vn,true);//x=z plane
		vn=new re4.math.Vector3D(-1,0,-1);
		this._clipPlaneLt=new re4.math.Plane3D(po,vn,true);//-x=z plane
		vn=new re4.math.Vector3D(0,1,-1);
		this._clipPlaneTp=new re4.math.Plane3D(po,vn,true);//y=z plane
		vn=new re4.math.Vector3D(0,-1,-1);
		this._clipPlaneBt=new re4.math.Plane3D(po,vn,true);//-y=z plane
	}
	else
	{
		vn=new re4.math.Vector3D(this._viewDist,0,-this._viewPlaneWidth/2);
		this._clipPlaneRt=new re4.math.Plane3D(po,vn,true);
		vn=new re4.math.Vector3D(-this._viewDist,0,-this._viewPlaneWidth/2);
		this._clipPlaneLt=new re4.math.Plane3D(po,vn,true);
		vn=new re4.math.Vector3D(0,this._viewDist,-this._viewPlaneWidth/2);
		this._clipPlaneTp=new re4.math.Plane3D(po,vn,true);
		vn=new re4.math.Vector3D(0,-this._viewDist,-this._viewPlaneWidth/2);
		this._clipPlaneBt=new re4.math.Plane3D(po,vn,true);
	}
};

/**
 * Get the world-camera transform matrix.
 * @method getMcam
 * @return {re4.math.Matrix4X4} The world-camera transform matrix
 */
/**
 * Get the viewing distance.
 * @method getViewDist
 * @return {re4.math.Matrix4X4} The world-camera transform matrix
 */
/**
 * Get the aspect ratio.
 * @method getAspectRatio
 * @return {number} The Aspect ratio
 */
/**
 * Get the the view port height.
 * @method getViewPortHeight
 * @return {number} The view port height
 */
/**
 * Get the view port width.
 * @method getViewPortWidth
 * @return {number} The view port width
 */
/**
 * Get the position of the camera.
 * @method getPos
 * @return {re4.math.Vector4D} The view port width
 */
/**
 * Get the far clipping plane.
 * @method getClipZfar
 * @return {re4.math.Vector4D} The view port width
 */
/**
 * Get the near clipping plane.
 * @method getClipZNear
 * @return {re4.math.Vector4D} The view port width
 */
/**
 * Get witdh of view plane to project onto.
 * @method getViewPlaneWidth
 * @return {re4.math.Vector4D} The view port width
 */
/**
 * Get heught of view plane to project onto.
 * @method getViewPlaneHeight
 * @return {re4.math.Vector4D} The view port width
 */
re4.fw.installGetters(re4.wire.Camera4D.prototype,["_mcam","_viewDist","_aspectRatio","_viewPortHeight","_viewPortWidth","_pos","_clipZfar","_clipZNear","_viewPlaneWidth","_viewPlaneHeight"]);


/**
 * With a position and the Euler angels, compute all the matrices and other elements for you.
 * @method buildMatrixEulerThis
 * @param {Enumerated by re4.wire.Camera4D.ROT_SEQ} rotSeq  A flag that controls the rotation seq for the Euler angles. 
 */
re4.wire.Camera4D.prototype.buildMatrixEulerThis=function(rotSeq)
{
	re4.fw.verifyArgs([re4.fw.isEnumeratedBy],[re4.wire.Camera4D.ROT_SEQ]);
	var trsM,invxM,invyM,invzM,rotM;
	var thetaX,thetaY,thetaZ,cosTheta,sinTheta;

	//move the camera from it's position to the original
	trsM=new re4.math.Matrix4X4([1,0,0,0],[0,1,0,0],[0,0,1,0],[-this._pos.getX(),-this._pos.getY(),-this._pos.getZ(),1]);

	//rotate the world following the camera 'normalize'
	thetaX=this._dir.getX();
	thetaY=this._dir.getY();
	thetaZ=this._dir.getZ();
	cosTheta=re4.math.cos(thetaX);	//no change since cos(-x)=cos(x)
	sinTheta=-re4.math.sin(thetaX);	//sin(-x)=-sin(x)
	invxM=new re4.math.Matrix4X4([1,0,0,0],[0,cosTheta,sinTheta,0],[0,-sinTheta,cosTheta,0],[0,0,0,1]);
	cosTheta=re4.math.cos(thetaY);
	sinTheta=-re4.math.sin(thetaY);
	invyM=new re4.math.Matrix4X4([cosTheta,0,-sinTheta,0],[0,1,0,0],[sinTheta,0,cosTheta,0],[0,0,0,1]);
	cosTheta=re4.math.cos(thetaZ);
	sinTheta=-re4.math.sin(thetaZ);
	invzM=new re4.math.Matrix4X4([cosTheta,sinTheta,0,0],[-sinTheta,cosTheta,0,0],[0,0,1,0],[0,0,0,1]);
	if(rotSeq==re4.wire.Camera4D.ROT_SEQ.XYZ)
	{
		rotM=invxM.multiply4X4(invyM).multiply4X4(invzM);
	}
	else if(rotSeq==re4.wire.Camera4D.ROT_SEQ.YXZ)
	{
		rotM=invyM.multiply4X4(invxM).multiply4X4(invzM);
	}
	else if(rotSeq==re4.wire.Camera4D.ROT_SEQ.XZY)
	{
		rotM=invxM.multiply4X4(invzM).multiply4X4(invyM);
	}
	else if(rotSeq==re4.wire.Camera4D.ROT_SEQ.YZX)
	{
		rotM=invyM.multiply4X4(invzM).multiply4X4(invxM);
	}
	else if(rotSeq==re4.wire.Camera4D.ROT_SEQ.ZYX)
	{
		rotM=invzM.multiply4X4(invyM).multipl4X4(invxM);
	}
	else if(rotSeq==re4.wire.Camera4D.ROT_SEQ.ZXY)
	{
		rotM=invzM.multiply4X4(invxM).multiply4X4(invyM);
	}

	//concatenate the translate and rotation
	this._mcam=trsM.multiply4X4(rotM);
};

re4.wire.Camera4D.prototype.buildMatrixUVNThis=function()
{

};

/**
 * This is an Enumerator.
 * Camera attributes
 * @class re4.wire.Camera4D.ATTRIBUTE
 * 
 */

re4.wire.Camera4D.ATTRIBUTE=new Object();

/**
 * EULER_MODEL
 * @property EULER_MODEL
 * @type number
 */
re4.wire.Camera4D.ATTRIBUTE.EULER_MODEL=1;

/**
 * UVN_MODEL
 * @property UVN_MODEL
 * @type number
 */
re4.wire.Camera4D.ATTRIBUTE.UVN_MODEL=2;

/**
 * This is an Enumerator.
 * A flag that controls the rotation sequence for the Euler angels.
 * @class re4.wire.Camera4D.ROT_SEQ
 * 
 */
re4.wire.Camera4D.ROT_SEQ=new Object();

/**
 * XYZ
 * @property XYZ
 * @type number
 */
re4.wire.Camera4D.ROT_SEQ.XYZ=0;

/**
 * YXZ
 * @property YXZ
 * @type number
 */
re4.wire.Camera4D.ROT_SEQ.YXZ=1;

/**
 * XZY
 * @property XZY
 * @type number
 */
re4.wire.Camera4D.ROT_SEQ.XZY=2;

/**
 * YZX
 * @property YZX
 * @type number
 */
re4.wire.Camera4D.ROT_SEQ.YZX=3;

/**
 * ZYX
 * @property ZYX
 * @type number
 */
re4.wire.Camera4D.ROT_SEQ.ZYX=4;

/**
 * ZXY
 * @property ZXY
 * @type number
 */
re4.wire.Camera4D.ROT_SEQ.ZXY=5;

/**
 * This is an Enumerator.
 * A flag that controls how UVN is computed.
 * @class re4.wire.Camera4D.UVN_MODE
 * 
 */
re4.wire.Camera4D.UVN_MODE=new Object();


/**
 * Low level simple model, use the target and view reference point
 * @property SIMPLE
 * @type number
 */
re4.wire.Camera4D.UVN_MODE.SIMPLE=1;

/**
 * Spherical mode, the x,y components will be used as the heading and elevation of the view vector respectively,
 * along with the view reference point as the position as usual.
 * @property SPHERICAL
 * @type number
 */
re4.wire.Camera4D.UVN_MODE.SPHERICAL=2;
