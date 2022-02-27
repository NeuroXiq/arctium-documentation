namespace arctium_website.Models
{
    public class DocumentationPageMetadataModel
    {
        public string Name { get; set; }

        public string HtmlPageName { get; set; }

        public DocumentationPageMetadataModel(string name, string htmlPageName)
        {
            Name = name;
            HtmlPageName = htmlPageName;
        }
    }
}
