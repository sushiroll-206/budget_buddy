async function init() {
    try {
      await new Promise(resolve => {
        console.log("Waiting for 'load' event");
        let btn = document.querySelector('#btn');
        let navbar = document.querySelector('.navbar');
        btn.onclick = function() {
          navbar.classList.toggle('active');
          localStorage.setItem('navbarState', navbar.classList.contains('active') ? 'open' : 'closed');
        };
    
        const navbarState = localStorage.getItem('navbarState');
        if (navbarState === 'open') {
          navbar.classList.add('active');
        } else {
          navbar.classList.remove('active');
        };
    
        loadIdentity();
        loadUserBudget();
        console.log("Identify loaded");
        console.log("User budget loaded");
        window.addEventListener('load', resolve);
      });
    } catch(err) {
      console.log("Error: ", err)
    }
  };

async function loadUserBudget() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    const username_span = document.getElementById("username-span");
    const userBudgetDisplay = document.getElementById("userBudgetDisplay");

    if (!username) {
        username_span.innerText = `Please Log In`;
        console.error('No username found in url');
        userBudgetDisplay.classList.add("hidden");
    } else if (username == myIdentity) {
        username_span.innerText = `You (${username})`;
        userBudgetDisplay.classList.remove("hidden");
    } else {
        username_span.innerText = username;
    }
    
    //TODO: do an ajax call to load whatever info you want about the user from the user table
    try {
        const response = await fetch(`api/${apiVersion}/myBudget?username=${encodeURIComponent(username)}`);
        const userInfos = await response.json();
        if (!response.ok) {
            console.error('Error loading user info:', userInfos.error);
        };
    } catch (error) {
        console.error('Error loading user info:', error);
    }
    loadUserInfoBudget(username);
}

