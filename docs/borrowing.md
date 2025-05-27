# Borrowing Book API Spec

## Add Borrow Book Record

Endpoint : POST /api/borrowings

Request Header :
- Authorization : Bearer [User or Administrator Access Token]

Request Body :

```json
{
  "bookId" : "isbn",
  "userId": "NRP or NIDN",
  "borrowDate": "2025-05-26T01:05:57.123Z",
  "returnDate": "2025-05-27T01:05:57.123Z"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "bookId" : "isbn",
    "userId": "NRP or NIDN",
    "borrowDate": "2025-05-26T01:05:57.123Z",
    "returnDate": "2025-05-27T01:05:57.123Z",
    "title" : "book title",
    "name": "user name"
  }
}
```

Response Body (Failed) :

```json
{
  "error" : "This book currently borrowed by another user"
}
```

## Update Borrow Book Record

This only can be accessed by `administrator` role.

Request Header :
- Authorization : Bearer [Administrator Access Token]

Endpoint : PATCH /api/borrowings/:borrowingId

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
  "error": "Corresponding borrow record is not found"
}
```

## Get User Borrowing History

Endpoint : POST /api/borrowings/history/:userId

Request Header :
- Authorization : Bearer [User Access Token]

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 123,
      "borrowDate": "...",
      "returnDate": "...",
      "returnedDate": "...",
      "book": {
        "isbn": "string",
        "title": "string",
        "description": "string",
        "year": "number",
        "authorId": "number",
        "cover": "string",
        "author": {
          "name": "string"
        },
        "category": {
          "name": "string"
        }
      }
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "error" : "Unauthorized"
}
```

## Get Library Stats

Endpoint : POST /api/borrowings/history/:userId

Request Header :
- Authorization : Bearer [Admin Access Token]

Response Body (Success) :

```json
{
  "data": {
    "booksTotal": "number",
    "borrowedTotal": "number",
    "averageBorrowedBooksPerMonth": "number",
    "notReturnedCount": "number"
  }
}
```

Response Body (Failed) :

```json
{
  "error" : "Unauthorized"
}
```