/**
 * Wireframe rendering engine of re4 
 * @module re4.wire
 * @namespace re4.wire
 */

re4.fw.requires(["re4.fw","re4.math","re4.math.Point4D","re4.math.Vector4D","re4.math.Matrix4X4","re4.wire"]);

/**
 * Object to hold the render list, this way we can have more than one render list at a time
 * @class RenderList4D
 * 
 * @constructor
 * @param {re4.wire.Poly4D.STATE} state  state information
 * @param {re4.wire.Poly4D.ATTRIBUTE} attr  attribute
 * @param {re4.wire.Poly4DSelf[]} polyData  the actual polygon faces are stored
 * @param {number} polyQuan  Number of polys in render list
 * 
 */
re4.wire.RenderList4D=function(state,attr,polyData,polyQuan)
{
	re4.fw.verifyArgs([re4.fw.isEnumeratedBy,re4.fw.isEnumeratedBy,re4.fw.isArrayOfInstances,re4.fw.isNumber],[re4.wire.Poly4D.STATE, re4.wire.Poly4D.ATTRIBUTE, re4.wire.Poly4DSelf]);

	/**
	 * State of renderlist???
	 * @property _state
	 * @type re4.wire.Poly4D.STATE
	 */
	this._state=state;

	/**
	 * Attributes of renderlist???
	 * @property _attr
	 * @type re4.wire.Poly4D.ATTRIBUTE
	 */
	this._attr=attr;



	/**
	 * To cut down on allocation, de-allocation of polygons each frame, here's where the actual polygon faces will be stored
	 * @property _polyData
	 * @type Array of re4.wire.Poly4DSelf
	 */
	this._polyData=polyData;

	/**
	 * The render list is an array of pointers each pointing to a self contained rendable polygon face re4.wire.Poly4DSelf
	 * @property _polyPtrs
	 * @type number[]
	 */
	this._polyPtrs=new Array();
	for(var i=0;i<this._polyData.length;i++)
	{
		this._polyPtrs[i]=i;
	}

	/**
	 *  Number of polys in render list
	 * @property _polyQuan
	 * @type number
	 */
	this._polyQuan=polyQuan;

};

/**
 * Insert an object into this render list.
 * @method insertWith
 * @param {re4.wire.Object4D} obj  The Object
 */
re4.wire.RenderList4D.prototype.insertWith=function(obj)
{
	re4.fw.verifyArgs ([re4.fw.isInstanceOf],[re4.wire.Object4D]);
	var ps=obj.getPlist();
	var pf;
	var prev;
	for(var pSeq=0;pSeq<ps.length;pSeq++)
	{
		if(this._polyQuan>0)
		{
			prev=this._polyData[this._polyPtrs[this._polyQuan-1]];
		}
		else
		{
			prev=null;
		}
		pf=new re4.wire.Poly4DSelf (ps[pSeq].getState(),ps[pSeq].getAttr ( ),ps[pSeq].getColor ( ),[ps[pSeq].getVector(0),ps[pSeq].getVector(1),ps[pSeq].getVector(2)],null, prev );
		if(prev!=null)
		{
			prev.setNext(pf);
		}
		this._polyData.push(pf);
		this._polyQuan++;
	}
};

/**
 * Initializes and resets the render list and ready's it for polygons/faces to be inserted into it.
 * You call this function each frame.
 * @method resetThis
 */
re4.wire.RenderList4D.prototype.resetThis=function()
{
	this._polyQuan=0;
};

/**
 * Performs the transform defined by the matrix to a render list.
 * @method transformThis
 * @param {re4.math.Matrix4X4} mt  transformation matrix
 * @param {Enumeratd by re4.wire.TRANS_COORD} coordSelect select coords to transform
 * @return {re4.wire.RenderList4D} This render list after transform
 */
re4.wire.RenderList4D.prototype.transformThis=function(mt,coordSelect)
{
	re4.fw.verifyArgs ([re4.fw.isInstanceOf,re4.fw.isEnumeratedBy],[re4.math.Matrix4X4,re4.wire.TRANS_COORD]);
	if(coordSelect==re4.wire.TRANS_COORD.LOCAL_ONLY)
	{
		for(var i=0;i<this._polyQuan;i++)
		{
			var currPoly=this._polyData[this._polyPtrs[i]];
			if((currPoly==null) || !(currPoly.getState() & re4.wire.Poly4D.STATE.ACTIVE) || (currPoly.getState() & re4.wire.Poly4D.STATE.BACKFACE) || (currPoly.getState() & re4.wire.Poly4D.STATE.CLIPPED))
			{
				continue;
			}
			else
			{
				for(var j=0;j<3;j++)
				{
					currPoly.getVlist()[j].copy(mt.mulByVector(currPoly.getVlist()[j]));
				}

			}
		}
	}
	else if(cooedSelect==re4.wire.TRANS_COORD.LOCAL_TO_TRANS)
	{
		for(var i=0;i<this._polyQuan;i++)
		{
			var currPoly=this._polyData[this._polyPtrs[i]];
			if((currPoly==null) || !(currPoly.getState() & re4.wire.Poly4D.STATE.ACTIVE) || (currPoly.getState() & re4.wire.Poly4D.STATE.BACKFACE) || (currPoly.getState() & re4.wire.Poly4D.STATE.CLIPPED))
			{
				continue;
			}
			else
			{
				for(var j=0;j<3;j++)
				{
					currPoly.getTvlist()[j].copy(mt.mulByVector(currPoly.getVlist()[j]));
				}

			}
		}
	}
	else //if(cooedSelect==re4.wire.TRANS_COORD.TRANS_ONLY)
	{
		for(var i=0;i<this._polyQuan;i++)
		{
			var currPoly=this._polyData[this._polyPtrs[i]];
			if((currPoly==null) || !(currPoly.getState() & re4.wire.Poly4D.STATE.ACTIVE) || (currPoly.getState() & re4.wire.Poly4D.STATE.BACKFACE) || (currPoly.getState() & re4.wire.Poly4D.STATE.CLIPPED))
			{
				continue;
			}
			else
			{
				for(var j=0;j<3;j++)
				{
					currPoly.getTvlist()[j].copy(mt.mulByVector(currPoly.getTvlist()[j]));
				}

			}
		}
	}
	return this;
};

