async function netIncome() {

    try {
        // GET income
        console.log("Getting projected income");
        const iResponse = await fetch(`api/${apiVersion}/myBudgetCalcs/projectedIncome`);
        const incomes = await iResponse.json(); 
        const projectedIncome = document.getElementById("projectedIncome");
        projectedIncome.innerHTML = '';
        let totalIncome = 0;
  
        if (incomes.length === 0) {
            projectedIncome.innerHTML = '<p>No incomes found.</p>';
            return;
        }
        else {
            incomes.forEach(income => {
                totalIncome += income.amount;
            });
        }
  
        let incomeHTML = `<p>This is your total Projected Income: $${totalIncome}</p>`;
        projectedIncome.innerHTML = incomeHTML;
  
        // GET expenses
        console.log("Getting projected expenses");
        const eResponse = await fetch(`api/${apiVersion}/myBudgetCalcs/projectedExpense`);
        const expenses = await eResponse.json(); 
        const projectedExpense = document.getElementById("projectedExpense");
        projectedExpense.innerHTML = '';
        let totalExpense = 0;
  
        if (expenses.length === 0) {
            projectedExpense.innerHTML = '<p>No expenses found.</p>';
            return;
        }
        else {
            expenses.forEach(expense => {
                totalExpense += expense.amount;
            });
        }
  
        let expenseHTML = `<p>This is your total Projected Expenses: $${totalExpense}</p>`;
        projectedExpense.innerHTML = expenseHTML;
  
        // Calculate Net Income
        const projectedNI = document.getElementById("projectedNI");
        projectedNI.innerHTML = '';
        let totalNI = totalIncome - totalExpense;
        let nIHTML = `<p>This is your projected Net Income: $${totalNI}</p>`;
        projectedNI.innerHTML = nIHTML;
    } catch(error) {
        console.error('Error fetching users:', error);
    }
  
  }