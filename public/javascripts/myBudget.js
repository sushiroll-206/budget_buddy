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
    actualBudgets.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    projectedBudgets.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

    
    // Divide budget into projected incomes and expenses
    let projectedIncomes = []
    let projectedExpenses = []

    let actualIncomes = []
    let actualExpenses = []

    

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

    actualBudgets.map(budgetInfo => {
        let transactionCategory = budgetInfo.category
        if (budgetInfo.type == "Income") {
            if (transactionCategory in actualIncomes) {
                actualIncomes[transactionCategory].push(budgetInfo)
            } else {
                actualIncomes[transactionCategory] = [budgetInfo]
            }
        }
        if (budgetInfo.type == "Expense") {
            if (transactionCategory in actualExpenses) {
                actualExpenses[transactionCategory].push(budgetInfo)
                // projectedExpenses.push({[transactionCategory]: budgetInfo})
            } else {
                actualExpenses[transactionCategory] = [budgetInfo]
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

    let actualHtml = actualBudgets.map(budgetInfo => {
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

    document.getElementById("userBudgetDisplay").innerHTML = budgetHTML;
}