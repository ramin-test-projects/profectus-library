using LibraryWebApis.Books.Models;
using LibraryWebApis.Database.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.Text.Json.Serialization;

namespace LibraryWebApis.Controller;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly ILogger<BooksController> _logger;
    private readonly ControllerHelpers _helpers;
    private readonly BooksCollection _booksCollection;
    private readonly IWebHostEnvironment _env;

    public BooksController(ILogger<BooksController> logger,
        ControllerHelpers helpers, BooksCollection booksCollection, IWebHostEnvironment env)
    {
        _logger = logger;
        _helpers = helpers;
        _booksCollection = booksCollection;
        _env = env;
    }

    [HttpGet(template: "settings", Name = "Settings")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Dictionary<string, string>))]
    public ActionResult<Dictionary<string, string>> Settings()
    {
        return Ok(new
        {
            MongoDbConnection = _helpers.AppSettings.MongoDB.ConnectionString,
            MongoDbName = _helpers.AppSettings.MongoDB.DatabaseName,
            JwtIssuer = _helpers.AppSettings.JWT.Issuer
        });
    }

    [Authorize]
    [HttpPost(template: "populate-with-sample-data", Name = "PopulateWithSampleData")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> PopulateWithSampleData()
    {
        try
        {
            if (!_helpers.CurrentUser.IsAdmin) return StatusCode(StatusCodes.Status403Forbidden);

            string filePath = Path.Combine(_env.ContentRootPath, "books.xlsx");
            if (!System.IO.File.Exists(filePath)) {
                return NotFound(new { filePath = filePath });
            }

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using var package = new ExcelPackage(new FileInfo(filePath));
            var worksheet = package.Workbook.Worksheets[0];
            var rowCount = worksheet.Dimension.Rows;

            var books = Enumerable.Range(2, rowCount - 1).Select(row => new Book()
            {
                BookID = worksheet.Cells[row, 1].Text.Trim(),
                Title = worksheet.Cells[row, 2].Text.Trim(),
                Authors = worksheet.Cells[row, 3].Text.Trim(),
                AverageRating = Parsers.ParseDouble(worksheet.Cells[row, 4].Text.Trim()),
                ISBN = worksheet.Cells[row, 5].Text.Trim(),
                ISBN13 = worksheet.Cells[row, 6].Text.Trim(),
                LanguageCode = worksheet.Cells[row, 7].Text.Trim(),
                NumPages = Parsers.ParseInt(worksheet.Cells[row, 8].Text.Trim()),
                RatingsCount = Parsers.ParseInt(worksheet.Cells[row, 9].Text.Trim()),
                TextReviewsCount = Parsers.ParseInt(worksheet.Cells[row, 10].Text.Trim()),
                PublicationDate = Parsers.ParseDate(worksheet.Cells[row, 11].Text.Trim()),
                Publisher = worksheet.Cells[row, 12].Text.Trim()
            }).ToList();

            await _booksCollection.InsertBookAsync(books);

            return Ok(new { result = "success", message = $"populated '{books.Count}' books." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "populate with sample data");
            return StatusCode(StatusCodes.Status500InternalServerError, "an error has occurred");
        }
    }

    [Authorize]
    [HttpDelete(template: "clear-sample-data", Name = "ClearSampleData")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> ClearSampleData()
    {
        try
        {
            if (!_helpers.CurrentUser.IsAdmin) return StatusCode(StatusCodes.Status403Forbidden);

            await _booksCollection.DeleteAllBooksAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "clear sample data");
            return StatusCode(StatusCodes.Status500InternalServerError, "an error has occurred");
        }
    }

    [Authorize]
    [HttpPut(template: "add", Name = "AddBook")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Book))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<Book>> AddBook([FromBody] Book book)
    {
        try
        {
            if (!_helpers.CurrentUser.IsAdmin) return StatusCode(StatusCodes.Status403Forbidden);

            await _booksCollection.InsertBookAsync(book);
            return CreatedAtAction(nameof(AddBook), book);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "add book");
            return StatusCode(StatusCodes.Status500InternalServerError, "an error has occurred");
        }
    }

    [Authorize]
    [HttpPut(template: "update", Name = "UpdateBook")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> UpdateBook([FromBody] Book book)
    {
        try
        {
            if (!_helpers.CurrentUser.IsAdmin) return StatusCode(StatusCodes.Status403Forbidden);

            bool result = await _booksCollection.UpdateBookAsync(book);

            return result
                ? NoContent()
                : StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the book.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "update book");
            return StatusCode(StatusCodes.Status500InternalServerError, "an error has occurred");
        }
    }

    [Authorize]
    [HttpDelete(template: "delete/{id}", Name = "DeleteBook")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> DeleteBook([FromRoute] string id)
    {
        try
        {
            if (!_helpers.CurrentUser.IsAdmin) return StatusCode(StatusCodes.Status403Forbidden);


            Book? book = string.IsNullOrEmpty(id) ? null : await _booksCollection.GetBookByIdAsync(id);

            if (book?.ID == null) return NotFound();

            bool result = await _booksCollection.DeleteBookByIdAsync(book.ID);

            return result
                ? NoContent()
                : StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the book.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "delete book");
            return StatusCode(StatusCodes.Status500InternalServerError, "an error has occurred");
        }
    }

    [Authorize]
    [HttpGet(template: "{id}", Name = "GetBookById")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Book))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Book>> GetBookById([FromRoute] string id)
    {
        try
        {
            Book? book = await _booksCollection.GetBookByIdAsync(id);

            return book == null ? NotFound() : Ok(book);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "get book by id");
            return StatusCode(StatusCodes.Status500InternalServerError, "an error has occurred");
        }
    }

    [Authorize]
    [HttpGet(template: "search/{searchTerm?}", Name = "SearchBooks")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<SearchBooksResponse>))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SearchBooksResponse>> SearchBooks([FromRoute] string? searchTerm,
        [FromQuery] int? count, [FromQuery] int? lowerBoundary)
    {
        try
        {
            (List<Book> books, long totalCount) = await _booksCollection.SearchBooksAsync(
                searchTerm: searchTerm,
                count: count,
                lowerBoundary: lowerBoundary);

            return Ok(new SearchBooksResponse()
            {
                TotalCount = totalCount,
                Books = books
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "search books");
            return StatusCode(StatusCodes.Status500InternalServerError, "an error has occurred");
        }
    }
}

[Serializable]
public class SearchBooksResponse
{
    [JsonPropertyName("totalCount")]
    public long? TotalCount { get; set; }

    [JsonPropertyName("books")]
    public List<Book> Books { get; set; }

    public SearchBooksResponse()
    {
        Books = new List<Book>();
    }
}
