(function() {
    // before executing the script, make sure object "config" is set accordingly
    var config = {
        // 0 - values of the properties, that hold "string" or "number" type values only
        // 1 - names of the properties, that hold "function" type values only
        // 2 - names of the properties, that hold "string" or "number" type values only
        searchWhere: 0,
        // string to search (if you need to search for a number - add it inside quotes)
        // the search is case insensitive
        searchWhat: [],
        // 0 - wildcard search
        // 1 - exact word/phrase/number search
        searchHow: 0
    }
    var arrayOfPathsToObjectPropertyThatContainsSearchString = [];
    var arrayOfValuesThatContainsSearchString = [];
    var globalVarName;
    var isMatchingSearch;
    var output = '';
    var stringifyGlobalVar = function stringifyGlobalVar(obj) {
        // array used to handle circular refs exceptions
        var alreadyStringifiedObjects = [];
        // array used to control object paths
        var tempKeyToObjectArray = [];
        var path = '';
        var pathKey = '';
        
        // wrapping inside try/catch block due to various JS errors that are sometimes thrown
        try {
            JSON.stringify(obj, function(key, value) {

                // get back to object ancestor in order to maintain the correct path
                for (var i = 0; i < tempKeyToObjectArray.length; i++)
                    if (tempKeyToObjectArray[i].parentObject == this)
                        tempKeyToObjectArray.splice(i);

                if (typeof value == 'object' && value !== null) {
                    tempKeyToObjectArray.push({key: key, parentObject: this});

                    if (alreadyStringifiedObjects.indexOf(value) !== -1) {
                        // Circular reference found, discard key
                        return;
                    }
                    // Store already stringified value in the collection
                    alreadyStringifiedObjects.push(value);
                }

                config.searchWhat.forEach(function(e) {

                    isMatchingSearch = false;

                    var isNumberValue = typeof value == 'number';
                    var isStringValue = typeof value == 'string';
                    var isFunction = typeof value == 'function';
                    var isObject = typeof value == 'object';
                    
                    // make search case insensitive
                    var keyTemp = key.toLowerCase();
                    var valueTemp = value;

                    if (isStringValue)
                        valueTemp = value.toLowerCase();
                    else if (isNumberValue)
                        valueTemp = value.toString();

                    e = e.toLowerCase();

                    var isKeyMatch = keyTemp.indexOf(e) > -1;

                    if (config.searchHow)
                        isKeyMatch = keyTemp === e;

                    if (config.searchWhere == 1)
                        isMatchingSearch = isFunction && isKeyMatch;
                    else if (config.searchWhere == 2)
                        isMatchingSearch = (isStringValue || isNumberValue || isObject) && isKeyMatch;
                    // config.searchWhere == 0
                    else if (isNumberValue || isStringValue) {
                        var isValueMatch = config.searchHow ? valueTemp === e : valueTemp.indexOf(e) > -1;
                        
                        isMatchingSearch = isValueMatch;
                    }
                    
                    // path formation START
                    if (isMatchingSearch) {
                        path = globalVarName;

                        for (var i = 0; i < tempKeyToObjectArray.length; i++) {
                            pathKey = tempKeyToObjectArray[i].key;

                            if (pathKey && pathKey.match(/[^a-zA-Z0-9]/) === null)
                                path = path.concat('.' + pathKey);
                            else if (pathKey)
                                path = path.concat('["' + pathKey + '"]');
                        }

                        // avoid property name duplication (f.e. window.parent.child_1.child_2.child_2)
                        if (!isObject)
                            path = path.concat('.', key);

                        if (path.match(/^window\./) && arrayOfPathsToObjectPropertyThatContainsSearchString.indexOf(path) == -1) {
                            arrayOfPathsToObjectPropertyThatContainsSearchString.push(path);
                            arrayOfValuesThatContainsSearchString.push(value);
                        }
                    }
                    // path formation END
                });

                return value;
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    // needed to prevent DOMExceptions for webpages that uses iframes
    document.querySelectorAll('iframe').forEach(function(val){
        val.remove();
    });

    for(var prop in window){
        globalVarName = prop;

        if (typeof window[prop] == 'object')
            stringifyGlobalVar(window[prop]);
    }

    for (var i = 0; i < arrayOfPathsToObjectPropertyThatContainsSearchString.length; i++)
        output += 
            '\r\nPATH:\r\n  ' + arrayOfPathsToObjectPropertyThatContainsSearchString[i] + 
            '\r\nVALUE:\r\n  ' + arrayOfValuesThatContainsSearchString[i] + 
            '\r\n----------------------------------------';

    console.log(output);
})();
