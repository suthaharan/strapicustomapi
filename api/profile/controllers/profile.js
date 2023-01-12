'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

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