using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using Sage.Common.Syndication;
using Sage.Common.Syndication.Json;
using Sage.Entity.Interfaces;
using Sage.Integration.Messaging.Model;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Repository;

namespace Sage.SalesLogix.Client.App_Code
{
    [RequestPath(ProductPath)]
    public class AddOpportunityProductRequest
    {
        public const string ProductPath = "products";
        private Dictionary<string, string> parameters;


        //public class ProductRepresentationForJson
        //{
        //    private readonly ProductTreeNode _data;

        //    public ProductRepresentationForJson(ProductTreeNode data) //:this()
        //    {
        //        _data = data;
        //    }

        //    public ProductRepresentationForJson()
        //    {
        //        Meta = new Dictionary<string, object>();
        //        Meta["totalProperty"] = "total_count";
        //        Meta["root"] = "items";
        //    }
        //    [JsonProperty("metaData")]
        //    public Dictionary<string, object> Meta { get; set; }

        //    [JsonProperty("total_count")]
        //    public int TotalCount { get; set; }

        //    [JsonProperty("items")]
        //    public ProductTreeNode Data
        //    {
        //        get { return new ProductTreeNode(_data); }
        //    }

        //}




        /// <summary>
        /// 
        /// </summary>
        public class ProductTreeNode
        {
            private List<ProductTreeNode> _children = new List<ProductTreeNode>();
            private bool _checked;

            /// <summary>
            /// Gets or sets the ID.
            /// </summary>
            /// <value>The ID.</value>
            [JsonProperty("id")]
            public string ID { get; set; }

            /// <summary>
            /// Gets or sets the text.
            /// </summary>
            /// <value>The text.</value>
            [JsonProperty("text")]
            public string Text { get; set; }

            /// <summary>
            /// Gets or sets a value indicating whether this <see cref="ProductTreeNode"/> is checked.
            /// </summary>
            /// <value><c>true</c> if checked; otherwise, <c>false</c>.</value>
            [JsonProperty("checked")]
            public bool Checked
            {
                get { return _checked; }
                set { _checked = value; }
            }

            /// <summary>
            /// Gets a value indicating whether this instance is leaf.
            /// </summary>
            /// <value><c>true</c> if this instance is leaf; otherwise, <c>false</c>.</value>
            [JsonProperty("leaf")]
            public bool IsLeaf
            {
                get { return (_children == null || _children.Count == 0) ? true : false; }
            }

            /// <summary>
            /// Gets or sets the children.
            /// </summary>
            /// <value>The children.</value>
            [JsonProperty("children")]
            public List<ProductTreeNode> Children
            {
                get { return _children; }
                set { _children = value; }
            }

            public ProductTreeNode() { }
            /// <summary>
            /// Initializes a new instance of the <see cref="ProductTreeNode"/> class.
            /// </summary>
            /// <param name="id">The id.</param>
            /// <param name="text">The text.</param>
            public ProductTreeNode(string id, string text)
            {
                ID = id;
                Text = text;
                //Checked = _checked;
                //Children = _children;
            }

        }

        private static Dictionary<string, string> CollectParams(IRequest request)
        {
            var parameters = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            foreach (string key in HttpContext.Current.Request.QueryString.Keys)
                parameters[key] = HttpContext.Current.Request.QueryString[key];

            if (!String.IsNullOrEmpty(request.Uri.PathSegments[SDataUri.CollectionTypePathIndex].Predicate))
            {
                var predicate = request.Uri.PathSegments[SDataUri.CollectionTypePathIndex].Predicate;
                var queryInfo = predicate.Split('&');

                var nameValueRegex = new Regex(@"^(?<name>[^=]+)=(?<value>.*)$");
                foreach (var nameValuePair in queryInfo)
                {
                    var nameValueMatch = nameValueRegex.Match(nameValuePair);
                    if (!nameValueMatch.Success)
                        continue;

                    var name = nameValueMatch.Groups["name"].Value;
                    var value = nameValueMatch.Groups["value"].Value;

                    parameters[name] = value;
                }
            }
            return parameters;
        }

        [PostRequestTarget]
        [GetRequestTarget]
        [Description("Retrieve product data")]
        public void GetProducts(IRequest request)
        {
            var authProvider = ApplicationContext.Current.Services.Get<IAuthenticationProvider>(true);
            if (authProvider.IsAuthenticated)
            {
                parameters = CollectParams(request);
                string responseType = "JSON";

                if (parameters.ContainsKey("format"))
                    responseType = parameters["format"] ?? "JSON";


                List<ProductTreeNode> nodes = new List<ProductTreeNode>();
                foreach (ProductTreeNode product in GetProductsTree())
                    nodes.Add(product);

                int productTotalCount = GetProductsCount();

                if (responseType.Equals("Xml", StringComparison.OrdinalIgnoreCase))
                    request.Response.ContentType = MediaType.Xml;
                else
                    request.Response.ContentType = MediaType.JSON;

                request.Response.Html = JavaScriptConvert.SerializeObject(new
                {
                    nodes,
                    total = productTotalCount
                });

            }
            else
            {
                throw new DiagnosesException(Severity.Error,
                                             "Not authenticated.",
                                             DiagnosisCode.ApplicationDiagnosis,
                                             HttpStatusCode.Forbidden);
            }
        }



