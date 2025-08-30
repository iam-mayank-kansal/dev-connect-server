async function failureTemplate(scode, message) {
  const template = {
    responseCode: scode,
    status: "failure",
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

async function listUserTemplate(userList) {
  const template = {
    responseCode: "201",
    status: "success",
    message: "users listed successfully",
    data: userList,
  };
  return template;
}

async function createTaskTemplate() {
  const template = {
    responseCode: "201",
    status: "success",
    message: "task created successfully",
  };
  return template;
}

async function listTaskTemplate(taskList) {
  const template = {
    responseCode: "201",
    status: "success",
    message: "Tasks listed successfully",
    data: taskList,
  };
  return template;
}

async function assignTaskTemplate(title, assigned_to, assigned_by) {
  const template = {
    responseCode: "201",
    status: "success",
    message: "Tasks assigned successfully",
    data: {
      title: title,
      assigned_to: assigned_to,
      assigned_by: assigned_by,
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
    message: `${checkUser.name} user logged in  successfully`,
    data: checkUser,
  };
  return template;
}

module.exports = {
  failureTemplate,
  registerUserTemplate,
  listUserTemplate,
  createTaskTemplate,
  listTaskTemplate,
  assignTaskTemplate,
  delteUserTemplate,
  resetUserPasswordTemplate,
  loginUserTemplate,
};
