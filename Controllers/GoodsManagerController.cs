using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Common;
using BLL;
using Model;

namespace SaleTools.Controllers
{
    public class GoodsManagerController : Controller
    {
        private GoodsManager _manager = new GoodsManager();
        private UserManager _user = new UserManager();
        // GET: GoodsManager
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GoodsTypeList(string id = "")
        {
            if (Session["LoginUser"] == null)
                return RedirectToAction("Index", "Login");

            var loginUser = (UserInfo)Session["LoginUser"];
            var guid = Utils.ParseGuid(id);
            var list = _manager.GetDownGoodsType(guid,loginUser.UserId);
            ViewBag.GoodsTypeList = list;
            ViewBag.TypeId = guid;
            return View();
        }

        public string GetGoodsTypeList(string id )
        {
            var loginUser = (UserInfo)Session["LoginUser"];
            var guid = Utils.ParseGuid(id);
            var list = _manager.GetDownGoodsType(guid, loginUser.UserId);
            return Utils.SerializeObject(list);
        }
        public string AddGoodType(Guid parent,string typeName)
        {
            var loginUser = (UserInfo)Session["LoginUser"];
            
            GoodsType type = new GoodsType();
            type.CreateUserId = loginUser.UserId;
            type.CreateUserName = loginUser.UserName;
            var parentModel = _manager.GetTypeById(parent);
            type.Id = Guid.NewGuid();
            type.TypeName = typeName;
            type.IsDelete = false;
            if (parentModel == null)
            {
                type.ParentId = Guid.Empty;
                type.ParentName = string.Empty;
            }
            else
            {
                type.ParentId = parentModel.Id;
                type.ParentName = parentModel.TypeName;
            }
            var res = _manager.AddGoodsType(type);
            return Utils.SerializeObject(res);
        }

        public string DelGoodsType(Guid typeId)
        {
            var res = _manager.DelGoodsType(typeId);
            return Utils.SerializeObject(res);
        }


        public ActionResult GoodsBrand()
        {
            var loginUser = (UserInfo)Session["LoginUser"];

            var goodList = _manager.GetAllBrand(loginUser.UserId);
            return View(goodList);
        }

        public string AddGoodBrand(string brandName)
        {
            var loginUser = (UserInfo)Session["LoginUser"];

            GoodsBrand brand = new GoodsBrand();
            brand.CreateUserId = loginUser.UserId;
            brand.CreateUserName = loginUser.UserName;
            brand.Id = Guid.NewGuid();
            brand.BrandName = brandName;
            brand.IsDelete = false;
            brand.Country = string.Empty;
            brand.Country = "中国";
           
            var res = _manager.AddGoodsBrand(brand);
            return Utils.SerializeObject(res);
        }

        public ActionResult SetBrand(Guid typeId)
        {
            var loginUser = (UserInfo)Session["LoginUser"];
            ViewBag.TypeId = typeId;
            var typeList = _manager.GetBrandList(typeId);
            var brand = _manager.GetAllBrand(loginUser.UserId);
            ViewBag.TypeList = typeList;
            ViewBag.Brand = brand;
            return View();
        }

        public string SaveBrandOfType(Guid typeId,List<Guid> typeList)
        {
            var res = _manager.SaveBrandOfType(typeId, typeList);
            return Utils.SerializeObject(res);
        }

        public ActionResult AddGoods()
        {
            var loginUser = (UserInfo)Session["LoginUser"];
            var supplierList = _user.GetSupplierList(loginUser.UserId);
            ViewBag.SupplierList = supplierList;
            return View();
        }

        public string GetBrandList(Guid typeId)
        {
            var typeList = _manager.GetBrandList(typeId);

            return Utils.SerializeObject(typeList);
        }
    }
}