        public enum SearchParameter
        {
            StartingWith,
            Contains,
            EqualTo,
            NotEqualTo,
            EqualOrLessThan,
            EqualOrGreaterThan,
            LessThan,
            GreaterThan
        }

        public List<ProductTreeNode> GetProductsTree()
        {
            List<ProductTreeNode> result = new List<ProductTreeNode>();

            var node = parameters.ContainsKey("node")
                ? parameters["node"]
                : String.Empty;

            if (node != "root")
            {
                List<IPackage> packages = (List<IPackage>)GetPackageList();
                foreach (IPackage package in packages)
                {
                    if (package.Id.ToString() == node)
                    {
                        foreach (IPackageProduct packageProduct in package.PackageProducts)
                            result.Add(new ProductTreeNode(packageProduct.Product.Id.ToString(),
                                                                    packageProduct.Product.Name));
                    }
                }
                return result;
            }

            if (parameters["packages"] == "True")
            {
                List<IPackage> packages = (List<IPackage>)GetPackageList();
                foreach (IPackage package in packages)
                {
                    ProductTreeNode parent = new ProductTreeNode(package.Id.ToString(), package.Name + " (" + package.PackageProducts.Count + ")");
                    parent.Children.Add(new ProductTreeNode("", package.PackageProducts.Count.ToString()));
                    result.Add(parent);
                }
                return result;
            }

            //Else just products
            List<IProduct> products = (List<IProduct>)GetProductList();
            foreach (IProduct product in products)
                result.Add(new ProductTreeNode(product.Id.ToString(), product.Name));
            return result;



        }

        private IPackage GetSinglePackage(string id)
        {
            IRepository<IPackage> PackageRep = EntityFactory.GetRepository<IPackage>();
            IQueryable qryablePackage = (IQueryable)PackageRep;
            IExpressionFactory expPackage = qryablePackage.GetExpressionFactory();
            ICriteria criteriaPackage = qryablePackage.CreateCriteria();

            //criteriaPackage.Add(Expression.Eq("Id", id));
            SearchParameter equals = (SearchParameter)2;
            criteriaPackage.Add(GetExpression(expPackage, equals, "Id", id));

            IPackage Package = criteriaPackage.List<IPackage>() as IPackage;
            return Package;
        }

        /// <summary>
        /// Gets the package list.
        /// </summary>
        /// <returns></returns>
        private object GetPackageList()
        {
            IRepository<IPackage> PackageRep = EntityFactory.GetRepository<IPackage>();
            IQueryable qryablePackage = (IQueryable)PackageRep;
            IExpressionFactory expPackage = qryablePackage.GetExpressionFactory();
            ICriteria criteriaPackage = qryablePackage.CreateCriteria();

            if (parameters.ContainsKey("start"))
                criteriaPackage.SetFirstResult(Convert.ToInt32(parameters["start"]));
            if (parameters.ContainsKey("limit"))
                criteriaPackage.SetMaxResults(Convert.ToInt32(parameters["limit"]));

            if (parameters["NameFilter"] != string.Empty)
            {
                SearchParameter enumCondition = (SearchParameter)Convert.ToInt32(parameters["NameCond"]);
                criteriaPackage.Add(GetExpression(expPackage, enumCondition, "Name", parameters["NameFilter"]));
            }

            List<IPackage> PackageList = criteriaPackage.List<IPackage>() as List<IPackage>;
            return PackageList;
        }

        /// <summary>
        /// Gets the product list.
        /// </summary>
        /// <returns></returns>
        public object GetProductList()
        {
            IRepository<IProduct> productRep = EntityFactory.GetRepository<IProduct>();
            IQueryable qryableProduct = (IQueryable)productRep;
            IExpressionFactory expProduct = qryableProduct.GetExpressionFactory();
            ICriteria criteriaProduct = qryableProduct.CreateCriteria();

            if (parameters.ContainsKey("start"))
                criteriaProduct.SetFirstResult(Convert.ToInt32(parameters["start"]));
            if (parameters.ContainsKey("limit"))
                criteriaProduct.SetMaxResults(Convert.ToInt32(parameters["limit"]));

