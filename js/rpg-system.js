/**
 * rpg-system.js - Sistema RPG completo para gamificação
 *
 * Gerencia:
 * - Criação de personagem
 * - Sistema de XP e níveis
 * - Quests e bloqueio automático
 * - Cheat codes
 * - Badges e conquistas
 */

// ============================================
// CONFIGURAÇÃO DO SISTEMA RPG
// ============================================

const RPG_CONFIG = {
    // Níveis e XP necessário
    levels: [
        { level: 1, name: 'Iniciante', xpRequired: 0, xpToNext: 200 },
        { level: 2, name: 'Aprendiz', xpRequired: 200, xpToNext: 200 },
        { level: 3, name: 'Praticante', xpRequired: 400, xpToNext: 300 },
        { level: 4, name: 'Expert', xpRequired: 700, xpToNext: 300 },
        { level: 5, name: 'Mestre', xpRequired: 1000, xpToNext: 0 }
    ],

    // Configuração das quests
    quests: [
        {
            id: 'citologia_oncotica',
            number: 1,
            title: 'Quest 1: Citologia Oncótica',
            subtitle: 'O Mistério da Citologia Oncótica',
            description: 'Domine o rastreamento do câncer cervical',
            icon: '🔬',
            difficulty: 1,
            xpReward: 100,
            type: 'quest',
            prereq: null
        },
        {
            id: 'vulvovaginites',
            number: 2,
            title: 'Quest 2: Vulvovaginites',
            subtitle: 'O Desafio das Vulvovaginites',
            description: 'Identifique e trate infecções vaginais',
            icon: '🔥',
            difficulty: 2,
            xpReward: 120,
            type: 'quest',
            prereq: 'citologia_oncotica'
        },
        {
            id: 'ists_dipa',
            number: 3,
            title: 'Quest 3: ISTs e DIPA',
            subtitle: 'As ISTs e a Temível DIPA',
            description: 'Diagnostique e trate ISTs e complicações',
            icon: '⚠️',
            difficulty: 3,
            xpReward: 130,
            type: 'quest',
            prereq: 'vulvovaginites'
        },
        {
            id: 'patologias_tgi',
            number: 4,
            title: 'Quest 4: Patologias TGI',
            subtitle: 'Patologias do Trato Genital Inferior',
            description: 'Domine lesões e neoplasias do TGI',
            icon: '🌸',
            difficulty: 3,
            xpReward: 140,
            type: 'quest',
            prereq: 'ists_dipa'
        },
        {
            id: 'trabalho_parto',
            number: 5,
            title: 'Quest 5: Trabalho de Parto',
            subtitle: 'A Grande Jornada do Parto',
            description: 'Conduza partos com segurança',
            icon: '👶',
            difficulty: 4,
            xpReward: 150,
            type: 'quest',
            prereq: 'patologias_tgi'
        },
        {
            id: 'puerperio_amamentacao',
            number: 6,
            title: 'Quest 6: Puerpério e Amamentação',
            subtitle: 'O Sagrado Puerpério',
            description: 'Acompanhe mãe e bebê no pós-parto',
            icon: '🍼',
            difficulty: 4,
            xpReward: 160,
            type: 'quest',
            prereq: 'trabalho_parto'
        },
        {
            id: 'revisao_geral_parte1',
            number: 7,
            title: 'BOSS 1: O Grande Examinador',
            subtitle: 'Revisão Geral - Parte 1',
            description: 'Teste TODOS os seus conhecimentos',
            icon: '🐉',
            difficulty: 5,
            xpReward: 300,
            type: 'boss',
            prereq: 'all_quests'  // Especial: precisa de TODAS as 6 quests
        },
        {
            id: 'revisao_geral_parte2',
            number: 8,
            title: 'BOSS 2: O Examinador Supremo',
            subtitle: 'Revisão Geral - Parte 2',
            description: 'O desafio final!',
            icon: '👑',
            difficulty: 6,
            xpReward: 300,
            type: 'boss',
            prereq: 'revisao_geral_parte1'
        }
    ],

    // Códigos de sincronização (cheat codes)
    cheatCodes: {
        'QUEST1-RASTREIO': { quest: 'citologia_oncotica', xp: 100 },
        'QUEST2-FLORA': { quest: 'vulvovaginites', xp: 220 },
        'QUEST3-ISTS': { quest: 'ists_dipa', xp: 350 },
        'QUEST4-COLPO': { quest: 'patologias_tgi', xp: 490 },
        'QUEST5-PARTO': { quest: 'trabalho_parto', xp: 640 },
        'QUEST6-PUERPERIO': { quest: 'puerperio_amamentacao', xp: 800 },
        'BOSS1-EXAMINADOR': { quest: 'revisao_geral_parte1', xp: 1100 },
        'BOSS2-SUPREMO': { quest: 'revisao_geral_parte2', xp: 1400 }
    }
};

// ============================================
// PLAYER DATA MANAGEMENT
// ============================================

class RPGPlayer {
    constructor() {
        this.data = this.load() || this.createNew();
    }

