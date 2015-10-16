using System;
using System.Collections.Generic;
using System.Security;
using Microsoft.SharePoint.Client;

namespace Pzl.SharePoint.Client
{
    public class SharepointContext
    {
        private readonly ClientContext _context;

        public SharepointContext( string siteUrl , string username, string password)
        {
            try
            {
                var credentials = GetSharePointOnlineCredentials(username, password);
                var context = new ClientContext(siteUrl)
                {
                    Credentials = credentials
                };

                _context = context;
            }
            catch (Exception e)
            {
                throw;
            } 
        }

        private static SharePointOnlineCredentials GetSharePointOnlineCredentials(string username, string password)
        {
            try
            {
                if (password == null)
                {
                    throw new ArgumentNullException("password");
                }

                var securePassword = new SecureString();

                foreach (var c in password)
                {
                    securePassword.AppendChar(c);
                }

                securePassword.MakeReadOnly();
                return new SharePointOnlineCredentials(username, securePassword);
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public IEnumerable<ListItem> RetrieveListItems(string query, string listTitle)
        {
            try
            {
                var web = _context.Web;
                var camlQuery = new CamlQuery { ViewXml = query };
                var result = _context.LoadQuery(web.Lists.GetByTitle(listTitle).GetItems(camlQuery));
                _context.ExecuteQuery();

                return result;
            }
            catch (Exception e)
            {
                throw;
            }
        }

        /*public bool UpdateListItem(string id, string listTitle, string columnName, string value)
        {
            try
            {
                var web = _context.Web;
                var oList = web.Lists.GetByTitle(listTitle);
                var oListItem = oList.GetItemById(id);

                oListItem[columnName] = value;

                oListItem.Update();
                _context.ExecuteQuery();

                return true;
            }
            catch (Exception e)
            {
                throw;
            }
        }*/

        public bool UpdateListItem(string listItemId, string listTitle, Dictionary<string, object> values)
        {
            var web = _context.Web;
            var sharepointList = web.Lists.GetByTitle(listTitle);
            var sharepointListItem = sharepointList.GetItemById(listItemId);
            
            foreach (var listItem in values)
            {
                sharepointListItem[listItem.Key] = listItem.Value;
            }

            sharepointListItem.Update();
            _context.ExecuteQuery();

            return true;
        }

        /*public bool UpdateListItemWithLookUp(string id,string listTitle,string columnName,string value)
        {
            try
            {
                var web = _context.Web;
                var oList = web.Lists.GetByTitle(listTitle);
                var oListItem = oList.GetItemById(id);

                var lv = new FieldLookupValue { LookupId = Convert.ToInt32(value) };

                oListItem[columnName] = lv;

                oListItem.Update();
                _context.ExecuteQuery();

                return true;
            }
            catch (Exception e)
            {
                throw;
            }
        }*/
    }
}
