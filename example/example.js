require(["../inheritance"], function(Base) {
  
/*
 * You can call extend to create a new constructor
 */

  var Mammal = Base.extend({
    //you hand it an object with properties you want on the prototype
    //of any objects created using this constructor
    init: function(name) {
      //init automatically gets called when you create an object
      this.name = name;
    }
  }, "Mammal"); 
  //You can (optionally) pass in the name of the class.
  //This will create the constructor function of the correct name,
  //for prettyprinting when you use a debugger.


/*
 * You can keep extending constructors all the way down
 */

  var Snake = Mammal.extend({
    init: function(name) {
      //you can call anything on the parent
      //by calling this.parent.<method>.call(this,<args>)
      this.parent.init.call(this, name);
    },
    slither: function() {
      return this.name + " says sssSSSSssss";
    }
  });

/* 
 * You can create new things like so:
 */

  mySnake = new Snake("Billybob");
  console.log(mySnake.slither());

/* 
 * And instanceof works just fine:
 */

  if (mySnake instanceof Mammal) {
    console.log("instanceof works")
  }
  
});