import { ZodError } from "zod";




// export function validateSchema(schema, type = "body"){
//     return (req, res, next) => {
//         try {
//             req[type] = schema.parse(req[type] ?? {});
//             next();
//         } catch (error) {
//             if (error instanceof ZodError) {
//                 return res.status(400).json({
//                     success: false,
//                     errors: error.errors.map(e => e.message),
//                 });
//             } 
//             console.error("Error inesperado en la validación:", error);
//             return res.status(500).json({
//                 success: false,
//                 message: "Error interno en la validación",
//                 error: error.message || error.toString()
//             });
//         }
//     }
// };



export function validateSchema(schema, type = "body") {
  return (req, res, next) => {
    try {
      req[type] = schema.parse(req[type] ?? {});
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Error de validacion de Zod: ", error.issues);
        
        return res.status(400).json({
          success: false,
          errors: error.issues.map(e => ({
            path: e.path.join("."), // ej: "email" o "password"
            message: e.message
          }))          
        });
      }
      console.error("Error inesperado en la validación:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno en la validación",
        error: error.message || error.toString()
      });
    }
  };
}
