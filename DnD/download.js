function readAndDisplay() {
    let checkedSkills = [];
    skillId.forEach(skill => {
        if(document.getElementById(skill).checked) {checkedSkills.push(skill)}
    })
    choicesSaved = [];
    let choices = document.getElementsByClassName("choiceAbility");
    let choicesArray = Array.from(choices);
    choicesArray.forEach(choice => {
        choicesSaved.push(choice.value)
    })

    let data = {
        name: document.getElementById("name").value,
        race: document.getElementById("raceSelector").value,
        stats: {
            str: document.getElementById("strDef").value,
            con: document.getElementById("conDef").value,
            agi: document.getElementById("agiDef").value,
            int: document.getElementById("intDef").value,
            wis: document.getElementById("wisDef").value,
            chr: document.getElementById("chrDef").value,
        },
        class: document.getElementById("classSelector").value,
        level: document.getElementById("level").value,
        skills: checkedSkills,
        choices: choicesSaved
    }

    let json = JSON.stringify(data,null,2);
    document.getElementById("result").textContent = json;

    let blob = new Blob([json], {type: 'application/json'});
    let url = URL.createObjectURL(blob);

    let link = document.createElement('a');
    link.href = url;
    link.download = data["name"]+".json";
    link.click();
    URL.revokeObjectURL(url);

}