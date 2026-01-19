## notification system

1. To send the notifications --> calling a helper fn (handleNotification) at the time of (send-connection request) and (accept-connection request)

2. created /get-notification to list all notifications related to the current logged in user

3. created /read-notification to change the status of notification from unread to read as we will pass a key in our request body like ({"key":"send"})

4. created notification collection to store all the notifications with proper indexing to query the result fast
