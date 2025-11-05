/**
 * rpg-ui.js - Funções de UI para o sistema RPG
 *
 * Gerencia a interface e interação com o usuário do sistema RPG
 */

// ============================================
// CHARACTER CREATION
// ============================================

function initializeCharacterCreation() {
    const avatarChoices = document.querySelectorAll('.avatar-choice');
    const nameInput = document.getElementById('character-name-input');
    const createBtn = document.getElementById('create-character-btn');
    const backBtn = document.getElementById('character-back-btn');

    // Avatar selection
    avatarChoices.forEach(choice => {
        choice.addEventListener('click', function() {
            // Remove previous selection
            avatarChoices.forEach(c => c.classList.remove('selected'));

            // Add selection to clicked
            this.classList.add('selected');
            selectedAvatar = this.dataset.avatar;

            // Enable create button if name is filled
            updateCreateButtonState();
        });
    });

    // Name input
    nameInput.addEventListener('input', updateCreateButtonState);

    // Create character button
    createBtn.addEventListener('click', handleCharacterCreation);

    // Back button
    backBtn.addEventListener('click', () => {
        showLoginScreen();
    });

    function updateCreateButtonState() {
        const hasName = nameInput.value.trim().length > 0;
        const hasAvatar = selectedAvatar !== null;
        createBtn.disabled = !(hasName && hasAvatar);
    }
}

function handleCharacterCreation() {
    const nameInput = document.getElementById('character-name-input');
    const name = nameInput.value.trim();

    if (!name || !selectedAvatar) {
        alert('Por favor, escolha um nome e um avatar!');
        return;
    }

    // Create character in RPG system
    rpgPlayer.createCharacter(name, selectedAvatar);

    // Go to Quest Hub
    currentSpecialty = 'go';
    currentSubcategory = 'avc2';
    showModuleSelectionScreen();
}

function showCharacterCreationScreen() {
    hideAllScreens();
    screens.characterCreation.classList.remove('d-none');

    // Reset form
    document.getElementById('character-name-input').value = '';
    document.querySelectorAll('.avatar-choice').forEach(c => c.classList.remove('selected'));
    selectedAvatar = null;
    document.getElementById('create-character-btn').disabled = true;
}

// ============================================
// QUEST HUB UI
// ============================================

function updateCharacterSheet() {
    const playerData = rpgPlayer.data;
    const levelInfo = rpgPlayer.getLevelInfo();

    // Update name
    document.getElementById('player-name-display').textContent = playerData.name;

    // Update avatar icon
    const avatarIcon = document.getElementById('player-avatar-icon');
    avatarIcon.className = playerData.avatar === 'male' ? 'fas fa-user-md' : 'fas fa-user-nurse';

    // Update level
    document.getElementById('player-level-badge').textContent = `Nível ${levelInfo.currentLevel}`;

    // Update XP bar
    const xpText = document.getElementById('xp-text-display');
    const xpBar = document.getElementById('xp-bar-display');

    if (levelInfo.isMaxLevel) {
        xpText.textContent = `${levelInfo.currentXP} XP (MAX)`;
        xpBar.style.width = '100%';
        xpBar.textContent = '100%';
    } else {
        const xpInLevel = levelInfo.currentXP - (RPG_CONFIG.levels[levelInfo.currentLevel - 1].xpRequired);
        const xpNeededForLevel = levelInfo.nextLevelXP - RPG_CONFIG.levels[levelInfo.currentLevel - 1].xpRequired;
        const percentage = Math.floor((xpInLevel / xpNeededForLevel) * 100);

        xpText.textContent = `${levelInfo.currentXP} / ${levelInfo.nextLevelXP} XP`;
        xpBar.style.width = `${percentage}%`;
        xpBar.textContent = `${percentage}%`;
    }
}

