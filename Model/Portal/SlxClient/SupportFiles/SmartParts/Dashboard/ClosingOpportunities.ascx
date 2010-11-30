<%@ Import Namespace="System.Globalization"%>
<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ClosingOpportunities.ascx.cs" Inherits="SmartParts_Dashboard_ClosingOpportunities" %>

<div class="portlet_description">
<asp:label ID="Label0" runat="Server" Text="<%$ resources:Description %>"></asp:label>
</div>

<script type="text/javascript" >
Ext.onReady(function(){
    var tplproc = new Ext.Template([ 
        '<div style="margin:3px 0px"><a href="Opportunity.aspx?entityid={OppId}">{Description}</a></div>',
        '<div style="margin:0px 10px">', '<%= GetLocalResourceObject("Est__Close") %>', ': {EstClose}</div>',
        '<div style="margin:0px 10px">', '<%= GetLocalResourceObject("Next_Step") %>', ': {nextstep}</div>',
        '<div style="margin:0px 10px"><span style="display:block;float:left;width:200px">', '<%= GetLocalResourceObject("Stage") %>', ': {stage}</span><span>', '<%= GetLocalResourceObject("Days_in_Stage") %>', ': {daysinstage}</span></div>',
        '<div style="margin:0px 10px"><span style="display:block;float:left;width:200px">', '<%= GetLocalResourceObject("Sales_Potential") %>', ': {potential}</span><span>', '<%= GetLocalResourceObject("Probability") %>', ': {probability}%</span></div>'
        ].join(""));
    tplproc.compile();
    var tplnoproc = new Ext.Template([ 
        '<div style="margin:3px 0px"><a href="Opportunity.aspx?entityid={OppId}">{Description}</a></div>',
        '<div style="margin:0px 10px">', '<%= GetLocalResourceObject("Est__Close") %>', ': {EstClose}</div>',
        '<div style="margin:0px 10px">', '<%= GetLocalResourceObject("Next_Activity") %>', ': <a href="javascript:editActivity(\'{nextactid}\');">{nextactname}</a></div>',
        '<div style="margin:0px 10px">', '<%= GetLocalResourceObject("Days_since_Last_Activity") %>', ': {days}</div>',
        '<div style="margin:0px 10px"><span style="display:block;float:left;width:200px">', '<%= GetLocalResourceObject("Sales_Potential") %>', ': {potential}</span><span>', '<%= GetLocalResourceObject("Probability") %>', ': {probability}%</span></div>'
        ].join(""));
    tplnoproc.compile();
    
    var data = ClosingOpportunities_data;
    for (var i=0; i<ClosingOpportunities_data.numberToDisplay; i++) {
        if (i < data.items.length) {
            if ((data.items[i].stage == null) || (data.items[i].stage.length == 0))
            {
                tplnoproc.append('ClosingOppsDiv', {
                    OppId: data.items[i].id,
                    Description: data.items[i].description,
                    EstClose: formattedDate(data.items[i].estClose),
                    potential: data.items[i].potential.toFixed(2),
                    probability: data.items[i].probability,
                    days: data.items[i].daysSinceLastActivity,
                    nextactid: data.items[i].nextActivityId,
                    nextactname: (data.items[i].nextActivityName.length == 0) ? "&lt;None&gt;" : data.items[i].nextActivityName
                });
            } else {
                tplproc.append('ClosingOppsDiv', {
                    OppId: data.items[i].id,
                    Description: data.items[i].description,
                    EstClose: formattedDate(data.items[i].estClose),
                    stage: data.items[i].stage,
                    nextstep: data.items[i].nextStep,
                    potential: data.items[i].potential.toFixed(2),
                    probability: data.items[i].probability,
                    daysinstage: data.items[i].daysInStage
                });
            }
        }
    }
    if (data.items.length == 0) {
        var noitems = new Ext.Template('<div>{NoItems}</div>');
        noitems.compile();
        noitems.append('ClosingOppsDiv', {
            NoItems: '<%= GetLocalResourceObject("NoItemsAvailable") %>'});
    }

    var footer = new Ext.Template(["<div style='margin:5px 0px'><a href='javascript:myOpenOppsClick()' >", 
        '<%= GetLocalResourceObject("View_all_my_open") %>', 
        "</a> ({numopen})</div>"].join(""));
    footer.compile();
    footer.append('ClosingOppsDiv', {
        numopen: ClosingOpportunities_data.openOppCount });
    
    refreshPortletData("ClosingOpportunities");

});

function formattedDate(d) {
    var renderer = Ext.util.Format.dateRenderer(ConvertToPhpDateTimeFormat('<%= CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern %>'));
    return renderer(d);
}


function myOpenOppsClick() {
    $.ajax({
        url: String.format("slxdata.ashx/slx/crm/-/groups?family=OPPORTUNITY&name=My%20Open%20Opps&responsetype=json"),
        type : "GET",
        dataType: 'json',
        success: function(data) {
            window.location = "Opportunity.aspx";
        },
        error: function(request, status, error) {
            window.location = "Opportunity.aspx";
        }
    });    
}
</script>
<asp:Literal ID="ClosingOppsData" runat="server" />
<div id="ClosingOppsDiv">
</div>