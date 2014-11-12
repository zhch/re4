/**
 * Wireframe rendering engine of re4 
 * @module re4.wire
 * @namespace re4.wire
 */

re4.fw.requires(["re4.fw","re4.math","re4.math.Point4D","re4.math.Vector4D","re4.wire"]);

/**
 * Object based on a vertex list and list of polygons
 * @class Object4D
 * 
 * @constructor
 * @param {number} id  numeric id of this object
 * @param {String} name ASCII name of object just for kicks
 * @param {Array of re4.math.Point4D} vlist array of local vertices
 * @param {Array of re4.wire.Poly4D} plist Array of polygons
 * @param {re4.math.Point4D} scale scale of the model
 * @param {re4.math.Point4D} pos position of object in world
 * @param {re4.math.Vector4D} rot rotation angles of object in local,cords or unit direction vector user defined???
 *  
 *  /
/*
 * {Enumerated by re4.wire.Object4D.STATE} state  state information
 * {re4.wire.Poly4D.ATTRIBUTE} attr physical attribute
 * {number} avgRadius average radius of object used for collision detection
 * {number} maxRadius max radius of object  

 * {re4.math.Vector4D} ux local axes to track full orientation, this is updated automatically during rotation calls
 * {re4.math.Vector4D} uy local axes to track full orientation, this is updated automatically during rotation calls
 * {re4.math.Vector4D} uz local axes to track full orientation, this is updated automatically during rotation calls
 * {number} vertQuan number of vertices of this object * 
 * {number} polyQuan number of polygons in object mesh
 * 
 */
re4.wire.Object4D=function(id,name,vlist,plist,colors,scale,pos,rot)
{
	re4.fw.veriArgs (	[id,				name,				vlist],
			[re4.fw.isNumber,	re4.fw.isString,	re4.fw.isArrayOfInstances],
			[										re4.math.Vector4D] );
	re4.fw.veriArgs (	[scale],	[re4.fw.isArrayOfPrims],[re4.fw.isNumber]	);
	re4.fw.veriArgs (	[pos],		[re4.fw.isArrayOfPrims],[re4.fw.isNumber]	);
	re4.fw.veriArgs (	[rot],		[re4.fw.isArrayOfPrims],[re4.fw.isNumber]	);
	if(colors.length<plist.length)
	{
		throw new Error("not enough color to create polys");
	}
	else
	{
		for(var i=0;i<plist.length;i++)
		{
			re4.fw.veriArgs ([colors[i]],[re4.fw.isString] );
		}
	}
	/**
	 * numeric id of this object
	 * @property _id
	 * @type number
	 */
	this._id=id;

	/**
	 * ASCII name of object just for kicks
	 * @property _name
	 * @type String
	 */
	this._name=name;

	/**
	 * state information
	 * @property _state
	 * @type re4.wire.Poly4D.STATE
	 */
	this._state= re4.wire.Object4D.STATE.ACTIVE;

	/**
	 * physical attributes of polygon
	 * @property _attr
	 * @type re4.wire.Poly4D.ATTRIBUTE
	 */
	this._attr=re4.wire.Poly4D.ATTRIBUTE.EMPTY ;

	/**
	 * array of local vertices
	 * @property _vlistLocal
	 * @type Array of re4.math.Point4D
	 */
	this._vlistLocal=vlist;

	/**
	 * number of vertices of this object
	 * @property _vertQuan
	 * @type number
	 */
	/**
	 * max radius of object
	 * @property _maxRadius
	 * @type number
	 */
	this._maxRadius=maxRadius=-1;
	var tmpRadius=0;
	this._vertQuan=vlist.length;
	var mScale=re4.math.Matrix4X4.buildScaleXYZ(scale[0],scale[1],scale[2]);
	var mRot=re4.math.Matrix4X4.buildRotationXYZ(rot[0],rot[1],rot[2]);
	var mTrnsf=mScale.multiply4X4(mRot);
	for(var i=0;i<this._vertQuan;i++)
	{
		this._vlistLocal[i]=mTrnsf.mulByVector(this._vlistLocal[i]);
		tmpRadius=this._vlistLocal[i].getX()*this._vlistLocal[i].getX()+this._vlistLocal[i].getY()*this._vlistLocal[i].getY()+this._vlistLocal[i].getZ()*this._vlistLocal[i].getZ();
		if(tmpRadius>this._maxRadius)
		{
			this._maxRadius=tmpRadius;
		}
	}
	this._maxRadius=Math.sqrt(this._maxRadius);

	/**
	 * array of transformed vertices
	 * @property _vlistTrans
	 * @type Array of re4.math.Point4D
	 */
	this._vlistTrans=new Array(this._vertQuan); 
	for(var i=0;i<this._vertQuan;i++)
	{
		this._vlistTrans[i]=this._vlistLocal[i];
	}

	/**
	 * Array of polygons
	 * @property _plist 
	 * @type Array of re4.wire.Poly4D
	 */
	this._plist=new Array(plist.length);
	for(var i=0;i<plist.length;i++)
	{
		this._plist[i]=new re4.wire.Poly4D(re4.wire.Poly4D.STATE.ACTIVE,re4.wire.Poly4D.ATTRIBUTE.EMPTY ,colors[i],this._vlistTrans,plist[i]);
	}


	/**
	 * polyQuan number of polygons in object mesh
	 * @property _polyQuan
	 * @type number
	 */
	this._polyQuan=this._plist.length;

	/**
	 * local axes to track full orientation, this is updated automatically during rotation calls
	 * @property _ux
	 * @type re4.math.Vector4D
	 */ 
	this._ux=new re4.math.Vector4D(1,0,0,0);

	/**
	 * local axes to track full orientation, this is updated automatically during rotation calls
	 * @property _uy
	 * @type re4.math.Vector4D
	 */
	this._uy=new re4.math.Vector4D(0,1,0,0);

	/**
	 * local axes to track full orientation, this is updated automatically during rotation calls
	 * @property _uz
	 * @type re4.math.Vector4D
	 */
	this._uz=new re4.math.Vector4D(0,0,1,0);	

	/**
	 * position of object in world
	 * @property _worldPos
	 * @type re4.math.Point4D
	 */ 
	this._worldPos=new re4.math.Vector4D(pos[0],pos[1],pos[2],1);















	/**
	 * average radius of object used for collision detection
	 * @property _avgRadius
	 * @type number
	 */
	//this._avgRadius=avgRadius;





	/**
	 * rotation angles of object in local,cords or unit direction vector user defined???
	 * @property _dir
	 * @type re4.math.Vector4D
	 */ 
	//this._dir=dir;










};


