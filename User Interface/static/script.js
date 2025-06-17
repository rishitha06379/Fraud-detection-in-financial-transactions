document.getElementById("fraudForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "Processing...";
    resultDiv.className = "";

    try {
        const dt = new Date(document.getElementById("datetime").value);
        
        const data = {
            Transaction_Amount: parseFloat(document.getElementById("transactionAmount").value),
            Transaction_Type: parseInt(document.getElementById("transactionType").value),
            Account_Balance: parseFloat(document.getElementById("accountBalance").value),
            Device_Type: parseInt(document.getElementById("deviceType").value),
            Previous_Fraudulent_Activity: parseInt(document.getElementById("previousFraud").value),
            Daily_Transaction_Count: parseInt(document.getElementById("dailyCount").value),
            Avg_Transaction_Amount_7d: parseFloat(document.getElementById("avg7d").value),
            Failed_Transaction_Count_7d: parseInt(document.getElementById("failed7d").value),
            Card_Type: parseInt(document.getElementById("cardType").value),
            Transaction_Distance: parseFloat(document.getElementById("distance").value),
            Authentication_Method: parseInt(document.getElementById("authMethod").value),
            Is_Weekend: parseInt(document.getElementById("isWeekend").value),
            Year: dt.getFullYear(),
            Month: dt.getMonth() + 1,
            Day: dt.getDate(),
            Hour: dt.getHours(),
            Minute: dt.getMinutes(),
            Second: dt.getSeconds(),
            IP_Address_Flag: parseInt(document.getElementById("ipAddressFlag").value)
        };

        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || "Prediction failed");
        }

        resultDiv.className = result.prediction === 'Fraudulent' ? 'error' : 'success';
        resultDiv.innerHTML = `
            ${result.prediction === 'Fraudulent' ? '🚨 Fraudulent' : '✅ Safe'} Transaction<br>
            Confidence: ${result.confidence}%<br>
            Fraud Probability: ${result.fraud_probability}%
        `;
        
    } catch (error) {
        resultDiv.className = 'error';
        resultDiv.textContent = error.message;
        console.error("Error:", error);
    }
});