| №  | Method | Scenario                                                      | Test data                                          | Expected Result      |
|----|--------|---------------------------------------------------------------|----------------------------------------------------|----------------------|
| 1  | PUT    | Check received order info with correct orderID and api_key    | oderId = { 1 .. 10 } && api_key = { 16-digit }     | 200: Success         |
| 2  | PUT    | Check received order info with incorrect api_key              | api_key = { non-16-digit } \|\| invalid \|\| empty | 401: Unauthorized    |
| 3  | PUT    | Check received order info with empty request body             | requestBody = {}                              | 404: Order not found |
| 4  | DELETE | Check deleted order info with correct orderID and api_key     | oderId = { 1 .. 10 } && api_key = { 16-digit }     | 204: Success         |
| 5  | DELETE | Check deleted order info with incorrect api_key               | api_key = { non-16-digit } \|\| invalid \|\| empty | 401: Unauthorized    |
| 6  | GET    | Check user login status with correct username and password    | username = { string} && password = { string }      | 200: Success         |
| 7  | GET    | Check user login status with missing username or/and password | username = empty \|\| password = { string }        | 500: Error           |
