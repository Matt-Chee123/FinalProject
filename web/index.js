<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="css/homeStyles.css">
  <link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet'>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body>
<div class="sidebar close">
  <div class="logo-details">
    <span class="logo_name">REF2021 Data Dashboard</span>
  </div>
  <ul class="nav-links">
    <li>
      <a href="#">
        <i class='bx bx-grid-alt' ></i>
        <span class="link_name">Homepage</span>
      </a>
      <ul class="sub-menu blank">
        <li><a class="link_name" href="#">Homepage</a></li>
      </ul>
    </li>
    <li>
      <div class="iocn-link">
        <a href="#">
          <i class='bx bx-collection' ></i>
          <span class="link_name">Institution</span>
        </a>
        <i class='bx bxs-chevron-down arrow' ></i>
      </div>
      <ul class="sub-menu">
        <li><a class="link_name" href="#">Institution</a></li>
        <li><a href="#">University Of Manchester</a></li>
        <li><a href="#">Univeristy College London</a></li>
        <li><a href="#">University of Birmingham</a></li>
      </ul>
    </li>
    <li>
      <a href="#">
        <i class='bx bx-book-alt' ></i>
        <span class="link_name">Overall</span>
      </a>
      <ul class="sub-menu blank">
        <li><a class="link_name" href="#">Overall</a></li>
      </ul>
    </li>
    <li>
      <a href="#">
        <i class='bx bx-pie-chart-alt-2' ></i>
        <span class="link_name">Analytics</span>
      </a>
      <ul class="sub-menu blank">
        <li><a class="link_name" href="#">Analytics</a></li>
      </ul>
    </li>
  </ul>
</div>

<section class="home-section">
  <div class="home-content">
    <i class='bx bx-menu' ></i>
    <span class="text">Homepage</span>
  </div>
  <div class="main-container">
    <div class="left-components">
      <div id="top-three-records" class="component-bubble">
        <script src="./top3.js"></script>
      </div>
      <div id="bottom-three-records" class="component-bubble">
        <!-- Top 3 records will be inserted here by JavaScript -->
      </div>
      <div class="component-bubble">
      </div>
      <div class="component-bubble">
        <span id="average-score"></span><br>
        <span id="range-score"></span><br>
        <span id="std-deviation"></span>
      </div>
      <div class="component-bubble"></div>
      <div class="component-bubble">
      </div>      <!-- Add more .component-bubble as needed -->
    </div>
    <div class="bubble-container">
      <iframe src="uk_heatmap.html" frameborder="0" class="heatmap-iframe"></iframe>
    </div>
  </div>
</section>

<script>
  let arrow = document.querySelectorAll(".arrow");
  for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e)=>{
   let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
   arrowParent.classList.toggle("showMenu");
    });
  }
  let sidebar = document.querySelector(".sidebar");
  let sidebarBtn = document.querySelector(".bx-menu");
  console.log(sidebarBtn);
  sidebarBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("close");
  });
</script>

<script src="static/js/top3script.js"></script>
<script src="static/js/bottom3script.js"></script>
<script src="static/js/averages.js"></script>


</body>
</html>
