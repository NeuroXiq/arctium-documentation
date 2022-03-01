using Microsoft.Data.Sqlite;
using System.IO;

namespace arctium_website.Database
{
    public class SQLiteDb
    {
        public const string ConnectionString = "DataSource=Database/arctium-website-db";

        private SqliteConnection connection;

        public static void Init()
        {
            File.Delete("Database/arctium-website-db");
            var cc = new SqliteConnection(ConnectionString);
            cc.Open();

            var cmd = cc.CreateCommand();

            var migration1 = File.ReadAllText("Database/Migrations/_1_AlgorithmSummary.sql");

            cmd.CommandText = migration1;
            
            cmd.ExecuteNonQuery();
        }

        public SQLiteDb()
        {
            connection = new SqliteConnection(ConnectionString);
            connection.Open();
        }

        public SqliteDataReader Read(string query)
        {
            var cmd = connection.CreateCommand();
            cmd.CommandText = query;

            return cmd.ExecuteReader();
        }
    }
}