            if (parameters["NameFilter"] != string.Empty)
            {
                SearchParameter enumCondition = (SearchParameter)Convert.ToInt32(parameters["NameCond"]);
                criteriaProduct.Add(GetExpression(expProduct, enumCondition, "Name", parameters["NameFilter"]));
            }

            if (parameters["SKUFilter"] != string.Empty)
            {
                SearchParameter enumCondition = (SearchParameter)Convert.ToInt32(parameters["SKUCond"]);
                criteriaProduct.Add(GetExpression(expProduct, enumCondition, "ActualId", parameters["SKUFilter"]));
            }

            if (parameters["FamilyFilter"] != string.Empty)
            {
                SearchParameter enumCondition = SearchParameter.EqualTo;
                criteriaProduct.Add(GetExpression(expProduct, enumCondition, "Family", parameters["FamilyFilter"]));
            }

            if (parameters["StatusFilter"] != string.Empty)
            {
                SearchParameter enumCondition = SearchParameter.EqualTo;
                criteriaProduct.Add(GetExpression(expProduct, enumCondition, "Status", parameters["StatusFilter"]));
            }

            List<IProduct> ProductList = criteriaProduct.List<IProduct>() as List<IProduct>;
            return ProductList;
        }

        private int GetProductsCount()
        {
            if (parameters["packages"] == "True")
            {
                IRepository<IPackage> PackageRep = EntityFactory.GetRepository<IPackage>();
                IQueryable qryablePackage = (IQueryable)PackageRep;
                IExpressionFactory expPackage = qryablePackage.GetExpressionFactory();
                ICriteria criteriaPackage = qryablePackage.CreateCriteria();

                if (parameters["NameFilter"] != string.Empty)
                {
                    SearchParameter enumCondition = (SearchParameter)Convert.ToInt32(parameters["NameCond"]);
                    criteriaPackage.Add(GetExpression(expPackage, enumCondition, "Name", parameters["NameFilter"]));
                }

                List<IPackage> PackageList = criteriaPackage.List<IPackage>() as List<IPackage>;
                return PackageList.Count;
            }

            IRepository<IProduct> productRep = EntityFactory.GetRepository<IProduct>();
            IQueryable qryableProduct = (IQueryable)productRep;
            IExpressionFactory expProduct = qryableProduct.GetExpressionFactory();
            ICriteria criteriaProduct = qryableProduct.CreateCriteria();

            if (parameters["NameFilter"] != string.Empty)
            {
                SearchParameter enumCondition = (SearchParameter)Convert.ToInt32(parameters["NameCond"]);
                criteriaProduct.Add(GetExpression(expProduct, enumCondition, "Name", parameters["NameFilter"]));
            }

            if (parameters["SKUFilter"] != string.Empty)
            {
                SearchParameter enumCondition = (SearchParameter)Convert.ToInt32(parameters["SKUCond"]);
                criteriaProduct.Add(GetExpression(expProduct, enumCondition, "ActualId", parameters["SKUFilter"]));
            }

            if (parameters["FamilyFilter"] != string.Empty)
            {
                SearchParameter enumCondition = SearchParameter.EqualTo;
                criteriaProduct.Add(GetExpression(expProduct, enumCondition, "Family", parameters["FamilyFilter"]));
            }

            if (parameters["StatusFilter"] != string.Empty)
            {
                SearchParameter enumCondition = SearchParameter.EqualTo;
                criteriaProduct.Add(GetExpression(expProduct, enumCondition, "Status", parameters["StatusFilter"]));
            }

            List<IProduct> ProductList = criteriaProduct.List<IProduct>() as List<IProduct>;
            return ProductList.Count;
        }

        /// <summary>
        /// Gets the expression.
        /// </summary>
        /// <param name="ef">The ef.</param>
        /// <param name="expression">The expression.</param>
        /// <param name="propName">Name of the prop.</param>
        /// <param name="value">The value.</param>
        /// <returns></returns>
        public static IExpression GetExpression(IExpressionFactory ef, SearchParameter expression, string propName, string value)
        {
            switch (expression)
            {
                case SearchParameter.StartingWith:
                    return ef.InsensitiveLike(propName, value, LikeMatchMode.BeginsWith);
                case SearchParameter.Contains:
                    return ef.InsensitiveLike(propName, value, LikeMatchMode.Contains);
                case SearchParameter.EqualOrGreaterThan:
                    return ef.Ge(propName, value);
                case SearchParameter.EqualOrLessThan:
                    return ef.Le(propName, value);
                case SearchParameter.EqualTo:
                    return ef.Eq(propName, value);
                case SearchParameter.GreaterThan:
                    return ef.Gt(propName, value);
                case SearchParameter.LessThan:
                    return ef.Lt(propName, value);
                case SearchParameter.NotEqualTo:
                    return ef.InsensitiveNe(propName, value);
            }
            return null;
        }
    }
}