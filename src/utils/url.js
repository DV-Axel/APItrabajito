export function buildConfirUrl(token){
    //TODO: Corregir el nombre de esta funcion
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return `${ baseUrl }/cuenta-verificada?token=${ token }`;
}

export function buildConfigUrlSponsor(token){
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return `${baseUrl}/sponsor/cuenta-verificada?token=${token}`;
}


export function buildResetPasswordUrl(token){
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return `${ baseUrl }/cambiar-contrasenia?token=${ token }`;
}

export function buildResetPasswordUrlSponsor(token){
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return `${ baseUrl }/sponsor/cambiar-contrasenia?token=${ token }`;
}