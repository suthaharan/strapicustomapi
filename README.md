# Custom endpoint in Strapi application 

* Application uses Strapi v3

[Reference documentation link](https://docs-v3.strapi.io/developer-docs/latest/development/backend-customization.html#controllers)
* Start the application in development mode to modify existing content types
$ npm run develop


* Create a profile content type
```
firstName (TEXT)
lastName (TEXT)
image (MEDIA only image)
user (relation to indicate that one profile has one user)
```

* Edit api/profile/config/routes.json and add
```
    {
      "method": "POST",
      "path": "/profiles/me",
      "handler": "profile.createMe",
      "config": {
        "policies": []
      }
    },
```

* Edit api/profile/controllers/profile.js and add
```
 const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

 module.exports = {
   async createMe(ctx) {
     let entity;
     // Get authenticated user
     const user = ctx.state.user;
     if(!user){
        return ctx.request(null, [{messages: [{id: "No authorization header found!"}] }]);
     }
     if (ctx.is('multipart')) {
       const { data, files } = parseMultipartData(ctx);
       data[user] = user;
       entity = await strapi.services.profile.create(data, { files });
     } else {
        const data = ctx.request.body;
        data[user] = user;
        entity = await strapi.services.profile.create(data);
     }
     return sanitizeEntity(entity, { model: strapi.models.profile });
   },
 };
```

* Testing with PostMan
    * Now go to postman and try to login to strapi as a user and get the user token http://localhost:1337/auth/local
    * Use the user token as Bearer token and access http://localhost:1337/profiles/me
    * Make a POST request to the profiles endpoint with the bearer token and the post body given below
    ```
    {
        "firstName": "Bheem",
        "lastName": "Raj"
    }
    ```
    * You will get forbidden message when you make this request as we need to set the  authenticated permission for /createme method
    * User and permissions plugin > roels > authenticated > permissions > "check" createme
