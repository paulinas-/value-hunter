# value-hunter

This JavaScript snippet is **intended** to be executed in a web browser's console. 

The **purpose** of the snippet is to traverse all globally defined JavaScript objects (properties of a "window" object) in a scope of a webpage and find (_wildcard_ or _exact_ search - configurable in the script) a specified string in one of the following (configurable in the script): 
- property values
- function names
- property names (except funtions)

The snippet **returns** a list of paths to object properties and their values matching the search in the following format:
```
----------------------------------------
PATH:
  window.ParentObject.ChildObject.PropertyName
VALUE:
  value that the property is storing
----------------------------------------
```
