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

## Dependencies

- require.js (optional)

## Issues with this approach

Unfortunately every pseudoclass in my system has "SubClass" as a constructor, 
thus something like FireBug or Chrome Developer Tools look a little ugly
when you're printing things out.

This is fixed by passing a string argument with the name you want, but that's not very DRY, so i'm not a huge fan.

## Fundamental reasons why I want something like this.

What makes this process difficult is: I want to distinguish between internal
library functionality and an external API. This is why thing like public-private
are useful. The Revealing Module pattern is a nice way of achieving this for
Modules, but for Classes there seems to be no equivalent.

The difference is: for Classes you do not want to duplicate code on every instance,
while for Modules this is not an issue, since you tend to only instantiate one copy
of each module,

I like my approach slightly more than prototype.js (Alex Arnell)'s implementation,
since I don't need a `super()` method everywhere.

## Understanding Javascript Inheritance

See `inheritance.md` for an overview of javascript inheritance.