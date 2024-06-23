using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace LibraryWebApis.Books.Models;

[Serializable]
public class Book
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("id")]
    public string? ID { get; set; }

    [JsonPropertyName("bookId")]
    public string? BookID { get; set; }

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("authors")]
    public string? Authors { get; set; }

    [JsonPropertyName("average_rating")]
    public double? AverageRating { get; set; }

    [JsonPropertyName("isbn")]
    public string? ISBN { get; set; }

    [JsonPropertyName("isbn13")]
    public string? ISBN13 { get; set; }

    [JsonPropertyName("language_code")]
    public string? LanguageCode { get; set; }

    [JsonPropertyName("num_pages")]
    public int? NumPages { get; set; }

    [JsonPropertyName("ratings_count")]
    public int? RatingsCount { get; set; }

    [JsonPropertyName("text_reviews_count")]
    public int? TextReviewsCount { get; set; }

    [JsonPropertyName("publication_date")]
    public DateTime? PublicationDate { get; set; }

    [JsonPropertyName("publisher")]
    public string? Publisher { get; set; }
}
