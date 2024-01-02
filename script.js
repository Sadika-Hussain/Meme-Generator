// Elements selection
const imgContainer = document.querySelector('#images');
const memeContainer = document.querySelector('.memeContainer');
const form = document.querySelector('.formContainer');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const imgInput = document.getElementById('imageURL');
const imgWidth = document.getElementById('imageWidth');
const imgHeight = document.getElementById('imageHeight');
const fontInput = document.getElementById('fontSize');
const submitBtn = document.getElementById('submit');
const resetBtn = document.getElementById('resetBtn');

// Event Listeners
submitBtn.addEventListener('click', displayImage); // Display meme upon form submission 
resetBtn.addEventListener('click', generateNewMeme); // Reset form for new inputs 

// Function to create and display the image on canvas 
function displayImage(e) {
    e.preventDefault();

    //Create canvas elements
    const canvasContainer = document.createElement('div');
    const myCanvas = document.createElement('canvas');
    const removeImgTextContainer = document.createElement('div');
    const removeImgText = document.createElement('p');

    // Retrieve user inputs
    let canvasWidth = imgWidth.value || 600; // Default canvas width if not specified by user
    let canvasHeight = imgHeight.value || 400; // Default canvas height if not specified by user
    let fontSize = fontInput.value;

    // Setting classes and content for canvas elements 
    canvasContainer.className = 'canvasContainer';
    removeImgText.innerText = 'Click to delete image';
    removeImgTextContainer.className = 'removeImage';
    removeImgTextContainer.appendChild(removeImgText);
    canvasContainer.appendChild(myCanvas);
    canvasContainer.appendChild(removeImgTextContainer);
    myCanvas.setAttribute('width', canvasWidth);
    myCanvas.setAttribute('height', canvasHeight);

    // Get canvas context and user inputs for image and text
    const ctx = myCanvas.getContext('2d');
    const imgURL = imgInput.value.trim();
    const topTextValue = topTextInput.value.trim();
    const bottomTextValue = bottomTextInput.value.trim();

    // Display image on canvas if URL is provided
    if (imgURL) {
        // Show/hide containers
        imgContainer.classList.remove('hideMe');
        form.classList.add('hideMe');

        const img = document.createElement('img');
        img.onload = function() {
            ctx.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);

            // Set font size dynamically if not provided by user
            if (!fontSize) {
                fontSize = Math.min(myCanvas.width / 10, myCanvas.height / 10); 
            }

            ctx.font = `${fontSize}px 'Impact', sans-serif`; 
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'black';

            const maxWidth = canvasWidth - 20; // Margin for textwrapping
            const linespacing = 0.8 * fontSize; // Vertical spacing between lines 
            const lineHeight = 10; // Extra spacing for cleaner text layout and appearance 
            
            // Wrap and draw top and bottom text on canvas
            wrapTopText(ctx, topTextValue, maxWidth, lineHeight, canvasWidth, canvasHeight, linespacing);
            wrapBottomText(ctx, bottomTextValue, maxWidth, lineHeight, canvasWidth, canvasHeight, linespacing);
        };

        img.src = imgURL;
        // Reset input fields
        imgInput.value = '';
        topTextInput.value = '';
        imgWidth.value = '';
        imgHeight.value = '';
        fontInput.value = '';
        bottomTextInput.value = '';
        memeContainer.prepend(canvasContainer);
    } else {
        alert("Please enter an image URL.");
    }

    // Remove canvas container on click
    myCanvas.addEventListener('click', function(e) {
        e.target.parentElement.remove();
    });
}

// Function to reset the form
function generateNewMeme() {
    form.classList.remove('hideMe'); // Show form 
    imgContainer.classList.add('hideMe'); // Hide image container 
}


// Function to wrap text for top placement on canvas
function wrapTopText(ctx, text, maxWidth, lineHeight, canvasWidth, canvasHeight, linespacing) {
    const lines = wrapText(ctx, text, maxWidth, lineHeight);
    
    let startY = canvasHeight * 0.1; // Position text at 10% of canvas height

    // Adjust start position if canvas height is larger
    if (canvasHeight > canvasWidth) {
        startY = canvasHeight * 0.05; 
    }
    drawText(ctx, lines, canvasWidth, startY, lineHeight, linespacing);
}

// Function to wrap text for bottom placement on canvas
function wrapBottomText(ctx, text, maxWidth, lineHeight, canvasWidth, canvasHeight, linespacing) {
    const lines = wrapText(ctx, text, maxWidth, lineHeight);

    const totalTextHeight = (lines.length - 1) * (lineHeight + linespacing) + lineHeight;
    let startY = canvasHeight - totalTextHeight;

    drawText(ctx, lines, canvasWidth, startY, lineHeight, linespacing);
}

// Function to wrap longer text inputs
// Splits the text into words and wraps it based on the provided maximum width. 
// It calculates how the text should wrap within the canvas.
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (const word of words) {
        const testLine = line + word + ' ';
        const testWidth = ctx.measureText(testLine).width; // Measers line width in pixels 

        if (testWidth > maxWidth && line !== '') {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    return lines;
}

// Function to render text on canvas using the Canvas API's fillText() and strokeText() functions.
function drawText(ctx, lines, canvasWidth, startY, lineHeight, linespacing) {
    // Renders each line of text from the 'lines' array onto the canvas
    lines.forEach((line, index) => {
        ctx.fillText(line.trim(), canvasWidth / 2, startY + index * (lineHeight + linespacing));
        ctx.strokeText(line.trim(), canvasWidth / 2, startY + index * (lineHeight + linespacing));
    });
}