// export const adminGuard = () => {
//   return async (c, next) => {
//     const user = c.get("user");

//     if (!user || user.role !== TRUE) {
//       return c.text("Access denied", 403);
//     }

//     await next();
//   };
// };
