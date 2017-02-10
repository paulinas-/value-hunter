# value-hunter

Value-hunter is simply a JavaScript snippet, which can be executed in browser's console.

Current value-hunter version is being executed synchronously (dang!).

The **purpose** of the snippet is to traverse all globally defined JavaScript objects (properties of a "window" object) in a scope of a webpage and find (_wildcard_ or _exact_ search - configurable in the script) a specified string in one of the following (configurable in the script): 
- property values (typeof "string" or "number")
- function names
- property names (typeof "string", "number" or "object")

The snippet **returns** a list of object paths and their corresponding values matching the search in the following format:
```
----------------------------------------
PATH:
  window.ParentObject.ChildObject.PropertyName
VALUE:
  value that the property is storing
----------------------------------------
```
