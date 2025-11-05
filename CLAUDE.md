# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Knowledge Quest** is a gamified quiz application for medical education, specifically focused on Ginecology & Obstetrics (GO) AVC 2 content. It combines an RPG-style progression system with an interactive web-based quiz interface to make studying more engaging and organized.

## Core Concept

The application treats medical study as an RPG adventure:
- **Quests** = Study modules (6 main topics)
- **Boss Battles** = Comprehensive review exams (2 final challenges)
- **XP & Levels** = Progress tracking via manual honor system
- **Badges** = Achievements for completing milestones
- **Gating** = Sequential progression (must complete Quest 1 before Quest 2, etc.)

## File Structure

```
rpg-med/
├── README.md                           # Main "Character Sheet" & Quest Map (user's hub)
├── index.html                          # Quiz interface
│
├── quests/                             # RPG Quest Structure (NEW!)
│   ├── 01-citologia-oncotica/
│   │   ├── QUEST.md                   # Quest description & objectives
│   │   ├── guia.md                    # Study guide (lore/textbook)
│   │   ├── resumo.md                  # Summary (TL;DR)
│   │   └── questoes.json              # Quiz questions (copied from subjects/)
│   ├── 02-vulvovaginites/
│   ├── 03-ists-dipa/
│   ├── 04-patologias-tgi/
│   ├── 05-trabalho-parto/
│   ├── 06-puerperio-amamentacao/
│   └── BOSS-BATTLES/
│       ├── revisao-geral-1/
│       │   ├── BOSS.md                # Boss description
│       │   └── questoes.json
│       └── revisao-geral-2/
│           ├── BOSS.md
│           └── questoes.json
│
├── subjects/                           # Technical quiz data (backend)
│   └── GO/
│       └── AVC 2/
│           ├── GOQuestions/           # JSON quiz files (source of truth)
│           ├── GOGuias/               # Original guide files
│           └── GOResumos/             # Original summary files
│
├── assets/
│   └── badges/                        # Visual assets for achievements
│
├── css/
│   └── styles.css                     # Quiz interface styling
│
├── js/
│   ├── config.js                      # Quiz configuration (ONLY GO AVC 2)
│   ├── data.js                        # Data management & localStorage
│   └── app.js                         # Quiz application logic
│
└── CLAUDE.md                          # ← YOU ARE HERE
```

## Two-Layer Architecture

### Layer 1: RPG Experience (`quests/`)
- **Purpose**: User-facing gamification layer
- **Contents**: QUEST.md files with narratives, study guides, summaries
- **User Flow**: Read README.md → Select quest → Study materials → Take quiz
- **Tracking**: Manual honor system via checkboxes in README.md

### Layer 2: Quiz Engine (`subjects/` + `js/`)
- **Purpose**: Technical backend for quiz functionality
- **Contents**: JSON question files, quiz logic, progress storage
- **User Flow**: Open index.html → Select GO → AVC 2 → Choose quest
- **Tracking**: Automatic progress tracking via localStorage

## Quest Progression System

### The 6 Main Quests (Sequential):
1. **Quest 1**: Citologia Oncótica (⭐ Iniciante, +100 XP)
2. **Quest 2**: Vulvovaginites (⭐⭐ Intermediário, +120 XP)
3. **Quest 3**: ISTs e DIPA (⭐⭐⭐ Avançado, +130 XP)
4. **Quest 4**: Patologias TGI (⭐⭐⭐ Avançado, +140 XP)
5. **Quest 5**: Trabalho de Parto (⭐⭐⭐⭐ Especialista, +150 XP)
6. **Quest 6**: Puerpério e Amamentação (⭐⭐⭐⭐ Especialista, +160 XP)

### Boss Battles (Require ALL 6 quests completed):
7. **BOSS 1**: Revisão Geral Parte 1 (⚔️⚔️⚔️⚔️⚔️ Boss, +300 XP)
8. **BOSS 2**: Revisão Geral Parte 2 (⚔️⚔️⚔️⚔️⚔️⚔️ Legendary, +300 XP)

**Total XP Available**: 1,000 XP
**Completion Criteria**: ≥70% accuracy on quests, ≥80-85% on bosses

## Honor System (Gating Mechanism)

The system uses a **manual honor-based progression**:

1. User completes Quest 1 materials (reads guide, summary)
2. User takes quiz via `index.html`
3. If user scores ≥70%, they manually check the box in README.md
4. Quest 2 is now "unlocked" (honor system - user can access it)
5. Process repeats for all quests

**Why Honor System?**
- No complex authentication needed
- Encourages self-discipline
- Easy to implement and maintain
- User controls their own learning pace

## Key Files to Understand

### `README.md`
- The **main hub** users interact with
- Contains character sheet, XP tracker, quest map
- Manual checkboxes for progress tracking
- Links to all quest files

### `quests/[XX-name]/QUEST.md`
- Narrative description of each quest
- Learning objectives
- Resources available (guide, summary, quiz)
- Completion criteria
- Rewards (XP, badges)

### `js/config.js`
- **CRITICAL**: Only contains GO AVC 2 modules now
- Maps quest names to JSON file paths
- Must be updated if adding new quests
- Storage key: `knowledgeQuestGOAVC2`

