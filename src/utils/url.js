export function buildConfirUrl(token){
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return `${ baseUrl }/cuenta-verificada?token=${ token }`;
}

export function buildConfirUrlSposnor(token){
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return `${baseUrl}/sponsor/cuenta-verificada?token=${token}`;
}


export function buildResetPasswordUrl(token){
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return `${ baseUrl }/cambiar-contrasenia?token=${ token }`;
}