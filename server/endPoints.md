# Intro

This file is going to take you through all the end points in this API.

- This API return all of it's data in ***applicaton/json*** format
- **Note** that each endpoin start with `/api`.
- There is **two** versions of each end point. When using the API to a native app you have to follow the `/api` with `/native`.
- So, every endpoint should start with `/api` for *Web* Apps and with `/api/native` for *Native* Apps.
- Most of the end points require sending the `sessionToken` in their body
-  All end points will return the following on `failure`:


   ```
   {
      "message": "error message"
   }
   ```


# End Points

## **Items**

- GET `/items/list?section=&type=`

   Get all specified items by *section* and **optionally** *type*.
   
   **section** could only be *men*, *women* and *kids*.

   **type** could only be *jeans*, *shirts*, *coats*, *dresses* or *skirts*. Note that *dresses* and *skirts* are only for *women* and *kids* sections.

   The endpoint will return the following on `Success`:
   ```
   [
      {
         "id": 1,
         "name": "item name",
         "price": 00.00,
         "image_path": "path/to/image",
         "type": "jeans",
      },
      ...
   ]
   ```

- GET `/items/details/:id`

   Get item with the specific *id*.

   The endpoint will return the following on `Success`:

      ```
      {
         itemsDetails: [
            {
               "stock": 1,
               "size": "xl",
               "color": "red",
               "id": 1,
            },
            ... 
            // note that each item in the array is an instance of the item with a specific color and size. The front end developer should show it in a proper way
         ],
         images: [
            {
               "path": "path/to/image"
            },
            ... // 3 images
         ]
      }
      ```

- GET `/items/search?term=`

   Seacrch a specific *term*.
   
   **term** could be any search term the user write.

   The endpoint will return the following on `Success`:

      ```
      [
         {
            "id": 1,
            "name": "item name",
            "price": 00.00,
            "image_path": "path/to/image",
            "type": "jeans",
         },
         ...
      ]
      ```

## **User**

- POST `/user/auth/google` and `/user/auth/facebook`

   body:
   ```
      {
         "access_token": "access-token-string"
      }
   ```

   This end point is used for users to sign up or log in with their google account.

   The front-end have to show the user a consent screen by taking the user to the `https://accounts.google.com/signin/oauth/oauthchooseaccount?include_granted_scopes=true&client_id=450145178762-ve8m4krlq5cc02rp54ipkmtktlg58p11.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Flogin%2Fcomplete&response_type=token&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&service=lso&o2v=2&flowName=GeneralOAuthFlow` and send the access_token returned in the hash of the *redirect_url* specified in the google auth url mentioned.

   The endpoint will return the following on `Success`:

      ```
      {
         "sessionToken": 1,
         "name": "user name",
         "email": "user email or null",
         "phone_number": "user phone number or null",
         "cartItemsCount": 3
      },
         
      ```

- POST `/user/info/set`

   body:
   ```
   {
      "sessionToken": "session-token-string",
      "country": "country of the user", 
      "city": "city of the user", 
      "district": "district of the user", 
      "nearestPoI": "nearest point of intrest to the user", 
      "phone_number": "user phone number",
   }
   ```
   
   This end point is used to set user info so the order can reach him.

   The endpoint will return the following on `Success`:

   ```
   {
      "message": "Location and phone number saved",
   }
      
   ```

- POST `/user/info/get`  

   body:
   ```
      {
         "sessionToken": "session-token-string",
      }
   ```

   This end point is used to check if user info are still the same or if he even entered this data previouslly when he makes an order.

   The endpoint will return the following on `Success`:

   If the user data does not exsist:
   ```
   {
      "message": "The user does not have this info.",
   }
      
   ```

   If the user data exsist:
   ```
   {
      "country": "country of the user", 
      "city": "city of the user", 
      "district": "district of the user", 
      "nearestPoI": "nearest point of intrest to the user", 
      "phone_number": "user phone number",
   }
      
   ```

## **Cart**

