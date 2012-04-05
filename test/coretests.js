//We are defining a test module...
define(
  
  //Here we list the modules this test depends on.
  //We are testing the inheritance library...
  ['order!../inheritance', 'order!lib/jasmine-1.2.0.rc3/jasmine.js', 'order!lib/jasmine-1.2.0.rc3/jasmine-html.js'],
  
  //Here we code the actual Jasmine tests,
  //with the library passed in.
  function(Base) {
    
    window.Base = Base;


    //Test classes
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


    //Tests
    describe("Base", function() {
      
      it("should have extend function", function() {
        expect(typeof Base.extend === "function").toBeTruthy();
      });
      
      it("should take 2 arguments", function() {
        expect(Base.extend.length === 2).toBeTruthy();
      })

      it("should accept having just 1 argument", function() {
        expect( function() {Base.extend({})} ).not.toThrow(new Error("Illegal arguments"));
      })
      
    });
    
    describe("Mammal", function() {
      
      
    });
    
    describe("Snake", function() {
      
      var myMammal;
      var mySnake;

      beforeEach(function() {
        myMammal = new Mammal("Job");
        mySnake = new Snake("Billybob");
      });

      
    });        
    
  }
  
);
