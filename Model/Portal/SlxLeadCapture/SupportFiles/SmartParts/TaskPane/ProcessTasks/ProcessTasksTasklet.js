var TitleNodeTemplate = new Ext.XTemplate('<div class="workflow-title">{Description}</div>');
var ListStartTag = '<ul class="workflow-list">';
var ListEndTag = '</ul>';
var ListItemStartTag = '<li class="workflow-node"><div class="workflow-node-el">';
var ListItemEndTag = '</div></li>';
var IndentMarkup = '<span class="workflow-node-indent"><img src="Libraries/Ext/resources/images/default/s.gif" /></span>';
var ExpanderMarkup = '<span class="workflow-node-indent workflow-list-expander workflow-list-expanded"><img src="Libraries/Ext/resources/images/default/s.gif" /></span>';
var LeafTemplate = new Ext.XTemplate('<tpl if="Status == \'NotCompleted\'">',
    '<span class="workflow-leaf-action" title="{[ProcessTaskletStrings.ClickToComplete]}" onclick="completeTask(\'{[currentWorkflowID]}\',\'{MessageUri}\', \'Completed\')">',
    '<img src="ImageResource.axd?scope=global&type=Global_Images&key=gear_check" />',
    '</span>',
    '<span class="workflow-leaf-action" title="{[ProcessTaskletStrings.ClickToCancel]}" onclick="completeTask(\'{[currentWorkflowID]}\',\'{MessageUri}\', \'Cancelled\')">',
    '<img src="ImageResource.axd?scope=global&type=Global_Images&key=gear_cancel" />',
    '</span></tpl>',
    '<tpl if="Status == \'Completed\'">',
    '<span><img src="ImageResource.axd?scope=global&type=Global_Images&key=check" /></span>',    
    '</tpl>',
    '<tpl if="Status == \'Cancelled\'">',
    '<span><img src="ImageResource.axd?scope=global&type=Global_Images&key=cancel" /></span>',    
    '</tpl>',
    '<span class="workflow-leaf-text">{Description}</span>');



//    '<tpl if="Status == \'Completed\'">',
//    '<span><input type="checkbox" disabled="disabled" name="{Name}_chk" checked="checked" /></span>',    
//    '</tpl>',
    
var StartProcessTemplate = new Ext.XTemplate('<div class="workflow-title"><a href="javascript:runProcess(\'{Name}\')" title="{[ProcessTaskletStrings.ClickToStartWorkflow]}" alt="{[ProcessTaskletStrings.ClickToStartWorkflow]}" >{FriendlyName}</a></div>');

$(document).ready(initTasklet);

var intervalToken;
var interval;

function initTasklet(){
    interval = 10000;
    getPendingTasks();
    //startTimer();
    
    var svc = Sage.Services.getService("GroupManagerService");  
    if (svc) {
	svc.addListener(Sage.GroupManagerService.CURRENT_GROUP_POSITION_CHANGED, function(sender, evt) {
	    getPendingTasks();
	}); 
    }
    
}

function tryGetUrl(){
    if(Sage.Services.hasService("ClientContextService")){
        var context = Sage.Services.getService("ClientContextService");
        if(context != null){
            if(context.containsKey("ProcessHost")){
                return context.getValue("ProcessHost");
            }
        }
    }
    return null;
}

function startTimer(){
    intervalToken = setInterval("elapseTimer()", interval);
}

function elapseTimer(){
    getPendingTasks();
}

