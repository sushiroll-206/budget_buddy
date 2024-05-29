async function proNetIncome() {

    try {
        // GET Projected Income
        console.log("Getting projected income");
        const iResponse = await fetch(`api/${apiVersion}/myBudgetCalcs/projectedIncome`);
        const incomes = await iResponse.json(); 
        const projectedIncome = document.getElementById("projectedIncome");
        projectedIncome.innerHTML = '';
        let totalIncome = 0;
  
        if (incomes.length === 0) {
            projectedIncome.innerHTML = '<p>No incomes found.</p>';
        }
        else {
            incomes.forEach(income => {
                totalIncome += income.amount;
            });
        }
  
        let incomeHTML = `<p>This is your total Projected Income: $${totalIncome}</p>`;
        projectedIncome.innerHTML = incomeHTML;
  
        // GET Projected Expenses
        console.log("Getting projected expenses");
        const eResponse = await fetch(`api/${apiVersion}/myBudgetCalcs/projectedExpense`);
        const expenses = await eResponse.json(); 
        const projectedExpense = document.getElementById("projectedExpense");
        projectedExpense.innerHTML = '';
        let totalExpense = 0;
  
        if (expenses.length === 0) {
            projectedExpense.innerHTML = '<p>No expenses found.</p>';
        }
        else {
            expenses.forEach(expense => {
                totalExpense += expense.amount;
            });
        }
  
        let expenseHTML = `<p>This is your total Projected Expenses: $${totalExpense}</p>`;
        projectedExpense.innerHTML = expenseHTML;
  
        // Calculate Projected Net Income
        const projectedNI = document.getElementById("projectedNI");
        projectedNI.innerHTML = '';
        let totalNI = totalIncome - totalExpense;
        let nIHTML = `<p>This is your projected Net Income: $${totalNI}</p>`;
        projectedNI.innerHTML = nIHTML;
    } catch(error) {
        console.error('Error fetching budget:', error);
    }
  
  }

async function actNetIncome() {
    try {
        // GET Actual Income
        console.log("Getting actual income");
        const iResponse = await fetch(`api/${apiVersion}/myBudgetCalcs/actualIncome`);
        const incomes = await iResponse.json(); 
        const actualIncome = document.getElementById("actualIncome");
        actualIncome.innerHTML = '';
        let totalIncome = 0;
  
        if (incomes.length === 0) {
            actualIncome.innerHTML = '<p>No incomes found.</p>';
        }
        else {
            incomes.forEach(income => {
                totalIncome += income.amount;
            });
        }
  
        let incomeHTML = `<p>This is your total Actual Income: $${totalIncome}</p>`;
        actualIncome.innerHTML = incomeHTML;
  
        // GET Act Expenses
        console.log("Getting actual expenses");
        const eResponse = await fetch(`api/${apiVersion}/myBudgetCalcs/actualExpense`);
        const expenses = await eResponse.json(); 
        const actualExpense = document.getElementById("actualExpense");
        actualExpense.innerHTML = '';
        let totalExpense = 0;
  
        if (expenses.length === 0) {
            actualExpense.innerHTML = '<p>No expenses found.</p>';
        }
        else {
            expenses.forEach(expense => {
                totalExpense += expense.amount;
            });
        }
  
        let expenseHTML = `<p>This is your total Actual Expenses: $${totalExpense}</p>`;
        actualExpense.innerHTML = expenseHTML;
  
        // Calculate Actual Net Income
        const actualNI = document.getElementById("actualNI");
        actualNI.innerHTML = '';
        let totalNI = totalIncome - totalExpense;
        let nIHTML = `<p>This is your actual Net Income: $${totalNI}</p>`;
        actualNI.innerHTML = nIHTML;
    } catch(error) {
        console.error('Error fetching budget:', error);
    }
}

async function highestExpense() {
    try {
        console.log("Getting highest expense");
        const response = await fetch(`api/${apiVersion}/myBudgetCalcs/highest`);
        const highExpense = await response.json(); 
        const highest = document.getElementById("highest");
        highest.innerHTML = '';
        let highCat = '';
        let highAmount = 0;
  
        if (highExpense.length === 0) {
            highest.innerHTML = '<p>No expenses found.</p>';
            return;
        }
        else {
            highExpense.forEach(expense => {
                highCat = expense._id;
                highAmount = expense.maxAmount;
            });
        }

        let highHTML = `<br>
                        <p>This is your highest expense: </p>
                        <p>Category: ${highCat}</p>
                        <p>Amount: $${highAmount}</p>`;
        highest.innerHTML = highHTML;
    }
    catch(error) {
        console.error('Error fetching budget:', error);
    }
}
