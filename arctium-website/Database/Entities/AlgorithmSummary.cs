namespace arctium_website.Database.Entities
{
    public enum ArgorithmSummaryStatus : long
    {
        Ok = 0,
        Partial = 1,
        Todo = 2, 
        NotImplemented = 3
    }

    public class AlgorithmSummary
    {
        public string AlgorithmName { get; set; }
        public string StandardName { get; set; }
        public string StandardWebsiteUrl { get; set; }
        public string ArctiumWebsiteDocumentationUrl { get; set; }
        public string Group { get; set; }
        public ArgorithmSummaryStatus Status { get; set; }
    }
}
