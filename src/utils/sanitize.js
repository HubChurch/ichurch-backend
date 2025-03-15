const sanitize = (name) => {
    return name
        .normalize("NFD") // Remove acentos
        .replace(/[\u0300-\u036f]/g, "") // Remove caracteres especiais
        .replace(/[^a-zA-Z0-9.-]/g, "-") // Substitui caracteres inválidos
        .toLowerCase(); // Converte para minúsculas
};

module.exports = sanitize;
