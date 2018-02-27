using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using BLL;
using Common;

namespace SaleTools.Controllers
{
    public class CommonController : Controller
    {
        AreaManger _area = new AreaManger();
        // GET: Common
        public string GetAreaList(string num = "0")
        {
            var list = _area.GetAreaList(num);
            return Utils.SerializeObject(list);
        }

        [HttpPost]
        public ActionResult Upload(HttpPostedFileBase file)
        {
            if (Request.Files.Count == 0)
            {
                return Json(new { jsonrpc = 2.0, error = new { code = 102, message = "没有任何文件上传" }, id = "id" });
            }
            string ex = Path.GetExtension(file.FileName);
            try
            {
                string path = "~/GoodImg/" + DateTime.Now.ToString("yyyy_MM_dd") + "/";
                string savepath = Server.MapPath(path);//设定上传的文件路径
                if (!Directory.Exists(savepath))
                {
                    Directory.CreateDirectory(savepath);
                }
                string fileName = Guid.NewGuid().ToString("N") + ex;
                file.SaveAs(savepath + fileName);
                string returnPath = path + fileName;
                return Json(new
                {
                    status = true,
                    filePath = returnPath,
                    saveName = file.FileName,
                    extension = ex
                });
            }
            catch (Exception exception)
            {
            }
            return Json(new
            {
                status = false,
                filePath = "",
                saveName = "",
                extension = ""
            });
        }
    }
}