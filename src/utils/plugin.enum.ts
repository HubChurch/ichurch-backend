// 🔧 Enum com todos os plugins suportados
export enum PluginEnum {
    CELULA = "CELULA",
    FREQUENCIA = "FREQUENCIA",
    ESCALA = "ESCALA",
    REPERTORIO = "REPERTORIO",
    FINANCEIRO = "FINANCEIRO",
    DIACONIA = "DIACONIA",
    AGENDA = "AGENDA",
    ARQUIVOS = "ARQUIVOS",
    GESTAO_MEMBROS = "GESTAO_MEMBROS",
    ORACAO = "ORACAO",
    PROFESSORES = "PROFESSORES",
    VISITACAO = "VISITACAO",
}

// 📌 Tipo restrito para validação e autocomplete
export type PluginCode = keyof typeof PluginEnum;

// 🧩 Plugins padrão por tipo de ministério
export const PluginsPorTipoMinisterio: Record<string, PluginEnum[]> = {
    louvor: [PluginEnum.ESCALA, PluginEnum.REPERTORIO],
    celula: [PluginEnum.CELULA, PluginEnum.FREQUENCIA, PluginEnum.GESTAO_MEMBROS],
    diaconia: [PluginEnum.ESCALA],
    cantina: [PluginEnum.FINANCEIRO],
    financeiro: [PluginEnum.FINANCEIRO],
    infantil: [PluginEnum.ESCALA, PluginEnum.FREQUENCIA, PluginEnum.PROFESSORES],
    intercessao: [PluginEnum.ORACAO],
    evangelismo: [PluginEnum.VISITACAO, PluginEnum.ESCALA],
    outro: [],
};
