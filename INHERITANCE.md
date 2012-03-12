# A Partial Review of Object Oriented Javascript 

This is a f\*\*\*\* mess, to say the least. There's a million ways to do this, each with their own strengths and weaknesses, none of them complete.

My best advice is to turn around now and run for the hills. Barring that, choose one library and just stick with it. If you can, go with Crockford's "The Good Parts" approach and forget about things like public vs private, constructors, Classes and all that jazz.


###A couple of things to understand:

1. Everything is an `[[Object]]`. An `[[Object]]` has two interesting hidden properties:

  - `[[Prototype]]` (in the ECMAScript spec) accessible using `.__proto__`. This is used by a process called "Delegation" where property lookup on an object can traverse up the `[[Prototype]]` chain to find the property in "parent" objects if it wasn't found in the local object. "Points to the object which was used as prototype when the object was instantiated".

  - `.constructor` points to a function that, when called, creates an object's prototype. Or, "the Object function that created an instance's prototype". This is here because all objects can be prototypes of functions, and then they need a constructor for when "new" is called on that function. 

  - That last sentence should scare the shit out of you, that's how convoluted it is.

2. A Function is a special type of `[[Object]]`. It has 3 hidden properties:

  - `[[Scope]]` which points to the execution context in which it was _defined_ (this is how a function's closure over variables are implemented)

  - `[[Code]]` which points to the actual javascript code of the function.

  - `.prototype` which points to an 

3. When you type `Object` in your code, you get a Function which is a constructor for Objects, NOT an "object"

4. **Identifier Lookup**: When you call something like `ident.prop`, the object `ident` is found by looking through the `[[Scope]]` chain. If you're in a function's Execution Context and `ident` is not found, javascript traverses up the `[[Scope]]` link and attempts to find it in that execution context.


5. Javascript has 4 different type of Invocations, each of them doing separate things:

    - **Method Invocation**: `ident.prop()` finds `ident` using scoping rules, finds `prop` using delegation rules in the `[[Prototype]]` chain, and invokes the found Function object with `this` bound to `ident`.

    - **Function Invocation**: `ident()` finds `ident` using scoping rules, and invokes the found Function object with `this` bound to the global object (usually `window`).

    - **Constructor Invocation**: `new ident()` gets real hairy. Creates a new object, sets the new object's `[[Prototype]]` to `ident.prototype`, and invokes the `ident` Function object with `this` bound to the newly created object. If this `ident` function does not return a function itself, then `this` is returned (aka, the newly created object is returned)

    - **Apply invocation**: `ident.apply(this, args)` lets you do whatever the fuck you feel like. It finds `ident` using scoping rules, then calls it with `this` bound to the first argument, and the arguments bound to `args`. 


###Big reasons why this is a mess:

1. The most basic reason is, Javascript has multiple, inconsistent ways to create objects:
    - Just use object literals.
    - Use constructor functions
	This was the biggest mistake in the language. Get rid of functions as constructors, stick with prototypal inheritance and everything gets nice.

2. function invocation always has `this` set to the global object, not the enclosing scope's `this`, so helper functions inside an object's functions must have a copy of `this` passed in or saved in the enclosing scope for it to work correctly. This is a _design flaw_ which fucks up your shit and makes you have `that` variables littered in your code.

3. Javascript provides `instanceof` which only works if you used a constructor function to create an object, not if you use `Object.create()` or object literals. That is, it does not just look at the [[Prototype]] of an object.

4. It has the same name for different things. An object has a `[[Prototype]]` link used for delegation, a function has that, AND a `.prototype` property used to set values on an object that will be the `[[Prototype]]` of an object if you call it using the `new` operator

5. The way to make this work is through a smart mix of using scope to hide variables and prototype chains (`[[Prototype]]`) to have hiding and inheritance. This is both really cool and extremely painfully non-obvious in the edge cases (try to make a function that can access "private" members, is visible to the outside, has the correct "this" pointer, and is not instantiated on every created object. Java/C++/Classical Inheritance languages works like this by default, in JavaScript that is not possible).

###What's out there that can help me at all?

JavaScript is too important to be ignored, so let's assume that if you got this far you're not just going to turn around and head back to the rosy world of well-designed languages. (No offense Brendan, but you fucked us over bad).

Well, you can settle on one of many libraries that can help you, which is probably the best approach - buy into someone else's framework and go with it.

## Inheritance

There's a couple of things that is usually expected in inheritance. You're not going to get all of these at the same time, but it's ideas for what you might want in your system.

My advice - rather have as little as possible and don't worry about fancy features, you don't need them.

- Constructors: a function that is called on object creation to initialize values

- Calling parent constructors: a child constructor calling a parent's constructor to initialize values

- Code (functions) are not instantiated for every object, only for the "template" of that object, so you save the time and space of not having duplicate functions hanging around

- Some degree of encapsulation, Private and Public variables.

- Static variables and functions - things on the "Class", which is the same for all objects.

- A way to call overridden methods on the parent

Here's what I want from inheritance:

- A way to keep code somewhere other than on the object itself, so I don't have duplicate functions floating about taking up space and time

- A typing system that gives me a way to distinguish different objects.

### 1. Prototypal:

Just use object.create() the way [http://javascript.crockford.com/prototypal.html](Crockford explains). There are no classes.

*PROS:*

- lightweight
- you just think about objects
- you never call "new"
- you can put functions and values right on the object
- you can get code reuse by putting things on an object, in the parent

*CONS:*

- no private variables
- instanceof now no longer does shit for you
- you have two ways of making objects (literals, and create())
- you don't have constructors thats called on create
- there is no way to call or know anything about the parent (except if you use the not recommended `.__proto__`. Although you can now use `.getPrototypeOf()` so if you're on ECMAScript3.1 or later that's fine)

How do we deal with these cons? There are some answers:

*Duck Typing*: Forget about using "instanceof", if it quacks like a duck, it's a duck. This, unfortunately, doesn't work if you're trying to write something like a visitor pattern that relies on the type of an object to identify it. You can fix that using a .type property with some value. That means doing string comparisons rather than using the built-in type system, which is about the most retarded thing I've ever heard suggested.

*Factory function*: Forget about constructors, just create a function that initializes the object. This is not unreasonable.

#### New in ECMAScript 3.1: Object.getPrototypeOf()

Apparently I'm not the only person annoyed by `instanceof` breaking when you use prototypal inheritance. You can now call `getPrototypeOf()` on any object, and get the prototype. You can now write an interative method that traverses the actual `[[Prototype]]` chain to check whether one object is an instance of another object. Still messy and ugly (given that it's not baked into the language) but a whole lot better than what we currently have.

*CODE:*

    Object.create = function(o) {
        var F = function() {};
        F.prototype = o;
        return new F();
    }

    var myMammal = {
        name : "Herb the Mammal",
        get_name : function() { return this.name; }
    }

    var myCat = Object.create(myMammal);
    myCat.name = "Henrietta"
    myCat.purr = function(n) {....}

### 2. Coffeescript-style classes

This is *almost* the same as Resig's Simple Inheritance. Here we create, very concretely, all the classes using the same approach. We're using the __extends method to create the prototype chain.
This does NOT save a pointer to the super-function of all functions (unlike the next class.extends()), it only saves a pointer to the superclass, so you can call the constructor on it.

*PROS:*

- You get something that looks like a class!
- instanceof works!
- constructors!
- you don't get code bloat, it all stays on the parent!

*CONS:*

- super ugly and tons of boilerplate
- repetitive
- no private variables
- can only call super for constructor, nothing else

*CODE:*

    var __hasProp = Object.prototype.hasOwnProperty
    var __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child;
    };

    Animal = (function() {

        function Animal(name) {
            this.name = name;
        }

        Animal.prototype.move = function(meters) {
            return alert(this.name + (" moved " + meters + "m."));
        };

        return Animal;

    })();

    Snake = (function(_super) {

        __extends(Snake, _super);

        function Snake() {
            Snake.__super__.constructor.apply(this, arguments);
        }

        Snake.prototype.move = function() {
            alert("Slithering...");
            return Snake.__super__.move.call(this, 5);
        };

        return Snake;

    })(Animal);

    sam = new Snake("Sammy the Python");
    sam.move();

