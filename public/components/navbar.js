function SideNavbar() {
  return `
      <!-- Page Logo -->
      <div>
        <a class="flex px-11 pt-12" href="index.html">
          <img src="./assets/BudgetBuddy.png" alt="Home">
          <h3 class="pl-2">Budget Buddy</h3>
        </a>
      </div>
      <!-- tab to different pages -->
      <div class="flex flex-col justify-between h-screen">
        <ul class="menu flex flex-col p-8 pr-11">
            <li class="flex p-3">
              <a href="index.html"><h3 class="pl-2">Dashboard</h3></a>
            </li>
            <li class="flex p-3">
              <a href="budgetBuddy.html"><h3 class="pl-2">Budget with Buddies</h3></a>
            </li>
            <li class="flex p-3">
              <div id="identity_div">loading...</div>
            </li>
        </ul>
        <a class="flex px-11 py-6" href="*">
          <img src="" alt="user profile">
          <h3 class="pl-2">Profile</h3>
        </a>
      </div>
    </nav>
  `;
}

document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  navbar.innerHTML = SideNavbar();
});