async function init() {
    await loadIdentity();
    loadUserBudget();
}

async function loadUserBudget() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if (!username) {
        document.getElementById("username-span").innerText = `Please Log In`;
        console.error('No username found in url');
    }

    if (username == myIdentity) {
        document.getElementById("username-span").innerText = `You (${username})`;
        document.getElementById("userBudgetDisplay").classList.remove("d-none");
    } else {
        document.getElementById("username-span").innerText = username;
        document.getElementById("userBudgetDisplay").classList.add("d-none");
    }
    
    //TODO: do an ajax call to load whatever info you want about the user from the user table
    try {
        const response = await fetch(`api/${apiVersion}/myBudget?username=${encodeURIComponent(username)}`);
        const userInfos = await response.json();
        if (response.ok) {
            
        } else {
            console.error('Error loading user info:', userInfos.error);
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
    
    loadUserInfoBudget(username)
}

async function loadUserInfoBudget(username) {
    document.getElementById("userBudgetDisplay").innerText = "Loading...";
    let budgetJson = await fetchJSON(`api/${apiVersion}/myBudget?username=${encodeURIComponent(username)}`);
    actualBudgets = budgetJson.actualBudgets;
    projectedBudgets = budgetJson.projectedBudgets;
    projectedBudgets.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

    // Divide budget into projected incomes and expenses
    let projectedIncomes = []
    let projectedExpenses = []

    // maps each budget instance as an income or expense -- under their respective category
    projectedBudgets.map(budgetInfo => {
        let transactionCategory = budgetInfo.category
        if (budgetInfo.type == "Income") {
            if (transactionCategory in projectedIncomes) {
                projectedIncomes[transactionCategory].push(budgetInfo)
            } else {
                projectedIncomes[transactionCategory] = [budgetInfo]
            }
        }
        if (budgetInfo.type == "Expense") {
            if (transactionCategory in projectedExpenses) {
                projectedExpenses[transactionCategory].push(budgetInfo)
                // projectedExpenses.push({[transactionCategory]: budgetInfo})
            } else {
                projectedExpenses[transactionCategory] = [budgetInfo]
            }
        }
    });

    // what needs to be done -- might need to update the projectedBudgets.map
    let incomeHTML = projectedIncomes.forEach(transactionInfo => {
        console.log(transactionInfo)
        let incomeTransactionsHTML = transactionInfo.map(data => {
            return `
            <div class="post border">
                <p>Amount: ${data.amount}</p>
                <p>Description: ${data.description}
            </div>
            `
        })
        return incomeTransactionsHTML

        // return `
        // <div class="post border">
        //     <p>Amount: ${budgetInfo.amount}</p>
        //     <p>Description: ${budgetInfo.description}
        // </div>
        // `
    });

    let budgetHTML = projectedBudgets.map(budgetInfo => {
        const amountColorClass = budgetInfo.type === 'Expense' ? 'red-text' : 'green-text';
        return `
        <div class="post border">
            <p>Category: ${budgetInfo.category}</p>
            <p class="${amountColorClass}">Amount: ${budgetInfo.amount}</p>
            <p>Description: ${budgetInfo.description}</p>
        </div>`;
    }).join("\n");

    const margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
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


    const aggregatedData = {};
    projectedBudgets.forEach(d => {
        const day = parseTime(d.created_date).toDateString(); // Convert to date string to consider only day, month, and year
        aggregatedData[day] = (aggregatedData[day] || 0) + (d.type === 'Expense' ? -d.amount : +d.amount);
    });

    // Ensure we have data for each day within the time period
    const startDate = d3.min(projectedBudgets, d => parseTime(d.created_date));
    const endDate = d3.max(projectedBudgets, d => parseTime(d.created_date));
    const timeRange = d3.timeDay.range(new Date(startDate.getTime() - (24 * 60 * 60 * 1000)), new Date(endDate.getTime() + 24 * 60 * 60 * 1000));
    timeRange.forEach(day => {
        const dayString = day.toDateString();
        if (!(dayString in aggregatedData)) {
            aggregatedData[dayString] = 0; // If no data for a day, set amount to 0
        }
    });


    // Convert aggregated data to array format and calculate cumulative amount
    const aggregatedArray = [];
    let cumulativeAmount = 0;
    timeRange.forEach(day => {
        const dayString = day.toDateString();
        cumulativeAmount += aggregatedData[dayString];
        aggregatedArray.push({
            date: day,
            amount: aggregatedData[dayString],
            cumulativeAmount: cumulativeAmount
        });
    });


    const x = d3.scaleTime()
        .domain(d3.extent(aggregatedArray, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min(aggregatedArray, d => d.cumulativeAmount) * 1.1 , d3.max(aggregatedArray, d => d.cumulativeAmount) * 1.1])
        .range([height, 0]);

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.cumulativeAmount));

    svg.append("path")
        .datum(aggregatedArray)
        .attr("fill", "none")
        .attr("stroke", (d, i) => {
            if (i === 0) return "steelblue"; // First data point, default color
            return aggregatedArray[i].cumulativeAmount > aggregatedArray[i - 1].cumulativeAmount ? "green" : "red";
        })
        .attr("stroke-width", 1.5)
        .attr("d", line);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    document.getElementById("userBudgetDisplay").innerHTML = budgetHTML;
}