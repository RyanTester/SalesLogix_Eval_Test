<%@ Import Namespace="System.Globalization"%>
<%@ Control Language="C#" AutoEventWireup="true" CodeFile="CampaignResponses.ascx.cs" Inherits="SmartParts_Dashboard_CampaignResponses" %>

<div class="portlet_description">
<asp:label ID="Label0" runat="Server" Text="<%$ resources:Description %>"></asp:label>
</div>

<script type="text/javascript" >

    function CampaignResponses_refresh() {
        $("#CampaignResponsesDiv").html("");
        var numberToShow = 5;

        var tpl = new Ext.Template([
        '<table style="margin:3px 0px"><colgroup><col width="10px"></col><col width="200px"></col><col width="*"></col></colgroup>',
        '<tr><td colspan=3><a href=campaign.aspx?entityid={id}>{name}</a></td></tr>',
        '<tr><td>&nbsp;</td><td>', '<%= GetLocalResourceObject("StartDate") %>', ': {start}</td><td rowspan=5><img src="{imgurl}" /></td></tr>',
        '<tr><td>&nbsp;</td><td>', '<%= GetLocalResourceObject("EndDate") %>', ': {end}</td></tr>',
        '<tr><td>&nbsp;</td><td>', '<%= GetLocalResourceObject("Expected") %>', ': {expected}</td></tr>',
        '<tr><td>&nbsp;</td><td>', '<%= GetLocalResourceObject("Actual") %>', ': {actual}</td></tr>',
        '<tr><td>&nbsp;</td><td>', '<%= GetLocalResourceObject("Last_10_days") %>', ': {last10days}</td></tr>',
        '</table>'
        ].join(""));
        tpl.compile();

        $.ajax({
            url: "slxdata.ashx/slx/crm/-/namedqueries?format=json&name=campaignResponses",
            dataType: 'json',
            success: function(data) {
                //                var legend = new Ext.Template(["<div style='border: black 1px solid;width:97%;padding:3px 1px;'>",
                //                "<span style='white-space:nowrap;'><span style='margin:0px 7px;background-color:#102541'>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>", DashboardResource.Responses, "</span></span>",
                //                "<span style='white-space:nowrap;'><span style='margin:0px 7px;background-color:#A6A6A6'>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>", DashboardResource.Expected, "</span></span>",
                //                "<span style='white-space:nowrap;'><span style='margin:0px 7px;background-color:#F28226'>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>", DashboardResource.Last_10_days, "</span></span>",
                //                "</div>"].join(""));
                //                legend.compile();
                //                legend.append('CampaignResponsesDiv', {});
                for (var i = 0; i < data.items.length; i++) {
                    if (i < numberToShow) {
                        CampaignResponses_displayItem(data.items[i], tpl);
                    }
                }
            },
            error: function(request, status, error) {
                var noitems = new Ext.Template('<div>{NoItems}</div>');
                noitems.compile();
                noitems.append('CampaignResponsesDiv', {
                    NoItems: '<%= GetLocalResourceObject("NoItemsAvailable") %>'
                });
            }
        });
    }

    function CampaignResponses_displayItem(campaign, tpl) {
        campaign.expected = campaign.expectedcontact + campaign.expectedlead;
        $.ajax({
            url: String.format("slxdata.ashx/slx/crm/-/namedqueries?format=json&name=campaignTargetsQuery&where=t.Campaign.Id eq '{0}'", campaign.id),
            dataType: 'json',
            success: function(data) {
                var last10 = 0;
                var tenDaysAgo = new Date();
                tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
                for (var i = 0; i < data.count; i++) {
                    if (data.items[i].ResponseDate >= tenDaysAgo) {
                        last10 += 1;
                    }
                }
                var imgUrl = String.format("Libraries/SparkHandler.ashx?type=bullet&height=15&value={0}&target={1}&scale-max={2}&first-band={3}&second-band={4}&first-color=red&second-color=orange&third-color=yellow&target-color=green",
                        data.total_count, campaign.expected,
                        (data.total_count > campaign.expected) ? parseInt(data.total_count, 10) + 1 : parseInt(campaign.expected, 10) * 1.2,
                        Math.floor(campaign.expected / 2),
                        Math.floor(campaign.expected * .8));
                tpl.append('CampaignResponsesDiv', {
                    id: campaign.id,
                    name: campaign.name,
                    start: formattedDate(campaign.startdate),
                    end: formattedDate(campaign.enddate),
                    imgurl: imgUrl,
                    expected: campaign.expected,
                    actual: data.total_count,
                    last10days: last10
                });
            },
            error: function(request, status, error) {
            }
        });
    }
    function daydiff(d1, d2) {
        return Math.floor((d1 - d2) / 1000 / 60 / 60 / 24);
    }
    function formattedDate(d) {
        var renderer = Ext.util.Format.dateRenderer(ConvertToPhpDateTimeFormat('<%= CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern %>'));
        return renderer(d);
    }
</script>
<asp:Literal runat="server" ID="CampaignResponseData"></asp:Literal>
<div id="CampaignResponsesDiv">
</div>