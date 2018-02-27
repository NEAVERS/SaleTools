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
    public class UserController : Controller
    {
        private UserManager manager = new UserManager();
        // GET: Usei
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult AddNewUser()
        {
            var list = manager.GetTypeList();
            ViewBag.TypeList = list;
            return View();
        }

        public ActionResult UserTyoeList()
        {
            var list = manager.GetTypeList(true);
            return View(list);
        }



        public string GetList(int index , int size , string  start, string end, string  key = "")
        {
            var startTime = Utils.GetTime(start, true);
            var endTime = Utils.GetTime(end);
            var list = manager.GetUserByPage(index, size, startTime, endTime, key, false);

            return Utils.SerializeObject(list);
        }


        public string ToggaleLock(Guid userId)
        {
            var res = manager.ToggaleLock(userId);
            return Utils.SerializeObject(res);
        }


        public  string SaveUser(UserInfo user)
        {
            var loginUser = (UserInfo)Session["LoginUser"];
            user.PassWord = Utils.GetMD5(user.PassWord);
            bool res =  false;
            if (user.UserId == Guid.Empty)
            {
                user.CreateUser = loginUser.UserName;
                user.CreateUserId = user.UserId;
                user.UserId = Guid.NewGuid();
                res = manager.UserReg(user);
            }
            else
                res = manager.UpdateUser(user);
            return Utils.SerializeObject(res);
            
        }
        public string DelUser(Guid userId)
        {
            var res = manager.DelUser(userId);
            return Utils.SerializeObject(res);
        }


        public string AddUserType(string userType,bool isAdmin)
        {
            var res = manager.AddUserType(userType, isAdmin);
            return res;
        }

        public ActionResult ShowSupplierList()
        {
            if(Session["LoginUser"] == null)
                return RedirectToAction("Index", "Login");
            var loginUser = (UserInfo)Session["LoginUser"];
            var list = manager.GetSupplierList(loginUser.UserId);
            return View(list);
        }

        public ActionResult SupplierDeltie(int id = 0)
        {
            var model = new Supplier();
            if (id > 0)
                model = manager.GetSupplierById(id);
            return View(model);
        }
        public string DeleteSupplier(int id)
        {
            var result = manager.DelSupplier(id);
            return Utils.SerializeObject(result);
        }

        public ActionResult AddOrUpdateSupplier(Supplier model)
        {
            if (Session["LoginUser"] == null)
                return RedirectToAction("Index", "Login");
            var loginUser = (UserInfo)Session["LoginUser"];

            if (model.Id == 0)
            {
                model.CreateUserId = loginUser.UserId;
                model.CreateUserName = loginUser.UserName;
                manager.AddSupplier(model);
            }
            else
            {
                manager.UpdateSupplier(model);
            }
            return RedirectToAction("ShowSupplierList", "User");

        }

        public ActionResult EditUserInfo(Guid id)
        {
            var list = manager.GetTypeList();
            ViewBag.TypeList = list;

            var model = manager.GetUserByUserId(id);
            if (model == null)
                return RedirectToAction("AddNewUser", "User");
            else return View(model);
        }     
    }
}