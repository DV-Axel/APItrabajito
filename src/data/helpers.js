export const parseIfString = ( data ) =>{
    if (typeof data == 'string') return JSON.parse( data );
    return data;
}