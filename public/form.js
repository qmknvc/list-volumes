const form      = document.querySelector("#usbForm");
const emailInput  = document.querySelector('input:first-of-type')
const phoneInput  = document.querySelector('input:last-of-type')
const submitButton  = document.querySelector("button")
const statusMessage = document.querySelector("#status");
submitButton.addEventListener("click", async (action) => {
    action.preventDefault();
    statusMessage.textContent = `Processing...`
    if (!emailInput.value){
        statusMessage.textContent = `Please enter a name!`
        return
    }
    if (!phoneInput.value){
        statusMessage.textContent = `Please enter a phone number!`
        return
    }
    try { await handleForm() } catch (error) { throw error }
    submitButton.disabled = true
});

const handleForm = async () => {
    const formData = {
        user_email: emailInput.value,
        user_phone: phoneInput.value
    }
    const res = await fetch('/form', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    if (res.ok) {
        let countdown = 3;
        statusMessage.textContent = `Access granted. Closing in ${countdown}...`;
        submitButton.style.backgroundColor = "green"
        form.reset()

        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                statusMessage.textContent = `Access granted. Closing in ${countdown}...`;
                return
            }
            clearInterval(interval);
            window.close();
        }, 1000);
    };
}

const checkUSBRemoval = async () => {
    try {
        const response = await fetch('/form-removed');
        const formStatus = await response.json();
        if (formStatus === null) {
          window.close();
        }
      } catch (error) { console.error(error) }
};
  
setInterval(checkUSBRemoval, 2000);