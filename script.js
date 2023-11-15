const generatorForm = document.querySelector(".generate-form")
const imageGallery = document.querySelector(".image-gallery")

const OPENAI_API_KEY = "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";

const updatImageCard = (imgDataArray) => {
    imageGallery.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");;

        // Set the image source to the AI-generated image data
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        // When the image is loaded, remove the loadin class and set download attributes
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}
const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        //Send a request to the Openai API to generate images based on user inputs
        const resonse = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if(!resonse.ok) throw new Error("Failed to generate images! Please try again.");

        const { data } = await resonse.json(); // Get data from the response
        // console.log(data)
        updateImageCard([...data])
    } catch (error) {
        // console.log(error);
        alert(error.message);
    }
}
const handleFormSubmission = (e) => {
    e.preventDefault();

    //  Get user input and image quantity values from the form
    // console.log(e.srcElement);
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    // Creation markup for image cards with loading state
    // console.log(userPrompt, userImgQuantity);
    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
    `<div class="img-card loading">
        <img src="images/loader.svg" alt="image">
        <a href="#" class="download-btn">
            <img src="images/download.svg" alt="download icon">
        </a>
    </div>`
    ).join("");

    // console.log(imgCardMarkup);
    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}
generatorForm.addEventListener("submit", handleFormSubmission);