using arctium_website.Database.Entities;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;

namespace arctium_website.Database.Repository
{
    public interface IAlgorithmSummaryRepository
    {
        IList<AlgorithmSummary> GetAll();
    }

    public class AlgorithmSummaryRepository : IAlgorithmSummaryRepository
    {
        private SQLiteDb db;

        public AlgorithmSummaryRepository(SQLiteDb db)
        {
            this.db = db;
        }

        public IList<AlgorithmSummary> GetAll()
        {
            var reader = db.Read("select * from algorithm_summary");
            var result = new List<AlgorithmSummary>();

            while (reader.Read())
            {
                result.Add(Map(reader));
            }

            return result;
        }


        private AlgorithmSummary Map(SqliteDataReader reader)
        {
            var model = new AlgorithmSummary();

            model.AlgorithmName = reader["algorithm_name"] as string;
            model.StandardName = reader["standard_name"] as string;
            model.StandardWebsiteUrl = reader["standard_website_url"] as string;
            model.ArctiumWebsiteDocumentationUrl = reader["arctium_website_documentation_url"] as string;
            model.Group = reader["group"] as string;
            model.Status = (ArgorithmSummaryStatus)(long)(reader["status"]);

            return model;
        }
    }
}
