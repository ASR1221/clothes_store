# Intro

This file is going to take you through all the end points in this API.

- This API return all of it's data on ***json*** format
- **Note** that each endpoin start with `/api`.
- There is **two** versions of each end point. When using the API to a mobile app you have to follow the `/api` with `/mobile`.
- So, every endpoint should start with `/api` for *Web* Apps and with `/api/mobile` for *Mobile* Apps.

# End Points

## **Items**

- GET `/items/list?section=&type=`

   Get all specified items by section and optionally type.
   
   **section** could be *men*, *women* and *kids*.

   **type** could be *jeans*, *shirts*, *coats*, *dresses* or *skirts*. Note that *dresses* and *skirts* are only for *women* and *kids* sections.

   Thisendpoint will return the following:
   ```
   {
      "id": 1,
      "name": "item name",
      "price": 00.00,
      "image_path": "path/to/image",
      "type": "jeans",
   }
   ```

- GET `/items/details/:id`
