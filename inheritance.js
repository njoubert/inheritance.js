/*
  INHERITANCE.JS
  A simple base class for your javascript needs.
  
     Copyright Niels Joubert, njoubert.com, njoubert@gmail.com

     This program is free software: you can redistribute it and/or modify
     it under the terms of the GNU General Public License as published by
     the Free Software Foundation, either version 3 of the License, or
     (at your option) any later version.

     This program is distributed in the hope that it will be useful,
     but WITHOUT ANY WARRANTY; without even the implied warranty of
     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     GNU General Public License for more details.

     You should have received a copy of the GNU General Public License
     along with this program.  If not, see <http://www.gnu.org/licenses/>

*/

 /*
 * This class inheritance structure gives up private variables,
 * since you cannot return an object from your constructor and
 * have the hierarchy still work.
 *
 * There is a tension between creating scopes to hold private variables,
 *  which necessitates that all the functions also be created in this scope
 *  to access these variables, and
 * having constructor functions to instantiate objects but having functions
 *  on the prototype of these constructor functions to avoid duplication.
 */

//graceful degredation if require.js is not available.
//in that case, we just define window.Base
if (define === undefined || define === null) {
  define = function(obj) {
    (function(global) {
      if (global.Base) {
        throw new Error("inheritance.js: Base has already been defined.")
      } else {
        global.Base = obj;
      }      
    })(window);
  }
}

//Inheritance.js
define(function () {

  var Base = function(){};
  Base.extend = function(prop, className) {
    initializing = true;
    var prototype = new this();
    initializing = false;

    for (var name in prop) {
      if (prop.hasOwnProperty(name)) {
        prototype[name] = prop[name];
      }
    }


    if (className !== undefined) {

      eval("function " + className + "() { \
        if (!(this instanceof arguments.callee)) { \
          return new arguments.callee(); \
        } \
        if (!initializing && prototype.init) { \
          prototype.init.apply(this,arguments); \
        } \
      };"
      + className + ".prototype = prototype;"
      + className + ".prototype.constructor = SubClass;"
      + className + ".prototype.parent = this.prototype;"
      + className + ".extend = arguments.callee;");
      return eval(className);

    } else {

      function SubClass() {
        //Inspired by John Resig's Secrets of the Javascript Ninja.
        if (!(this instanceof arguments.callee)) {
          return new arguments.callee();
        }
        if (!initializing && prototype.init) {
            prototype.init.apply(this,arguments)
        }
      }
      SubClass.prototype = prototype;
      SubClass.prototype.constructor = SubClass;
      SubClass.prototype.parent = this.prototype;
      SubClass.extend = arguments.callee
      return SubClass;

    }
  }  
  
  return Base;
  
})
