(function() {
    // before executing the script, make sure object "config" is set accordingly
    var config = {
        // 0 - property string/number values
        // 1 - function names
        // 2 - property names (except funtions)
        searchWhere: 2,
        // string to search
        searchWhat: ['avail','count','quant','qty','inven','stock'],
    }
    var arrayOfPathsToObjectPropertyThatContainsSearchString = [];
    var arrayOfValuesThatContainsSearchString = [];
    var globalVarName;
    var searchCriteria;
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

                    if (config.searchWhere == 1)
                        searchCriteria = typeof value == 'function' && key.toLowerCase().indexOf(e) > -1;
                    else if (config.searchWhere == 2)
                        searchCriteria = typeof value != 'function' && key.toLowerCase().indexOf(e) > -1;
                    // config.searchWhere == 0
                    else
                        searchCriteria = 
                            (typeof value == 'string' && value.toLowerCase().indexOf(e) > -1) ||
                            (typeof value == 'number' && value.toString().indexOf(e) > -1);
                    
                    // path formation START
                    if (searchCriteria) {
                        path = globalVarName;

                        for (var i = 0; i < tempKeyToObjectArray.length; i++) {
                            pathKey = tempKeyToObjectArray[i].key;

                            if (parseInt(pathKey) >= 0)
                                path = path.concat('[' + pathKey + ']');
                            else if (pathKey)
                               path = path.concat('.' + pathKey);
                        }

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
