document.addEventListener("DOMContentLoaded", () => {
    const lengthDisplay = document.querySelector("[data-length-display]");
    const lengthSlider = document.querySelector("[data-length-slider]");
    const passwordDisplay = document.querySelector("[data-password-display]");
    const copyBtn = document.querySelector("[data-copy-btn]");
    const copyMessage = document.querySelector("[data-copy-message]");
    const strengthIndicator = document.querySelector("[data-strength-indicator]");
    const generateBtn = document.querySelector("[data-generate-btn]");
    const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");

    const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + symbols;

    let password = "";
    let passwordLength = 10;
    let checkCount = 0;
    handleSlider();

    function handleSlider() {
        lengthSlider.value = passwordLength;
        lengthDisplay.innerText = passwordLength;
        const min = lengthSlider.min;
        const max = lengthSlider.max;
        const percent = ((passwordLength - min) * 100) / (max - min);
        lengthSlider.style.background = `linear-gradient(to right, var(--primary) ${percent}%, rgba(0,0,0,0.4) ${percent}%)`;
    }

    lengthSlider.addEventListener("input", (e) => {
        passwordLength = e.target.value;
        handleSlider();
    });
    
    function setIndicator(color) {
        strengthIndicator.style.backgroundColor = color;
        strengthIndicator.style.boxShadow = `0 0 12px 1px ${color}`;
    }
    setIndicator("#444");

    function getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function generateRandomNumber() {
        return getRandomInteger(0, 10);
    }

    function generateLowercase() {
        return String.fromCharCode(getRandomInteger(97, 123));
    }

    function generateUppercase() {
        return String.fromCharCode(getRandomInteger(65, 91));
    }

    function generateSymbol() {
        const randNum = getRandomInteger(0, symbols.length);
        return symbols.charAt(randNum);
    }
    
    function calculateStrength() {
        let hasUpper = false;
        let hasLower = false;
        let hasNum = false;
        let hasSym = false;

        if (document.getElementById("uppercase").checked) hasUpper = true;
        if (document.getElementById("lowercase").checked) hasLower = true;
        if (document.getElementById("numbers").checked) hasNum = true;
        if (document.getElementById("symbols").checked) hasSym = true;

        if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
            setIndicator("var(--strength-strong)");
        } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
            setIndicator("var(--strength-medium)");
        } else {
            setIndicator("var(--strength-weak)");
        }
    }

    async function copyContent() {
        try {
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyMessage.innerText = "Copied!";
        } catch (e) {
            copyMessage.innerText = "Failed";
        }
        copyMessage.classList.add("active");
        setTimeout(() => copyMessage.classList.remove("active"), 2000);
    }

    copyBtn.addEventListener("click", () => {
        if (passwordDisplay.value) {
            copyContent();
        }
    });

    function shufflePassword(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join("");
    }
    
    function handleCheckBoxChange() {
        checkCount = 0;
        allCheckBoxes.forEach((checkbox) => {
            if (checkbox.checked) checkCount++;
        });

        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }
    }

    allCheckBoxes.forEach((checkbox) => {
        checkbox.addEventListener("change", handleCheckBoxChange);
    });

    // Scramble animation
    const animatePasswordDisplay = (finalPassword) => {
        let i = 0;
        const scrambleInterval = setInterval(() => {
            let scrambledText = "";
            for (let j = 0; j < finalPassword.length; j++) {
                scrambledText += characters[Math.floor(Math.random() * characters.length)];
            }
            passwordDisplay.value = scrambledText;

            i++;
            if (i > 15) { // Run for about 15 frames
                clearInterval(scrambleInterval);
                passwordDisplay.value = finalPassword;
            }
        }, 30);
    };

    generateBtn.addEventListener("click", () => {
        if (checkCount <= 0) return;

        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }

        // Add button click animation
        generateBtn.classList.add('clicked');
        setTimeout(() => generateBtn.classList.remove('clicked'), 300);

        password = "";
        
        let funcArr = [];
        if (document.getElementById("uppercase").checked) funcArr.push(generateUppercase);
        if (document.getElementById("lowercase").checked) funcArr.push(generateLowercase);
        if (document.getElementById("numbers").checked) funcArr.push(generateRandomNumber);
        if (document.getElementById("symbols").checked) funcArr.push(generateSymbol);

        // Compulsory additions
        for (let i = 0; i < funcArr.length; i++) {
            password += funcArr[i]();
        }

        // Remaining additions
        for (let i = 0; i < passwordLength - funcArr.length; i++) {
            let randIndex = getRandomInteger(0, funcArr.length);
            password += funcArr[randIndex]();
        }

        password = shufflePassword(Array.from(password));
        
        animatePasswordDisplay(password);
        calculateStrength();
    });
});