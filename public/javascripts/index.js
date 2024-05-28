// budget app functions go here

// Initialize for budgetBuddy.html
async function initBuddy(){

    await loadIdentity();
    await fetchUserCards(); 
    console.log("Init Index");
}

// Initialize for the others because only budgetBuddy.html needs the user cards
// async function init() {
//   console.log("start load identity");
//   await loadIdentity();
//   console.log("load identity is going");
//   // netIncome();
//   // console.log("Init for everything else");
// }


// document.addEventListener('DOMContentLoaded', async () => {
//     await fetchUserCards();
//   });

async function fetchUserCards() {
    try {
        console.log("Fetching usersCards")
        const response = await fetch(`api/${apiVersion}/usersCards`);
        console.log(response)
        const users = await response.json();
    
        const userCardsDisplay = document.getElementById('userCardsDisplay');
        userCardsDisplay.innerHTML = ''; // Clear any existing content
    
        if (users.length === 0) {
            userCardsDisplay.innerHTML = '<p>No users found.</p>';
            return;
        } 
        users.forEach(user => {
          const userCard = document.createElement('div');
          userCard.classList.add('user-card', 'p-4', 'm-2', 'bg-gray-100', 'rounded');

          const userName = document.createElement('h3');
          userName.textContent = user.name;
  
          const userEmail = document.createElement('p');
          userEmail.textContent = user.email;
  
          const viewBudgetButton = document.createElement('a');
          viewBudgetButton.href = `/userBudgets.html?userId=${user._id}`;
          viewBudgetButton.textContent = 'View Budgets';
          viewBudgetButton.classList.add('btn', 'btn-primary', 'mt-2');
  
          userCard.appendChild(userName);
          userCard.appendChild(userEmail);
          userCard.appendChild(viewBudgetButton);
  
          userCardsDisplay.appendChild(userCard);
    });
    } catch (error) {
        console.error('Error fetching users:', error);
        const userCardsDisplay = document.getElementById('userCardsDisplay');
        userCardsDisplay.innerHTML = '<p>Failed to load user cards.</p>';
    }
  }

// takes inputted income budget info and posts it to the /budgets post router
async function saveIncomeBudgetInfo(){
  let incomeTitle = document.getElementById('incomeTitle').value
  // make expense name case sensitive (upper first, lower rest)
  incomeTitle = incomeTitle.charAt(0).toUpperCase() + incomeTitle.slice(1)
  let incomeAmount = document.getElementById('incomeAmount').value
  let incomeDescription = document.getElementById('incomeDescription').value
  // let userJSON = await fetchJSON(`api/${apiVersion}/users/myIdentity`)
  // let userName = userJSON.user.name

  try {
    await fetchJSON(`api/${apiVersion}/budgets/projected`, {
      method: "POST",
      body: {type: "Income",
            category: incomeTitle,
            amount: incomeAmount,
            description: incomeDescription
            }
    });
  }
  catch(error) {
    console.log("this is the error: " + error);
  }

//  let responseJson = await fetchJSON(`api/${apiVersion}/budgets/projected`, {
//     method: "POST",
//     body: {type: incomeTitle,
//            amount: incomeAmount
//     }
// })

console.log("successfully sent")

document.getElementById(`incomeTitle`).value = "";
document.getElementById(`incomeAmount`).value = "";
document.getElementById(`incomeDescription`).value = "";
loadUserBudget()
}

// takes inputted expense budget information and posts it to the /budgets post router
async function saveExpenseBudgetInfo(){
  let expenseName = document.getElementById('expenseName').value
  // make expense name case sensitive (upper first, lower rest)
  expenseName = expenseName.charAt(0).toUpperCase() + expenseName.slice(1)
  let expenseAmount = document.getElementById('expenseAmount').value
  let expenseDescription = document.getElementById('expenseDescription').value
  // let userJSON = await fetchJSON(`api/${apiVersion}/users/myIdentity`)
  // let userName = userJSON.userInfo.name

 let responseJson = await fetchJSON(`api/${apiVersion}/budgets/projected`, {
    method: "POST",
    body: {type: "Expense",
          category: expenseName,
          amount: expenseAmount,
          description: expenseDescription
          }
})

document.getElementById(`expenseName`).value = "";
document.getElementById(`expenseAmount`).value = "";
document.getElementById(`expenseDescription`).value = "";
loadUserBudget()
}

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

      let incomeHTML = `<p>This is your total income: $${totalIncome}</p>`;

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

      let expenseHTML = `<p>This is your total Expenses: $${totalExpense}</p>`;

      projectedExpense.innerHTML = expenseHTML;

      // Calculate Net Income
      const projectedNI = document.getElementById("projectedNI");
      projectedNI.innerHTML = '';
      let totalNI = totalIncome - totalExpense;
      let nIHTML = `<p>This is your projected Net Income: $${totalNI}</p>`;
      projectedNI.innerHTML = nIHTML;
  }
  catch(error) {
      console.error('Error fetching users:', error);
  }

}

