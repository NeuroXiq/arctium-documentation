using System.Collections.Generic;
using System.Linq;

namespace arctium_website.Models.Documentation
{
    public class ContentTable
    {
        public List<string> Content;

        public ContentTable(params string[] content)
        {
            Content = content.ToList();
        }
    }
}