### `subjects/GO/AVC 2/GOQuestions/[file].json`
- Actual quiz questions in JSON format
- Standard format with question, options, correctIndex, explanation
- Loaded dynamically by `data.js`

## Quiz Question Format

```json
{
  "question": "Question text here",
  "options": [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5"
  ],
  "correctIndex": 0,
  "explanation": "Explanation of correct answer",
  "type": "conteudista" | "raciocínio"
}
```

Optional `image` field for visual questions:
```json
{
  "question": "Analyze this image...",
  "image": "subjects/GO/GOImages/example.jpg",
  ...
}
```

## Common Tasks

### Adding a New Quest
1. Create folder: `quests/[number]-[name]/`
2. Add files: `QUEST.md`, `guia.md`, `resumo.md`, `questoes.json`
3. Update `js/config.js` with new module entry
4. Update `README.md` quest map with new entry
5. Ensure sequential numbering (e.g., Quest 7 after Quest 6)

### Modifying Quest Content
1. Edit `quests/[name]/guia.md` or `resumo.md` for study materials
2. Edit `subjects/GO/AVC 2/GOQuestions/[file].json` for quiz questions
3. **DO NOT** edit the copied `questoes.json` in quests/ - edit source in subjects/

### Updating Progress Tracking
- User manually edits README.md checkboxes
- XP calculated manually based on completed quests
- Level progression: 200/400/700/1000 XP thresholds

### Resetting User Data
- Delete localStorage key: `knowledgeQuestGOAVC2`
- User can do this via browser DevTools → Application → localStorage

## Design Philosophy

### Gamification Principles Used:
1. **Clear Objectives**: Each quest has explicit learning goals
2. **Progressive Difficulty**: Quests get harder (⭐ to ⭐⭐⭐⭐)
3. **Rewards**: XP, badges, unlocks create dopamine feedback
4. **Boss Battles**: High-stakes challenges test mastery
5. **Narrative Framing**: Medical content wrapped in adventure storytelling

### Why This Works:
- **Engagement**: RPG elements make studying fun
- **Structure**: Sequential gating prevents overwhelm
- **Motivation**: Visible progress (XP bar, badges) maintains momentum
- **Flexibility**: Honor system respects user autonomy
- **Low Friction**: No login, no servers, works offline

## Technical Notes

### localStorage Schema
```javascript
{
  "userName": "User's Name",
  "moduleProgress": {
    "citologia_oncotica": {
      "lastScore": 85,
      "attempts": 2,
      "completed": true
    },
    ...
  },
  "questionStats": {
    "module_question_0": {
      "seen": 3,
      "correct": 2,
      "incorrect": 1,
      "lastSeen": "2025-11-05T12:34:56"
    },
    ...
  }
}
```

### Quiz Flow
1. User opens `index.html`
2. Selects: **GO → AVC 2 → [Quest Name]**
3. `data.js` loads JSON from `subjects/GO/AVC 2/GOQuestions/`
4. Questions displayed in original order (no shuffling)
5. User answers, sees immediate feedback
6. Results saved to localStorage
7. User returns to README.md to mark quest complete

## Maintenance Guidelines

### DO:
- Keep quest numbering sequential (01, 02, 03...)
- Maintain consistency in QUEST.md format across all quests
- Update README.md whenever adding/removing quests
- Test quiz functionality after any config.js changes

### DON'T:
- Don't break the link between config.js and actual JSON files
- Don't change localStorage key (would reset all user progress)
- Don't remove the original subjects/ folder (quiz needs those JSON files)
- Don't add quests without updating config.js

## Future Enhancement Ideas

If you want to expand this system:

1. **Automated Gating**: Use localStorage to actually block quest access
2. **Real XP Tracking**: JavaScript calculates XP from quiz results
3. **Badge Display**: Show earned badges visually on README or webpage
4. **Leaderboard**: If multiple users, compare progress
5. **Spaced Repetition**: Resurface questions user got wrong
6. **More Specialties**: Add CardioResp, ClinicaCirurgica as separate quest lines

## Troubleshooting

### Quiz not loading:
- Check browser console for errors
- Verify JSON file paths in `config.js` match actual files
- Ensure JSON is valid (no trailing commas, proper quotes)

### Progress not saving:
- Check localStorage in DevTools
- Verify storageKey matches between config.js and data.js
- Clear localStorage and try again

### Quest links broken:
- Verify file paths in README.md match actual folder structure
- Check for typos in folder names (case-sensitive on some systems)

## Repository Information
- **GitHub Repository**: https://github.com/feralog/rpg-med
- **Branch**: `claude/setup-knowledge-quest-rpg-011CUqBdXmjMEFppTjTCeJtt`
- **Purpose**: Study tool for GO AVC 2 content with RPG gamification
- **Target Users**: Medical students preparing for assessments

## Version History
- **v1.0** (Nov 2025): Initial RPG Quest implementation
  - 6 main quests created
  - 2 boss battles added
  - Honor system gating implemented
  - All non-GO content removed
  - README.md converted to character sheet format
