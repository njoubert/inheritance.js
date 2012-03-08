# INHERITANCE.JS

*A simple base class for your javascript needs.*

This class inheritance structure gives up private variables,
since you cannot return an object from your constructor and
have the hierarchy still work.

There is a tension between creating scopes to hold private variables,
 which necessitates that all the functions also be created in this scope
 to access these variables, and
having constructor functions to instantiate objects but having functions
 on the prototype of these constructor functions to avoid duplication.