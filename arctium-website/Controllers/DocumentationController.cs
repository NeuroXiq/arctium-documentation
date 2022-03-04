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

            var name = model.ContentName;

            if (!documentationPagesNames.Contains(name)) return "Documentation page not found";

            var fileName = Path.Combine(Startup.WebRootPath, "documentation-pages", name);

            var content = System.IO.File.ReadAllText(fileName);

            return content;
        }

        //public IList<DocumentationPageMetadataModel> GetPagesMetadata()
        //{
        //    var x = new List<DocumentationPageMetadataModel>();

        //    foreach (var docFile in documentationPagesNames)
        //    {
        //        x.Add(new DocumentationPageMetadataModel(docFile, docFile));
        //    }

        //    x.Add(new DocumentationPageMetadataModel("Algorithms Summary", "algorithms-summary"));

        //    for (int i = 0; i < 120; i++)
        //    {
        //        var q = "doc page" + i;
        //        x.Add(new DocumentationPageMetadataModel(q,q));
        //    }

        //    return x;
        //}
    }
}