    createNew() {
        return {
            name: '',
            avatar: '',
            createdAt: new Date().toISOString(),
            xp: 0,
            level: 1,
            completedQuests: [],
            questScores: {},
            badges: [],
            lastPlayed: new Date().toISOString()
        };
    }

    load() {
        try {
            const saved = localStorage.getItem('rpg_player_data');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Erro ao carregar dados do player:', error);
            return null;
        }
    }

    save() {
        try {
            this.data.lastPlayed = new Date().toISOString();
            localStorage.setItem('rpg_player_data', JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados do player:', error);
            return false;
        }
    }

    hasCharacter() {
        return this.data.name && this.data.avatar;
    }

    createCharacter(name, avatar) {
        this.data.name = name;
        this.data.avatar = avatar;
        this.save();
    }

    addXP(amount) {
        const oldXP = this.data.xp;
        const oldLevel = this.data.level;

        this.data.xp += amount;

        // Verifica level up
        const newLevel = this.calculateLevel(this.data.xp);
        const leveledUp = newLevel > oldLevel;

        if (leveledUp) {
            this.data.level = newLevel;
        }

        this.save();

        return {
            oldXP,
            newXP: this.data.xp,
            oldLevel,
            newLevel: this.data.level,
            leveledUp,
            xpGained: amount
        };
    }

    calculateLevel(xp) {
        for (let i = RPG_CONFIG.levels.length - 1; i >= 0; i--) {
            if (xp >= RPG_CONFIG.levels[i].xpRequired) {
                return RPG_CONFIG.levels[i].level;
            }
        }
        return 1;
    }

    getLevelInfo() {
        const currentLevelData = RPG_CONFIG.levels.find(l => l.level === this.data.level);
        const nextLevelData = RPG_CONFIG.levels.find(l => l.level === this.data.level + 1);

        return {
            currentLevel: this.data.level,
            currentLevelName: currentLevelData ? currentLevelData.name : 'Mestre',
            currentXP: this.data.xp,
            xpToNextLevel: nextLevelData ? nextLevelData.xpRequired - this.data.xp : 0,
            nextLevelXP: nextLevelData ? nextLevelData.xpRequired : this.data.xp,
            isMaxLevel: !nextLevelData
        };
    }

    completeQuest(questId, score) {
        if (!this.data.completedQuests.includes(questId)) {
            this.data.completedQuests.push(questId);
        }

        this.data.questScores[questId] = {
            score: score,
            completedAt: new Date().toISOString()
        };

        const quest = RPG_CONFIG.quests.find(q => q.id === questId);
        if (quest) {
            return this.addXP(quest.xpReward);
        }

        this.save();
        return null;
    }

    isQuestCompleted(questId) {
        return this.data.completedQuests.includes(questId);
    }

    isQuestUnlocked(questId) {
        const quest = RPG_CONFIG.quests.find(q => q.id === questId);
        if (!quest) return false;

        // Primeira quest sempre desbloqueada
        if (!quest.prereq) return true;

        // Boss battles requerem todas as quests
        if (quest.prereq === 'all_quests') {
            const mainQuests = RPG_CONFIG.quests.filter(q => q.type === 'quest');
            return mainQuests.every(q => this.isQuestCompleted(q.id));
        }

        // Quest normal requer a anterior
        return this.isQuestCompleted(quest.prereq);
    }

    generateCheatCode(questId) {
        const quest = RPG_CONFIG.quests.find(q => q.id === questId);
        if (!quest) return null;

        // Encontra o código correspondente
        for (const [code, data] of Object.entries(RPG_CONFIG.cheatCodes)) {
            if (data.quest === questId) {
                return code;
            }
        }

        return null;
    }

    applyCheatCode(code) {
        const codeData = RPG_CONFIG.cheatCodes[code.toUpperCase()];
        if (!codeData) {
            return { success: false, message: 'Código inválido!' };
        }

        const quest = RPG_CONFIG.quests.find(q => q.id === codeData.quest);
        if (!quest) {
            return { success: false, message: 'Quest não encontrada!' };
        }

        // Se já completou, não faz nada
        if (this.isQuestCompleted(quest.id)) {
            return {
                success: false,
                message: `Você já completou esta quest!`
            };
        }

        // Completa a quest e adiciona XP
        this.data.xp = codeData.xp;
        if (!this.data.completedQuests.includes(quest.id)) {
            this.data.completedQuests.push(quest.id);
        }
        this.data.questScores[quest.id] = {
            score: 100,
            completedAt: new Date().toISOString(),
            fromCheatCode: true
        };

        // Recalcula nível
        this.data.level = this.calculateLevel(this.data.xp);
        this.save();

        return {
            success: true,
            message: `${quest.title} desbloqueada! +${quest.xpReward} XP`,
            questName: quest.title,
            xpGained: quest.xpReward
        };
    }

    reset() {
        this.data = this.createNew();
        this.save();
    }
}

// Instância global do player
const rpgPlayer = new RPGPlayer();

// Export para usar em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RPGPlayer, RPG_CONFIG, rpgPlayer };
}
