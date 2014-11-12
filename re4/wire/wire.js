/**
 * Wireframe rendering engine of re4 
 * @module re4.wire
 * @namespace re4
 */

re4.fw.requires(["re4.fw","re4.math","re4.math.Point4D","re4.math.Vector4D"]);

/**
 * Basical functions and constants of wireframe engine
 * @class re4.wire
 * 
 */
re4.fw.provides("re4.wire");

/**
 * Builds up a general local to world transformation matrix
 * @method buildModelToWorldMatrix4X4
 * @static
 * @param {re4.math.Vector4D} vpos Translation of the origin
 * @return {re4.math.Matrix4X4} The Transformation matrix
 */
re4.wire.buildModelToWorldMatrix4X4=function(vpos)
{
	
};



/**
 * Builds up a camera to perspective transformation matrix.
 * In most cases the camera would have a 2X2 normalized view plane with a 90 degree FOV,
 * since the point of the having this matrix must be also have a perspective to screen matrix that scales the normalized coordinates,
 * also the matrix assumes that you are working in 4D homogenous coordinates and at some point there will be a 4D->3D conversion,
 * it might be immediately after this transform is applied to vertices, or after the perspective to screen transform.
 * 
 * @method buildCameraToPerspectiveMatrix4X4
 * @static
 * @param {re4.wire.Camera4D} cam The camera
 * @return {re4.math.Matrix4X4} The Transformation matrix
 */
re4.wire.buildCameraToPerspectiveMatrix4X4=function(cam)
{
	
};

/**
 * Builds up a general perspective to screen transformation matrix.
 * Assumes that you want to perform the transform in homogeneous conversion 
 * and at raster time there will be a 4D->3D homogeneous conversion. 
 * And of course only the x,y points will be considered for the 2D rendering, 
 * thus you would use this function's matrix as if your perspective coordinates were still in homogeneous form when this matrix was applied,
 * Additionally, the point of this matrix to scale and translate the perspective coordinates to screen coordinates,
 * thus the matrix is built up assuming that the perspective coordinates are in normalized form  for a 2X2  view plane,
 * that is , x: -1~1, y: -1/ar~1/ar  
 *   
 * @method buildPerspectiveToScreen4DMatrix4X4
 * @static
 * @param {re4.wire.Camera4D} cam The camera
 * @return {re4.math.Matrix4X4} The Transformation matrix
 */
re4.wire.buildPerspectiveToScreen4DMatrix4X4=function(cam)
{
	
};

/**
 * Builds up a general perspective to screen transformation matrix.
 * Assumes that you want to perform the transform in 2D/3D coordinates,
 * that is you have already converted the perspective coordinates from homogeneous 4D to 3D before applying this matrix.  
 * Additionally, the point of this matrix to scale and translate the perspective coordinates to screen coordinates,
 * thus the matrix is built up assuming that the perspective coordinates are in normalized form  for a 2X2  view plane,
 * that is , x: -1~1, y: -1/ar~1/ar  
 * 
 * The only difference between this and the re4.wire.buildPerspectiveToScreen4DMatrix4X4 the last column dosen't force w=z,
 * in fact the z, and w results are irrelevant since we assume  that BEFORE this matrix  is applied 
 * all points are already converted  from 4D->3D. 
 *   
 * @method buildPerspectiveToScreenMatrix4X4
 * @static
 * @param {re4.wire.Camera4D} cam The camera
 * @return {re4.math.Matrix4X4} The Transformation matrix
 */
re4.wire.buildPerspectiveToScreenMatrix4X4=function(cam)
{
	
};

/**
 * Transformation coord select flag:
 * This is an Enumerator
 * @class re4.wire.TRANS_COORD
 * @final
 * @static
 */
re4.wire.TRANS_COORD=new Object();

/**
 * perform the transformation in place on the local/world vertex list
 * @property LOCAL_ONLY
 * @type number
 * @final
 * @static
 */
re4.wire.TRANS_COORD.LOCAL_ONLY=0;

/**
 * perform the transformation in place on the "transformed" vertex list
 * @property TRANS_ONLY
 * @type number
 * @final
 * @static
 */
re4.wire.TRANS_COORD.TRANS_ONLY=1;

/**
 * perform the transformation to the local vertex list, but store the results in the transformed vertex list
 * @property LOCAL_TO_TRANS
 * @type number
 * @final
 * @static
 */
re4.wire.TRANS_COORD.LOCAL_TO_TRANS=2;














