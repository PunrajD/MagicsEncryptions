async function handleFileDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file || !file.name.endsWith('.magic')) {
        alert("Please drop a valid .magic file");
        return;
    }

    const fileText = await file.text();
    const [encodedTime, ...rest] = fileText.trim().split(" ");
    const encodedText = rest.join(" ");

    const algorithm = await fetch("algorithm.json").then(res => res.json());

    const matchingTimeEntry = Object.entries(algorithm).find(
        ([_, data]) => data["time_code"] === encodedTime
    );

    if (!matchingTimeEntry) {
        document.getElementById("output").textContent = "Invalid timestamp or time code in .magic file.";
        return;
    }

    const [time, data] = matchingTimeEntry;
    const alphabetMapping = data["A"];
    const sampleLength = Object.values(alphabetMapping)[0].length;

    let decodedText = '';
    let i = 0;
    while (i < encodedText.length) {
        const charGroup = encodedText.slice(i, i + sampleLength);
        
        const decodedChar = Object.entries(alphabetMapping).find(
            ([_, mappedChars]) => mappedChars === charGroup
        );

        if (decodedChar) {
            decodedText += decodedChar[0];
            i += sampleLength;
        } else {
            decodedText += encodedText[i];
            i += 1;
        }
    }

    const outputElement = document.getElementById("output");
    outputElement.textContent = `${time} - ${decodedText}`;
    outputElement.style.height = "auto";
    outputElement.style.height = `${outputElement.scrollHeight}px`;
}
