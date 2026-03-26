export function buildConfirUrl(token){
    const baseUrl = "http://localhost:5173";
    return `${ baseUrl }/cuenta-verificada?token=${ token }`;
}