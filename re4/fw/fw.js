/**
 * Framework utilities of re4
 * @module re4.fw
 * @namespace re4
 */

/**
 * 
 * 
 * @class  re4.fw
 * @static
 */
var re4;
if( ! re4)
{
	re4 = new Object();
}
else	if (typeof re4 != "object")
{
	throw new Error("canot install re4");
}
if( ! re4.fw)
{
	re4.fw = new Object();
}
else 
{
	if (typeof re4.fw != "object")
	{
		throw new Error("canot install re4.fw");
	}
}


/**
 * The refer to the global object.
 * @property GLOBAL
 * @static
 * @type Object
 */
re4.fw.GLOBAL = this;

/**
 * Whether the source is number or not
 * @method isNumber
 * @param {_ANYTHING_} source test object 
 * @return {boolean} ret
 */
re4.fw.isNumber = function (source) 
{
	return '[object Number]' == Object.prototype.toString.call(source) && isFinite(source);
};

/**
 * Whether the source is boolean or not
 * @method isBoolean
 * @param {_ANYTHING_} source test object 
 * @return {boolean} ret
 */
re4.fw.isBoolean = function(o) 
{
	return typeof o === 'boolean';
};

/**
 * Whether the source is String or not
 * @method isString
 * @param {_ANYTHING_} source test object 
 * @return {boolean} ret
 */
re4.fw.isString = function (source) 
{
	return '[object String]' == Object.prototype.toString.call(source);
};

/**
 * Whether the source is Array or not
 * @method isArray
 * @param {_ANYTHING_} v test object 
 * @return {boolean} ret
 */
re4.fw.isArray = function(v)
{
	return (v.constructor === Array );
};

/**
 * Whether the source is an Array or entity that can be verified by  auther and clazz
 * @method isArrayOf
 * @param {_ANYTHING_} source test object 
 * @param {Function} Type auther
 * @param {Function} clazz Class of the entities
 * @return {boolean} ret
 */
re4.fw.isArrayOf=function(v,auther,clazz)
{
	if(re4.fw.isArray(v)==false || re4.fw.isFunction(auther)==false )
	{
		return false;
	}
	else
	{
		for(var i=0;i<v.length;i++)
		{
			re4.fw.veriArgs(v[i],auther,clazz);
		}
	}
};

/**
 * Whether the source is an Array or primitives  
 * @method isArrayOfPrims
 * @param {_ANYTHING_} source test object 
 * @param {Function} Primitive type authers
 * @return {boolean} ret
 */
re4.fw.isArrayOfPrims=function(v,auther)
{
	if(auther==re4.fw.isNumber || auther==re4.fw.isBoolean || auther==re4.fw.isString)
	{
		re4.fw.isArrayOf(v,auther);
	}
	else
	{
		throw new Error("only primitive verifiers are accepted");
	}
};

/**
 * Whether the source is an Array or instance of some classes 
 * @method isArrayOfInstances
 * @param {_ANYTHING_} source test object 
 * @param {Function} clazz Class of the instances
 * @return {boolean} ret
 */
re4.fw.isArrayOfInstances=function(v,clazz)
{
	if(clazz==re4.fw.isNumber || clazz==re4.fw.isBoolean || clazz==re4.fw.isString)
	{
		throw new Error("only primitive verifiers are accepted");
	}
	else
	{
		re4.fw.isArrayOf(v,re4.fw.isInstanceOf,clazz);
	}
};


/**
 * Whether the source is Function or not
 * @method isFunction
 * @param {_ANYTHING_} source test object 
 * @return {boolean} ret
 */
re4.fw.isFunction = function (source) 
{
	return '[object Function]' == Object.prototype.toString.call(source);
};

/**
 * Whether the source is Object or not
 * @method isObject
 * @param {_ANYTHING_} source test object 
 * @return {boolean} ret
 */
re4.fw.isObject = function (source) 
{
	return (source && 'object' == typeof source && !re4.fw.isArray(source));
};

/**
 * Whether the source is Date or not
 * @method isDate 
 * @param {_ANYTHING_} source test object 
 * @return {boolean} ret
 */
re4.fw.isDate = function(o) 
{
	// return o instanceof Date;
	return {}.toString.call(o) === "[object Date]" && o.toString() !== 'Invalid Date' && !isNaN(o);
};

/**
 * Whether the source is a DOM element or not
 * @method isElement
 * @param {_ANYTHING_} source test object 
 * @return {boolean} ret
 */
re4.fw.isElement = function (source) 
{
	return !!(source && source.nodeName && source.nodeType == 1);
};

/**
 * Whether the source is a instance of the specified class or a subclass of the specified class
 * @method isInstanceOf
 * @param {_ANYTHING_} source test object 
 * @return {boolean} ret
 */
