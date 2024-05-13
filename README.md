# Nodejs Programmeren 4 Express server

Gebruikers kunnen zich registreren in het systeem. Daarna kan diegene een of meer maaltijden aanbieden. Een maaltijd wordt aangeboden op een datum en tijdstip, en heeft een aantal eigenschappen, zoals een beschrijving, een afbeelding, en informatie over het al dan niet vegetarisch of veganistisch zijn. Andere gebruikers die dat willen kunnen zich aanmelden om deel te nemen aan de maaltijd, tegen een geringe vergoeding.

## Installing

To install, run `npm install`.

## Running

To run, type `npm start`.

## Run the tests
To run the tests, type npm test.

## How to use

use a program like postman to get the data from the database through the api.

## Deployed webserver
[Online-webserver](https://ruben-share-a-meal.azurewebsites.net/)

## Use Cases

### UC-101: Login

- **Method:** POST
- **Endpoint:** `/api/login`
- **Parameters:**
  - emailAddress
  - password
- **Response:** User data and assigned token

### UC-102: Retrieving System Information

- **Method:** GET
- **Endpoint:** `/api/info`
- **Response:** Basic information

### UC-201: Registering as a New User

- **Method:** POST
- **Endpoint:** `/api/user`
- **Parameters:** All mandatory user data fields
- **Response:** User data and assigned userId

### UC-202: Retrieving Overview of Users

- **Method:** GET
- **Endpoint:** `/api/user`
- **Response:** List of user data

### UC-202: Retrieving Overview of Users (Filtered)

- **Method:** GET
- **Endpoint:** `/api/user?field1=:value1&field2=:value2`
- **Response:** List of user data filtered by field1 and field2

### UC-203: Retrieving User Profile

- **Method:** GET
- **Endpoint:** `/api/user/profile`
- **Response:** User data and userId

### UC-204: Retrieving User Data by ID

- **Method:** GET
- **Endpoint:** `/api/user/:userId`
- **Response:** User data (with password if owner) by userId

### UC-205: Modifying User Data

- **Method:** PUT
- **Endpoint:** `/api/user/:userId`
- **Parameters:** All mandatory fields + updated user data
- **Response:** Entire updated user data

### UC-206: Deleting User

- **Method:** DELETE
- **Endpoint:** `/api/user/:userId`
- **Response:** Message confirming user deletion

### UC-301: Adding Meals

- **Method:** POST
- **Endpoint:** `/api/meal`
- **Parameters:** All mandatory meal fields (user id comes from header)
- **Response:** Entire meal data including assigned mealId

### UC-303: Retrieving All Meals

- **Method:** GET
- **Endpoint:** `/api/meal`
- **Response:** List of all meals (excluding cook and participants' passwords)

### UC-304: Retrieving Meal by ID

- **Method:** GET
- **Endpoint:** `/api/meal/:mealId`
- **Response:** Entire meal information by mealId (excluding cook and participants' passwords)

### UC-305: Deleting Meal

- **Method:** DELETE
- **Endpoint:** `/api/meal/:mealId`
- **Response:** Message confirming meal deletion
