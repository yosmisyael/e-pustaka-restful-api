# Category API Spec
The category resource can be managed (action: CREATE, UPDATE, DELETE) by administrator only.
## Add Category

Endpoint : POST /api/categories

Request Header :
- Authorization : Bearer [Access Token]

Request Body :

```json
{
  "name" : "habit"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": "...",
    "name": "habit"
  }
}
```

Response Body (Failed) :

```json
{
  "error" : "Unauthorized"
}
```

## Delete Category

Endpoint : DELETE /api/categories/:categoryId

Response Body (Success) :

```json
{
  "message" : "OK"
}
```

Response Body (Failed) :

```json
{
  "error": "Category not found"
}
```

## Update Category

Endpoint : PATCH /api/categories/:categoryId

Request Header :
- Authorization : Bearer [Access Token]

Request Body :

```json
{
  "name" : "new category name"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": "...",
    "name": "new category name"
  }
}
```

Response Body (Failed) :

```json
{
  "error" : "Unauthorized"
}
```