# Intro

This file is going to take you through all the end points in this API.

-  This API return all of it's data in **_applicaton/json_** format
-  **Note** that each endpoin start with `/api`.
-  There is **two** versions of each end point. When using the API to a native app you have to follow the `/api` with `/native`.
-  So, every endpoint should start with `/api` for _Web_ Apps and with `/api/native` for _Native_ Apps.
-  All of the end point ( except `/items/*`, `/user/auth/google` and `/user/auth/facebook` ) require sending the `sessionToken` in an Authorization header like:

   ```
   Authorization: Bearer sessionToken
   ```

-  All end points will return the following on `failure`:

   ```
   {
      "message": "error message"
   }
   ```

# End Points

## **Items**

-  GET `/items/list?section=&type=&page=`

   Get all specified items by _section_ and **optionally** _type_.

   **section** and **page** are required. _page_ is used for pagenating. It indecate the page number and it has to be an integer.
   This endpoint return only 12 items and then _nextCursor_ indecate the next page to fetch (you should start with 1).

   **section** could only be _men_, _women_ and _kids_.

   **type** could only be _jeans_, _shirts_, _coats_, _dresses_ or _skirts_. Note that _dresses_ and _skirts_ are only for _women_ and _kids_ sections.

   The endpoint will return the following on `Success`:

   ```
   {
      nextCursor: 2,
      items: [
         {
            "id": 1,
            "name": "item name",
            "price": 00.00,
            "image_path": "path/to/image",
            "type": "jeans"
         },
         ...
      ]
   }
   ```

-  GET `/items/details/:id`

   Get item with the specific _id_.

   The endpoint will return the following on `Success`:

      ```
      {
         item: {
            "name": "item name", 
            "price": 00.00, 
            "section": "men", 
            "type": "shirts"
         },
         itemDetails: [
            {
               "stock": 1,
               "size": "xl",
               "color": "red",
               "id": 1
            },
            ...
            // note that each item in the array is an instance of the item with a specific color and sizes. The front end developer should show it in a proper way
         ],
         images: [
            "/path/to/image",
            ... // 3 images
         ]
      }
      ```

-  GET `/items/search?term=&page=`

   Seacrch a specific _term_.

   **page** are required. _page_ is used for pagenating. It indecate the page number and it has to be an integer.
   This endpoint return only 12 items and then _nextCursor_ indecate the next page to fetch (you should start with 1).

   **term** could be any search term the user write.

   The endpoint will return the following on `Success`:

      ```
      {
         nextCursor: 2,
         items: [
            {
               "id": 1,
               "name": "item name",
               "price": 00.00,
               "image_path": "path/to/image",
               "section": "women",
               "type": "jeans"
            },
            ...
         ]
      }
      ```

## **User**

-  POST `/user/auth/google` and `/user/auth/facebook`

   body:

   ```
      {
         "access_token": "access-token-string"
      }
   ```

   This end point is used for users to sign up or log in with their google account.

   The front-end have to show the user a consent screen (google or facebook) to log in or sign in and send the _access_token_ returned from the server.

   The endpoint will return the following on `Success`:

      ```
      {
         "sessionToken": "session token string",
         "name": "user name",
         "email": "user email or null",
         "phone_number": "user phone number or null", // either email or phone number or both will be returned
         "cartItemsCount": 3
      }
      ```

-  POST `/user/info/set`

   body:

   ```
   {
      "country": "country of the user",
      "city": "city of the user",
      "district": "district of the user",
      "nearestPoI": "nearest point of intrest to the user",
      "phone_number": "user phone number"
   }
   ```

   This end point is used to set user info so the order can reach him.

   The endpoint will return the following on `Success`:

   ```
   {
      "message": "Location and phone number saved"
   }
   ```

-  GET `/user/info/get`

   This end point is used to check if user info are still the same or if he even entered this data previouslly when he makes an order.

   If the user data exsist ( `Success` ), the endpoint will return the following:

   ```
   {
      "name": "user name",
      "email": "user email",
      "phone_number": "user phone number",
      "country": "country of the user",
      "city": "city of the user",
      "district": "district of the user",
      "nearestPoI": "nearest point of intrest to the user",
      "cartItemsCount": 3
   }
   ```

## **Cart**

-  POST `/cart/add`

   body:

   ```
   [
      {
         "item_details_id": 1,
         "item_count": 1
      },
      ...
   ]
   ```

   This end point is user to add items to the cart.

   The endpoint will return the following on `Success`:

      ```
      {
         "sessionToken": "new sessionToken",
         "message": "cart item added"
      }
      ```

-  GET `/cart/list`

   This end point is used to list the cart items.

   The endpoint will return the following on `Success`:

      ```
      [
          {
            "id": "uuid of the cart",
            "item_count": 2,
            "total_price": 30.50,
            "itemsDetail": {
               "id": 34,
               "size": "xl",
               "color": "blue",
               "stock": 5,
               "item": {
                  "id": 4,
                  "name": "item name",
                  "price": 15.25,
                  "image_path": "/path/to/image"
               }
            }
         },
         ...
      ]
      ```

-  PUT `/cart/update`

   body:

   ```
   {
      "id": "uuid of the cart item",
      "item_details_id": 234,
      "item_count": 3
   }
   ```

   This end point is used to update cart items.

   The endpoint will return the following on `Success`:

      ```
      {
         "sessionToken": "new sessionToken",
         "message": "updated successfully"
      }
      ```