async function loadUserInfoBudget(username) {
    document.getElementById("userBudgetDisplay").innerText = "Loading...";
    let budgetJson = await fetchJSON(`api/${apiVersion}/myBudget?username=${encodeURIComponent(username)}`);
    let actualBudgets = budgetJson.actualBudgets;
    let projectedBudgets = budgetJson.projectedBudgets;
    actualBudgets.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    projectedBudgets.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

    // Divide budget into projected incomes and expenses
    let projectedIncomes = [];
    let projectedExpenses = [];

    let actualIncomes = [];
    let actualExpenses = [];

    // maps each budget instance as an income or expense -- under their respective category
    projectedBudgets.map(budgetInfo => {
        let transactionCategory = budgetInfo.category;
        if (budgetInfo.type == "Income") {
            if (transactionCategory in projectedIncomes) {
                projectedIncomes[transactionCategory].push(budgetInfo);
            } else {
                projectedIncomes[transactionCategory] = [budgetInfo];
            }
        }
        if (budgetInfo.type == "Expense") {
            if (transactionCategory in projectedExpenses) {
                projectedExpenses[transactionCategory].push(budgetInfo);
            } else {
                projectedExpenses[transactionCategory] = [budgetInfo];
            }
        }
    });

    actualBudgets.map(budgetInfo => {
        let transactionCategory = budgetInfo.category;
        if (budgetInfo.type == "Income") {
            if (transactionCategory in actualIncomes) {
                actualIncomes[transactionCategory].push(budgetInfo);
            } else {
                actualIncomes[transactionCategory] = [budgetInfo];
            }
        }
        if (budgetInfo.type == "Expense") {
            if (transactionCategory in actualExpenses) {
                actualExpenses[transactionCategory].push(budgetInfo);
            } else {
                actualExpenses[transactionCategory] = [budgetInfo];
            }
        }
    });

    // initialize income and expense HTMLs
    let projectedIncomeHTML = `<h3 class="mt-4"><strong>Incomes:</strong></h3>`;
    let projectedExpenseHTML = `<h3 class="mt-4"><strong>Expenses:</strong></h3>`;

    let actualIncomeHTML = `<h3 class="mt-4"><strong>Incomes:</strong></h3>`;
    let actualExpenseHTML = `<h3 class="mt-4"><strong>Expenses:</strong></h3>`;

    // for each category in INCOME, create an html format to show transactions
    for(const category in projectedIncomes) {
        let categoryTransactions = projectedIncomes[category]
        let categoryHTML = categoryTransactions.map(transactionInfo => {
            const amountColorClass = transactionInfo.type === 'Expense' ? 'color: red' : 'color: green';
            return `
            <div class="card-info border">
                <p>Category: ${transactionInfo.category}</p>
                <p style="${amountColorClass}">Amount: ${transactionInfo.amount}</p>
                <p>Description: ${transactionInfo.description}</p>
            </div>`;
        }).join("\n");
        projectedIncomeHTML += `<h3><strong>${category}</strong></h3><div class='mb-3'>${categoryHTML}</div>`
    }
    // for each category in EXPENSE, create an html format to show transactions
    for(const category in projectedExpenses) {
        let categoryTransactions = projectedExpenses[category]
        let categoryHTML = categoryTransactions.map(transactionInfo => {
            const amountColorClass = transactionInfo.type === 'Expense' ? 'color: red' : 'color: green';
            return `
            <div class="card-info border">
                <p>Category: ${transactionInfo.category}</p>
                <p style="${amountColorClass}">Amount: ${transactionInfo.amount}</p>
                <p>Description: ${transactionInfo.description}</p>
            </div>`;
        }).join("\n");
        projectedExpenseHTML += `<h3><strong>${category}</strong></h3><div class='mb-3'>${categoryHTML}</div>`
    }

    ///////////// ACTUAL BUDGET STUFF 
    // for each category in ACTUAL INCOME, create an html format to show transactions
    for(const category in actualIncomes) {
        let categoryTransactions = actualIncomes[category]
        let categoryHTML = categoryTransactions.map(transactionInfo => {
            const amountColorClass = transactionInfo.type === 'Expense' ? 'color: red' : 'color: green';
            return `
            <div class="card-info border">
                <p>Category: ${transactionInfo.category}</p>
                <p style="${amountColorClass}">Amount: ${transactionInfo.amount}</p>
                <p>Description: ${transactionInfo.description}</p>
            </div>`;
        }).join("\n");
        actualIncomeHTML += `<h3><strong>${category}</strong></h3><div class='mb-3'>${categoryHTML}</div>`
    }
    // for each category in ACTUAL EXPENSE, create an html format to show transactions
    for(const category in actualExpenses) {
        let categoryTransactions = actualExpenses[category]
        let categoryHTML = categoryTransactions.map(transactionInfo => {
            const amountColorClass = transactionInfo.type === 'Expense' ? 'color: red' : 'color: green';
            return `
            <div class="card-info border">
                <p>Category: ${transactionInfo.category}</p>
                <p style="${amountColorClass}">Amount: ${transactionInfo.amount}</p>
                <p>Description: ${transactionInfo.description}</p>
            </div>`;
        }).join("\n");
        actualExpenseHTML += `<h3><strong>${category}</strong></h3><div class='mb-3'>${categoryHTML}</div>`
    }

    let budgetHTML = `
        <section class="flex justify-evenly">
            <div class="projected-budget-summary">
                <h2>Projected Budget</h2>
                ${projectedIncomeHTML}
                ${projectedExpenseHTML}
            </div>
            <div class="actual-budget-summary">
                <h2>Actual Budget</h2>
                ${actualIncomeHTML}
                ${actualExpenseHTML}
            </div>
        </section>
    `;
    document.getElementById("userBudgetDisplay").innerHTML = budgetHTML;

    // chart
    const margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


    d3.select("#chart").selectAll("svg").remove()
    
    const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z");
    projectedBudgets.forEach(d => {
        d.date = parseTime(d.created_date);
        d.amount = d.amount;
    });

    actualBudgets.forEach(d => {
        d.date = parseTime(d.created_date);
        d.amount = d.amount;
    });


    let totalProjectedBudget = 0;
    projectedBudgets.forEach(d => {
        totalProjectedBudget += (d.type === 'Expense' ? -d.amount : d.amount);
    });

    const actualAggregatedData = {};
    actualBudgets.forEach(d => {
        const day = parseTime(d.created_date).toDateString(); // Convert to date string to consider only day, month, and year
        actualAggregatedData[day] = (actualAggregatedData[day] || 0) + (d.type === 'Expense' ? -d.amount : +d.amount);
    });

    // Ensure we have data for each day within the time period
    const startDate = d3.min(actualBudgets, d => parseTime(d.created_date));
    const endDate = d3.max(actualBudgets, d => parseTime(d.created_date));
    const timeRange = d3.timeDay.range(new Date(startDate.getTime() - (48 * 60 * 60 * 1000)), new Date(endDate.getTime() + 24 * 60 * 60 * 1000));
    console.log(startDate, endDate, timeRange)
    timeRange.forEach(day => {
        const dayString = day.toDateString();
        if (!(dayString in actualAggregatedData)) {
            actualAggregatedData[dayString] = 0; // If no data for a day, set amount to 0
        }
    });

    // Convert aggregated data to array format and calculate cumulative amount
    const actualAggregatedArray = [];
    let actualCumulativeAmount = 0;
    timeRange.forEach(day => {
        const dayString = day.toDateString();
        actualCumulativeAmount += actualAggregatedData[dayString];
        actualAggregatedArray.push({
            date: day,
            amount: actualAggregatedData[dayString],
            actualCumulativeAmount: actualCumulativeAmount
        });
    });

    const yMin = Math.min(d3.min(actualAggregatedArray, d => d.actualCumulativeAmount), totalProjectedBudget) * 1.1;
    const yMax = Math.max(d3.max(actualAggregatedArray, d => d.actualCumulativeAmount), totalProjectedBudget) * 1.1;

    const x = d3.scaleTime()
        .domain(d3.extent(actualAggregatedArray, d => d.date))
        .range([0, width]);

        const y = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.actualCumulativeAmount));

    svg.append("path")
        .datum(actualAggregatedArray)
        .attr("fill", "none")
        .attr("stroke", (d, i) => {
            if (i === 0) return "steelblue"; // First data point, default color
            return actualAggregatedArray[i].actualCumulativeAmount > actualAggregatedArray[i - 1].cumulativeAmount ? "green" : "red";
        })
        .attr("stroke-width", 1.5)
        .attr("d", line);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Add a horizontal line for the projected budget
    svg.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(totalProjectedBudget))
        .attr("y2", y(totalProjectedBudget))
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4");

    svg.append("text")
        .attr("x", width - 10)
        .attr("y", y(totalProjectedBudget) - 10)
        .attr("text-anchor", "end")
        .attr("fill", "red")
        .text(`Projected Budget: ${totalProjectedBudget}`);
}