function getPendingTasks(){
    var baseUrl = tryGetUrl();
    if(baseUrl != null){
        var eid = getCurrentEntityID()
        if (eid != "") {
            var url = "proxyrequest.ashx?target=" + escape(baseUrl + "/ProcessManager/crm/-/goal/instances(" + eid + ")");
            $.ajax({
                url: url,
                type: "GET",
                success: function(data) {
                    var wkfls = eval(data);
                    if (wkfls.length > 0) {
                        drawWorkflows(wkfls);
                    } else {
                        getAvailableProcesses();
                    }
                },
                error: function(reqObj) {
                    if (reqObj.status == "404") {
                        $("#pendingTaskResult").text(ProcessTaskletStrings.ProcessHostNotFound);
                    } else {
                        $("#pendingTaskResult").text(reqObj.responseText);
                    }
                    if (intervalToken) { clearInterval(intervalToken); }
                }
            });
        } else {
            $("#pendingTaskResult").text("");
            if (intervalToken) { clearInterval(intervalToken); }	        
        }
    } else {
    	$("#pendingTaskResult").text(ProcessTaskletStrings.ProcessHostNotFound);
        if (intervalToken) { clearInterval(intervalToken); }
    }
};

function completeTask(procId, goalId, message){
    var baseUrl = tryGetUrl();
    if(baseUrl != null){
        $.ajax({
            url: "proxyrequest.ashx?target=" + escape(baseUrl + "/ProcessManager/crm/-/RunningProcesses(" + procId + ")/Messages(" + goalId + ")"),
            type : "POST",
            data : message,
            success: function() {
                getPendingTasks();
            },
            error: handleProcessAjaxError
        });
    }
};

function getCurrentEntityType() {

    var entSvc = Sage.Services.getService("ClientEntityContext");
	if (entSvc) {
	    var curContext = entSvc.getContext();
	    return curContext.EntityType;
	}
}

function getCurrentEntityID() {
    var entSvc = Sage.Services.getService("ClientEntityContext");
	if (entSvc) {
	    var curContext = entSvc.getContext();
	    return curContext.EntityId;
    }    
}

function getAvailableProcesses() {
    var baseUrl = tryGetUrl();
    if (baseUrl != null) {
        var etype = getCurrentEntityType();
        if (etype.indexOf(".") > 0) {
            etype = etype.substring(etype.lastIndexOf(".") + 1);
        }
        var url = "proxyrequest.ashx?target=" + escape(baseUrl + "/ProcessManager/crm/-/goal/types?entityType=" + etype);

        $.ajax({
            url: url,
            type : "GET",
            success : function(data) {
                drawStartLink(data);
            },
            error: handleProcessAjaxError    
        });
    }
}


function handleProcessAjaxError(reqObj) {
    alert(reqObj.responseText);
    //alert(reqObj.status + " " + reqObj.statusText + "\r\n" + reqObj.responseText);
}

function runProcess(procName) {
    var baseUrl = tryGetUrl();
    if (baseUrl != null) {
        var url = "proxyrequest.ashx?target=" + escape(baseUrl + "/ProcessManager/crm/-/RunningProcesses?name=" + procName)
	    var data;
        var eid = getCurrentEntityID();
        if (eid != "") {
            var data = { EntityId : eid }
            $.ajax({
                url : url,
                type : "POST",
                data : data,
                success : function() {
                    getPendingTasks();
                },
                error : handleProcessAjaxError	    
            }); 
        }      
    }
}

function drawStartLink(availableProcesses) {
    var processes = eval(availableProcesses);
    var markup = "";

    if (processes.length > 0) {
        for (var i = 0; i < processes.length; i++) {
            markup += StartProcessTemplate.apply(processes[i]);
        }
        $("#pendingTaskResult").html(markup);
    }
    else {
        $("#pendingTaskResult").text(ProcessTaskletStrings.NoProcessesFound);
    }
}

function drawWorkflows(workflowdata) {
    if (typeof(workflowdata) == "string") {
        workflowdata = eval(workflowdata);
    }
    var markup = "";
    for (var wrkflw = 0; wrkflw < workflowdata.length; wrkflw++) {
        var workflow = workflowdata[wrkflw];
        markup += drawWorkFlow(workflow);
    }
    
    $("#pendingTaskResult").html(markup);

    $("#pendingTaskResult .workflow-list-expander").bind("click", function(e) {
        $(this).toggleClass("workflow-list-expanded");
        var disp = ($(this).hasClass("workflow-list-expanded")) ? "block" : "none";
        var pnt = $(this).parents(".workflow-node-el")[0];
        if (pnt) {
            var childList = $(pnt).children(".workflow-list")[0];
            if (childList) {
                $(childList).css("display", disp);
            }
        }
    });
}