function generateQuestCards() {
    const container = document.getElementById('module-list');
    container.innerHTML = '';

    RPG_CONFIG.quests.forEach(quest => {
        const isCompleted = rpgPlayer.isQuestCompleted(quest.id);
        const isUnlocked = rpgPlayer.isQuestUnlocked(quest.id);
        const isBoss = quest.type === 'boss';

        // Create quest card
        const card = document.createElement('div');
        card.className = 'quest-card';

        if (isCompleted) {
            card.classList.add('quest-completed');
        } else if (isUnlocked) {
            card.classList.add(isBoss ? 'quest-boss' : 'quest-unlocked');
        } else {
            card.classList.add(isBoss ? 'quest-boss-locked' : 'quest-locked');
        }

        // Quest header
        const header = document.createElement('div');
        header.className = 'quest-card-header';
        header.innerHTML = `
            <div class="quest-icon">${quest.icon}</div>
            <div class="quest-info">
                <div class="quest-title">${quest.title}</div>
                <div class="quest-description">${quest.description}</div>
            </div>
        `;

        // Lock overlay if locked
        if (!isUnlocked) {
            const lockOverlay = document.createElement('div');
            lockOverlay.className = 'quest-lock-overlay';
            lockOverlay.innerHTML = '<i class="fas fa-lock"></i>';
            card.appendChild(lockOverlay);
        }

        // Quest stats
        const stats = document.createElement('div');
        stats.className = 'quest-stats';

        const difficultyStars = '⭐'.repeat(quest.difficulty);
        const statusBadge = isCompleted ?
            `<span class="badge badge-completed"><i class="fas fa-check me-1"></i>Completa</span>` :
            isUnlocked ?
                `<span class="badge badge-unlocked"><i class="fas fa-unlock me-1"></i>Disponível</span>` :
                `<span class="badge badge-locked"><i class="fas fa-lock me-1"></i>Bloqueada</span>`;

        stats.innerHTML = `
            <div class="quest-stat">
                <span>${difficultyStars}</span>
                <span>${quest.difficulty === 1 ? 'Iniciante' : quest.difficulty === 2 ? 'Intermediário' : quest.difficulty <= 4 ? 'Avançado' : 'Boss'}</span>
            </div>
            <div class="quest-stat">
                <i class="fas fa-star"></i>
                <span>+${quest.xpReward} XP</span>
            </div>
            <div class="quest-stat">
                ${statusBadge}
            </div>
        `;

        // Quest actions
        const actions = document.createElement('div');
        actions.className = 'quest-actions';

        if (isUnlocked) {
            const startBtn = document.createElement('button');
            startBtn.className = 'btn btn-sm btn-primary';
            startBtn.innerHTML = isCompleted ? '<i class="fas fa-redo me-1"></i>Refazer' : '<i class="fas fa-play me-1"></i>Iniciar';
            startBtn.addEventListener('click', () => startQuest(quest.id));
            actions.appendChild(startBtn);
        } else {
            const lockedText = document.createElement('small');
            lockedText.className = 'text-muted';
            if (quest.prereq === 'all_quests') {
                lockedText.textContent = 'Complete todas as 6 quests para desbloquear';
            } else if (quest.prereq) {
                const prereqQuest = RPG_CONFIG.quests.find(q => q.id === quest.prereq);
                lockedText.textContent = `Complete "${prereqQuest?.title}" primeiro`;
            }
            actions.appendChild(lockedText);
        }

        // Append all parts
        card.appendChild(header);
        card.appendChild(stats);
        card.appendChild(actions);
        container.appendChild(card);
    });

    // Update overall progress
    updateOverallProgress();
}

