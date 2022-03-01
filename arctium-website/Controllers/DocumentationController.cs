using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using arctium_website.Database.Entities;
using arctium_website.Database.Repository;
using arctium_website.Models;
using Microsoft.AspNetCore.Mvc;

namespace arctium_website.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class DocumentationController : ControllerBase
    {
        private static readonly List<string> documentationPagesNames;
        private IAlgorithmSummaryRepository algorithmSummaryRepository;

        static DocumentationController()
        {
            var docsDirectory = Path.Combine(Startup.WebRootPath, "documentation-pages");
            documentationPagesNames = Directory.GetFiles(docsDirectory).Select(path => Path.GetFileName(path)).ToList();
        }

        public DocumentationController(IAlgorithmSummaryRepository algorithmSummaryRepository)
        {
            this.algorithmSummaryRepository = algorithmSummaryRepository;
        }

        public IList<AlgorithmSummary> GetAlgorithmsSummary()
        {
            return algorithmSummaryRepository.GetAll();
        }

        public IActionResult GetContent(GetContentModel model)
        {
            var name = model.ContentName;

            if (!documentationPagesNames.Contains(name)) return NotFound("Documentation page not found");

            var fileName = Path.Combine(Startup.WebRootPath, "documentation-pages", name);

            var content = System.IO.File.ReadAllText(fileName);

            return Ok(content);
        }

        public IList<DocumentationPageMetadataModel> GetPagesMetadata()
        {
            var x = new List<DocumentationPageMetadataModel>();

            foreach (var docFile in documentationPagesNames)
            {
                x.Add(new DocumentationPageMetadataModel(docFile, docFile));
            }

            for (int i = 0; i < 120; i++)
            {
                var q = "doc page" + i;
                x.Add(new DocumentationPageMetadataModel(q,q));
            }

            return x;
        }
    }
}
