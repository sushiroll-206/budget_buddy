// budget app functions go here

// Initialize for index.html
async function initIndex(){

    await loadIdentity();
    await fetchUserCards(); 
    console.log("Init Index");
}

// Initialize for the others because only index.html needs the user cards
async function init() {
  await loadIdentity();
  console.log("Init for everything else");
}


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


