var currentLevel = document.getElementById("level").value
console.log(currentLevel)
const LevelContainer = document.getElementById("levelAbilities")


function updLevel(levelNum) {
    LevelContainer.innerHTML='';
    let passiveCount = 0;
    let activeCount = 0;
    let choiceCount = 0;
    for (const [level, levelData] of Object.entries(classStat[selectedClass].levels)) {
        if(levelNum >= level) {
        let div = document.createElement('div');
        div.id = level;
    levelData.features.forEach(feature => {
        if(feature.type === 'passive') {
            passiveCount++
            let passive = document.createElement('div');
            passive.id = `passive_${passiveCount}`
            passive.className = "passiveAbility";
            passive.innerHTML = `<h3>✨${feature.name}</h3>
                                    <p>${feature.description.substring(0,100)}</p>
                                `;
            div.appendChild(passive);

        }
        if(feature.type === 'active') {
            activeCount++;
            let active = document.createElement('div');
            active.id = `active_${activeCount}`;
            active.className = "activeAbility";
            active.innerHTML = `<h3>🧨${feature.name}</h3>
<p>${feature.description.substring(0,100)}</p>
<p>When: ${feature.usage}</p>
<p>How much: ${feature.amount}</p>
<p>Recovery: ${feature.recovery}</p>
`
            div.appendChild(active)
        }
        if(feature.type === 'choice') {
            choiceCount++;
            let butt = document.createElement('h3');
            butt.innerText = `📜${feature.name}`;
            let choice = document.createElement('select');
            choice.id = `choice_${choiceCount}`
            choice.className = "choiceAbility";
            choice.innerHTML = `
            <option>--Choose--</option>"
            `
            for (const [key,option] of Object.entries(feature.options)) {
                let cho = document.createElement("option");
                cho.value = key;
                cho.id = key;
                cho.innerText = option.name;
                choice.appendChild(cho)
            };
            div.appendChild(butt)
            div.appendChild(choice);
        }
    })
    LevelContainer.appendChild(div);
}}
}