document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/api/projected-budgets/post/{POST_ID}'); // Replace {POST_ID} with the actual post ID or retrieve it dynamically
      const budgets = await response.json();
  
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = ''; // Clear any existing content
  
      if (budgets.length === 0) {
        resultsDiv.innerHTML = '<p>No projected budgets found.</p>';
        return;
      }
  
      budgets.forEach(budget => {
        const budgetDiv = document.createElement('div');
        budgetDiv.classList.add('budget');
  
        const budgetTitle = document.createElement('h2');
        budgetTitle.textContent = budget.name;
  
        const budgetTotal = document.createElement('p');
        budgetTotal.textContent = `Total: $${budget.total}`;
  
        const categoriesList = document.createElement('ul');
        budget.categories.forEach(category => {
          const categoryItem = document.createElement('li');
          categoryItem.textContent = `${category.name}: $${category.amount}`;
          categoriesList.appendChild(categoryItem);
        });
  
        budgetDiv.appendChild(budgetTitle);
        budgetDiv.appendChild(budgetTotal);
        budgetDiv.appendChild(categoriesList);
  
        resultsDiv.appendChild(budgetDiv);
      });
    } catch (error) {
      console.error('Error fetching projected budgets:', error);
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '<p>Failed to load projected budgets.</p>';
    }
  });
  