-  DELETE `/cart/remove/:id`

   This end point is used to delete a specific cart items.

   The endpoint will return the following on `Success`:

      ```
      {
         "sessionToken": "new sessionToken",
         "message": "Cart item deleted"
      }
      ```

## **Order**

-  POST `/order/make`

   body:

   ```
   {
      "payment_method": "credit-card", // or cash
      "credit_card": "credit-card-number"     // or null,
   }
   ```

   This end point is used to make an order.

   The endpoint will return the following on `Success`:

      ```
      {
         "sessionToken": "new sessionToken",
         "message": "order made successfully"
      }
      ```

-  GET `/order/list`

   This end point is used to get all orders that the user made.

   The endpoint will return the following on `Success`:

   ```
   [
      {
         "id": 12,
         "payment_method": "cash",
         "credit_card": null,
         "order_price": 100.25,
         "served": false,
         "order_date": "2023-05-04T08:56:12.000Z"
      },
      ...
   ]
   ```

-  GET `/order/details/:id`

   This end point is used to get a specific order details.
   The end point is going to return all items of that order.

   The endpoint will return the following on `Success`:

   ```
   [
      {
         "id": "uuid",
         "item_count": 2,
         "total_price": 69.98,
         "itemsDetail": {
            "size": "xl",
            "color": "blue",
            "item": {
               "id": 2,
               "name": "item name",
               "price": 15.25,
               "section": "men",
               "type": "shirts"
            }
         },
         "images": [
            { "path": "path/to/image" },
            ...
         ]
      },
      ...
   ]
   ```

## **Admin**

-  GET `/admin/check`

   This end point is used to check if user is allowed to see and use admins end points.

   The endpoint will return the following on `Success`:

   ```
   {
      "sessionToken": "new sessionToken",
      "roles": "orders" // or uploading or finance
   }
   ```

-  GET `/admin/list/served?from&to`

   _from_ and _to_ are required while _section_ and _type_ are not.

   _from_ is the date where the search starts.

   _to_ is the data where the search ends.

   Both _from_ and _to_ have to be in the following format: `2023-5-4`

   This end point is used to serve the served items to the finance admin to see the sales and calculate profit.

   The endpoint will return the following on `Success`:

   ```
   [
      {
         "id": 1
         "payment_method": "credit-card",
         "credit_card": "credit card id",
         "order_price": 20.50,
         "order_date": "2023-05-05T17:55:57.000Z",
         "user": {
            "name": "user name",
            "email": "user email",
            "phone": "user phone number",
            "country": "user order country",
            "city": "user order city",
         },
         orderItems: [
            {
               "item_count": 12,
               "total_price": "cash",
               "itemsDetail": {
                  "size": "xl",
                  "color": "blue",
                  "item": {
                     "id": 1,
                     "name": "item name",
                     "price": 15.25,
                     "section": "men",
                     "type": "shirts"
                  }
               }
            },
            ...
         ]
      },
      ...
   ]
   ```

-  GET `/admin/list/pending?country&city`

   This end point is used to list pending orders that have not been served yet to the order admins.

   The endpoint will return the following on `Success`:

   ```
   [
      {
         "id": 1
         "payment_method": "credit-card",
         "credit_card": "credit card id",
         "order_price": 20.50,
         "order_date": "2023-05-05T17:55:57.000Z",
         "user": {
            "name": "user name",
            "email": "user email",
            "phone": "user phone number",
            "country": "user order country",
            "city": "user order city",
            "district": "user order district",
            "nearestPoI": "user order nearest point of intrest"
         },
         orderItems: [
            {
               "item_count": 12,
               "total_price": "cash",
               "itemsDetail": {
                  "size": "xl",
                  "color": "blue",
                  "item": {
                     "id": 12,
                     "name": "item name",
                     "price": 15.25,
                     "section": "men",
                     "type": "shirts"
                  }
               }
            },
            ...
         ]
      },
      ...
   ]
   ```

-  POST `/admin/item/add`

   This end point is user to upload new items with their images.

   It is different from the other because it accepts `multipart/form-data` instead of `application/json`. So, you **must** send both the images (three images for now) and the item data together in one POST request where:

   ```
   Content-Type: multipart/form-data
   ```

   **Note** that if you your enviroment (browser or native app) can set this header automaticlly you can skip setting it your self.

   The body is going to contain the files and the data as json.

   You have to name the images part of the the body _images_ and the other data sent as json are named _json_.

   The json part is like the following:

   ```
   {
      "name": "item name",
      "price": 20.00,
      "section": "men",
      "type": "coats",
      "details": [
         {
            "color": "red",
            "sizes": [
               {
                  "size": "xl",
                  "stock": 3
               },
               ...
            ]
         },
         ...
      ]
   }
   ```

   The endpoint will return the following on `Success`:

   ```
   {
      "message": "Item added successfully.",
      "sessionToken": "new session token"
   }
   ```

-  PUT `/admin/item/update`

   body:

   ```
   {
      "id": 1,
      "details": [
         {
            "color": "red",
            "sizes": [ 
               {
                  "size": "XL",
                  "count": 5
               },
               ...
            ]
         },
         ...
      ]
   }
   ```

   This end point is used to update the stock of an item instance or add a size that did not exsist previouslly. 

   *count* is the number that is going to be added of that item instance.

   The endpoint will return the following on `Success`:

   ```
   {
      "message": "Updated",
      "sessionToken": "new session token"
   }
   ```