- POST `/cart/add`

   body:
   ```
      {
         "sessionToken": "session-token-string",
         "item_details_id": "uuid",
         "item_count": 1,
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

- POST `/cart/list`

   body:
   ```
      {
         "sessionToken": "session-token-string",
      }
   ```

   This end point is used to list the cart items.

   The endpoint will return the following on `Success`:

      ```
      [
         {
            "id": "uuid of the cart",
            "item_count": 2,
            "total_price": 30.50,
            "item_details_id": 232,
            "ItemsDetails": {
               "size": "xl",
               "color": "blue",
               "stock": 5,
            },
            "item": {
               "name": "item name",
               "price": 15.25,
               "section": "men",
               "type": "shirts",
            }
         },
         ...
      ]
         
      ```

- PUT `/cart/update`

   body:
   ```
      {
         "sessionToken": "session-token-string",
         "id": "uuid of the cart item",
         "item_details_id": 234,
         "item_count": 3,
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

- POST `/cart/remove/:id`

   body:
   ```
      {
         "sessionToken": "session-token-string",
      }
   ```

   This end point is used to delete a specific cart items.

   The endpoint will return the following on `Success`:

      ```
      {
         "sessionToken": "new sessionToken",
         "message": "Cart item deleted"
      }
         
      ```

## **Order**

- POST `/order/make`

   body:
   ```
      {
         "sessionToken": "session-token-string",
         "payment_method": "credit-card", // or cash
         "credit_card": "credit-card", // or null,
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

- POST `/order/get`

   body:
   ```
      {
         "sessionToken": "session-token-string",
      }
   ```

   This end point is used to get all orders that the user made.

   The endpoint will return the following on `Success`:

   ```
   [
      {
         "sessionToken": "new sessionToken",
         "id": 12,
         "payment_method": "cash",
         "credit_card": null,
         "order_price": 100.25,
         "served": false,
      },
      ...
   ]
   ``` 

- POST `/order/get/:id`

   body:
   ```
      {
         "sessionToken": "session-token-string",
         "order_id": 12,
      }
   ```

   This end point is used to get a specific order details.
   The end point is going to return all items of that order.

   The endpoint will return the following on `Success`:

   ```
   [
      {
         "id": "uuid",
         "item_count": 12,
         "total_price": "cash",
         "ItemsDetails": {
            "size": "xl",
            "color": "blue",
            "stock": 5,
         },
         "item": {
            "name": "item name",
            "price": 15.25,
            "section": "men",
            "type": "shirts",
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

- POST `/admin/check`

   body:
   ```
      {
         "sessionToken": "session-token-string",
      }
   ```

   This end point is used to check if user is allowed to see and use admins end points.

   The endpoint will return the following on `Success`:

   ```

   {
      "sessionToken": "new sessionToken",
      "role": "orders" // or uploading or finance
   }

   ``` 

- POST `/admin/list/served?from&to&section&type`

   body:
   ```
      {
         "sessionToken": "session-token-string",
      }
   ```

   *from* and *to* are required while *section* and *type* are not.

   *from* is the date where the search starts.

   *to* is the data where the search ends.

   *section* could be men, women or kids.

   *type* could be any type listed in the top of this file like shirts or jeans.

   This end point is used to serve the served items to the finance admin to see the sales and calculate profit.

   The endpoint will return the following on `Success`:

   ```
   [
      {
         "item_count": 12,
         "total_price": "cash",
         "ItemsDetails": {
            "size": "xl",
            "color": "blue",
            "Item": {
               "name": "item name",
               "price": 15.25,
               "section": "men",
               "type": "shirts",
            },
         },
         "Order": {
            "payment_method": "credit-card",
            "credit_card": "credit card id",
            "order_price": 20.50,
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

- POST `/admin/list/pending?country&city`

   body:
   ```
      {
         "sessionToken": "session-token-string",
      }
   ```

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
         }.
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
                  "type": "shirts",
               },
            },
         },
      }
      ...
   ]
   ```

- POST `/admin/item/add` 

   This end point is user to upload new items with their images.

   It is different from the other because it accepts `multipart/form-data` instead of `application/json`. So, you **must** send both the images (three images) and the item data together in one POST request.

   The body is going to contain the files and the below json:

   body:
   ```
      {
         "sessionToken": "session-token-string",
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

- POST `/admin/item/update`

   body:
   ```
      {
         "sessionToken": "session-token-string",
         "id": "id of the item", 
         "details": [
            {
               "color": "red",
               "stock": 5,
               "size": ["xl", "xxl", "xxxl"] 
            },
            ...
         ]
      }
   ```

   The endpoint will return the following on `Success`:

   ```
   {
      "message": "Updated.", 
      "sessionToken": "new session token"
   }
   ```

