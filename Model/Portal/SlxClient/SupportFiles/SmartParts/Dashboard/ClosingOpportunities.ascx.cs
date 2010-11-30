using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using NHibernate.Criterion;
using Sage.Common.Syndication.Json;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.NamedQueries;
using Sage.Platform.Repository;
using Sage.SalesLogix.Client.GroupBuilder;
using Sage.SalesLogix.Plugins;
using Sage.SalesLogix.Security;
using Sage.SalesLogix.Web.Controls;

public partial class SmartParts_Dashboard_ClosingOpportunities : System.Web.UI.UserControl
{
    public class OpportunityRepresentation
    {
        private string id;
        private string description;
        private DateTime estimatedClose;
        private double potential;
        private int probability;
        private string stage;
        private string nextStep;
        private string nextActivityId = "";
        private string nextActivityName = "";
        private int daysSinceLastActivity;
        private int daysInStage;

        [JsonProperty("id")]
        public string ID
        {
            get { return id; }
            set { id = value; }
        }

        [JsonProperty("description")]
        public string Description
        {
            get { return description; }
            set { description = value; }
        }

        [JsonProperty("estClose")]
        public DateTime EstimatedClose
        {
            get { return estimatedClose; }
            set { estimatedClose = value; }
        }

        [JsonProperty("potential")]
        public double Potential
        {
            get { return potential; }
            set { potential = value; }
        }

        [JsonProperty("probability")]
        public int Probability
        {
            get { return probability; }
            set { probability = value; }
        }

        [JsonProperty("stage")]
        public string Stage
        {
            get { return stage; }
            set { stage = value; }
        }

        [JsonProperty("nextStep")]
        public string NextStep
        {
            get { return nextStep; }
            set { nextStep = value; }
        }

        [JsonProperty("nextActivityId")]
        public string NextActivityId
        {
            get { return nextActivityId; }
            set { nextActivityId = value; }
        }
        [JsonProperty("nextActivityName")]
        public string NextActivityName
        {
            get { return nextActivityName; }
            set { nextActivityName = value; }
        }
        [JsonProperty("daysSinceLastActivity")]
        public int DaysSinceLastActivity
        {
            get { return daysSinceLastActivity; }
            set { daysSinceLastActivity = value; }
        }
        [JsonProperty("daysInStage")]
        public int DaysInStage
        {
            get { return daysInStage; }
            set { daysInStage = value; }
        }

        public static OpportunityRepresentation from(IOpportunity opp)
        {
            OpportunityRepresentation or = new OpportunityRepresentation();
            or.ID = opp.Id.ToString();
            or.Description = opp.Description;
            or.EstimatedClose = opp.EstimatedClose ?? DateTime.Now;
            or.Potential = opp.SalesPotential ?? 0;
            or.Probability = opp.CloseProbability ?? 0;
            or.Stage = opp.Stage;
            or.NextStep = opp.NextStep;
            or.DaysSinceLastActivity = opp.DaysSinceLastActivity;
            IActivity act = getNextActivity(opp.Id.ToString());
            if (act != null)
            {
                or.NextActivityId = act.Id.ToString();
                or.NextActivityName = String.Format("{0} &lt;{1}&gt;", (act.Description ?? ""), act.StartDate.ToShortDateString());
            }
            ISalesProcesses sp = Sage.SalesLogix.SalesProcess.Helpers.GetSalesProcess(opp.Id.ToString());
            if (sp != null)
            {
                IList<ISalesProcessAudit> list = sp.GetSalesProcessAudits();
                foreach (ISalesProcessAudit spa in list)
                {
                    if ((spa.ProcessType == "STAGE") && (spa.IsCurrent != null) && ((bool)spa.IsCurrent))
                    {
                        or.DaysInStage = sp.DaysInStage(spa.StageId);
                        //break;
                    }
                    if ((spa.ProcessType == "STEP") && (spa.IsCurrent != null) && ((bool)spa.IsCurrent))
                    {
                        or.NextStep = spa.StepName;
                    }
                }
            }
            return or;
        }
        public static IActivity getNextActivity(string oppid)
        {
            IRepository<IActivity> actRep = EntityFactory.GetRepository<IActivity>();
            IQueryable qryableAct = (IQueryable)actRep;
            IExpressionFactory expAct = qryableAct.GetExpressionFactory();
            Sage.Platform.Repository.ICriteria critAct = qryableAct.CreateCriteria();

            IList<IActivity> ActivityList = critAct.Add(
                expAct.Eq("OpportunityId", oppid))
                .AddOrder(expAct.Asc("StartDate"))
                .List<IActivity>();

            if ((ActivityList != null) && (ActivityList.Count > 0))
            {
                return ActivityList[0];
            }
            return null;
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        int numberToDisplay = 5;

        Sage.SalesLogix.Security.SLXUserService slxUserService = ApplicationContext.Current.Services.Get<Sage.Platform.Security.IUserService>() as Sage.SalesLogix.Security.SLXUserService;
        string currentUserId = slxUserService.GetUser().Id.ToString();
        IRepository<IOpportunity> oRep = EntityFactory.GetRepository<IOpportunity>();
        IExpressionFactory ep = ((IQueryable)oRep).GetExpressionFactory();
        ICriteria countCrit = GetOpenOppCrit(oRep, ep, currentUserId);
        countCrit.SetProjection(((IQueryable)oRep).GetProjectionsFactory().RowCount());
        int totalCount = Convert.ToInt32(countCrit.UniqueResult());

        ICriteria crit = GetOpenOppCrit(oRep, ep, currentUserId);
        crit.AddOrder(ep.Asc("EstimatedClose"));
        crit.SetMaxResults(numberToDisplay);
        IList<IOpportunity> opps = crit.List<IOpportunity>();
        numberToDisplay = (totalCount < numberToDisplay) ? totalCount : numberToDisplay;
        StringBuilder script = new StringBuilder("<script type='text/javascript'>var ClosingOpportunities_data = { items: [");
        for (int i = 0; i < numberToDisplay; i++)
        {
            IOpportunity opp = opps[i];
            script.Append(JavaScriptConvert.SerializeObject(OpportunityRepresentation.from(opp)));
            if (i != numberToDisplay - 1)
                script.AppendLine(",");
        }
        string groupId = GetPluginIdFromFamilyAndName("Opportunity", "My Open Opps");
        int groupCount = totalCount;
        script.AppendFormat("], openOppGroup: '{0}', openOppCount: {1}, numberToDisplay: {2}", groupId, groupCount, numberToDisplay);
        script.AppendLine("};</script>");
        ClosingOppsData.Text = script.ToString();

    }

    private ICriteria GetOpenOppCrit(IRepository<IOpportunity> oRep, IExpressionFactory ep, string currentUserId)
    {
        ICriteria countCrit = ((IQueryable)oRep).CreateCriteria();
        countCrit.Add(ep.Eq("Status", "Open"));
        countCrit.Add(ep.Eq("AccountManager.Id", currentUserId));
        return countCrit;
    }

    private string GetPluginIdFromFamilyAndName(string family, string name)
    {
        Plugin groupPlugin = Plugin.LoadByName(name, family, PluginType.Group);
        if (groupPlugin == null)
            groupPlugin = Plugin.LoadByName(name, family, PluginType.ACOGroup);
        if (groupPlugin != null)
            return groupPlugin.PluginId;
        return string.Empty;
    }

}
