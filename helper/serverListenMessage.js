function serverListenMessage() {
  // Using standard ANSI escape codes for color without needing the 'chalk' library
  const cyan = "\x1b[36m";
  const yellow = "\x1b[33m";
  const green = "\x1b[32m";
  const magenta = "\x1b[35m";
  const blue = "\x1b[34m";
  const reset = "\x1b[0m";
  const bold = "\x1b[1m";

  console.log(`${cyan}${bold}====================================${reset}`);
  console.log(`${yellow}${bold}🚀  DEV CONNECT SERVER STARTED  🚀${reset}`);
  console.log(`${green}${bold}Project: Dev Connect${reset}`);
  console.log(
    `${magenta}${bold}Contributors: Mayank Kansal & Kartik Bhatt${reset}`
  );
  console.log(
    `${blue}Server running at: ${process.env.ORIGIN_URL || "http://localhost"}${reset}`
  );
  console.log(`${cyan}${bold}====================================${reset}`);
}

module.exports = serverListenMessage;
