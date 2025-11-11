export const parseIfString = (value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    if (trimmed === "") return "";
    try {
        return JSON.parse(trimmed);
    } catch (e) {
        // Si no es JSON válido, devolver la cadena original
        return value;
    }
};
