using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using Sage.Integration.Adapter;
using Sage.Integration.Messaging.Model;

namespace Sage.SalesLogix.Client.App_Code
{
    [RequestPath(RootAdapter.Path)]
    [Description("Root adapter for the Web Site assembly.")]
    public class RootAdapter : Adapter
    {
        public const string Path = "slx/crm/-";
    }

}