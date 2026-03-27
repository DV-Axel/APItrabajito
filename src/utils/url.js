export function buildConfirUrl(token){
    const baseUrl = "http://localhost:5173";
    return `${ baseUrl }/cuenta-verificada?token=${ token }`;
}

export function buildResetPasswordUrl(token){
    const baseUrl = "http://localhost:5173";
    return `${ baseUrl }/cambiar-contrasenia?token=${ token }`;
}