/**
 * Performs the local to world transformation on this list without matrix.
 * @method modelToWorldThis
 * @param {re4.math.Point4D} worldPos  The world position
 * @param {Enumeratd by re4.wire.TRANS_COORD} coordSelect select coords to transform
 */
re4.wire.RenderList4D.prototype.modelToWorldThis=function(worldPos,coordSelect)
{
	re4.fw.verifyArgs ([re4.fw.isInstanceOf,re4.fw.isEnumeratedBy],[re4.math.Vector4D,re4.wire.TRANS_COORD]);
	if(coordSelect==re4.wire.TRANS_COORD.LOCAL_ONLY)
	{
		for(var i=0;i<this._polyQuan;i++)
		{
			var currPoly=this._polyData[this._polyPtrs[i]];
			if((currPoly==null) || !(currPoly.getState() & re4.wire.Poly4D.STATE.ACTIVE) || (currPoly.getState() & re4.wire.Poly4D.STATE.BACKFACE) || (currPoly.getState() & re4.wire.Poly4D.STATE.CLIPPED))
			{
				continue;
			}
			else
			{
				for(var j=0;j<3;j++)
				{
					currPoly.setVector(j,currPoly.getVector(j).add(worldPos));
				}
			}
		}
	}
	else if(coordSelect==re4.wire.TRANS_COORD.LOCAL_TO_TRANS)
	{
		for(var i=0;i<this._polyQuan;i++)
		{
			var currPoly=this._polyData[this._polyPtrs[i]];
			if((currPoly==null) || !(currPoly.getState() & re4.wire.Poly4D.STATE.ACTIVE) || (currPoly.getState() & re4.wire.Poly4D.STATE.BACKFACE) || (currPoly.getState() & re4.wire.Poly4D.STATE.CLIPPED))
			{
				continue;
			}
			else
			{
				for(var j=0;j<3;j++)
				{
					currPoly.setTVector(j,currPoly.getVector(j).add(worldPos));
				}
			}
		}
	}
	else //if(cooedSelect==re4.wire.TRANS_COORD.TRANS_ONLY)
	{
		for(var i=0;i<this._polyQuan;i++)
		{
			var currPoly=this._polyData[this._polyPtrs[i]];
			if((currPoly==null) || !(currPoly.getState() & re4.wire.Poly4D.STATE.ACTIVE) || (currPoly.getState() & re4.wire.Poly4D.STATE.BACKFACE) || (currPoly.getState() & re4.wire.Poly4D.STATE.CLIPPED))
			{
				continue;
			}
			else
			{
				for(var j=0;j<3;j++)
				{
					currPoly.setTVector(j,currPoly.getTVector(j).add(worldPos));
				}
			}
		}
	}
};

/**
 * Transforms each polygon in the render list to camera coordinates based on the sent camera transform matrix.
 * Assumes the render list has already been transformed to eorld coordinates 
 * and the result  is in the tvlist[] of each polygon object
 * @method worldToCameraThis
 * @param {re4.wire.Camera4D} cam The camera
 */
re4.wire.RenderList4D.prototype.worldToCameraThis=function(cam)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.wire.Camera4D]);
	for(var i=0;i<this._polyQuan;i++)
	{
		var currPoly=this._polyData[this._polyPtrs[i]];
		if(currPoly==null || !(currPoly.getState() & re4.wire.Poly4D.STATE.ACTIVE) || (currPoly.getState() & re4.wire.Poly4D.STATE.BACKFACE) || (currPoly.getState() & re4.wire.Poly4D.STATE.CLIPPED))
		{
			continue;
		}
		else
		{
			for(var j=0;j<3;j++)
			{
				currPoly.setTVector ( j, cam.getMcam().mulByVector(currPoly.getTVector(j)));
			}			
		}

	}
};

