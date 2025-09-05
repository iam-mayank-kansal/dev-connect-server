async function failureTemplate(scode, message) {
  const template = {
    responseCode: scode,
    status: "failure",
    message: message,
  };
  return template;
}
async function successTemplate(scode, message) {
  const template = {
    responseCode: scode,
    status: "success",
    message: message,
  };
  return template;
}

async function registerUserTemplate(name, email, password, mobile) {
  const template = {
    responseCode: "201",
    status: "success",
    message: `${name} User created Successfully`,
    data: {
      name: name,
      email: email,
      pasword: password,
      mobile: mobile,
    },
  };
  return template;
}

//USERS MODULE -->
async function delteUserTemplate(name) {
  const template = {
    responseCode: "201",
    status: "success",
    message: `${name} user deleted successfully`,
  };
  return template;
}

async function resetUserPasswordTemplate(name) {
  const template = {
    responseCode: "201",
    status: "success",
    message: `${name} user password updated successfully`,
  };
  return template;
}

//LOGIN
async function loginUserTemplate(checkUser) {
  const template = {
    responseCode: "201",
    status: "success",
    message: `${checkUser.name} user logged in successfully`,
    data: checkUser,
  };
  return template;
}
//LOGOUT
async function logoutUserTemplate() {
  const template = {
    responseCode: "201",
    status: "success",
    message: `user logged out successfully`,
  };
  return template;
}

async function updateUserTemplate(name, updatedUser) {
  const template = {
    responseCode: "201",
    status: "success",
    message: `${name} user updated in successfully`,
    data: updatedUser,
  };
  return template;
}

async function displayUserTemplate(findUser) {
  const template = {
    responseCode: "201",
    status: "success",
    data: findUser,
  };
  return template;
}

// OTP MODULE
async function otpSentTemplate(destination) {
  return {
    responseCode: "200",
    status: "success",
    message: `OTP sent successfully to ${destination}`,
  };
}

module.exports = {
  failureTemplate,
  successTemplate,
  registerUserTemplate,
  delteUserTemplate,
  resetUserPasswordTemplate,
  loginUserTemplate,
  logoutUserTemplate,
  updateUserTemplate,
  displayUserTemplate,
  otpSentTemplate,
};
