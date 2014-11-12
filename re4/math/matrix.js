re4.fw.requires(["re4.fw","re4.math","re4.math.Vector4D","re4.math.Vector3D","re4.math.Vector2D"]);
/**
 * @module re4.math
 * @namespace re4.math
 */

/**
 * The private generic matrix class hiding the implement details of all kinds of matrix.
 * 
 * @class _GenericMatrix
 * 
 * @constructor
 * @param {Array of Array of number} rows  Matrix rows
 * @param {number} rowQuan Row number of the matrix
 * @param {number} colQuan Col number of the matrix  
 * 
 */
re4.math._GenericMatrix=function(rows,rowQuan,colQuan)
{
	/**
	 * The Matrix elements.
	 * All matrices are in row major form(row*col matrix representation) and indexed [0..n][0..n] = [row_index][column_index].
	 * @property _m
	 * @type number[][]
	 */
	this._m=new Array();
	re4.fw.veriArgs(arguments, [re4.fw.isArray,re4.fw.isNumber,re4.fw.isNumber]);
	if(rowQuan==rows.length)
	{
		for(var i=0;i<rows.length;i++)
		{
			if(re4.fw.isArray(rows[i]))
			{
				if(rows[i].length==colQuan)
				{
					this._m[i]=new Array();
					for(var j=0;j<rows[i].length;j++)
					{
						if(!re4.fw.isNumber(rows[i][j]))
						{
							throw new Error("wrong arg type for re4.math._GenericMatrix:is not number at:row="+i+",col="+j);
						}
						else
						{
							this._m[i][j]=rows[i][j];
						}
					}
				}
				else
				{
					throw new Error("wrong data set row*col for re4.math._GenericMatrix");
				}
			}
			else
			{
				throw new Error("wrong arg type for re4.math._GenericMatrix");
			}

		}
	}
	else
	{
		throw new Error("wrong data set row*col for re4.math._GenericMatrix");
	}

};

/**
 * @2012-3-24 BUG HERE!
 * Private method, should not be used but the author.
 * Initializes the matrix with the sent floating-point values in row major form.
 * @method _init
 * @static
 * @param {number} rowQuan Row numbers of the matrix to be inited
 * @param {number} colQuan Column numbers of the matrix to be inited
 * @param {number[]} THE_FOLLOWED_ARGS Data used to init
 */
re4.math._GenericMatrix._init=function(rowQuan,colQuan)
{
	var argArr=new Array();
	for(var i=0;i<arguments.length;i++)
	{
		argArr[i]=re4.fw.isNumber;
	}
	re4.fw.verifyArgs ( argArr);
	if(this.getColQuan==colQuan && this.getRowQuan==rowQuan && arguments.length==(rowQuan*colQuan+2))
	{
		for( i=0;i<rowQuan;i++)
		{
			for(var j=0;j<colQuan;j++)
			{
				this.set(i,j,arguments[/*The previous i rows used i*colQuan args*/i*colQuan+/*This row used j args*/j+/*Data args started since index 2*/2]);
			}
		}
	}
	else
	{
		throw new Error("re4.math._GenericMatrix.init:improper elements number to init");
	}

};

/**
 * Get a matrix element
 * @method get
 * @param {number} row  The row index 
 * @param {number} col The col index
 * @return {number} The element
 */
re4.math._GenericMatrix.prototype.get=function(row,col)
{
	re4.fw.veriArgs(arguments,[re4.fw.isNumber,re4.fw.isNumber]);
	if(row>=0 && row<this._m.length)
	{
		if(col>=0 && col<this._m[row].length)
		{
			return this._m[row][col];
		}
		else
		{
			throw new Error("invalid col index:"+col);
		}
	}
	else
	{
		throw new Error("invalid row index:"+row);
	}
};

/**
 * Set a matrix element
 * @method set
 * @param {number} row  The row index 
 * @param {number} col The col index
 * @param {number} val The new element value
 */
