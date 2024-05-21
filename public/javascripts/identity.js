// Added from web sharer for Auth
let myIdentity = undefined;

async function loadIdentity(){
    let identity_div = document.getElementById("identity_div");
    console.log("This is the identity_div" + identity_div);

    try{
        let identityInfo = await fetchJSON(`api/${apiVersion}/users/myIdentity`)
        
        if(identityInfo.status == "loggedin"){
            myIdentity = identityInfo.user.username;
            identity_div.innerHTML = `
            <a href="/myBudget.html?user=${encodeURIComponent(identityInfo.user.username)}">${escapeHTML(identityInfo.user.name)} (${escapeHTML(identityInfo.user.username)})</a>
            <a href="signout" class="btn btn-danger" role="button">Log out</a>`;
            if(document.getElementById("results")){
                document.getElementById("results").classList.remove("d-none");
            }
        } else { //logged out
            myIdentity = undefined;
            identity_div.innerHTML = `
            <a href="signin" class="btn btn-primary" role="button">Log in</a>`;
            if(document.getElementById("results")){
                document.getElementById("results").classList.add("d-none");
            }
        }
    } catch(error){
        myIdentity = undefined;
        identity_div.innerHTML = `<div>
        <button onclick="loadIdentity()">retry</button>
        Error loading identity: <span id="identity_error_span"></span>
        </div>`;
        document.getElementById("identity_error_span").innerText = error;
        if(document.getElementById("results")){
            document.getElementById("results").classList.add("d-none");
        }
    }
}
