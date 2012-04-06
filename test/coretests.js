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
      init: function(name, sound) {
        this.parent.init.call(this, name);
        this.sound = sound;
      },
      slither: function() {
        return this.name + " says " + this.sound;
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

      var myMammal;

      beforeEach(function() {
        myMammal = new Mammal("Job");
      });
      
      it("should be a constructor function", function() {
        expect(typeof Mammal === "function").toBeTruthy();
      });

      it("not using new should cause exception", function() {
        expect( function() { 
            var didntUseNew = Mammal("MyName"); 
          }).toThrow(
            { 
              name: "ClassError", 
              message: "Called constructor without using 'new'."
            });
      });
      
      it("should be an instance of Mammal", function() {
        expect(myMammal instanceof Mammal).toBeTruthy();
      });
      
      it("should be an instance of Base", function() {
        expect(myMammal instanceof Base).toBeTruthy();
      });
      
      it("should not be an instance of Snake", function() {
        expect(myMammal instanceof Snake).toBeFalsy();
      });
      
      it("should have the name set correctly", function() {
        expect(myMammal.name === "Job").toBeTruthy();
      });
      
      it("should not work if you give it the wrong number of arguments", function() {
        expect( function() { 
            var wrongargs = new Mammal(); 
          }).toThrow(
            { 
              name: "ClassError", 
              message: "Called constructor with incorrect number of arguments."
            });
        
      });
      
    });
    
    describe("Snake", function() {
      
      var myMammal;
      var mySnake;

      beforeEach(function() {
        myMammal = new Mammal("Job");
        mySnake = new Snake("Billybob", "sssSSSsss");
      });

      it("should be a constructor function", function() {
        expect(typeof Snake === "function").toBeTruthy();
      });

      it("not using new should cause exception", function() {
        expect( function() { 
            var didntUseNew = Snake("MyName"); 
          }).toThrow(
            { 
              name: "ClassError", 
              message: "Called constructor without using 'new'."
            });
      });
      
      it("should be an instance of Mammal", function() {
        expect(mySnake instanceof Mammal).toBeTruthy();
      });
      
      it("should be an instance of Base", function() {
        expect(mySnake instanceof Base).toBeTruthy();
      });
      
      it("should be an instance of Snake", function() {
        expect(mySnake instanceof Snake).toBeTruthy();
      });
      
      it("should have the name set correctly", function() {
        expect(mySnake.name === "Billybob").toBeTruthy();
      });

      it("should have the sound set correctly", function() {
        expect(mySnake.sound === "sssSSSsss").toBeTruthy();
      });
      
      it("should have a slither function", function() {
        expect(typeof mySnake.slither === "function").toBeTruthy();
      });

      it("should have a slither function on the constructor's prototype", function() {
        expect(typeof Snake.prototype.slither === "function").toBeTruthy();
      });

      it("should have a slither function on the prototype", function() {
        expect(typeof mySnake.__proto__.slither === "function").toBeTruthy();
      });
      
      it("the constructor prototype's slither function should be equal to the object's slither function", function() {
        expect(Snake.prototype.slither === mySnake.__proto__.slither).toBeTruthy();
      });
      
      it("the slither function should return the right value", function() {
        expect(mySnake.slither() === "Billybob says sssSSSsss").toBeTruthy();
      });
      
      it("should not work if you give it the wrong number of arguments", function() {
        expect( function() { 
            var wrongargs = new Snake("MyName"); 
          }).toThrow(
            { 
              name: "ClassError", 
              message: "Called constructor with incorrect number of arguments."
            });
        
      });
      
      
      
            
    });        
    
  }
  
);