var currentWorkflowID = '';
function drawWorkFlow(workflow) {
    if (workflow.ActivityType == 'Workflow') {
        currentWorkflowID = workflow.WorkflowInstanceId;
        //draw workflow title
        var markup = TitleNodeTemplate.apply(workflow);
        //start the outer list
        markup += ListStartTag;
        //render the insides
        for (var wact = 0; wact < workflow.Activities.length; wact++) {
            markup += drawBranch(workflow.Activities[wact], 0);
        }        
        //end the outer list
        markup += ListEndTag;
        return markup;
    }
    return '';
}

function drawBranch(activity, indentLevel) {
    //<li><div>
    var branchmarkup = ListItemStartTag;
    //indent
    for (var i = 0; i < indentLevel; i++) {
        branchmarkup += IndentMarkup;
    }
    //draw expander button
    branchmarkup += ExpanderMarkup;
    //draw the activity title
    branchmarkup += '<span>' + activity.Description + '</span>';
    //start new list...
    branchmarkup += ListStartTag;
    for (var bact = 0; bact < activity.Activities.length; bact++) {
        var act = activity.Activities[bact];
        if ((act.ActivityType == "Scope") || (act.ActivityType == "Stage")) {
            branchmarkup += drawBranch(act, indentLevel + 1);
        } else if (act.ActivityType == "Step") { 
            branchmarkup += drawLeaf(act, indentLevel + 1);
        }
    }  
    //end the list
    branchmarkup += ListEndTag;
    //</li></div>
    branchmarkup += ListItemEndTag;
    return branchmarkup;
}

function drawLeaf(activity, indentLevel) {
    //<li></div>
    var leafmarkup = ListItemStartTag
    //indent
    for (var i = 0; i < indentLevel; i++) {
        leafmarkup += IndentMarkup;
    }
    //draw the leaf node with appropriate action buttons  
    leafmarkup += LeafTemplate.apply(activity);
    //</li></div>
    leafmarkup += ListItemEndTag;
    return leafmarkup;
}


// Example workflow JSON:
//no scope:
//var workflowdata = [{"WorkflowInstanceId":"99750b46-9f90-4caf-9aa9-59c2032cd64b","Name":"TestAccountWorkflow","Description":"Technology - Large Business (eg)","ActivityType":"Workflow","Status":"NotCompleted","Activities":[{"Name":"ProspectStage","Description":"Prospect","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"Research","Description":"Research","ActivityType":"Step","Status":"Completed","Activities":[]},{"Name":"InitialCall","Description":"Initial Call","ActivityType":"Step","Status":"Completed","Activities":[]}]},{"Name":"Qualification","Description":"Qualification","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"SetInitialMeeting","Description":"Set Initial Meeting","ActivityType":"Step","Status":"Completed","Activities":[]},{"Name":"InitialMeeting_Qualification","Description":"Initial Meeting - Qualification","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"ThankYouEmail","Description":"Thank you Email","ActivityType":"Step","Status":"NotCompleted","Activities":[]}]},{"Name":"NeedsAnalysis","Description":"Needs Analysis","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"InfrastructureDiscoveryMeeting","Description":"Infrastructure Discovery Meeting","ActivityType":"Step","Status":"Cancelled","Activities":[]},{"Name":"DevelopAccountStrategy","Description":"Develop Account Strategy","ActivityType":"Step","Status":"Cancelled","Activities":[]},{"Name":"SetUpMeetingForProductDemo","Description":"Set up Meeting for Product Demo","ActivityType":"Step","Status":"NotCompleted","Activities":[]}]},{"Name":"Demonstration","Description":"Demonstration","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"DemoPreparation","Description":"Demo Preparation","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"ProductDemonstration","Description":"Product Demonstration","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"DemoThankYouEmail","Description":"Demo Thank you Email","ActivityType":"Step","Status":"NotCompleted","Activities":[]}]},{"Name":"Negotiation","Description":"Negotiation","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"DevelopProposal","Description":"Develop Proposal","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"ProposalGeneration","Description":"Proposal Generation","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"ProposalDelivery","Description":"Proposal Delivery","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"ProposalRevision","Description":"Proposal Revision","ActivityType":"Step","Status":"NotCompleted","Activities":[]}]},{"Name":"Decision","Description":"Decision","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"GetSignOffOnProposal","Description":"Get Sign-Off On Proposal","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"PlanImplementation","Description":"Plan Implementation","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"OrderThankYouLetter","Description":"Order Thank you Letter","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"_14DayFollowUp","Description":"14 Day Follow Up","ActivityType":"Step","Status":"NotCompleted","Activities":[]}]}]}];