/**
 * Get the array of polygons.
 * @method getPlist
 */
re4.fw.installGetters (re4.wire.Object4D.prototype,["_plist"]);


/**
 * Transform an object.
 * @method transformThis
 * @param {re4.math.Matrix4X4} mt  transformation matrix
 * @param {Enumeratd by re4.wire.TRANS_COORD} coordSelect select coords to transform
 * @param {boolean} transBasis if vector orientation should be transformed
 */
re4.wire.Object4D.prototype.transformThis=function(mt,coordSelect,transBasis)
{
	re4.fw.verifyArgs ([re4.fw.isInstanceOf,re4.fw.isEnumeratedBy,re4.fw.isBoolean],[re4.math.Matrix4X4,re4.wire.TRANS_COORD]);
	if(coordSelect==re4.wire.TRANS_COORD.LOCAL_ONLY)
	{
		for(var vertex=0;vertex<this._vertQuan;vertex++)
		{
			this._vlistLocal[vertex]=mt.mulByVector(this._vlistLocal[vertex]);
		}
	}
	else if(coordSelect==re4.wire.TRANS_COORD.LOCAL_TO_TRANS)
	{
		for(var vertex=0;vertex<this._vertQuan;vertex++)
		{
			this._vlistTrans[vertex]=mt.mulByVector(this._vlistLocal[vertex]);
		}
	}
	else //if(cooedSelect==re4.wire.TRANS_COORD.TRANS_ONLY)
	{
		for(var vertex=0;vertex<this._vertQuan;vertex++)
		{
			this._vlistTrans[vertex]=mt.mulByVector(this._vlistTrans[vertex]);
		}
	}
	if(transBasis)
	{
		this._ux=mt.mulByVector(this._ux);
		this._uy=mt.mulByVector(this._uy);
		this._uz=mt.mulByVector(this._uz);
	}
};

