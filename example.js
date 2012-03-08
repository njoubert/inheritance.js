
//You can call extend to create a new constructor
var Mammal = Base.extend({
  //you hand it an object with properties you want on the prototype
  //of any objects created using this constructor
  init: function(name) {
    //init automatically gets called when you create an object
    this.name = name;
  }
});

//You can keep extending constructors all the way down
var Snake = Mammal.extend({
  init: function(name) {
    //you can call anything on the parent
    //by calling this.parent.<method>.apply(this,<args>)
    this.parent.init.apply(this, name);
  },
  slither: function() {
    return this.name + " says sssSSSSssss";
  }
});

//You can create new things like so:
mySnake = new Snake("Billybob");
console.log(mySnake.slither();)

//And instanceof works just fine:
if (mySnake instanceof Mammal) {
  console.log("instanceof works")
}