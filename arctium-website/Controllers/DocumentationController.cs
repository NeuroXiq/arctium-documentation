using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace arctium_website.Controllers
{
    public class DocumentationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
