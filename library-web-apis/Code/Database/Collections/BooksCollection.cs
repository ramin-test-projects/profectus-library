using LibraryWebApis.Books.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace LibraryWebApis.Database.Collections;

public class BooksCollection
{
    private readonly IMongoCollection<Book> _books;

    public BooksCollection(MongoDBContext context)
    {
        _books = context.Books;
    }

    public async Task InsertBookAsync(Book book)
    {
        await _books.InsertOneAsync(book);
    }

    public async Task InsertBookAsync(List<Book> books)
    {
        await _books.InsertManyAsync(books);
    }

    public async Task<bool> UpdateBookAsync(Book book)
    {
        if (string.IsNullOrEmpty(book.ID ?? "")) return false;

        var result = await _books.ReplaceOneAsync<Book>(b => b.ID == book.ID, book);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public async Task<Book?> GetBookByIdAsync(string id)
    {
        long? bookId = Parsers.ParseLong(id);

        return bookId.HasValue 
            ? await _books.Find(b => b.BookID == bookId.ToString()).FirstOrDefaultAsync()
            : await _books.Find(b => b.ID == id).FirstOrDefaultAsync();
    }

    public async Task<(List<Book>, long)> SearchBooksAsync(string? searchTerm, int? count, int? lowerBoundary)
    {
        var filter = Builders<Book>.Filter.Empty;

        if (!string.IsNullOrEmpty(searchTerm))
        {
            var regex = new BsonRegularExpression(searchTerm, "i");

            filter = Builders<Book>.Filter.Or(
                Builders<Book>.Filter.Regex("Title", regex),
                Builders<Book>.Filter.Regex("Authors", regex),
                Builders<Book>.Filter.Regex("Publisher", regex)
            );
        }

        var totalCount = await _books.CountDocumentsAsync(filter);

        var books = await _books.Find(filter)
            .Skip(Math.Max(lowerBoundary ?? 0, 1) - 1)
            .Limit(Math.Max(Math.Min(count ?? 10, 50), 1))
            .ToListAsync();

        return (books, totalCount);
    }

    public async Task<bool> DeleteBookByIdAsync(string id)
    {
        var result = await _books.DeleteOneAsync(p => p.ID == id);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }

    public async Task<bool> DeleteAllBooksAsync()
    {
        var result = await _books.DeleteManyAsync(p => true);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }
}