/**
 * Performs the local-to-world transformation.
 * @method modelToWorldThis
 * @param {Enumeratd by re4.wire.TRANS_COORD} coordSelect LOCAL_ONLY and TRANS_ONLY are allowed
 * 
 */
re4.wire.Object4D.prototype.modelToWorldThis=function(coordSelect)
{
	re4.fw.verifyArgs([re4.fw.isEnumeratedBy],[re4.wire.TRANS_COORD]);
	if(coordSelect==re4.wire.TRANS_COORD.LOCAL_ONLY)
	{
		for(var vertex=0;vertex<this._vertQuan;vertex++)
		{
			this._vlistLocal[vertex]=this._vlistLocal[vertex].add(this._worldPos);
		}
	}
	else if(coordSelect==re4.wire.TRANS_COORD.LOCAL_TO_TRANS)
	{
		for(var vertex=0;vertex<this._vertQuan;vertex++)
		{
			this._vlistTrans[vertex]=this._vlistLocal[vertex].add(this._worldPos);
		}
	}
	else //if(cooedSelect==re4.wire.TRANS_COORD.TRANS_ONLY)
	{
		for(var vertex=0;vertex<this._vertQuan;vertex++)
		{
			this._vlistTrans[vertex]=this._vlistTrans[vertex].add(this._worldPos);
		}
	}
};

/**
 * A matrix based function transforms the world coordinates of an object into camera coordinates based on the sent camera matrix,
 * but it totally disregards the polygons themselves,it only works on the vertices in the vlist_tans[] list
 * 
 * @method worldToCameraThis
 * @param {re4.wire.Camera4D} cam The camera
 * 
 */
re4.wire.Object4D.prototype.worldToCameraThis=function(cam)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.wire.Camera4D]);
	for(var vertex=0;vertex<this._vertQuan;vertex++ )
	{
		this._vlistTrans[vertex]=cam.getMcam().mulByVector(this._vlistTrans[vertex]);
	}
};

/**
 * Takes the object's current world position along with it's average/maximum radius(you might use either),
 * culls the object based on the current camera transformation
 * 
 * @method cullThis
 * @param {re4.wire.Camera4D} cam The camera
 * @param {Enumrated by re4.wire.Object4D.CULL_PLANE} cullFlag Specifies the cull plane(s).
 */
re4.wire.Object4D.prototype.cullThis=function(cam,cullFlag)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf,re4.fw.isEnumeratedBy],[re4.wire.Camera4D, re4.wire.Object4D.CULL_PLANE]);
	var camPosCenter=this._worldPos.multiply4X4(cam.getMcam());
	var testBound;
	if(cullFlag & re4.wire.Object4D.CULL_PLANE.Z)
	{
		if((camPosCenter.getZ()-this._maxRadius)>cam.getClipZfar() || (camPosCenter.getZ()+this._maxRadius)<cam.getClipZNear())
		{
			this._state=this._state | re4.wire.Object4D.STATE.CULLED;
			return true;
		}
	}
	if(cullFlag & re4.wire.Object4D.CULL_PLANE.X)
	{
		testBound=0.5*cam.getViewPlaneWidth()*camPosCenter.getZ()/cam.getViewDist ( );
		
		
	}
	if(cullFlag & re4.wire.Object4D.CULL_PLANE.Y)
	{
		testBound=0.5*cam.getViewPlaneHeight()*camPosCenter.getZ()/cam.getViewDist ( );
	}

};

/**
 * An object may or may not be culled each frame.
 * So, in each game frame, you need to reset your object's flags so that all the transient flags are cleared.
 * 
 * @method resetThis
 * 
 */
re4.wire.Object4D.prototype.resetThis=function()
{
	this._state=((this._state) & (~re4.wire.Object4D.STATE.CULLED));//Remove the CULLED bits from the _state flag
	for(var poly=0;poly<this._polyQuan;poly++)
	{
		if(this._plist[poly].getState() & re4.wire.Poly4D.STATE.ACTIVE)// first is this polygon even visible?
		{
			/*
			 * reset clipped and backface flags
			 */
			this._plist[poly].setState (this._plist[poly].getState() & (~re4.wire.Poly4D.STATE.BACKFACE) );
			this._plist[poly].setState (this._plist[poly].getState() & (~re4.wire.Poly4D.STATE.CLIPPED) );
		}

	}
};