### 3. Class.extends() like John Resig, Base.js, Prototype.js

There are many slight variations on this approach, but they all come down to the same thing. You call Class.create() or Class.extend() and pass it in an object that defines that class. You can then use some form of $super to access the superclass's equivalent method and call it. 

See: 

* [http://ejohn.org/blog/simple-javascript-inheritance/](http://ejohn.org/blog/simple-javascript-inheritance/)
* [http://dean.edwards.name/weblog/2006/03/base/](http://dean.edwards.name/weblog/2006/03/base/)
* [http://www.prototypejs.org/api/class/create](http://www.prototypejs.org/api/class/create)
* [http://code.google.com/p/inheritance/](http://code.google.com/p/inheritance/)

*PROS:*

- you get something that looks kinda a little bit like a class
- instanceof works!
- constructors!
- super() works for all functions, including constructor!
- Prototype's Class.create() and Base.js's Class.extend() will call "initialize" for you
- much prettier than Coffeescript's native implementation

*CONS:*

- still no privates
- now every method invocation has the overhead of dealing with "super"
- some of these does some WEIRD fucking shit with members (sticks all members on the prototype, etc.)

*USAGE CODE*:

    var Person = Class.extend({
      init: function(isDancing){
        this.dancing = isDancing;
      },
      dance: function(){
        return this.dancing;
      }
    });
    var Ninja = Person.extend({
      init: function(){
        this._super( false );
      },
      dance: function(){
        // Call the inherited version of dance()
        return this._super();
      },
      swingSword: function(){
        return true;
      }
    });

    var p = new Person(true);
    p.dance(); // => true

    var n = new Ninja();
    n.dance(); // => false
    n.swingSword(); // => true

    // Should all be true
    p instanceof Person && p instanceof Class &&
    n instanceof Ninja && n instanceof Person && n instanceof Class    

*LIBRARY CODE:*

    /* Simple JavaScript Inheritance
     * By John Resig http://ejohn.org/
     * MIT Licensed.
     */
    // Inspired by base2 and Prototype
    (function(){
      var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
      // The base Class implementation (does nothing)
      this.Class = function(){};

      // Create a new Class that inherits from this class
      Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
          // Check if we're overwriting an existing function
          prototype[name] = typeof prop[name] == "function" && 
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
              return function() {
                var tmp = this._super;

                // Add a new ._super() method that is the same method
                // but on the super-class
                this._super = _super[name];

                // The method only need to be bound temporarily, so we
                // remove it when we're done executing
                var ret = fn.apply(this, arguments);        
                this._super = tmp;

                return ret;
              };
            })(name, prop[name]) :
            prop[name];
        }

        // The dummy class constructor
        function Class() {
          // All construction is actually done in the init method
          if ( !initializing && this.init )
            this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
      };
    })();

### 4. Phrogz.net's approach

[http://phrogz.net/js/classes/OOPinJS.html](Gavin Kistner) gets almost everything you want, but then he trades it off by sticking some code on the objects themselves, and private variables can only be seen by private and protected functions.

PROS:

- Woah you get almost everything

CONS:

- Functions that can access private variables are duplicated on every object.
- It's verbose, uglier than previous
- You manage the inheritance yourself, like the coffeescript verion

CLASS IMPLEMENTATION:

    function Person(n,race){ 
      // CLASS-LEVEL VARIABLES
    	this.constructor.population++;

    	// PRIVATE VARIABLES AND FUNCTIONS 
    	// ONLY PRIVELEGED METHODS MAY VIEW/EDIT/INVOKE 
    	var alive=true, age=1;
    	var maxAge=70+Math.round(Math.random()*15)+Math.round(Math.random()*15);
    	function makeOlder(){ return alive = (++age <= maxAge) } 

    	var myName=n?n:"John Doe";
    	var weight=1;

    	// PRIVILEGED METHODS 
    	// MAY BE INVOKED PUBLICLY AND MAY ACCESS PRIVATE ITEMS 
    	// MAY NOT BE CHANGED; MAY BE REPLACED WITH PUBLIC FLAVORS 
    	this.toString=this.getName=function(){ return myName } 

    	this.eat=function(){ 
    		if (makeOlder()){ 
    			this.dirtFactor++;
    			return weight*=3;
    		} else alert(myName+" can't eat, he's dead!");
    	} 
    	this.exercise=function(){ 
    		if (makeOlder()){ 
    			this.dirtFactor++;
    			return weight/=2;
    		} else alert(myName+" can't exercise, he's dead!");
    	} 
    	this.weigh=function(){ return weight } 
    	this.getRace=function(){ return race } 
    	this.getAge=function(){ return age } 
    	this.muchTimePasses=function(){ age+=50; this.dirtFactor=10; } 


    	// PUBLIC PROPERTIES -- ANYONE MAY READ/WRITE 
    	this.clothing="nothing/naked";
    	this.dirtFactor=0;
    } 

    // PUBLIC METHODS -- ANYONE MAY READ/WRITE 
    Person.prototype.beCool = function(){ this.clothing="khakis and black shirt" } 
    Person.prototype.shower = function(){ this.dirtFactor=2 } 
    Person.prototype.showLegs = function(){ alert(this+" has "+this.legs+" legs") } 
    Person.prototype.amputate = function(){ this.legs-- } 

    // PROTOTYOPE PROERTIES -- ANYONE MAY READ/WRITE (but may be overridden) 
    Person.prototype.legs=2;

    // STATIC PROPERTIES -- ANYONE MAY READ/WRITE 
    Person.population = 0;

INHERITANCE IMPLEMENTATION:

    Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
    	if ( parentClassOrObject.constructor == Function ) { 
    		//Normal Inheritance 
    		this.prototype = new parentClassOrObject;
    		this.prototype.constructor = this;
    		this.prototype.parent = parentClassOrObject.prototype; //CREATES "superclass" LINK
    	} else { 
    		//Pure Virtual Inheritance 
    		this.prototype = parentClassOrObject;
    		this.prototype.constructor = this;
    		this.prototype.parent = parentClassOrObject;
    	} 
    	return this;
    } 

    // PURE VIRTUAL CLASS: Cannot be instantiated with "new"
    LivingThing = { 
    	beBorn : function(){ 
    		this.alive = true;
    	} 
    } 
    //NORMAL CLASS
    function Mammal(name){ 
    	this.name=name;
    	this.offspring=[];
    } 
    Mammal.inheritsFrom(LivingThing);
    Mammal.prototype.haveABaby=function(){ 
    	this.parent.beBorn.call(this);
    	var newBaby = new this.constructor( "Baby " + this.name );
    	this.offspring.push(newBaby);
    	return newBaby;
    } 
    //SUBCLASS
    function Cat( name ){ 
    	this.name=name;
    } 
    Cat.inheritsFrom(Mammal);
    Cat.prototype.haveABaby=function(){ 
    	var theKitten = this.parent.haveABaby.call(this);
    	alert("mew!");
    	return theKitten;
    } 
    Cat.prototype.toString=function(){ 
    	return '[Cat "'+this.name+'"]';
    } 
    //
    //
    var felix = new Cat( "Felix" );
    var kitten = felix.haveABaby( ); // mew! 
    alert( kitten );                 // [Cat "Baby Felix"] 

### 5. Google Closure Compiler

I haven't looked in detail at this one yet, but clearly it's a player:

[https://developers.google.com/closure/library/](https://developers.google.com/closure/library/)
