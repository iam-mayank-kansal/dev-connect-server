## user connection

## create-connection

## validations

Check if toUserId and status are present in request body
Validate toUserId as a valid MongoDB ObjectId
Verify that the user with toUserId exists in DB
Ensure status is in COLLECTION_STATUS
Explicitly block status = "accepted"
Prevent duplicate "interested" request between same users
Prevent sending connection request to ourself only
Log success if all validations pass

## middleware

insert the record if it passes all the validations configured
return the usename from userids in api response using aggregation pipelines

## accept-connection

## validations

Check if toUserId and status are present in request body
Validate toUserId as a valid MongoDB ObjectId
Verify that the user with toUserId exists in DB
Ensure status is in COLLECTION_STATUS
Explicitly block status other than = "accepted" || "rejected"
Prevent duplicate "accepted" || "rejected" request between same users
Prevent accepting || rejecting connection request to ourself only
Log success if all validations pass

## middleware

insert the record if it passes all the validations configured
return the usename from userids in api response using aggregation pipelines

## list-connection

## validations

Check if status is present in request body
Verify that the user with toUserId exists in DB
Ensure status is in COLLECTION_STATUS
Explicitly block status other than = "accepted" || "blocked" || "interested"
Log success if all validations pass

## middleware

list the record if it passes all the validations configured

