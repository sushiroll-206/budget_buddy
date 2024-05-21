async function netIncome() {

    try {
        // GET income
        let incomes = await fetchJSON(`api/${apiVersion}/myBudgetCalcs/projectedIncome`);


        // GET expenses
    }
    catch(error) {
        console.error('Error fetching users:', error);
    }

}