re4.math._GenericMatrix.prototype.set=function(row,col,val)
{
	re4.fw.veriArgs(arguments,[re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber]);
	if(row>=0 && row<this.m.length)
	{
		if(col>=0 && col<this._m[row].length)
		{
			this._m[row][col]=val;
		}
		else
		{
			throw new Error("invalid col index:"+col);
		}
	}
	else
	{
		throw new Error("invalid row index:"+row);
	}
};

/**
 * Get the row number of this matrix 
 * @method getRowQuan
 * @return {number} The row number
 */
re4.math._GenericMatrix.prototype.getRowQuan=function()
{
	return this._m.length;
};

/**
 * Get the column number of this matrix 
 * @method getColQuan
 * @return {number} The column number
 */
re4.math._GenericMatrix.prototype.getColQuan=function()
{
	return this._m[0].length;
};

/**
 * Set this matrix into zero matrix
 * @method zeroThis
 */
re4.math._GenericMatrix.prototype.zeroThis=function()
{
	for(var i=0;i<this._m.length;i++)
	{
		for(var j=0;j<this._m[i].length;j++)
		{
			this._m[i][j]=0;
		}

	}
};

/**
 * Set this matrix into iden matrix
 * @method identifyThis
 */
re4.math._GenericMatrix.prototype.identifyThis=function()
{
	for(var i=0;i<this._m.length;i++)
	{
		for(var j=0;j<this._m[i].length;j++)
		{
			if(i==j)
			{
				this._m[i][j]=1;
			}
			else
			{
				this._m[i][j]=0;
			}
		}
	}
};

/**
 * Copy the source matrix elements into this matrix
 * @method copy
 * @param {re4.math._GenericMatrix} src The source matrix
 * @return {_GenericMatrix} The new this matrix.
 */
re4.math._GenericMatrix.prototype.copy=function(src)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[this.constructor]);
	for(var i=0;i<this._m.length;i++)
	{
		for(var j=0;j<this._m[i].length;j++)
		{
			this._m[i][j]=src.get(i,j);
		}
	}
	return this;
};


/**
 * Transpose the matrix
 * @method transposeThis
 * @return {_GenericMatrix} The transposed this matrix.
 */
re4.math._GenericMatrix.prototype.transposeThis=function()
{
	for(var i=0;i<this._m.length-1;i++)
	{
		for(var j=i+1;j<this._m[i].length;j++)
		{
			var tmp=this._m[i][j];
			this._m[i][j]=this._m[j][i];
			this._m[j][i]=tmp;
		}
	}
	return this;
};


/**
 * Replace the target matrix elements with this matrix transposed,the elements of this matrix will kept untouched 
 * @method transposeTo
 * @param {re4.math._GenericMatrix} target The target matrix
 */
re4.math._GenericMatrix.prototype.transposeTo=function(target)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[this.constructor]);
	for(var i=0;i<target.length;i++)
	{
		for(j=0;j<this._m[i].length;j++)
		{
			target.set(j,i,this._m[i][j]);
		}
	}
};

/**
 * Left multiply this matrix with a vector, the vector dimension must equals to the matirix row number 
 * @method mulByVector
 * @param {re4.math.Vector2D/Vector3D/Vector4D} v The vector
 * @return {re4.math.Vector2D/Vector3D/Vector4D} The result vector
 */
re4.math._GenericMatrix.prototype.mulByVector=function(v)
{
	if(re4.fw.isInstanceOf(v,re4.math.Vector4D))
	{
		if(this.getRowQuan()!=4)
		{
			throw new Error("invalid parameter");
		}
	}
	else if(re4.fw.isInstanceOf(v,re4.math.Vector3D))
	{
		if(this.getRowQuan()!=3)
		{
			throw new Error("invalid parameter");
		}
	}
	else if(re4.fw.isInstanceOf(v,re4.math.Vector2D))
	{
		if(this.getRowQuan()!=2)
		{
			throw new Error("invalid parameter");
		}
	}
	else
	{
		throw new Error("invalid parameter");
	}
	var x=new Array(this.getColQuan());
	for(var i=0;i<this.getColQuan();i++)
	{
		x[i]=0;
		for(var j=0;j<this.getRowQuan();j++)
		{
			x[i]=x[i]+v.get(j)*this._m[j][i];
		}

	}
	if(this.getRowQuan()==4)
	{
		return new re4.math.Vector4D(x[0],x[1],x[2],x[3]);
	}
	else if(this.getRowQuan()==3)
	{
		return new re4.math.Vector3D(x[0],x[1],x[2]);
	}
	else
	{
		return new re4.math.Vector2D(x[0],x[1]);
	}



};

