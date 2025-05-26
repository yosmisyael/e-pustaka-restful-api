# Borrowing Book API Spec

## Add Borrow Book Record

Endpoint : POST /api/borrowings

Request Header :
- Authorization : Bearer [Access Token]

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
- Authorization : Bearer [Access Token]

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