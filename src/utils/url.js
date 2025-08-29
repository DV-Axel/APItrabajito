


export function buildConfirUrl(token){
    const baseUrl = "http://localhost:5175";
    return `${ baseUrl }/validacion?token=${ token }`;
}