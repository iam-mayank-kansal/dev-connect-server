## API DOCUMENTATION

---

## AUTH API

## SIGNUP

--> METHOD : POST
--> URL: http://localhost:3000/devconnect/auth/sign-up

--> Required Fields = [email,name,password,mobile]

--> REQUEST BODY :

{
"email":"kartikworksss@gmail.com",
"name":"Kartik Bhatt",
"password":"Kartik@12345",
"mobile":"9310605985"
}

--> RESPONSE BODY :

{
"responseCode": 201,
"status": "success",
"message": "Kartik Bhatt User created Successfully",
"data": {
"email": "kartikworksss@gmail.com",
"password": "$2b$10$p/1iXs7UZk5NAQHwsw/Ev.WU8wGfMieOU7QcqVIvjB65Vf6pc7Y4i",
"name": "Kartik Bhatt"
}
}

---

## LOGIN

--> METHOD : POST
--> URL: http://localhost:3000/devconnect/auth/login

--> Required Fields = [email,password]

--> REQUEST BODY :

{
"email":"kartikworksss@gmail.com",
"password":"Kartik@12345"
}

--> RESPONSE BODY :

{
"responseCode": 201,
"status": "success",
"message": "Kartik Bhatt user logged in successfully",
"data": {
"\_id": "68ba9038aeeb2a6467e6be76",
"name": "Kartik Bhatt",
"email": "kartikworksss@gmail.com"
}
}

---

## LOGOUT

--> METHOD : POST
--> URL: http://localhost:3000/devconnect/auth/logout

--> REQUEST BODY : NOT REQUIRED

--> RESPONSE BODY :

{
"responseCode": 201,
"status": "success",
"message": "user logged out successfully"
}

---

## USER API

## DELETE USER

--> METHOD : DELETE
--> URL: http://localhost:3000/devconnect/user/delete

--> Required Fields = [email,password]

--> REQUEST BODY :

{
"email":"kartikworksss@gmail.com",
"password":"Kartik@12345"
}

--> RESPONSE BODY :

{
"responseCode": 201,
"status": "success",
"message": "Kartik Bhatt user deleted successfully"
}

---

## RESET USER PASSWORD

--> METHOD : PATCH
--> URL: http://localhost:3000/devconnect/user/reset-password

--> Required Fields = [oldpassword,newpassword]

--> REQUEST BODY :

{
"oldpassword":"Kartik@12345",
"newpassword":"Raj@1234567new"
}

--> RESPONSE BODY :

{
"responseCode": 201,
"status": "success",
"message": "Kartik Bhatt user password updated successfully"
}

---

## FORGET USER PASSWORD

--> METHOD : PATCH
--> URL: http://localhost:3000/devconnect/user/set-new-password

--> Required Fields = [ ]

--> REQUEST BODY :

--> RESPONSE BODY :

---

## UPDATE USER

--> METHOD : PATCH
--> URL: http://localhost:3000/devconnect/user/update-user

--> Required Fields = 'no required fields'

--> Allowed Fields = const allowedFields = ["name","mobile","bio","dob","designation","profilePicture","location","socialLinks","skills","education","experience","resume","certification",];

--> REQUEST BODY :

--> RESPONSE BODY :