re4.fw.isInstanceOf=function(src,cls)
{
	if(src==null)
	{
		return true;
	}
	else
	{
		if(re4.fw.isObject(src) || re4.fw.isArray(src) || re4.fw.isFunction(src))
		{
			if(re4.fw.isFunction(cls))
			{
				while(Object.getPrototypeOf(src))
				{
					if(src.constructor==cls)
					{
						return true;
					}
					else
					{
						src=Object.getPrototypeOf(src);
					}
				}
				//discarded @2012-3-19
				//return true;
			}
		}
		return false;
	}
};

/**
 * Whether the src value is enumerated by the members of obj
 * @method isEnumeratedBy
 * @param {_PRIMITIVES(number/string/boolean)_} src the value to be tested
 * @param {Object} obj the enumerater
 * @return {boolean} if src equals one of obj's member returns true, or returns false
 */
re4.fw.isEnumeratedBy=function(src,obj)
{
	if(re4.fw.isNumber(src) || re4.fw.isString(src) || re4.fw.isBoolean(src))
	{
//		re4.fw.debug(new Error(),"src="+src);

		for (var memb in obj) 
		{
//			re4.fw.debug(new Error(),"memb("+memb+")="+obj[memb]+",src="+src+":"+(obj[memb]==src));
			if(obj[memb]==src)
			{
				return true;
			}
		}
		return false;
	}
	else
	{
		throw new Error("Only primitives(number/string/boolean) can be enumerated");
	}
};

/**
 * Establish the Object framwork for code organization
 * @method provides
 * @param {String} name Object framework to establish
 * @return {Object} the bottom Object that's just created, eg:after provides "top-pkg.lv1-pkg.lv2-pkg.clazz" the Object window.top-pkg.lv1-pkg.lv2-pkg.clazz will be returned
 */
re4.fw.provides = function(name)
{
	var nameIsString = true;
	if(name == null || name == undefined)
	{
		nameIsString = false;
	}
	else if(typeof name != "string")
	{
		if(typeof name == "object")
		{
			if(name.constructor != String)
			{
				nameIsString = false;
			}

		}
		else
		{
			nameIsString = false;
		}

	}
	if(nameIsString == false)
	{
		throw new Error("provide name(" + name + ") must be specified by a String");
	}
	else
	{
		var parts = name.split('.');
		var container = re4.fw.GLOBAL;
		for(var i = 0; i < parts.length; i ++ )
		{
			var part = parts[i];

			// If there is no property of container with this name, create
			// an empty object.
			if ( ! container[part])
			{
				container[part] = new Object();
			}
			else
			{
				if(i < parts.length - 1)
				{
					if (typeof container[part] != "object")
					{
						// If there is already a property, make sure it is an object
						var n = parts.slice(0, i + 1).join('.');
						throw new Error(n + " already exists and is not an object");
					}
				}
				else
				{
					var n = parts.slice(0, i + 1).join('.');
					throw new Error(n + " is exported already");
				}
			}
			container = container[part];
		}
		return container;
	}
};

/**
 * Declare the prerequisite packages and class needed by this js src file
 * @method requires
 * @param {Array of String} pres list if needed packages and classes
 * @return {boolean} ret
 * 
 */
re4.fw.requires = function(pres)
{
	var container; 
	var pref;
	var parts;
	if(this.isArray(pres))
	{
		for(var i = 0; i < pres.length; i ++ )
		{
			container= re4.fw.GLOBAL;
			parts = pres[i].split('.');
			for(var j = 0; j < parts.length; j ++ )
			{
				if(this.isString(parts[j]))
				{
					if(container[parts[j]] && ((typeof container[parts[j]]) == "object" || (typeof container[parts[j]]) == "function"))
					{
						container = container[parts[j]];
					}
					else
					{
						pref = parts.slice(0, j + 1).join('.');
						throw new Error(pref + " is not loaded properly");
					}
				}
				else
				{
					throw new Error("requires must be specified by array of string(" + pres + ")");
				}
			}
		}

	}
	else
	{
		throw new Error("requires must be specified by array of string(" + pres + ")");
	}
};

/**
 * verify the argument types
 * @method veriArgs
 * @param {Array of _ANYTHING_} args arguments to be verified
 * @param {Array of Function} authers Type verify functions
 * @param {Array of Function} clazz if verified with generic functions, specify the classes here
 * @return {boolean} ret
 */
re4.fw.veriArgs=function (args,authers,clazz)
{	

	

	var ret=true;
	if( args.length>authers.length )
	{
		re4.fw.debug(new Error(),args);
		ret= false;
		throw new Error("function: "+arguments.callee.caller.name+" try to verify args failed:len of arguments("+args.length+") > len of auther functions("+authers.length+").");
	}
	else
	{
		var clsSeq=0;
		for(var i=0;i<args.length;i++)
		{

			if(authers[i]==re4.fw.isInstanceOf || authers[i]==re4.fw.isEnumeratedBy || authers[i]==re4.fw.isArrayOfInstances || authers[i]==re4.fw.isArrayOfPrims)
			{
				if((authers[i]).call(re4.fw,args[i],clazz[clsSeq])==false)
				{
					ret= false;
					break;
				}
				else
				{
					clsSeq++;
				}
			}
			else
			{
				if((authers[i]).call(re4.fw,args[i])==false)
				{
					ret=false;
					break;
				}
			}
		}
	}
	if(ret==false)
	{
		re4.fw.debug(new Error(),"function: "+arguments.callee.caller.name+" try to verify args failed:failed at arguments["+i+"].");
		throw new Error("function: "+arguments.callee.caller.name+" try to verify args failed:failed at arguments["+i+"].");
	}
	return ret;
};

