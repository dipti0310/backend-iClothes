# Backened-iClothes


**APIs for authentication**  <br/>

* Create a new user <br/>
POST: /api/auth/create/user

* get user details <br/>
GET: /api/auth/getuser

* login a user using auth token <br/>
POST: /api/auth/login

 
**Admins can create, read ,update and delete any entry** <br/>
APIs for Admin <br/>

APIs for basic CRUD operation <br/>

* Create a new cloth entry <br/>
POST: /api/clothes/addcloth <br/>

* Get all the clothes <br/>
GET: /api/clothes/fetchallclothes <br/>
 
* Update an exsiting entry <br/>
PUT: /api/clothes/updatecloth/:id <br/>
 
* Delete an entry <br/>
DELETE: /api/clothes/deletecloth/:id <br/>


**User can only read** <br/>
APIs for Any User <br/>

* Get all the clothes <br/>
GET: /api/clothes/fetchallclothes <br/>
 