/**
 * Not matrix based.
 * Removes the backfaces from polygon list, 
 * dose this based on the polygon list data tvlist along with the camera position.
 * Only the backface state is set in each polygon.
 * 
 * @method removeBackFacesThis
 * @param {re4.wire.Camera4D} cam The camera
 * 
 */
re4.wire.RenderList4D.prototype.removeBackFacesThis=function(cam)
{

};

/**
 * Not matrix based.
 * Transform each  polygon in the render list into camera  coordinates.
 * Assumes the render list has already been transformed to world coordinates and the result is in tvlist[] of each polygon object
 * 
 * @method cameraToPerspectiveThis
 * @param {re4.wire.Camera4D} cam The camera
 * 
 */
re4.wire.RenderList4D.prototype.cameraToPerspectiveThis=function(cam)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.wire.Camera4D]);
	for(var i=0;i<this._polyQuan;i++)
	{
		var currPoly=this._polyData[this._polyPtrs[i]];
		if(currPoly==null || !(currPoly.getState() & re4.wire.Poly4D.STATE.ACTIVE) || (currPoly.getState() & re4.wire.Poly4D.STATE.BACKFACE) || (currPoly.getState() & re4.wire.Poly4D.STATE.CLIPPED))
		{
			continue;
		}
		else
		{
			for(var ver=0;ver<3;ver++)
			{
				var x=currPoly.getTVector(ver).getX();
				var y=currPoly.getTVector(ver).getY();
				var z=currPoly.getTVector(ver).getZ();				
				currPoly.getTVector(ver).setX(cam.getViewDist()*x/z);
				currPoly.getTVector(ver).setY(cam.getViewDist()*y/z*cam.getAspectRatio());
			}
		}
	}

};

/**
 * Converts all valid vertices in the transformed vertex list from 4D homogeneous coordinates 
 * to normal 3D coordinates by dividing eacg x,y,z component by w 
 * 
 * @method convertFromHomogeneous4DThis
 * 
 */
re4.wire.RenderList4D.prototype.convertFromHomogeneous4DThis=function()
{

};

/**
 * Not matrix based.
 * Transform each  polygon in the render list from perspective into screen  coordinates.
 * Assumes the render list has already been transformed to normalized perspective coordinates 
 * and the result is in tvlist[].
 * 
 * @method perspectiveToScreenThis
 * @param {re4.wire.Camera4D} cam The camera
 * 
 */
re4.wire.RenderList4D.prototype.perspectiveToScreenThis=function(cam)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.wire.Camera4D]);
	for(var i=0;i<this._polyQuan;i++)
	{
		var currPoly=this._polyData[this._polyPtrs[i]];
		var alpha=(cam.getViewPortWidth()-1)/2;
		var beta=(cam.getViewPortHeight()-1)/2;
		if(currPoly==null || !(currPoly.getState() & re4.wire.Poly4D.STATE.ACTIVE) || (currPoly.getState() & re4.wire.Poly4D.STATE.BACKFACE) || (currPoly.getState() & re4.wire.Poly4D.STATE.CLIPPED))
		{
			continue;
		}
		else
		{
			for(var ver=0;ver<3;ver++)
			{
				var x=currPoly.getTVector(ver).getX();
				var y=currPoly.getTVector(ver).getY();
				currPoly.getTVector(ver).setX(x*alpha+alpha);
				currPoly.getTVector(ver).setY(beta-beta*y);
			}
		}
	}
};

/**
 * Not matrix based.
 * Transforms the camera coordinates of an render list into screen coordinates.
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
re4.wire.RenderList4D.prototype.cameraToScreenThis=function(cam)
{

};

/**
 * Draws all the faces in the list to the screen in wireframe, 16 bit mode.
 * There is no need to sort wire frame polygons, so hidden surfaces stay hidden.
 * Determines the bit depth and call the correct rasterizer.
 * 
 * @method drawWireTo
 * @param {re4.vm.Screen} screen The virtual computer screen
 * @param {re4.vm.Screen.BUFFER_SELECT} buffer Which buffer to draw
 */
re4.wire.RenderList4D.prototype.drawWireTo=function(screen,buffer)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf,re4.fw.isEnumeratedBy],[re4.vm.Screen,re4.vm.Screen.BUFFER_SELECT]);
	for(var i=0;i<this._polyQuan;i++)
	{
		var currPoly=this._polyData[this._polyPtrs[i]];
		if(currPoly==null || !(currPoly.getState() & re4.wire.Poly4D.STATE.ACTIVE) || (currPoly.getState() & re4.wire.Poly4D.STATE.BACKFACE) || (currPoly.getState() & re4.wire.Poly4D.STATE.CLIPPED))
		{
			continue;
		}
		else
		{
			for(var ver=0;ver<3;ver++)
			{
				screen.drawLine (currPoly.getTVector(ver).getX(),currPoly.getTVector(ver).getY(),currPoly.getTVector((ver+1)%3).getX(),currPoly.getTVector((ver+1)%3).getY(),currPoly.getColor(), buffer );
			}

		}
	}
};