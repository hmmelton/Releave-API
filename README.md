# Releave-API

## Releave
Releave is an application that crowdsources finding restrooms in crowded cities.  Users upload restroom locations, which then become visible to all users.  These restrooms are either:

1. Open to the public
1. Privately-owned, but available for use

The latter may require the purchase of a good or service for access.  The status of a restroom as either public or privately-owned is visible to the user.

## Releave API
This RESTful API is built with Node.js, Express.js, and Mongoose.  It provides the Releave iOS and Android applications with access to the database of restrooms and users.  All requests must have the correct authorization token, and are checked for their respective correct query parameters, with all error cases handled.

## Future Plans
Later versions of this application will be monetized, by charging users to view the ratings of individual restrooms.  The purpose of this is to help users not only find a nearby restroom, but one that is clean.  This will likely be implemented through Stripe.
