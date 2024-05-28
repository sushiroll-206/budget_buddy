async function netIncome() {

    try {
        // GET income
        console.log("Getting projected income");
        const response = await fetch(`api/${apiVersion}/myBudgetCalcs/projectedIncome`);
        const incomes = await response.json(); 
        const projectedDisplay = document.getElementById("projectedIncome");
        projectedDisplay.innerHTML = '';
        let totalIncome = 0;

        if (incomes.length === 0) {
            projectedDisplay.innerHTML = '<p>No incomes found.</p>';
            return;
        }
        else {
            incomes.forEach(income => {
                totalIncome += income.amount;
            });
        }

        let incomeHTML = `<p>This is your total income: $${totalIncome}</p>`;

        projectedDisplay.innerHTML = incomeHTML;

        // GET expenses
    }
    catch(error) {
        console.error('Error fetching users:', error);
    }

}