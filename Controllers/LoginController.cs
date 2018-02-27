using BLL;
using Common;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SaleTools.Controllers
{
    public class LoginController : Controller
    {
        private UserManager _manager = new UserManager();
        // GET: Login
        public ActionResult Index()
        {
        
            return View();
        }

        public string  AccountLogin(string account,string Pwd)
        {
            Pwd = Utils.GetMD5(Pwd);

            var user = _manager.Login(account, Pwd);
            if (user == null)
                return "登陆失败";
            ///锁定后不能进行登陆
            //if (user.IsLocked == true)
            //    return "该账号已被锁定！请联系管理员解除锁定后登陆";
            else
            {
                Session["LoginUser"] = user;
                return "登陆成功";
            }

        }
    }
}