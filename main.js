//variables
let favouritePage = document.querySelector(".favourites-page"),
  homePage = document.querySelector(".main-page"),
  articles = document.querySelector(".articles"),
  addedMessage = document.querySelector(".added-message");
let apiKey = `u3m8hSmeb3y0jsFhpfp9Z9dxrJqQfz1u7PFGiDSF`;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=3`;
let data = [];
let favourites = {};

//add items to favourite page
function addToFavourite(title) {
  data.forEach((item) => {
    if (item.title === title && !favourites[title]) {
      favourites[title] = item;
      //add added message
      addedMessage.classList.remove("hide");
      setTimeout(() => {
        addedMessage.classList.add("hide");
      }, 2000);
      localStorage.setItem("articles", JSON.stringify(favourites));
    }
  });
}
//create nasa articles
function createArticles(page) {

    const currentArr = page === "home" ? data :  Object.values(favourites);
    currentArr.forEach((obj) => {
    const { title, hdurl, explanation, date, copyright, url } = obj;
    let img = document.createElement("img");
    img.src = url;
    img.alt = title;
    let a = document.createElement("a");
    a.href = hdurl;
    let div = document.createElement("div");
    div.className = "details";
    let h1 = document.createElement("h1");
    h1.textContent = title;
    let favourites = document.createElement("span");
    favourites.className = "favourites";
    favourites.textContent=page==="home"?"Add to Favourites":"Remove from Favourites"
    favourites.addEventListener("click",()=>{page==="home"?addToFavourite(title):removeFromFav(title)})
    let description = document.createElement("p");
    description.textContent = explanation;
    let dateEle = document.createElement("span");
    dateEle.className = "date";
    dateEle.textContent = date;
    let authorEle = document.createElement("span");
    authorEle.textContent = copyright ? copyright : "";
    let article = document.createElement("article");
    article.className = "article";
    //add to home page
    a.append(img);
    dateEle.append(authorEle);
    div.append(h1, favourites, description, dateEle);
    article.append(a, div);
    articles.append(article);
  });
}
//update data from local storage
function updateFun(page) {
    if (localStorage.getItem("articles")) {
      favourites = JSON.parse(localStorage.getItem("articles")); 
    }
    articles.textContent=''
    createArticles(page)
}
//fetch Nasa Api
async function fetchArticles() {
   try {
    const response = await fetch(apiUrl);
    data = await response.json();
    updateFun("home");
  
  } catch (err) {
    console.log(err);
  }
}

//remove items from ui andlocal storage
function removeFromFav(title){  
  if(favourites[title]){
    delete favourites[title]
    localStorage.setItem("articles", JSON.stringify(favourites));
    articles.textContent=''
    updateFun("fav")
  }
}

//favourite page 
favouritePage.addEventListener("click", ()=>{updateFun("fav")});
//load more 
homePage.addEventListener("click",fetchArticles)
//on load 
window.scrollTo({top:0,behavior:"instant"})
fetchArticles()
