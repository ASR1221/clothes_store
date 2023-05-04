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

-  GET `/items/list?section=&type=`

   Get all specified items by _section_ and **optionally** _type_.

   **section** could only be _men_, _women_ and _kids_.

   **type** could only be _jeans_, _shirts_, _coats_, _dresses_ or _skirts_. Note that _dresses_ and _skirts_ are only for _women_ and _kids_ sections.

   The endpoint will return the following on `Success`:

   ```
   [
      {
         "id": 1,
         "name": "item name",
         "price": 00.00,
         "image_path": "path/to/image",
         "type": "jeans"
      },
      ...
   ]
   ```

-  GET `/items/details/:id`

   Get item with the specific _id_.

   The endpoint will return the following on `Success`:

      ```
      {
         itemsDetails: [
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
            {
               "path": "path/to/image"
            },
            ... // 3 images
         ]
      }
      ```

-  GET `/items/search?term=`

   Seacrch a specific _term_.

   **term** could be any search term the user write.

   The endpoint will return the following on `Success`:

      ```
      [
         {
            "id": 1,
            "name": "item name",
            "price": 00.00,
            "image_path": "path/to/image",
            "type": "jeans"
         },
         ...
      ]
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

   The front-end have to show the user a consent screen by taking the user to:

   `https://accounts.google.com/signin/oauth/oauthchooseaccount?include_granted_scopes=true&client_id=450145178762-ve8m4krlq5cc02rp54ipkmtktlg58p11.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Flogin%2Fcomplete&response_type=token&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&service=lso&o2v=2&flowName=GeneralOAuthFlow`

   And send the _access_token_ returned in the hash of the _redirect_url_ specified in the google auth url mentioned.

   **Note** that _redirect_url_ is the url where you want the user to wain while you send the _access_token_ and it has to be set in the google developer console for the app specificlly.

   The endpoint will return the following on `Success`:

      ```
      {
         "sessionToken": "session token string",
         "name": "user name",
         "email": "user email or null",
         "phone_number": "user phone number or null",
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

   The endpoint will return the following on `Success`:

   If the user data does not exsist:

   ```
   {
      "message": "The user does not have this info."
   }
   ```

   If the user data exsist:

   ```
   {
      "country": "country of the user",
      "city": "city of the user",
      "district": "district of the user",
      "nearestPoI": "nearest point of intrest to the user",
      "phone_number": "user phone number"
   }
   ```

## **Cart**

-  POST `/cart/add`

   body:

   ```
   {
      "item_details_id": 1,
      "item_count": 1
   }
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
            "item_details_id": 232,
            "itemsDetail": {
               "size": "xl",
               "color": "blue",
               "stock": 5,
               "item": {
                  "name": "item name",
                  "price": 15.25,
                  "section": "men",
                  "type": "shirts"
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

-  GET `/order/get`

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
         "createdAt": "2023-05-04T08:56:12.000Z"
      },
      ...
   ]
   ```

-  GET `/order/get/:id`

   This end point is used to get a specific order details.
   The end point is going to return all items of that order.

   The endpoint will return the following on `Success`:

   ```
   [
      {
         "id": "uuid",
         "item_count": 2,
         "total_price": 69.98,
         "ItemsDetails": {
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
      "role": "orders" // or uploading or finance
   }
   ```

-  GET `/admin/list/served?from&to&section&type`

   _from_ and _to_ are required while _section_ and _type_ are not.

   _from_ is the date where the search starts.

   _to_ is the data where the search ends.

   _section_ could be men, women or kids.

   _type_ could be any type listed in the top of this file like shirts or jeans.

   This end point is used to serve the served items to the finance admin to see the sales and calculate profit.

   The endpoint will return the following on `Success`:

   ```
   [
      {
         "item_count": 12,
         "total_price": 68.98,
         "itemsDetail": {
            "size": "XL",
            "color": "blue",
            "Item": {
               "id": 2,
               "name": "item name",
               "price": 15.25,
               "section": "men",
               "type": "shirts"
            }
         },
         "order": {
            "payment_method": "credit-card",
            "credit_card": "credit card id",
            "order_price": 20.50,
            "order_date": "2023-05-04T08:56:12.000Z",
            "User": {
               "name": "user name",
               "email": "user email",
               "phone": "user phone number",
               "country": "user order country",
               "city": "user order city"
            }
         }
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
         "User": {
            "name": "user name",
            "email": "user email",
            "phone": "user phone number",
            "country": "user order country",
            "city": "user order city",
            "district": "user order district",
            "nearestPoI": "user order nearest point of intrest"
         },
         OrderItems: {
            "item_count": 12,
            "total_price": "cash",
            "ItemsDetails": {
               "size": "xl",
               "color": "blue",
               "Item": {
                  "name": "item name",
                  "price": 15.25,
                  "section": "men",
                  "type": "shirts"
               }
            }
         }
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

   You have to name the images part of the the body _image_ and the other data sent as json are named _json_.

   The json part is like the following:

   body:

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
      "id": "id of the item",
      "details": [
         {
            "color": "red",
            "sizes": [ 
               {
                  size: "XL",
                  count: 5
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
