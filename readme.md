# DevConnect API

A comprehensive REST API for developer networking and profile management, built with Node.js and Express.js.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Utility Services](#utility-services)
- [Request/Response Examples](#requestresponse-examples)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## 🚀 Overview

DevConnect API provides a robust backend solution for developer networking platforms. It offers secure authentication, comprehensive user profile management, and utility services like OTP verification for password recovery.

## ✨ Features

- **Secure Authentication**: JWT-based login/logout system
- **Comprehensive User Profiles**: Support for skills, education, experience, certifications
- **File Upload Support**: Profile pictures and resume uploads
- **Password Management**: Reset and recovery functionality with OTP verification
- **Social Integration**: LinkedIn and GitHub profile linking
- **RESTful Architecture**: Clean, predictable API design

## 🛠 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Base URL

```
http://localhost:3000/devconnect
```

## 📡 API Endpoints

### Authentication

#### Sign Up
Create a new user account.

```http
POST /auth/sign-up
```

**Required Fields:** `email`, `name`, `password`, `mobile`

#### Login
Authenticate an existing user.

```http
POST /auth/login
```

**Required Fields:** `email`, `password`

#### Logout
Terminate the current user session.

```http
POST /auth/logout
```

**Authentication:** Required

---

### User Management

#### Delete User Account
Permanently delete a user account.

```http
DELETE /user/delete
```

**Required Fields:** `email`, `password`

#### Reset Password
Change password for authenticated users.

```http
PATCH /user/reset-password
```

**Required Fields:** `oldpassword`, `newpassword`
**Authentication:** Required

#### Set New Password (Forgot Password)
Set a new password using reset token from OTP verification.

```http
PATCH /user/set-new-password
```

**Required Fields:** `resetToken`, `newPassword`

#### Update User Profile
Update user profile information and upload files.

```http
PATCH /user/update-user
```

**Authentication:** Required
**Content-Type:** `multipart/form-data` (for file uploads) or `application/json`

**Optional Fields:**
- `name` - Full name
- `mobile` - Phone number with country code
- `bio` - Professional bio
- `dob` - Date of birth
- `designation` - Job title
- `profilePicture` - Profile image file
- `location` - Address information
- `socialLinks` - GitHub, LinkedIn profiles
- `skills` - Technical skills array
- `education` - Educational background
- `experience` - Work experience
- `resume` - Resume file upload
- `certification` - Professional certifications

---

### Utility Services

#### Send OTP
Send verification code to user's email for password recovery.

```http
POST /otp/send-otp
```

**Required Fields:** `email`

#### Verify OTP
Verify the OTP and receive reset token.

```http
POST /otp/verify-otp
```

**Required Fields:** `email`, `otp`

## 📝 Request/Response Examples

### User Registration

**Request:**
```json
{
  "email": "john.doe@example.com",
  "name": "John Doe",
  "password": "SecurePass123!",
  "mobile": "9876543210"
}
```

**Response:**
```json
{
  "responseCode": 201,
  "status": "success",
  "message": "John Doe User created Successfully",
  "data": {
    "email": "john.doe@example.com",
    "name": "John Doe"
  }
}
```

### Profile Update

**Request:**
```json
{
  "name": "John Doe",
  "bio": "Full-stack developer passionate about building scalable applications",
  "designation": "Senior Software Engineer",
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "location": {
    "country": "India",
    "state": "Karnataka",
    "city": "Bangalore"
  },
  "socialLinks": [
    {
      "platform": "GitHub",
      "url": "https://github.com/johndoe"
    },
    {
      "platform": "LinkedIn", 
      "url": "https://linkedin.com/in/johndoe"
    }
  ],
  "experience": [
    {
      "position": "Senior Software Engineer",
      "company": "Tech Solutions Inc",
      "startDate": "2022-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T00:00:00.000Z",
      "description": "Led development of microservices architecture and mentored junior developers."
    }
  ]
}
```

### OTP Verification

**Request:**
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "OTP verified successfully. Use the provided token to set a new password.",
  "data": {
    "token": "4a62cfb1dcce6447c75fd810d6314b4ec620d392cc3353f21263479a347bd2d8",
    "contact": "john.doe@example.com"
  }
}
```

## ⚠️ Error Handling

The API returns consistent error responses with appropriate HTTP status codes:

```json
{
  "responseCode": 400,
  "status": "error",
  "message": "Validation error: Email is required"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in your requests:

```http
Authorization: Bearer <your-jwt-token>
```

## 📁 File Uploads

For profile pictures and resume uploads, use `multipart/form-data`:

```javascript
const formData = new FormData();
formData.append('profilePicture', file);
formData.append('name', 'John Doe');
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for the developer community**
