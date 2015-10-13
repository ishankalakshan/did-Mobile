﻿using System;
using System.Collections.Generic;
using System.Security;
using Microsoft.SharePoint.Client;

namespace Pzl.SharePoint.Client
{
    public class SharepointContext
    {
        private readonly ClientContext _context;

        public SharepointContext( string url , string username, string password)
        {
            try
            {
                var cred = GetSharePointOnlineCredentials(username, password);
                var context = new ClientContext(url)
                {
                    Credentials = cred
                };

                _context = context;
            }
            catch (Exception e)
            {

                throw e;
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

                throw e;
            }
        }

        public IEnumerable<ListItem> RetrieveListItem(string query, string listTitle)
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

                throw e;
            }
        }

        public bool UpdateListItem(string id,string listTitle,string columnName,string lookUpId)
        {
            try
            {
                var web = _context.Web;
                var oList = web.Lists.GetByTitle(listTitle);
                var oListItem = oList.GetItemById(id);

                var lv = new FieldLookupValue {LookupId = Convert.ToInt32(lookUpId)};

                oListItem[columnName] = lv;

                oListItem.Update();
                _context.ExecuteQuery();

                return true;
            }
            catch (Exception e)
            {

                throw e;
            }
        }
    }
}
