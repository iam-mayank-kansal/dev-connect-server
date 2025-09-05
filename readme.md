## API DOCUMENTATION

---

## AUTH API

## SIGNUP

--> METHOD : POST
--> URL: http://localhost:3000/devconnect/auth/sign-up

--> Required Fields = [email,name,password,mobile]

--> REQUEST BODY :

{
"email":"kartikwork@gmail.com",
"name":"Kartik Bhatt",
"password":"Kartik@12345",
"mobile":"9310204975"
}

--> RESPONSE BODY :

{
"responseCode": 201,
"status": "success",
"message": "Kartik Bhatt User created Successfully",
"data": {
"email": "kartikwork@gmail.com",
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
"email":"kartikwork@gmail.com",
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
"email": "kartikwork@gmail.com"
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
"email":"kartikwork@gmail.com",
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

--> Required Fields = [ resetToken,newPassword]

--> REQUEST BODY :

request : {
"resetToken":"852074e5c5e70bc364cf2e3ae244ce0e88da4133de1afffd10430f66151d7c6d",
"newPassword":"Mayank@123"
}

--> RESPONSE BODY :

{
"responseCode": 201,
"status": "success",
"message": "Kartik Bhatt user password reseted successfully"
}

---

## UPDATE USER

--> METHOD : PATCH
--> URL: http://localhost:3000/devconnect/user/update-user

--> Required Fields = 'no required fields'

--> Allowed Fields = ["name","mobile","bio","dob","designation","profilePicture","location","socialLinks","skills","education","experience","resume","certification",]

--> REQUEST BODY :

:: NOTE : To upload profile pic and resume -- send body as form-data for these fields

![Screenshot](assets/form-data.png)

{
"name": "Kartikey Bhatt",
"mobile": {
"countryCode": "+91",
"number": "9123456789"
},
"bio": "Backend developer passionate about building scalable APIs ⚡",
"dob": "2003-05-06T00:00:00.000Z",
"designation": "Backend Engineer",
"location": {
"country": "India",
"state": "Uttarakhand",
"city": "Dehradun",
"address": "45 IT Park Road"
},
"socialLinks": [
{
"platform": "GitHub",
"url": "https://github.com/kartikeybhatt"
},
{
"platform": "LinkedIn",
"url": "https://linkedin.com/in/kartikeybhatt"
}
],
"skills": [
"Node.js",
"Express.js",
"MongoDB",
"Docker",
"Kubernetes"
],
"education": [
{
"degree": "B.Sc Computer Science",
"institution": "Delhi University",
"startDate": "2020-08-01T00:00:00.000Z",
"endDate": "2023-05-01T00:00:00.000Z"
}
],
    "experience": [
        {
            "position": "Backend Developer Intern",
            "company": "TechNova Solutions",
            "startDate": "2023-06-01T00:00:00.000Z",
            "endDate": "2024-03-01T00:00:00.000Z",
            "description": "Worked on REST APIs, authentication, and containerized services using Docker."
        }
    ],
    "certification": [
        {
            "company": "Google",
            "certificate": "Google Cloud Associate Engineer",
            "issuedBy": "Google",
            "issueDate": "2022-07-15T00:00:00.000Z"
        },
        {
            "company": "Linux Foundation",
            "certificate": "Certified Kubernetes Administrator (CKA)",
            "issuedBy": "CNCF",
            "issueDate": "2024-02-20T00:00:00.000Z"
        }
    ]

}

--> RESPONSE BODY :

{
"responseCode": 201,
"status": "success",
"message": "Kartikey Bhatt user updated successfully",
"data": {
"mobile": {
"countryCode": "+91",
"number": "9123456789"
},
"location": {
"country": "India",
"state": "Uttarakhand",
"city": "Dehradun",
"address": "45 IT Park Road"
},
"_id": "68bb294a15f5f4ef346dce71",
"email": "kartikwork@gmail.com",
"password": "$2b$10$1XaoEp/AUVc3VznriDTB..JaTsKhk8hryCuAJUtRTeYP/T64KPgCm",
"name": "Kartikey Bhatt",
"bio": "Backend developer passionate about building scalable APIs ⚡",
"skills": [
"Node.js",
"Express.js",
"MongoDB",
"Docker",
"Kubernetes"
],
"role": "user",
"education": [
{
"degree": "B.Sc Computer Science",
"institution": "Delhi University",
"startDate": "2020-08-01T00:00:00.000Z",
"endDate": "2023-05-01T00:00:00.000Z"
}
],
"experience": [
{
"position": "Backend Developer Intern",
"company": "TechNova Solutions",
"startDate": "2023-06-01T00:00:00.000Z",
"endDate": "2024-03-01T00:00:00.000Z",
"description": "Worked on REST APIs, authentication, and containerized services using Docker."
}
],
"certification": [
{
"company": "Google",
"certificate": "Google Cloud Associate Engineer",
"issuedBy": "Google",
"issueDate": "2022-07-15T00:00:00.000Z"
},
{
"company": "Linux Foundation",
"certificate": "Certified Kubernetes Administrator (CKA)",
"issuedBy": "CNCF",
"issueDate": "2024-02-20T00:00:00.000Z"
}
],
"socialLinks": [
{
"platform": "GitHub",
"url": "https://github.com/kartikeybhatt"
},
{
"platform": "LinkedIn",
"url": "https://linkedin.com/in/kartikeybhatt"
}
],
"createdAt": "2025-09-05T18:17:46.017Z",
"updatedAt": "2025-09-05T18:19:10.630Z",
"\_\_v": 0,
"age": 22,
"designation": "Backend Engineer",
"dob": "2003-05-06T00:00:00.000Z",
"profilePicture": "DevConnect-user-profilePicture.68bb294a15f5f4ef346dce71.jpg",
"resume": "DevConnect-user-resume.68bb294a15f5f4ef346dce71.pdf"
}
}

---

## Genric API

## SEND OTP

--> METHOD : POST

--> URL: http://localhost:3000/devconnect/otp/send-otp

--> Required Fields = [email]

--> REQUEST BODY :

{
"email":"kartikwork@gmail.com"
}

--> RESPONSE BODY :

{
"responseCode": "200",
"status": "success",
"message": "OTP sent successfully to kartikwork@gmail.com"
}

## VERIFY OTP

--> METHOD : POST

--> URL: http://localhost:3000/devconnect/otp/send-otp

--> Required Fields = [email,otp]

--> REQUEST BODY :

{
"email":"kartikwork@gmail.com",
"otp":"919246"
}

--> RESPONSE BODY :

{
"status": 200,
"message": "OTP verified successfully. Use the provided token to set a new password.",
"data": {
"token": "4a62cfb1dcce6447c75fd810d6314b4ec620d392cc3353f21263479a347bd2d8",
"contact": "kartikwork@gmail.com"
}
}
