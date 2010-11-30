/*
 * SagePlatform
 * Copyright(c) 2009, Sage Software.
 */


Sage.ClientEntityContextService=function(){this.emptyContext={"EntityId":"","EntityType":"","Description":"","EntityTableName":""};}
Sage.ClientEntityContextService.prototype.getContext=function(){var dataelem=$get("__EntityContext");if(dataelem){if(dataelem.value!=""){return eval(dataelem.value);}}
return this.emptyContext;}
Sage.Services.addService("ClientEntityContext",new Sage.ClientEntityContextService());