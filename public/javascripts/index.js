// budget app functions go here

// Initialize for budgetBuddy.html
async function initBuddy(){
    await loadIdentity();
    fetchUserCards(); 
}

// Initialize for the others because only budgetBuddy.html needs the user cards
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
      proNetIncome();
      actNetIncome();
      highestExpense();
      console.log("Identify loaded");
      window.addEventListener('load', resolve);
    });
  } catch(err) {
    console.log("Error: ", err)
  }
};


// document.addEventListener('DOMContentLoaded', async () => {
//     await fetchUserCards();
//   });

async function fetchUserCards() {
    try {
        document.getElementById("userCardsDisplay").innerText = "Loading...";
        const response = await fetch(`api/${apiVersion}/usersCards`);

        const userCards = await response.json();

        const userCardsDisplay = document.getElementById('userCardsDisplay');    
        if (userCards.length === 0) {
            userCardsDisplay.innerHTML = '<p>No users found.</p>';
            return;
        }
        let userCardHTML = userCards.map(card => {
          return `
            <div class="user-card', 'p-4', 'm-2', 'bg-gray-100', 'rounded">
                <p>${escapeHTML(card.description)}</p>
                <div><a href="/myBudget.html?user=${encodeURIComponent(card.username)}">${escapeHTML(card.username)}</a>, ${escapeHTML(card.created_date)}</div>
                <div class="post-interactions">
                    <div>
                        <span title="${card.likes? escapeHTML(card.likes.join(", ")) : ""}"> ${card.likes ? `${card.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                        <span class="heart-button-span ${myIdentity? "": "d-none"}">
                            ${card.likes && card.likes.includes(myIdentity) ? 
                                `<button class="heart_button" onclick='unlikePost("${card.id}")'>&#x2665;</button>` : 
                                `<button class="heart_button" onclick='likePost("${card.id}")'>&#x2661;</button>`} 
                        </span>
                    </div>
                    <br>
                    <button onclick='toggleComments("${card.id}")'>View/Hide comments</button>
                    <div id='comments-box-${card.id}' class="comments-box d-none">
                        <button onclick='refreshComments("${card.id}")')>refresh comments</button>
                        <div id='comments-${card.id}'></div>
                        <div class="new-comment-box ${myIdentity? "": "d-none"}">
                            New Comment:
                            <textarea type="textbox" id="new-comment-${card.id}"></textarea>
                            <button onclick='postComment("${card.id}")'>Post Comment</button>
                        </div>
                    </div>
                </div>
            </div>`
        }).join("\n");
        
        console.log(userCardHTML)
        userCardsDisplay.innerHTML = userCardHTML;
    } catch (error) {
        console.error('Error fetching users:', error);
        const userCardsDisplay = document.getElementById('userCardsDisplay');
        userCardsDisplay.innerHTML = '<p>Failed to load user cards.</p>';
    }
}

async function post(){
  document.getElementById("postStatus").innerHTML = "sending data..."
  let description = document.getElementById("descriptionInput").value;

  try{
      await fetchJSON(`api/${apiVersion}/usersCards`, {
          method: "POST",
          body: {description: description}
      });
  }catch(error){
      document.getElementById("postStatus").innerText = "Error"
      throw(error)
  }
  document.getElementById("descriptionInput").value = "";
  document.getElementById("postStatus").innerHTML = "successfully uploaded"
  fetchUserCards();
  
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
  let budgetType = document.getElementById('projected').checked;
  console.log(budgetType);

  try {

    await fetchJSON(`api/${apiVersion}/budgets`, {
      method: "POST",
      body: {type: "Income",
            category: incomeTitle,
            amount: incomeAmount,
            description: incomeDescription,
            budgetType: budgetType,
            created_date: new Date()
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
  let budgetType = document.getElementById('projected').checked;

  try {
    await fetchJSON(`api/${apiVersion}/budgets`, {
      method: "POST",
      body: {type: "Expense",
              category: expenseName,
              amount: expenseAmount,
              description: expenseDescription,
              budgetType: budgetType,
              created_date: new Date()
            }
    });
  }
  catch(error) {
    console.log("this is the error: " + error);
  }

 
  document.getElementById(`expenseName`).value = "";
  document.getElementById(`expenseAmount`).value = "";
  document.getElementById(`expenseDescription`).value = "";
  loadUserBudget()
}

async function likePost(postID){
  await fetchJSON(`api/${apiVersion}/usersCards/like`, {
      method: "POST",
      body: {postID: postID}
  })
  fetchUserCards();
}


async function unlikePost(postID){
  await fetchJSON(`api/${apiVersion}/usersCards/unlike`, {
      method: "POST",
      body: {postID: postID}
  })
  fetchUserCards();
}


function getCommentHTML(commentsJSON){
  return commentsJSON.map(commentInfo => {
      return `
      <div class="individual-comment-box">
          <div>${escapeHTML(commentInfo.comment)}</div>
          <div> - <a href="/myBudget.html?user=${encodeURIComponent(commentInfo.username)}">${escapeHTML(commentInfo.username)}</a>, ${escapeHTML(commentInfo.created_date)}</div>
      </div>`
  }).join(" ");
}

async function toggleComments(postID){
  let element = document.getElementById(`comments-box-${postID}`);
  if(!element.classList.contains("d-none")){
      element.classList.add("d-none");
  }else{
      element.classList.remove("d-none");
      let commentsElement = document.getElementById(`comments-${postID}`);
      if(commentsElement.innerHTML == ""){ // load comments if not yet loaded
          commentsElement.innerHTML = "loading..."

          let commentsJSON = await fetchJSON(`api/${apiVersion}/comments?postID=${postID}`)
          commentsElement.innerHTML = getCommentHTML(commentsJSON);          
      }
  }
  
}

async function refreshComments(postID){
  let commentsElement = document.getElementById(`comments-${postID}`);
  commentsElement.innerHTML = "loading..."

  let commentsJSON = await fetchJSON(`api/${apiVersion}/comments?postID=${postID}`)
  commentsElement.innerHTML = getCommentHTML(commentsJSON);
}

async function postComment(postID){
  let newComment = document.getElementById(`new-comment-${postID}`).value;

  let responseJson = await fetchJSON(`api/${apiVersion}/comments`, {
      method: "POST",
      body: {postID: postID, newComment: newComment}
  })
  document.getElementById(`new-comment-${postID}`).innerHTML = ""
  
  refreshComments(postID);
}



