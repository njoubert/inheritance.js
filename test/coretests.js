//We are defining a test module...
define(
  
  //Here we list the modules this test depends on.
  //We are testing the inheritance library...
  ['../inheritance', 'lib/jasmine-1.2.0.rc3/jasmine.js', 'lib/jasmine-1.2.0.rc3/jasmine-html.js'],
  
  //Here we code the actual Jasmine tests,
  //with the library passed in.
  function(Base) {

    describe("Base", function() {

      var Mammal = Base.extend({
        init: function(name) {
          this.name = name;
        }
      }, "Mammal"); 

      var Snake = Mammal.extend({
        init: function(name) {
          this.parent.init.call(this, name);
        },
        slither: function() {
          return this.name + " says sssSSSSssss";
        }
      });

      var myMammal;
      var mySnake;

      beforeEach(function() {
        myMammal = new Mammal("Job");
        mySnake = new Snake("Billybob");
      });

      it("should have snake instanceof mammal", function() {
        expect(mySnake instanceof Mammal).toBeTruthy();
      });

    });        
    
  }
  
);
