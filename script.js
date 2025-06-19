window.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display");
    const buttons = document.querySelectorAll('input[type="button"]');
    const errorDiv = document.getElementById("error-message");
    const clearBtn = document.getElementById("clear-button");
    const toggleBtn = document.getElementById("toggle-functions");
    const functionSection = document.getElementById("function-buttons");

    const allowedKeys = "0123456789+-*/.=()^";
    
    const savedState = localStorage.getItem("functionPanelVisible");
    const isVisible = savedState !== "false";
    functionSection.classList.toggle("hidden", !isVisible);
    toggleBtn.value = isVisible ? "🔼" : "🔽";

    toggleBtn.addEventListener("click", () => {
        const isNowHidden = functionSection.classList.toggle("hidden");
        localStorage.setItem("functionPanelVisible", !isNowHidden);
        toggleBtn.value = isNowHidden ? "🔽" : "🔼";
    });
    buttons.forEach(button => {
        const value = button.value;
        if (button.id === "toggle-functions" || button.id === "clear-button") return;

        button.addEventListener("click", () => {
            try {
                switch (value) {
                    case "=":
                        evaluateExpression();
                        break;
                    case "%":
                        display.value = eval(display.value) / 100;
                        break;
                    case "√":
                        const sqrtVal = eval(display.value);
                        display.value = sqrtVal < 0 ? "Error" : Math.sqrt(sqrtVal);
                        break;
                    case "x²":
                        display.value = Math.pow(eval(display.value), 2);
                        break;
                    case "xʸ":
                        display.value += "^";
                        break;
                    case "+/-":
                        const match = display.value.match(/(-?\d+(\.\d+)?)$/);
                        if (match) {
                            const number = match[0];
                            const toggled = number.startsWith('-') ? number.slice(1) : '-' + number;
                            display.value = display.value.slice(0, -number.length) + toggled;
                        }
                        break;
                    case "log":
                        const logVal = eval(display.value);
                        display.value = logVal <= 0 ? "Error" : Math.log10(logVal);
                        break;
                    case "1/x":
                        const inverse = eval(display.value);
                        display.value = inverse === 0 ? "Error" : 1 / inverse;
                        break;
                    case "x!":
                        const num = eval(display.value);
                        if (num < 0 || !Number.isInteger(num)) {
                            display.value = "Error";
                        } else {
                            let fact = 1;
                            for (let i = 2; i <= num; i++) {
                                fact *= i;
                            }
                            display.value = fact;
                        }
                        break;
                    default:
                        display.value += value;
                }
            } catch {
                display.value = "Error";
            }
        });
    });

    clearBtn.addEventListener("click", () => {
        display.value = "";
    });

    display.addEventListener("keydown", (e) => {
        const key = e.key;

        if (key === "Enter") {
            e.preventDefault();
            evaluateExpression();
        } else if (key === "Escape") {
            display.value = "";
        } else if (!allowedKeys.includes(key) && key.length === 1) {
            e.preventDefault();
            display.value = "";
            showError();
        }
    });

    function evaluateExpression() {
        try {
            let expression = display.value;
            expression = expression.replace(/(\d+(\.\d+)?|\))\^(\d+(\.\d+)?)/g, (match, base, _, exponent) => {
                return `Math.pow(${base},${exponent})`;
            });
            const result = eval(expression);
            display.value = result;
        } catch {
            display.value = "Error";
        }
    }

    function showError() {
        errorDiv.textContent = "⚠️ Caution: You can't use alphabet in the calculator.";
        errorDiv.style.display = "block";
        errorDiv.style.opacity = "1";

        setTimeout(() => {
            errorDiv.style.opacity = "0";
            setTimeout(() => {
                errorDiv.style.display = "none";
            }, 500);
        }, 5000);
    }
});
