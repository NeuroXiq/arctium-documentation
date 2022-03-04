using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using arctium_website.Database.Entities;
using arctium_website.Database.Repository;
using arctium_website.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;

namespace arctium_website.Controllers
{
    public class DocumentationController : Controller
    {
        private static readonly List<string> documentationPagesNames;
        private IAlgorithmSummaryRepository algorithmSummaryRepository;
        private ICompositeViewEngine compositeViewEngine;

        static DocumentationController()
        {
            var docsDirectory = Path.Combine(Startup.WebRootPath, "documentation-pages");
            documentationPagesNames = Directory.GetFiles(docsDirectory).Select(path => Path.GetFileName(path)).ToList();
        }

        public DocumentationController(IAlgorithmSummaryRepository algorithmSummaryRepository,
            ICompositeViewEngine compositeViewEngine)
        {
            this.algorithmSummaryRepository = algorithmSummaryRepository;
            this.compositeViewEngine = compositeViewEngine;
        }

        public IActionResult GetAlgorithmsSummary()
        {
            return Ok(System.IO.File.ReadAllText(Path.Combine(Startup.WebRootPath, "documentation-pages", "algorithms-summary.json")));
        }

        public async Task<string> GetContent([FromBody]GetContentModel model)
        {
            var w = "./pages/" + model.ContentName.Trim();
            var viewResult = compositeViewEngine.FindView(ControllerContext, w, false);

            if (viewResult.Success)
            {
                using (var writer = new StringWriter())
                {
                    var viewContext = new ViewContext(ControllerContext,
                        viewResult.View,
                        ViewData,
                        TempData,
                        writer,
                        new Microsoft.AspNetCore.Mvc.ViewFeatures.HtmlHelperOptions());

                    await viewResult.View.RenderAsync(viewContext);

                    return writer.GetStringBuilder().ToString();
                }
            }

            return "Documentation page not found";
        }
    }
}
