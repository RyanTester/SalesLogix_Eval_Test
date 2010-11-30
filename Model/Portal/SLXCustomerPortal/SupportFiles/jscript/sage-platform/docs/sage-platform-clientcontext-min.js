/*
 * SagePlatform
 * Copyright(c) 2009, Sage Software.
 */


Sage.ClientContextService=function(contextDataFieldId){this.contextDataFieldId=contextDataFieldId;_items=[];_watches=[];_toItemLiteral=function(key,value){var newItem={};newItem.itemKey=key;newItem.itemVal=value;return newItem;};_indexOf=function(key){for(i=0;i<_items.length;i++){if(_items[i].itemKey==key){return i;}}
return-1;};_throwKeyNotFound=function(key){throw"Entry Not Found: "+key;};_throwDuplicateKey=function(key){throw"Entry Already Exists: "+key;}
this.load();}
Sage.ClientContextService.prototype={add:function(key,value){if(_indexOf(key)===-1){var lit=_toItemLiteral(key,value);_items.push(lit);this.save();}
else
_throwDuplicateKey(key);},remove:function(key){var index=_indexOf(key);if(index!==-1){_items.splice(index,1);this.save();}},setValue:function(key,value){var index=_indexOf(key);if(index!==-1){_items[index].itemVal=value;this.save();}
else{_throwKeyNotFound(key);}},getValue:function(key){var index=_indexOf(key);if(index!==-1){return _items[index].itemVal;}
else{_throwKeyNotFound(key);}},clear:function(){_items=[];this.save();},containsKey:function(key){return(_indexOf(key)!==-1);},getCount:function(){return _items.length;},hasKeys:function(){return _items.length===0;},getKeys:function(){var keyRes=[];for(i=0;i<_items.length;i++){keyRes.push(_items[i].itemKey);}
return keyRes;},valueAt:function(index){if(_items[index]){return _items[index].itemVal;}
else{return null;}},keyAt:function(index){this.load();if(_items[index])
return _items[index].itemKey;else
return null;},getValues:function(){var valRes=[];for(i=0;i<_items.length;i++){valRes.push(_items[i].itemVal);}
return valRes;},save:function(hours){var data=document.getElementById(this.contextDataFieldId);if(data){data.value=this.toString();}
else{alert("can't find context data field");}},load:function(){var data=document.getElementById(this.contextDataFieldId);if(data){if(data.value){this.fromString(data.value);}}
else{alert("can't find context data field");}},toString:function(){var str="";for(i=0;i<_items.length;i++){str+=_items[i].itemKey+"="+escape(_items[i].itemVal);if(i!==_items.length-1)
str+="&";}
return str;},fromString:function(qString){_items=[];if(qString!=""){var items=qString.split("&");for(i=0;i<items.length;i++){var pair=items[i].split("=");_items.push(_toItemLiteral(pair[0],unescape(pair[1])));}}
this.save();}}