/**
 * Replace the specified column with the new column
 * @method replaceColumnWith
 * @param {number} index The column to be replaced
 * @param {number[]} col The new column
 */
re4.math._GenericMatrix.prototype.replaceColumnWith=function(index,col)
{
	if(re4.fw.isNumber(index) && re4.fw.isArray(col) && col.length==this._m[0].length && index>=0 && index<=this._m.length)
	{
		for(var i=0;i<col.length;i++)
		{
			if(re4.fw.isNumber(col[i]))
			{
				this._m[index][i]=col[i];
			}
			else
			{
				throw new Error("improper matrix column to replace");
			}			
		}

	}
	else
	{
		throw new Error("invalid argument(s)");
	}

};

/**
 * This is private, to be extended
 * Multiply another matrix onto this matrix
 * @method _multiply
 * @param {re4.math._GenericMatrix} m2 The other matrix
 * @return {re4.math._GenericMatrix} The multiplication result
 * 
 */
re4.math._GenericMatrix.prototype._multiply=function(m2)
{
	re4.fw.verifyArgs ([re4.fw.isInstanceOf],[re4.math._GenericMatrix] );
	if(this.getColQuan()==m2.getRowQuan())
	{
		var rows=new Array(this.getRowQuan());
		for(var i=0;i<this.getRowQuan();i++)
		{
			rows[i]=new Array(m2.getColQuan());
			for(var j=0;j<m2.getColQuan();j++)
			{
				rows[i][j]=0;
				for(var k=0;k<this.getColQuan();k++)
				{
					rows[i][j]=rows[i][j]+this._m[i][k]*m2.get(k,j);
				}
			}
		}

		return new re4.math._GenericMatrix(rows,this.getRowQuan(),m2.getColQuan());
	}
	else
	{
		throw new Error("can not do multiplication on these two matrix");
	}
};



/**
 * The matrix that's 4*4 dimensioned 
 * @class Matrix4X4
 * @extends re4.math._GenericMatrix
 * @constructor
 * @param {number[]} row0 The first row
 * @param {number[]} row1 The second row
 * @param {number[]} row2 The third row 
 * @param {number[]} row3 The fourth row 

 */
re4.math.Matrix4X4=function(row0,row1,row2,row3)
{

	re4.math._GenericMatrix.call(this,[row0,row1,row2,row3],4,4);
};
re4.fw.inherits(re4.math.Matrix4X4,re4.math._GenericMatrix);

/**
 * 4x4 identity matrix
 * @property IDEN_MAT
 * @static
 * @final
 * @type re4.math.Matrix4X4
 */
re4.math.Matrix4X4.IDEN_MAT=new re4.math.Matrix4X4([1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]);

/**
 * Build a matrix rotater based on the specified angles of the three axes 
 * @method buildRotationXYZ
 * @static
 * @param {number} angX Angle rotated around X axe, in radians
 * @param {number} angY Angle rotated around Y axe, in radians
 * @param {number} angZ Angle rotated around Z axe, in radians
 * @return {re4.math.Matrix4X4} The matrix 
 * 
 */