/**
 * verify the argument types of the caller of this function
 * @method verifyArgs
 * @param {Array of Function} authers Type verify functions
 * @param {Array of Function} clazz if verified with generic functions, specify the classes here
 * @return {boolean} ret
 */
re4.fw.verifyArgs=function (authers,clazz)
{
	re4.fw.veriArgs(arguments.callee.caller.arguments,authers,clazz);
};

/**
 * install property getter on the class
 * @method installGetters
 * @param {Object} obj Object to install the getter method on, if you want to install a instance method, please offer the property of the constructor
 * @param {Array of String} props Property name list, properties should start with underscore(_,meaning private), eg:property:_prop ==> getter:getProp() 
 */
re4.fw.installGetters=function(obj,props)
{
	re4.fw.veriArgs(arguments,[re4.fw.isObject,re4.fw.isArray]);
	for(var i=0;i<props.length;i++)
	{
		(function(propName){
			obj["get"+propName.charAt(1).toUpperCase()+propName.substring(2,propName.length)]=function()
			{
				return this[propName];
			};
		})(props[i]);
	}
};


/**
 * install property setter on the class
 * @method installSetters
 * @static
 * @param {Object} obj Object to install the setter method on, if you want to install a instance method, please offer the property of the constructor
 * @param {Array of String} props Property name list, properties should start with underscore(_,meaning private), eg:property:_prop ==> setter:setProp() 
 */
re4.fw.installSetters=function(obj,props)
{
	re4.fw.veriArgs(arguments,[re4.fw.isObject,re4.fw.isArray]);
	for(var i=0;i<props.length;i++)
	{
		(function(propName){
			obj["set"+propName.charAt(1).toUpperCase()+propName.substring(2,propName.length)]=function(value)
			{
				var match=false;
				if(re4.fw.isNumber(this[propName]) )
				{
					if(re4.fw.isNumber(value))
					{
						match=true;
					}

				}
				else if(re4.fw.isBoolean(this[propName]) )
				{
					if(re4.fw.isBoolean(value))
					{
						match=true;
					}

				}
				else if(re4.fw.isString(this[propName]))
				{
					if(re4.fw.isString(value))
					{
						match=true;
					}

				} 
				else if(re4.fw.isArray(this[propName]) )
				{
					if(re4.fw.isArray(value))
					{
						match=true;
					}

				} 
				else if(re4.fw.isFunction(this[propName])  )
				{
					if(re4.fw.isFunction(value))
					{
						match=true;
					}

				} 
				else if(re4.fw.isDate(this[propName]) )
				{
					if( re4.fw.isDate(value))
					{
						match=true;
					}

				}
				else if(this[propName].prototype.constructor==value.prototype.constructor)
				{
					match=true;
				}
				if(match)
				{
					this[propName]=value;	
				}
				else
				{
					throw new Error("trying to assign unmatched value through setter:now="+this[propName]+",trying="+value);
				}


			};
		})(props[i]);
	}
};

/**
 * Setup inherit relationship between sub-sup class
 * @method inherits
 * @static
 * @param {Function} childClazz The child class
 * @param {Function} parentClazz The parent class

re4.fw.inherits=function(instance,childClazz,parentClazz,args)
{
	//parentClazz.apply(instance,args);
	var fake=function(){};
	fake.prototype=parentClazz.prototype;
	childClazz.prototype=new fake();
	childClazz.prototype.constructor=childClazz;
};
 */
re4.fw.inherits=function(childClazz,parentClazz)
{
	//parentClazz.apply(instance,args);
	var fake=function(){var a;};
	fake.prototype=parentClazz.prototype;
	childClazz.prototype=new fake();
	childClazz.prototype.constructor=childClazz;
	Object.getPrototypeOf(childClazz.prototype).constructor=parentClazz;
};







/**
 * output debug messages to the window owned debugger
 * @method debug
 * @param {Object} error Error Object contained the debug stack 
 * @param {String} msg debug msg
 */
re4.fw.debug=function(error,msg)
{
	if(window.debug)
	{
		var stack=arguments[0].stack;

		//for ff only

		var stacks=stack.split("@file");
		var stackObj=new Object();
		for(var i=0;i<stacks.length;i++)
		{
			stackObj["stk"+i]=stacks[i];
		}

		arguments[0]=stackObj;
		window.debug(arguments);
	}

};



















































