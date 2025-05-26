# Book API Spec

## Get Book

Endpoint : GET /api/books/search

Query Parameters:
- `bookId`: ISBN
- `title`: title of a book
- `categoryId`: id of an valid category
- `categoryName`: name of an valid category
- `authorId`: id of an valid author
- `authorName`: name of an valid author

Request Header :
- Authorization : Bearer [Access Token]

Response Body (Success) :

```json
{
  "data": [
    {
      "isbn": "...",
      "title": "book title",
      "description": "book description",
      "year": 2005,
      "pages": 123,
      "language": "Indonesia",
      "cover": "https://image.com",
      "authorId": "author",
      "author": {
        "name": "..."
      },
      "categoryId": "category",
      "category": {
        "name": "..."
      }
    },
    {
    }
  ],
  "pagination": {
    "totalItems": 48,
    "itemCount": 40,
    "itemsPerPage": 12,
    "totalPages": 4,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

Response Body (Failed) :

```json
{
  "error" : "Invalid authorId: must be a number."
}
```

## Add Book

Endpoint : POST /api/books

Request Header :
- Authorization : Bearer [Access Token]

Request Body :

```json
{
  "isbn" : "...",
  "title" : "book title",
  "description" : "book description",
  "year": 2005,
  "pages": 123,
  "language": "Indonesia",
  "cover": "https://image.com",
  "author": "author", 
  "category": "category"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "title" : "book title",
    "isbn": "..."
  }
}
```

Response Body (Failed) :

```json
{
  "error" : "Title must not be empty"
}
```

## Update Book

Request Header :
- Authorization : Bearer [Access Token]


Endpoint : PATCH /api/books/:bookId

Request Body :

```json
{
  "isbn" : "...",
  "title" : "book title",
  "description" : "book description",
  "year": 2005,
  "pages": 123,
  "language": "Indonesia",
  "cover": "https://image.com",
  "author": "author",
  "category": "category"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "title" : "book title",
    "isbn": "..."
  }
}
```

Response Body (Failed) :

```json
{
  "error": "Title must not be empty"
}
```

## Delete Book

Request Header :
- Authorization : Bearer [Access Token]


Endpoint : DELETE /api/books/:bookId

Response Body (Success) :

```json
{
  "data" : {
    "message" : "OK"
  }
}
```

Response Body (Failed) :

```json
{
  "error": "Book not found"
}
```