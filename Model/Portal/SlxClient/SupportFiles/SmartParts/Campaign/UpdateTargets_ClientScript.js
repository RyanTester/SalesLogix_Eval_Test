Sage.SalesLogix.CampaignUpdateTarget = function(clientId)
{
    this.ClientId = clientId;
    this.Targets = new Object();
}
       
Sage.SalesLogix.CampaignUpdateTarget.prototype.Select = function (sender, targetId)
{
    this.Targets[targetId]= sender.checked
    this.SaveState(this.Targets);
}

Sage.SalesLogix.CampaignUpdateTarget.prototype.OptionChange = function()
{
    var value = document.getElementById(this.ClientId + "_ddlOptions").value;
    this.SetOption(value);
}

Sage.SalesLogix.CampaignUpdateTarget.prototype.SetOption = function(option)
{
    this.ShowControl(this.ClientId + "_opt0", false)
    this.ShowControl(this.ClientId + "_opt1", false)
    this.ShowControl(this.ClientId + "_opt2", false)
    this.ShowControl(this.ClientId + "_opt3", false)
                 
    switch(option)
    {
        case "0": //Status
           this.ShowControl(this.ClientId + "_opt0", true)
           break;
        case "1": //Stage
           this.ShowControl(this.ClientId + "_opt1", true)
           break;
        case "2": //Init
           this.ShowControl(this.ClientId + "_opt2", true)
           break;
        case "3": //Add Response
           this.ShowControl(this.ClientId + "_opt3", true)
           break;    
        default:
            break;
     }
}

Sage.SalesLogix.CampaignUpdateTarget.prototype.ShowControl = function(ctrlId, show)
{
   var ctrl = document.getElementById(ctrlId);
   if(ctrl != null)
   {
      if(show)
      {
         ctrl.style.display = 'block';
      }
      else
      {
         ctrl.style.display = 'none';
      }
   }
}

Sage.SalesLogix.CampaignUpdateTarget.prototype.InvokeClickEvent = function(control)
{
   if (document.createEvent)
   {
       // FireFox
       var e = document.createEvent("MouseEvents");
       e.initEvent("click", true, true);
       control.dispatchEvent(e);
    }
    else
    {
       // IE
       control.click();
    }  
 }

 Sage.SalesLogix.CampaignUpdateTarget.prototype.SaveState = function(targets)
 {
     var context = '<Targets>';
     for(var Id in targets) 
     {
        context = context + "<Target Id='" + Id + "' Selected='" + targets[Id] + "'/>" ; 
     }
     context = context + '</Targets>';
     
     document.getElementById(this.ClientId + "_txtSelectedTargets").value = context;
 }
    
if (typeof (Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();