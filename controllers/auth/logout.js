function logout(req, res) {
  res.clearCookie("devconnect-auth-token");
  res.status(200).json({ message: "Logged out successfully" });
}

module.exports = logout;
