# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "name" : "fullname",
  "email" : "fullname@pens.ac.id",
  "password" : "password"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "message" : "Registration success, now please login with your email."
  }
}
```

Response Body (Failed) :

```json
{
  "error" : "Email Email must be part of EEPIS domain"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "email" : "test@pens.ac.id",
  "password" : "password"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "accessToken" : "...",
    "refreshToken" : "..."
  }
}
```

Response Body (Failed) :

```json
{
  "error": "Username or password wrong"
}
```

## Update User Password

Endpoint : PATCH /api/users/current

Request Header :
- Authorization : Bearer [User Access Token]

Request Body :

```json
{
  "currentPassword" : "password",
  "newPassword" : "password",
  "confirmPassword" : "password"
}
```

Response Body (Success) :

```json
{
  "data": {
    "message": "Your password has been successfully reset! Please log in again using your new credentials"
  }
}
```

Response Body (Failed) :

```json
{
  "error" : "Unauthorized"
}
```

## Regenerate Access Token

Endpoint : POST /api/users/current/token

Request Body :

```json
{
  "refreshToken" : "..."
}
```
Response Body (Success) :

```json
{
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Response Body (Failed) :

```json
{
  "error" : "Invalid refresh token"
}
```

## Logout User

Endpoint : DELETE /api/users/current

Request Header :
- Authorization : Bearer [User Access Token]

Response Body (Success) :

```json
{
  "data": {
    "message": "OK"
  }
}
```

Response Body (Failed) :

```json
{
  "error" : "Unauthorized"
}
```