/**
 * Not matrix based.
 * Removes the backfaces from an object's polygon mesh, 
 * dose this based on the vertex data in vlist_trans along with the camera position.
 * Only the backface state is set in each polygon.
 * Tip: Make sure that you perform back-face removal after object removal, but before the world-to-camera transformation.
 * 
 * @method removeBackFacesThis
 * @param {re4.wire.Camera4D} cam The camera
 * 
 */
re4.wire.Object4D.prototype.removeBackFacesThis=function(cam)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.wire.Camera4D]);
	if(this._state & re4.wire.Object4D.STATE.CULLED)
	{
		return;
	}
	else
	{
		for(var poly=0;poly<this._polyQuan;poly++)
		{
			var currPoly=this._plist[poly];
			if(!(currPoly.getState() & re4.wire.Poly4D.STATE.ACTIVE) || (currPoly.getState() & re4.wire.Poly4D.STATE.CLIPPED) || (currPoly.getState() & re4.wire.Poly4D.STATE.BACKFACE))
			{
				continue;
			}
			else
			{
				/*
				 * Compute the normal of this polygon face, 
				 * and recall that the vertices are in counter-clock wise order,
				 * so u=p0->p1, v=p0->p2, n=cross-product(u,v), n will point at the right direction
				 * 
				 */
				var v0=currPoly.getVertex (0);
				var v1=currPoly.getVertex (1);				
				var v2=currPoly.getVertex (2);				
				var n= re4.math.Vector4D.build(v0,v1).cross(re4.math.Vector4D.build(v0,v2));				
				var view=re4.math.Vector4D.build(v0,cam.getPos());
				if(n.dot(view)<=0.0)
				{
					currPoly.setState(currPoly.getState() | re4.wire.Poly4D.STATE.BACKFACE);
				}
			}
		}
	}

};

/**
 * Not matrix based.
 * Transforms the camera coordinates of an object into perspective coordinates based on the sent camera object.
 * Assumes the object has already been transformed to camera, it only works on the vertices in the vlist_trans[] list.
 * This function is really for experimental reasons only, you would probably never let an object stay intact this far down the pipeline,
 * 
 * 
 * @method cameraToPerspectiveThis
 * @param {re4.wire.Camera4D} cam The camera
 * 
 */
re4.wire.Object4D.prototype.cameraToPerspectiveThis=function(cam)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.wire.Camera4D]);
	for(var vertex=0;vertex<this._vertQuan;vertex++ )
	{
		var x=this._vlistTrans[vertex].getX();
		var y=this._vlistTrans[vertex].getY();
		var z=this._vlistTrans[vertex].getZ();
//		re4.fw.debug(new Error(),"z="+z+",ar="+cam.getAspectRatio());
		this._vlistTrans[vertex].setX(cam.getViewDist()*x/z);

		this._vlistTrans[vertex].setY(cam.getViewDist()*y/z*cam.getAspectRatio());
	}
};

/**
 * Converts all vertices in the transformed vertex list from 4D homogeneous coordinates 
 * to normal 3D coordinates by dividing eacg x,y,z component by w 
 * 
 * @method convertFromHomogeneous4DThis
 * 
 */
re4.wire.Object4D.prototype.convertFromHomogeneous4DThis=function()
{

};

/**
 * Not matrix based.
 * Transforms the perspective coordinates of an object into screen coordinates.
 * Assumes the object has already been transformed to perspective, it only works on the vertices in the vlist_trans[] list.
 * This function is really for experimental reasons only, you would probably never let an object stay intact this far down the pipeline,
 * 
 * 
 * @method perspectiveToScreenThis
 * @param {re4.wire.Camera4D} cam The camera
 * 
 */
re4.wire.Object4D.prototype.perspectiveToScreenThis=function(cam)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.wire.Camera4D]);
	var alpha=(cam.getViewPortWidth()-1)/2;
	var beta=(cam.getViewPortHeight()-1)/2;
	for(var vertex=0;vertex<this._vertQuan;vertex++ )
	{
		var x=this._vlistTrans[vertex].getX();
		var y=this._vlistTrans[vertex].getY();
		this._vlistTrans[vertex].setX(x*alpha+alpha);
		this._vlistTrans[vertex].setY(beta-beta*y);
	}
};