function updateOverallProgress() {
    const totalQuests = RPG_CONFIG.quests.length;
    const completedQuests = RPG_CONFIG.quests.filter(q => rpgPlayer.isQuestCompleted(q.id)).length;
    const percentage = Math.floor((completedQuests / totalQuests) * 100);

    document.getElementById('overall-progress').textContent = `${percentage}%`;
    const progressBar = document.getElementById('overall-progress-bar');
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${percentage}% Completo`;
}

function startQuest(questId) {
    // Find the quest in config
    const quest = RPG_CONFIG.quests.find(q => q.id === questId);
    if (!quest) return;

    // Set current module to the quest ID
    currentModule = questId;

    // Check if it's a preparation quest
    if (quest.type === 'preparation') {
        showPreparationScreen(quest);
    } else {
        // Show mode selection for regular quests
        showModeSelection(questId);
    }
}

// ============================================
// CHEAT CODES
// ============================================

function initializeCheatCodes() {
    const cheatBtn = document.getElementById('cheat-code-btn');
    const modal = new bootstrap.Modal(document.getElementById('cheatCodeModal'));
    const applyBtn = document.getElementById('apply-cheat-code-btn');
    const input = document.getElementById('cheat-code-input');
    const resultDiv = document.getElementById('cheat-code-result');

    cheatBtn.addEventListener('click', () => {
        modal.show();
        input.value = '';
        resultDiv.classList.add('d-none');
    });

    applyBtn.addEventListener('click', () => {
        const code = input.value.trim().toUpperCase();
        if (!code) {
            showCheatCodeResult('Digite um código!', 'danger');
            return;
        }

        const result = rpgPlayer.applyCheatCode(code);

        if (result.success) {
            showCheatCodeResult(result.message, 'success');

            // Update UI
            setTimeout(() => {
                modal.hide();
                updateCharacterSheet();
                generateQuestCards();
            }, 2000);
        } else {
            showCheatCodeResult(result.message, 'danger');
        }
    });

    function showCheatCodeResult(message, type) {
        resultDiv.className = `alert alert-${type}`;
        resultDiv.textContent = message;
        resultDiv.classList.remove('d-none');
    }
}

// ============================================
// XP & LEVEL UP FEEDBACK
// ============================================

function showXPGainFeedback(xpData) {
    if (!xpData) return;

    // Animate XP bar
    const xpBar = document.getElementById('xp-bar-display');
    xpBar.classList.add('xp-bar-animate');

    // Show XP gain notification
    const notification = document.createElement('div');
    notification.className = 'position-fixed top-50 start-50 translate-middle';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show shadow-lg" role="alert">
            <h4 class="alert-heading">
                <i class="fas fa-star me-2"></i>
                +${xpData.xpGained} XP Ganho!
            </h4>
            <p class="mb-0">XP Total: ${xpData.newXP}</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);

    // Check for level up
    if (xpData.leveledUp) {
        setTimeout(() => showLevelUpFeedback(xpData), 500);
    }
}

function showLevelUpFeedback(xpData) {
    const levelBadge = document.getElementById('player-level-badge');
    levelBadge.classList.add('level-up-animation');

    const notification = document.createElement('div');
    notification.className = 'position-fixed top-50 start-50 translate-middle';
    notification.style.zIndex = '10000';
    notification.innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show shadow-lg text-center" role="alert">
            <h2 class="mb-3">
                <i class="fas fa-trophy text-warning"></i>
            </h2>
            <h3 class="alert-heading">LEVEL UP!</h3>
            <p class="mb-2">Nível ${xpData.oldLevel} → Nível ${xpData.newLevel}</p>
            <p class="mb-0">
                <strong>${RPG_CONFIG.levels[xpData.newLevel - 1].name}</strong>
            </p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
        levelBadge.classList.remove('level-up-animation');
    }, 4000);
}

function showQuestCompleteFeedback(questId, score) {
    const quest = RPG_CONFIG.quests.find(q => q.id === questId);
    if (!quest) return;

    // Generate cheat code
    const cheatCode = rpgPlayer.generateCheatCode(questId);

    const notification = document.createElement('div');
    notification.className = 'position-fixed top-50 start-50 translate-middle';
    notification.style.zIndex = '10001';
    notification.innerHTML = `
        <div class="card shadow-lg" style="min-width: 400px;">
            <div class="card-header bg-success text-white text-center">
                <h3 class="mb-0">
                    <i class="fas fa-check-circle me-2"></i>
                    Quest Completa!
                </h3>
            </div>
            <div class="card-body text-center">
                <h4>${quest.icon} ${quest.title}</h4>
                <p class="mb-3">Pontuação: ${score}%</p>
                <div class="alert alert-info">
                    <strong>Código de Sincronização:</strong><br>
                    <code class="fs-5">${cheatCode || 'N/A'}</code><br>
                    <small>Use este código para sincronizar seu progresso em outro dispositivo</small>
                </div>
                <button class="btn btn-primary" onclick="this.closest('.card').parentElement.remove(); updateCharacterSheet(); generateQuestCards();">
                    Continuar Jornada
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
}

