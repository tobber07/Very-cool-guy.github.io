document.getElementById('charFile').addEventListener('change', function(e) {
    let file = e.target.files[0];
                    
    let reader = new FileReader();

    reader.onload = function(event) {
        let data = JSON.parse(event.target.result);
        document.getElementById('name').value = data["name"];
        document.getElementById("raceSelector").value = data["race"];
        selectedRace = data["race"];
        statId.forEach(stat => {
            console.log(stat,data["stats"][stat])
            document.getElementById(`${stat}Def`).value = data["stats"][stat]
        })
        document.getElementById('classSelector').value = data["class"];
        selectedClass = data["class"];
        document.getElementById('level').value = data["level"];
        updLevel(data["level"]);
        let choices = document.getElementsByClassName("choiceAbility");
        let count = 0
        let choicesArray = Array.from(choices);
        choicesArray.forEach(choice => {
            choice.value = data["choices"][count]
            count++;
        })
        classSkill();
        skillAmount = data["skills"].length;
        document.getElementById("skillAmo").textContent = classStat[selectedClass].skill_amount - skillAmount;;
        console.log(skillAmount);
        data["skills"].forEach(skill => {
            console.log(skill);
            document.getElementById(skill).checked = true;
        })
        updSkillsAll();
        updAll();
        calcHp();
        console.log("whar");
        updSkillsAll();
        };
    reader.readAsText(file);
});