re4.math.Matrix4X4.buildRotationXYZ=function(angX,angY,angZ)
{
	re4.fw.verifyArgs([re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber]);
	var ma=re4.math.Matrix4X4.IDEN_MAT;
//	var ma=new re4.math.Matrix4X4([1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]);
	if(angX!=0)
	{
		ma=ma.multiply4X4(new re4.math.Matrix4X4([1,0,0,0],[0,re4.math.cos(angX),re4.math.sin(angX),0],[0,-re4.math.sin(angX),re4.math.cos(angX),0],[0,0,0,1]));
	}
	if(angY!=0)
	{
		ma=ma.multiply4X4(new re4.math.Matrix4X4([re4.math.cos(angY),0,-re4.math.sin(angY),0],[0,1,0,0],[re4.math.sin(angY),0,re4.math.cos(angY),0],[0,0,0,1]));
	}
	if(angZ!=0)
	{
		ma=ma.multiply4X4(new re4.math.Matrix4X4([re4.math.cos(angZ),re4.math.sin(angZ),0,0],[-re4.math.sin(angZ),re4.math.cos(angZ),0,0],[0,0,1,0],[0,0,0,1]));
	}
	return ma;
};

/**
 * Build a matrix translater based on the specified displacements of the three axes 
 * @method buildTranslationXYZ
 * @static
 * @param {number} disX Displacements on coord X
 * @param {number} disY Displacements on coord Y
 * @param {number} disZ Displacements on coord Z
 * @return {re4.math.Matrix4X4} The matrix 
 * 
 */
re4.math.Matrix4X4.buildTranslationXYZ=function(disX,disY,disZ)
{
	re4.fw.verifyArgs([re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber]);
	return new re4.math.Matrix4X4([1,0,0,0],[0,1,0,0],[0,0,1,0],[disX,disY,disZ,1]);
};

/**
 * Build a matrix translater based on the specified displacements of the three axes 
 * @method buildTranslationXYZ
 * @static
 * @param {number} disX Displacements on coord X
 * @param {number} disY Displacements on coord Y
 * @param {number} disZ Displacements on coord Z
 * @return {re4.math.Matrix4X4} The matrix 
 * 
 */
re4.math.Matrix4X4.buildScaleXYZ=function(sX,sY,sZ)
{
	re4.fw.verifyArgs([re4.fw.isNumber,re4.fw.isNumber,re4.fw.isNumber]);
	return new re4.math.Matrix4X4([sX,0,0,0],[0,sY,0,0],[0,0,sZ,0],[0,0,0,1]);
};

/**
 * Init a new 4X4 matrix with a generic matrix structure
 * @method fromGeneric
 * @static
 * @param {re4.math._GenericMatrix} gm The generic super matrix
 * @return {re4.math.Matrix4X4} The 4X4
 * 
 */
re4.math.Matrix4X4.fromGeneric=function(gm)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math._GenericMatrix]);
	if(gm.getColQuan()>=4 && gm.getRowQuan()>=4)
	{
		return new re4.math.Matrix4X4(	[gm.get(0,0),gm.get(0,1),gm.get(0,2),gm.get(0,3)],
				[gm.get(1,0),gm.get(1,1),gm.get(1,2),gm.get(1,3)],
				[gm.get(2,0),gm.get(2,1),gm.get(2,2),gm.get(2,3)],
				[gm.get(3,0),gm.get(3,1),gm.get(3,2),gm.get(3,3)]);
	}
	else
	{
		throw new Error("not enough elements to init a 4X4 matrix");
	}
};

/**
 * Multiply another matrix(col number must be 4) onto this 4X4matrix, this will kept untouched
 * @method multiply4X4
 * @param {re4.math.Matrix4X4} m2 The other matrix
 * @return {re4.math.Matrix4X4} The multiplication result
 * 
 */
re4.math.Matrix4X4.prototype.multiply4X4=function(ma)
{
	re4.fw.verifyArgs([re4.fw.isInstanceOf],[re4.math.Matrix4X4]);

	var gm=this._multiply(ma);
	return re4.math.Matrix4X4.fromGeneric(gm);
};



/**
 * The matrix that's 4 rows - 3 cols dimensioned 
 * @class Matrix4X3
 * @extends re4.math._GenericMatrix
 * @constructor
 * @param {number[]} row0 The first row
 * @param {number[]} row1 The second row
 * @param {number[]} row2 The third row 
 * @param {number[]} row3 The fourth row 
 */
