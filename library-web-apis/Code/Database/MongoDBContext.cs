using LibraryWebApis.Books.Models;
using MongoDB.Driver;

namespace LibraryWebApis;

public class MongoDBContext
{
    private readonly IMongoDatabase _database;

    public MongoDBContext(IMongoClient client, AppSettings settings)
    {
        _database = client.GetDatabase(settings.MongoDB.DatabaseName);
    }

    public IMongoCollection<Book> Books => _database.GetCollection<Book>("Books");
}
