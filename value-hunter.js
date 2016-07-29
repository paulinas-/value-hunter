(function() {
    // before executing the script, make sure object "config" is set accordingly
    var config = {
        // string to search across property values of the globally defined objects
        searchString: "",
        // returns paths to object properties, which values contain specified string above
        returnPaths: true,
        // returns full object property values containing specified string above
        returnValues: false

    }
    var arrayOfPathsToObjectPropertyThatContainsSearchString = [];
    var arrayOfValuesThatContainsSearchString = [];
    var globalVarName;
    var stringifyGlobalVar = function stringifyGlobalVar(obj) {
        // array used to handle circular refs exceptions
        var alreadyStringifiedObjects = [];
        // array used to control object paths
        var tempKeyToObjectArray = [];
        var path = '';
        var pathKey = '';
        
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

            // path formation START
            if (typeof value == 'string' && value.indexOf(config.searchString) > -1) {
                path = globalVarName;
                arrayOfValuesThatContainsSearchString.push(value);

                for (var i = 0; i < tempKeyToObjectArray.length; i++) {
                    pathKey = tempKeyToObjectArray[i].key;

                    if (parseInt(pathKey) >= 0)
                        path = path.concat('[' + pathKey + ']');
                    else if (pathKey)
                       path = path.concat('.' + pathKey);
                }

                path = path.concat('.', key);

                if (arrayOfPathsToObjectPropertyThatContainsSearchString.indexOf(path) == -1)
                    arrayOfPathsToObjectPropertyThatContainsSearchString.push(path);
            }
            // path formation END

            return value;
        });
    }

    // needed to prevent DOMExceptions for webpages that uses iframes
    $('iframe').remove();

    for(var prop in window){
        globalVarName = prop;

        if (typeof window[prop] == 'object')
            stringifyGlobalVar(window[prop]);
    }

    if (config.returnPaths)
        console.log(arrayOfPathsToObjectPropertyThatContainsSearchString.join('\r\n*\r\n'));
    
    if (config.returnValues)
        console.log(arrayOfValuesThatContainsSearchString.join('\r\n*\r\n'));

})();