// ============================================
// PREPARATION QUEST (Reading Materials)
// ============================================

function showPreparationScreen(quest) {
    hideAllScreens();
    screens.preparation.classList.remove('d-none');

    // Load reading progress
    const progress = rpgPlayer.getPreparationProgress();

    // Generate checklist
    generateMaterialsChecklist(quest.materials, progress);

    // Update progress bar
    updatePreparationProgress(progress, quest.materials.length);

    // Set up event listeners
    setupPreparationEventListeners(quest);
}

function generateMaterialsChecklist(materials, progress) {
    const container = document.getElementById('materials-checklist');
    container.innerHTML = '';

    materials.forEach((material, index) => {
        const isChecked = progress.includes(material.file);

        const item = document.createElement('div');
        item.className = 'card mb-3 shadow-sm';
        item.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <input
                        type="checkbox"
                        class="form-check-input me-3"
                        id="material-${index}"
                        data-file="${material.file}"
                        ${isChecked ? 'checked' : ''}
                        style="width: 24px; height: 24px; cursor: pointer;">
                    <label for="material-${index}" class="flex-grow-1 mb-0" style="cursor: pointer;">
                        <strong>${material.title}</strong>
                        <br>
                        <small class="text-muted">
                            <i class="fas ${material.type === 'resumo' ? 'fa-file-alt' : 'fa-book'}"></i>
                            ${material.type === 'resumo' ? 'Resumo' : 'Guia'}
                        </small>
                    </label>
                    <button
                        class="btn btn-sm btn-outline-primary"
                        onclick="openMaterial('${material.type}', '${material.file}')">
                        <i class="fas fa-eye me-1"></i>Ler
                    </button>
                </div>
            </div>
        `;

        container.appendChild(item);
    });

    // Add event listeners to checkboxes
    document.querySelectorAll('#materials-checklist input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleMaterialCheckboxChange);
    });
}

function handleMaterialCheckboxChange(event) {
    const file = event.target.dataset.file;
    const isChecked = event.target.checked;

    // Update progress in rpgPlayer
    rpgPlayer.updatePreparationProgress(file, isChecked);

    // Update progress bar
    const progress = rpgPlayer.getPreparationProgress();
    const quest = RPG_CONFIG.quests.find(q => q.type === 'preparation');
    updatePreparationProgress(progress, quest.materials.length);

    // Enable/disable complete button
    const completeBtn = document.getElementById('complete-preparation-btn');
    completeBtn.disabled = progress.length < quest.materials.length;
}

function updatePreparationProgress(progress, total) {
    const percentage = Math.floor((progress.length / total) * 100);
    const progressBar = document.getElementById('preparation-progress-bar');
    const progressText = document.getElementById('preparation-progress-text');

    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${progress.length}/${total} Completo`;

    // Enable complete button if all checked
    const completeBtn = document.getElementById('complete-preparation-btn');
    completeBtn.disabled = progress.length < total;
}

function setupPreparationEventListeners(quest) {
    // Back button
    document.getElementById('preparation-back-btn').onclick = () => {
        showModuleSelectionScreen();
    };

    // Complete button
    document.getElementById('complete-preparation-btn').onclick = () => {
        completePreparationQuest(quest);
    };
}

function completePreparationQuest(quest) {
    // Check if already completed
    if (rpgPlayer.isQuestCompleted(quest.id)) {
        alert('Você já completou esta quest!');
        return;
    }

    // Mark quest as completed and give XP
    const xpData = rpgPlayer.completeQuest(quest.id, 100); // 100% score for preparation

    // Show feedback
    showXPGainFeedback(xpData);
    showQuestCompleteFeedback(quest.id, 100);

    // Return to Quest Hub after a delay
    setTimeout(() => {
        showModuleSelectionScreen();
    }, 2000);
}

function openMaterial(type, filename) {
    // Reuse existing file loading function
    loadFile(type === 'resumo' ? 'resumos' : 'guias', filename);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeCharacterCreation,
        showCharacterCreationScreen,
        updateCharacterSheet,
        generateQuestCards,
        initializeCheatCodes,
        showXPGainFeedback,
        showLevelUpFeedback,
        showQuestCompleteFeedback,
        showPreparationScreen
    };
}
