document.getElementById('start').addEventListener('click', function(){
    startSignalSequence();
});

document.getElementById('stop').addEventListener('click', function(){
    stopSignalSequence();
});

let timer;
let currentLightIndex = 0;

function startSignalSequence(){
    const sequence = [
        { light: "A", order: parseInt(document.getElementById('seqA').value) },
        { light: "B", order: parseInt(document.getElementById('seqB').value) },
        { light: "C", order: parseInt(document.getElementById('seqC').value) },
        { light: "D", order: parseInt(document.getElementById('seqD').value) }
    ];

    const greenInterval = parseInt(document.getElementById('greenInterval').value) * 1000;
    const yellowInterval = parseInt(document.getElementById('yellowInterval').value) * 1000;

    if (!isVaildSequence(sequence) || isNaN(greenInterval) || isNaN(yellowInterval))
    {
        alert("Please enter valid sequence values (1-4) and numeric intervals.");
        return;
    }

    sequence.sort((a,b) => a.order - b.order);

    fetch('process.php', {
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sequence: sequence.map(item => item.order),
            greenInterval: greenInterval,
            yellowInterval: yellowInterval
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            startSequence(sequence, greenInterval, yellowInterval);
        }else{
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:' , error);
    });

}

function isVaildSequence(sequence){

    return sequence.every(item => !isNaN(item.order) && item.order >=1 && item.order <=4);
}

function startSequence(sequence, greenInterval, yellowInterval){
    resetLights();
    currentLightIndex = 0;
    changeLight(sequence, greenInterval, yellowInterval);

    timer  = setInterval(() => {

        currentLightIndex++;

        if (currentLightIndex >= sequence.length){
            clearInterval(timer);
            resetLights();
        }else{
            changeLight(sequence, greenInterval, yellowInterval);
        }
    }, greenInterval + yellowInterval * 2);
}

function changeLight(sequence, greenInterval, yellowInterval){

    if(currentLightIndex < sequence.length){
        const lightId = sequence[currentLightIndex].light;
        const light = document.getElementById(lightId);

        light.classList.remove('red');
        light.classList.add('green');

        setTimeout(() => {

            light.classList.remove('green');
            light.classList.add('yellow');
        }, greenInterval);

        setTimeout(() => {

            light.classList.remove('yellow');
            light.classList.add('red');

        }, greenInterval + yellowInterval);
    }
}

function stopSignalSequence()
    {
        clearInterval(timer);
        resetLights();
    }

function resetLights(){

    document.querySelectorAll('.signal').forEach(signal => {
        signal.classList.remove('green', 'yellow');
        signal.classList.add('red');
    });
}
