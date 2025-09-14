## user connection


## create-connection

## validations 
Check if toUserId and status are present in request body
Validate toUserId as a valid MongoDB ObjectId
Verify that the user with toUserId exists in DB
Ensure status is in COLLECTION_STATUS
Explicitly block status = "accepted"
Prevent duplicate "interested" request between same users
Log success if all validations pass


## middleware
insert the record if it passes all the validations configured