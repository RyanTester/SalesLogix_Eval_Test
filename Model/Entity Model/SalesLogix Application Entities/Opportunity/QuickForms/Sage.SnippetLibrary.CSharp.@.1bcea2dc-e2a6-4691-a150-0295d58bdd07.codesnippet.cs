/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="1bcea2dc-e2a6-4691-a150-0295d58bdd07">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>lueAssociateCompetitor_OnChangeStep</name>
 <references>
  <reference>
   <assemblyName>Sage.Entity.Interfaces.dll</assemblyName>
   <hintPath>%BASEBUILDPATH%\interfaces\bin\Sage.Entity.Interfaces.dll</hintPath>
  </reference>
  <reference>
   <assemblyName>Sage.Form.Interfaces.dll</assemblyName>
   <hintPath>%BASEBUILDPATH%\formInterfaces\bin\Sage.Form.Interfaces.dll</hintPath>
  </reference>
  <reference>
   <assemblyName>Sage.Platform.dll</assemblyName>
   <hintPath>%BASEBUILDPATH%\assemblies\Sage.Platform.dll</hintPath>
  </reference>
 </references>
</snippetHeader>
*/


#region Usings
using System;
using Sage.Entity.Interfaces;
using Sage.Form.Interfaces;
#endregion Usings

namespace Sage.BusinessRules.CodeSnippets
{
    /// <summary>
    /// Event handlers for the OpportunityCompetitor dialog
    /// </summary>
    public static partial class OpportunityCompetitorsEventHandlers
    {
        /// <summary>
        /// Invokes the association lookup for competitors.
        /// </summary>
        /// <param name="form">the instance of the OpportunityCompetitor dialog</param>
        /// <param name="args">empty</param>
        public static void lueAssociateCompetitor_OnChangeStep(IOpportunityCompetitors form,  EventArgs args)
        {
            if (form.lueAssociateCompetitor.LookupResultValue != null)
            {
                Sage.Entity.Interfaces.IOpportunity parentEntity = form.CurrentEntity as Sage.Entity.Interfaces.IOpportunity;
                Sage.Entity.Interfaces.ICompetitor relatedEntity = form.lueAssociateCompetitor.LookupResultValue as Sage.Entity.Interfaces.ICompetitor;
                Sage.Platform.WebPortal.SmartParts.EntityBoundSmartPart smartpart = form.NativeForm as Sage.Platform.WebPortal.SmartParts.EntityBoundSmartPart;
                Sage.Platform.WebPortal.EntityPage page = (Sage.Platform.WebPortal.EntityPage)smartpart.Page;

                if ((parentEntity != null) && (relatedEntity != null))
                {
                    // check for duplicates
                    bool found = false;
                    foreach (Sage.Entity.Interfaces.IOpportunityCompetitor oc in parentEntity.Competitors)
                    {
                        if (oc.Competitor == relatedEntity)
                        {
                            found = true;
                            break;
                        }
                    }

                    if (found)
                    {
                        if (smartpart != null && smartpart.DialogService != null)
                        {
                            string msg = string.Format(form.GetResource("DuplicateCompetitorMsg").ToString(), relatedEntity.CompetitorName);
                            smartpart.DialogService.ShowMessage(msg, form.GetResource("DuplicateCompetitorMsgTitle").ToString());
                        }
                    }
                    else
                    {
                        Sage.Entity.Interfaces.IOpportunityCompetitor relationshipEntity = Sage.Platform.EntityFactory.Create<Sage.Entity.Interfaces.IOpportunityCompetitor>();
                        relationshipEntity.Opportunity = parentEntity;
                        relationshipEntity.Competitor = relatedEntity;
                        parentEntity.Competitors.Add(relationshipEntity);
                        if (page.ModeId.ToUpper() != "INSERT")
                        {
                            parentEntity.Save();
                        }

                        if (smartpart.DialogService != null)
                        {
                            smartpart.DialogService.SetSpecs(0, 0, 400, 600, "EditOpportunityCompetitor", string.Empty, true);
                            smartpart.DialogService.EntityType = typeof(Sage.Entity.Interfaces.IOpportunityCompetitor);
                            string id = string.Empty;

                            smartpart.DialogService.CompositeKeyNames = "OpportunityId,CompetitorId";
                            id = string.Format("{0},{1}", relationshipEntity.OpportunityId, relationshipEntity.CompetitorId);
                            if (Sage.Platform.WebPortal.PortalUtil.ObjectIsNewEntity(relationshipEntity))
                            {
                                id = relationshipEntity.InstanceId.ToString();
                                Sage.Platform.ChangeManagement.ChangeManagementEntityFactory.RegisterInstance(relationshipEntity, relationshipEntity.InstanceId);

                                if (relationshipEntity != null && relatedEntity != null)
                                    relationshipEntity.SetOppCompetitorDefaults(relatedEntity);

                            }
                            smartpart.DialogService.EntityID = id;
                            smartpart.DialogService.ShowDialog();
                        }
                    }
                }
                form.lueAssociateCompetitor.LookupResultValue = null; //34026
            }
        }
    }
}