re4.math.Matrix4X3=function(row0,row1,row2,row3)
{
	re4.math._GenericMatrix.call(this,[row0,row1,row2,row3],4,3);
};
re4.fw.inherits(re4.math.Matrix4X3,re4.math._GenericMatrix);


/**
 * 4x3 identity matrix (note this is not correct mathematically). 
 * But later we may use 4x3 matrices with the assumption that
 * the last column is always [0 0 0 1]t
 * @property IDEN_MAT
 * @static
 * @final
 * @type re4.math.Matrix4X3
 */
re4.math.Matrix4X3.IDEN_MAT=new re4.math.Matrix4X3([1,0,0],[0,1,0],[0,0,1],[0,0,0]);


/**
 * The matrix that's 3 rows - 3 cols dimensioned 
 * @class Matrix3X3
 * @extends re4.math._GenericMatrix
 * @constructor
 * @param {number[]} row0 The first row
 * @param {number[]} row1 The second row
 * @param {number[]} row2 The third row 
 */
re4.math.Matrix3X3=function(row0,row1,row2)
{
	re4.math._GenericMatrix.call(this,[row0,row1,row2],3,3);
};
re4.fw.inherits(re4.math.Matrix3X3,re4.math._GenericMatrix);


/**
 * 3x3 identity matrix
 * @property IDEN_MAT
 * @static
 * @final
 * @type re4.math.Matrix3X3
 */
re4.math.Matrix3X3.IDEN_MAT=new re4.math.Matrix3X3([1,0,0],[0,1,0],[0,0,1]);

/**
 * The matrix that's 3 rows - 2 cols dimensioned 
 * @class Matrix3X3
 * @extends re4.math._GenericMatrix
 * @constructor
 * @param {number[]} row0 The first row
 * @param {number[]} row1 The second row
 * @param {number[]} row2 The third row 
 */
re4.math.Matrix3X2=function(row0,row1,row2)
{
	re4.math._GenericMatrix.call(this,[row0,row1,row2],3,2);
};
re4.fw.inherits(re4.math.Matrix3X2,re4.math._GenericMatrix);


/**
 * The matrix that's 2 rows - 2 cols dimensioned 
 * @class Matrix2X2
 * @extends re4.math._GenericMatrix
 * @constructor
 * @param {number[]} row0 The first row
 * @param {number[]} row1 The second row
 */
re4.math.Matrix2X2=function(row0,row1)
{
	re4.math._GenericMatrix.call(this,[row0,row1],2,2);
};
re4.fw.inherits(re4.math.Matrix2X2,re4.math._GenericMatrix);


/**
 * 2x2 identity matrix
 * @property IDEN_MAT
 * @static
 * @final
 * @type re4.math.Matrix2X2
 */
re4.math.Matrix2X2.IDEN_MAT=new re4.math.Matrix2X2([1,0],[0,1]);



/**
 * The matrix that's 1 rows - 4 cols dimensioned 
 * @class Matrix1X4
 * @extends re4.math._GenericMatrix
 * @constructor
 * @param {number[]} row0 The first row
 */
re4.math.Matrix1X4=function(row0)
{
	re4.math._GenericMatrix.call(this,[row0],1,4);
};
re4.fw.inherits(re4.math.Matrix1X4,re4.math._GenericMatrix);


/**
 * The matrix that's 1 rows - 3 cols dimensioned 
 * @class Matrix1X3
 * @extends re4.math._GenericMatrix
 * @constructor
 * @param {number[]} row0 The first row
 */
re4.math.Matrix1X3=function(row0)
{
	re4.math._GenericMatrix.call(this,[row0],1,3);
};
re4.fw.inherits(re4.math.Matrix1X3,re4.math._GenericMatrix);


/**
 * The matrix that's 1 rows - 2 cols dimensioned 
 * @class Matrix1X2
 * @extends re4.math._GenericMatrix
 * @constructor
 * @param {number[]} row0 The first row
 */
re4.math.Matrix1X2=function(row0)
{
	re4.math._GenericMatrix.call(this,[row0],1,2);
};
re4.fw.inherits(re4.math.Matrix1X2,re4.math._GenericMatrix);




