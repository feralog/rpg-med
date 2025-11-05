/**
 * config.js - Configurações do quiz
 * 
 * Este arquivo contém as configurações personalizáveis do quiz.
 * Altere estas configurações para adaptar o quiz à sua matéria.
 */

// Configuração do quiz
const quizConfig = {
    // Título principal que aparece na tela de login. Ajuste conforme a sua disciplina.
    title: "The Knowledge Quest - GO AVC 2",

    // Nome do localStorage para salvar os dados do usuário.
    storageKey: "knowledgeQuestGOAVC2",

    // Especialidades disponíveis
    specialties: {
        go: {
            id: "go",
            name: "Ginecologia e Obstetrícia",
            hasResumos: true,
            hasGuias: true,
            hasSubcategories: true,
            subcategories: {
                avc2: {
                    id: "avc2",
                    name: "AVC 2 - The Knowledge Quest",
                    modules: [
                        {
                            id: "citologia_oncotica",
                            name: "Quest 1: Citologia Oncótica",
                            file: "subjects/GO/AVC 2/GOQuestions/1citologia-oncotica"
                        },
                        {
                            id: "vulvovaginites",
                            name: "Quest 2: Vulvovaginites",
                            file: "subjects/GO/AVC 2/GOQuestions/3vulvovaginites"
                        },
                        {
                            id: "ists_dipa",
                            name: "Quest 3: ISTs e DIPA",
                            file: "subjects/GO/AVC 2/GOQuestions/4istsdipa"
                        },
                        {
                            id: "patologias_tgi",
                            name: "Quest 4: Patologias TGI",
                            file: "subjects/GO/AVC 2/GOQuestions/5patologiastgi"
                        },
                        {
                            id: "trabalho_parto",
                            name: "Quest 5: Trabalho de Parto e Parto",
                            file: "subjects/GO/AVC 2/GOQuestions/6trabalhodepartoeparto"
                        },
                        {
                            id: "puerperio_amamentacao",
                            name: "Quest 6: Puerpério e Amamentação",
                            file: "subjects/GO/AVC 2/GOQuestions/2puerperio_amamentacao_questoes"
                        },
                        {
                            id: "revisao_geral_parte1",
                            name: "⚔️ BOSS 1: O Grande Examinador",
                            file: "subjects/GO/AVC 2/GOQuestions/revisao-geral-parte"
                        },
                        {
                            id: "revisao_geral_parte2",
                            name: "👑 BOSS 2: O Examinador Supremo",
                            file: "subjects/GO/AVC 2/GOQuestions/revisao-geral-parte2"
                        }
                    ]
                }
            }
        }
    },

    // Lista de módulos disponíveis (mantida para compatibilidade)
    modules: []
};