//with scope:
//var workflowdata = [{"WorkflowInstanceId":"99750b46-9f90-4caf-9aa9-59c2032cd64b","Name":"TestAccountWorkflow","Description":"Technology - Large Business (eg)","ActivityType":"Workflow","Status":"NotCompleted","Activities":[{"Name":"MyScope","Description":"My Scope","ActivityType":"Scope","Status":"NotCompleted","Activities":[{"Name":"ProspectStage","Description":"Prospect","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"Research","Description":"Research","ActivityType":"Step","Status":"Completed","Activities":[]},{"Name":"InitialCall","Description":"Initial Call","ActivityType":"Step","Status":"Completed","Activities":[]}]},{"Name":"Qualification","Description":"Qualification","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"SetInitialMeeting","Description":"Set Initial Meeting","ActivityType":"Step","Status":"Completed","Activities":[]},{"Name":"InitialMeeting_Qualification","Description":"Initial Meeting - Qualification","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"ThankYouEmail","Description":"Thank you Email","ActivityType":"Step","Status":"NotCompleted","Activities":[]}]},{"Name":"NeedsAnalysis","Description":"Needs Analysis","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"InfrastructureDiscoveryMeeting","Description":"Infrastructure Discovery Meeting","ActivityType":"Step","Status":"Cancelled","Activities":[]},{"Name":"DevelopAccountStrategy","Description":"Develop Account Strategy","ActivityType":"Step","Status":"Cancelled","Activities":[]},{"Name":"SetUpMeetingForProductDemo","Description":"Set up Meeting for Product Demo","ActivityType":"Step","Status":"NotCompleted","Activities":[]}]},{"Name":"Demonstration","Description":"Demonstration","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"DemoPreparation","Description":"Demo Preparation","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"ProductDemonstration","Description":"Product Demonstration","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"DemoThankYouEmail","Description":"Demo Thank you Email","ActivityType":"Step","Status":"NotCompleted","Activities":[]}]},{"Name":"Negotiation","Description":"Negotiation","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"DevelopProposal","Description":"Develop Proposal","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"ProposalGeneration","Description":"Proposal Generation","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"ProposalDelivery","Description":"Proposal Delivery","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"ProposalRevision","Description":"Proposal Revision","ActivityType":"Step","Status":"NotCompleted","Activities":[]}]},{"Name":"Decision","Description":"Decision","ActivityType":"Stage","Status":"NotCompleted","Activities":[{"Name":"GetSignOffOnProposal","Description":"Get Sign-Off On Proposal","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"PlanImplementation","Description":"Plan Implementation","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"OrderThankYouLetter","Description":"Order Thank you Letter","ActivityType":"Step","Status":"NotCompleted","Activities":[]},{"Name":"_14DayFollowUp","Description":"14 Day Follow Up","ActivityType":"Step","Status":"NotCompleted","Activities":[]}]}]}]}];