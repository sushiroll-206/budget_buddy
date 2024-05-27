async function init(){
    await loadIdentity();
    loadUserBudget();
}

async function loadUserBudget(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    console.log(username)
    if (!username) {
        console.error('No username found in url');
    }

    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("userBudgetDisplay").classList.remove("d-none");
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("userBudgetDisplay").classList.add("d-none");
    }
    
    //TODO: do an ajax call to load whatever info you want about the user from the user table
    try {
        const response = await fetch(`api/${apiVersion}/myBudget?username=${encodeURIComponent(username)}`);
        console.log("response from myBudget.js in javascripts", response)
        const userInfos = await response.json();
        if (response.ok) {
            // const userInfo = userInfos[0]; // Assuming each username is unique and thus returns a single userInfo object
            // if (userInfo) {
            //     document.getElementById("favoriteBodyWaterDisplay").innerText = userInfo.favoriteBodyWater || 'Not specified';
            //     if (username === myIdentity) {
            //         document.getElementById("favoriteBodyWater").value = userInfo.favoriteBodyWater || '';
            //     }
            // }
        } else {
            console.error('Error loading user info:', userInfos.error);
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
    
    loadUserInfoBudget(username)
}

async function loadUserInfoBudget(username){
    document.getElementById("userBudgetDisplay").innerText = "Loading...";
    let budgetJson = await fetchJSON(`api/${apiVersion}/myBudget?username=${encodeURIComponent(username)}`);
    console.log(budgetJson)
    actualBudgets = budgetJson.actualBudgets;
    projectedBudgets= budgetJson.projectedBudgets;
    // Divide budget into projected incomes and expenses
    let projectedIncomes = []
    let projectedExpenses = []

    // maps each budget instance as an income or expense
    projectedBudgets.map(budgetInfo => {
        if(budgetInfo.type == "Income"){
            // budgetInfo.category
            projectedIncomes.push(budgetInfo)
        }
        if(budgetInfo.type == "Expense"){
            projectedExpenses.push(budgetInfo)
        }
    });

    console.log(projectedIncomes)
    console.log(projectedExpenses)

    let budgetHTML = projectedBudgets.map(budgetInfo => {
        return `
        <div class="post">
            <p>Category: ${budgetInfo.category}</p>
            <p>Amount: ${budgetInfo.amount}</p>
        </div>`
    }).join("\n");
    
    document.getElementById("userBudgetDisplay").innerHTML = budgetHTML;
}