let raceStat = null;
async function loadData() {
    const response = await fetch('raceStat.json');
    const response2 = await fetch('classStat.json');
    raceStat = await response.json();
    classStat = await response2.json();
    createRaces();
    createClass();
    createStatInputs();
    createSkills();
    addLevelUpdate();
    updAll();
    updSkillsAll();
}

const statId = ["str","agi","con","int","wis","chr"];
const statNames = {str: 'Strength', agi: 'Agility', con: 'Constitution', int: 'Intellect', wis: 'Wisdom', chr: 'Charisma'};
const skillId = ["athletics","acrobatics","sleight_of_hands","stealth","arcana","history","investigation","nature","religion","animal_handling","insight","medicine","perception","survival","deception","intimidation","performance","persuasion"];
const skillName = {athletics:"athletics",acrobatics:"acrobatics",sleight_of_hands:"sleight_of_hands",stealth:"stealth",arcana:"arcana",history:"history",investigation:"investigation",nature:"nature",religion:"religion",animal_handling:"animal_handling",insight:"insight",medicine:"medicine",perception:"perception",survival:"survival",deception:"deception",intimidation:"intimidation",performance:"performance",persuasion:"persuasion"};
const skillStat = {athletics:"str",acrobatics:"agi",sleight_of_hands:"agi",stealth:"agi",arcana:"int",history:"int",investigation:"int",nature:"int",religion:"int",animal_handling:"wis",insight:"wis",medicine:"wis",perception:"wis",survival:"wis",deception:"chr",intimidation:"chr",performance:"chr",persuasion:"chr"};
var statValue = {str:10,agi:10,con:10,int:10,wis:10,chr:10};
var selectedRace = '';
var selectedClass ='';
var skillAmount = 0;
var statPoints = 27;


function statCalc(stat) {
    let result = Math.floor((stat - 10) / 2)
    return result
}

function updStat(stat) {
    let base = document.getElementById(`${stat}Def`).value;
    statValue[stat] = base;
    let bonus = getRacialBonus(stat);
    let total = Number(base) + Number(bonus);
    let modifier = statCalc(total);

    document.getElementById(`${stat}`).textContent = total;
    document.getElementById(`${stat}Mod`).textContent = modifier;
    document.getElementById("pointsLeft").textContent = statPoints;
}

function updAll() {
    statId.forEach(stat => updStat(stat));
}

function createStatInputs(){
    let container = document.getElementById("statWrapper");
    container.innerHTML = '';
    statId.forEach(stat => {
        let div = document.createElement('div');
        div.className = 'stat-row';
        div.innerHTML = `
                    ${statNames[stat]}:
                    <input type="number" max="20" min="1" step="1" id="${stat}Def" value="10">
                    `;
        container.appendChild(div);
        document.getElementById(`${stat}Def`).addEventListener('change', function() {
            if(this.value > 20){
                this.value = 20;
            };
            if (this.value < 1){
                this.value = 1;
            };
            if(statValue[stat] > this.value) {
                statPoints += statValue[stat] - this.value;
            }
            else {
                statPoints -=  this.value - statValue[stat];
            }
            if(statPoints < 0) {
                this.value = Number(this.value) + Number(statPoints);
                statPoints = 0
            }
            updStat(stat);
            updSkillsAll();
        });
    });
    document.getElementById("conDef").addEventListener("change", () => calcHp());
};

function createRaces() {
    let select = document.getElementById("raceSelector")
    for (const [key,race] of Object.entries(raceStat)) {
        allRace = document.createElement('option');
        allRace.value = key;
        allRace.id = key;
        allRace.textContent = race.name;
        select.appendChild(allRace);
    }
    document.getElementById("raceSelector").addEventListener("change", (e) => {
        selectedRace = e.target.value;
        updAll();
        updSkillsAll();
    });
}

function getRacialBonus(stat){
    if (!raceStat || !raceStat[selectedRace]) return 0;
    return raceStat[selectedRace].stats[stat] || 0;
}

function createClass() {
    let select =  document.getElementById("classSelector")
    for (const [key,clas] of Object.entries(classStat)) {
        allClass = document.createElement('option');
        allClass.value = key;
        allClass.id = key;
        allClass.textContent = clas.name;
        select.appendChild(allClass);
    }
    select.addEventListener("change", (e) => {
        selectedClass = e.target.value;
        calcHp();
        classSkill();
        updLevel(document.getElementById("level").value);
        document.getElementById("skillAmo").textContent = classStat[selectedClass].skill_amount;
    });
}

function createSkills(){
    let container = document.getElementById("skillWrapper")
    let div = document.createElement("div");
    div.innerHTML = `Choose <span id="skillAmo"></span> skills`
    container.appendChild(div)
    skillId.forEach(skill => {
        let div = document.createElement("div");
        div.className = 'skill-row';
        div.innerHTML = `${skillName[skill]}<input type="checkbox" id=${skill} style="display:none" class="check"> <span id=${skill}Num></span>`
        container.appendChild(div)
        document.getElementById(skill).addEventListener("change", () => {
            if(document.getElementById(skill).checked) {
                skillAmount += 1
            }
            else {
                skillAmount -= 1
            };
            if(skillAmount > classStat[selectedClass].skill_amount) {
                document.getElementById(skill).checked = false;
                skillAmount -= 1;
            };
            document.getElementById("skillAmo").textContent = classStat[selectedClass].skill_amount - skillAmount;
            updSkills(skill)
        });
    })
}

function addLevelUpdate(){
    document.getElementById("level").addEventListener("change", () => calcHp());
    document.getElementById("level").addEventListener("change", () => updLevel(document.getElementById("level").value));
}

function updSkills(skill) {
    let baseStatName = skillStat[skill];
    let baseStatNum = Number(document.getElementById(`${baseStatName}Mod`).innerText);
    if(document.getElementById(skill).checked){ baseStatNum += 2};
    document.getElementById(`${skill}Num`).innerText = baseStatNum;
}

function updSkillsAll() {
    skillId.forEach(skill => updSkills(skill));
}

function classSkill() {
    skillId.forEach(skill => {
        document.getElementById(skill).style.display = "none";
        document.getElementById(skill).checked = false;
        skillAmount = 0;
    })
    classStat[selectedClass].skills.forEach(skill => {
        document.getElementById(skill).style.display = "inline";
    })
}

function calcHp(){
    const LvL = document.getElementById("level").value;
    const curHp = document.getElementById("currentHp")
    var mod = Number(document.getElementById("conMod").innerText)
    if (mod<1) {mod = 1};
    if (LvL == 1) {curHp.innerText = classStat[selectedClass].hpBase + mod}
    else { curHp.innerText = classStat[selectedClass].hpBase + mod + (classStat[selectedClass].hpGrow + mod) * (LvL-1)};
}

loadData();