/**
 * Not matrix based.
 * Transforms the camera coordinates of an object into screen coordinates.
 * view_dist_h and view_dist_v of camera should be set to cause the desired projection.
 * Totally disregards the polygons themselves, it onlu works on the vertices  in the vlist_trans[].
 * Also inverts the y axis, ARE ready for rendering.
 * 
 * This function is really for experimental reasons only, you would probably never let an object stay intact this far down the pipeline.
 * 
 * 
 * @method cameraToScreenThis
 * @param {re4.wire.Camera4D} cam The camera
 * 
 */
re4.wire.Object4D.prototype.cameraToScreenThis=function(cam)
{

};

/**
 * Renders an object to the screen in wireframe, 16 bit mode,
 * it has no regard at all about hidden surface removal etc.
 * Assumes all coordinates are screen coordinates, but will perform 2D clipping.
 * 
 * @method drawWireTo
 * @param {re4.vm.Screen} screen The virtual computer screen
 * @param {re4.vm.Screen.BUFFER_SELECT} buffer Which buffer to draw
 * 
 */
re4.wire.Object4D.prototype.drawWireTo=function(screen,buffer)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf,re4.fw.isEnumeratedBy],[re4.vm.Screen,re4.vm.Screen.BUFFER_SELECT]);
	for(var poly=0;poly<this._polyQuan;poly++)
	{
		if(!(this._plist[poly].getState() & re4.wire.Poly4D.STATE.ACTIVE) || (this._plist[poly].getState() & re4.wire.Poly4D.STATE.CLIPPED) || (this._plist[poly].getState() & re4.wire.Poly4D.STATE.BACKFACE))
		{
			continue;
		}
		else
		{

			var p0=this._plist[poly].getVertex(0);
			var p1=this._plist[poly].getVertex(1);
			var p2=this._plist[poly].getVertex(2);
			screen.drawLine (p0.getX() ,p0.getY(),p1.getX(),p1.getY(),this._plist[poly].getColor ( ), buffer );
			screen.drawLine (p1.getX() ,p1.getY(),p2.getX(),p2.getY(),this._plist[poly].getColor ( ), buffer );
			screen.drawLine (p2.getX() ,p2.getY(),p0.getX(),p0.getY(),this._plist[poly].getColor ( ), buffer );

		}
	}
};

/**
 * This is an Enumerator.
 * Controls the axes that object culling will be performed on.
 * For example, if you want culling only on the z-axis(near and far clip planes), an object might still be invisible on the x and y axes,
 * but at least you are guaranteed not to project polygons from an object that's behind you.
 * @class Object4D.CULL_PLANE
 * 
 */
re4.wire.Object4D.CULL_PLANE=new Object();

/**
 * Cull against the X plane.
 * @property X
 * @type number
 */
re4.wire.Object4D.CULL_PLANE.X=0x0001;

/**
 * Cull against the Y plane.
 * @property Y
 * @type number
 */
re4.wire.Object4D.CULL_PLANE.Y=0x0002;

/**
 * Cull against the Z plane.
 * @property Z
 * @type number
 */
re4.wire.Object4D.CULL_PLANE.Z=0x0004;

/**
 * Cull against all the three XYZ plane.
 * @property XYZ
 * @type number
 */
re4.wire.Object4D.CULL_PLANE.XYZ=re4.wire.Object4D.CULL_PLANE.X | re4.wire.Object4D.CULL_PLANE.Y | re4.wire.Object4D.CULL_PLANE.Z;

/**
 * This is an Enumerator.
 * State information of an Object4D.
 * After culling, the function will alter the object's state flags and set a bit to indicate that the object was culled.
 * @class Object4D.STATE
 * 
 */
re4.wire.Object4D.STATE=new Object();

/**
 * ACTIVE state.
 * @property ACTIVE
 * @type number
 */
re4.wire.Object4D.STATE.ACTIVE	=	0x0001;

/**
 * VISIBLE state.
 * @property VISIBLE
 * @type number
 */
re4.wire.Object4D.STATE.VISIBLE	=	0x0002;

/**
 * CULLED state.
 * @property CULLED
 * @type number
 */
re4.wire.Object4D.STATE.CULLED	=	0x0004;
