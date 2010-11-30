function RestrictToNumeric(e){
    var code = e.charCode ? e.charCode : e.keyCode
    if (code != 8){                
        if (code<48 || code>57) 
            return false           
    }
}

function ForceDefaultValue(elem, defaultValue) {
    if (elem.value.length == 0) {
        elem.value = defaultValue;
    }
}