const tabsBox = document.querySelector(".tabBar"),
    allTabs = tabsBox.querySelectorAll(".tab"),
    arrowIcons = document.querySelectorAll(".icon i");

const recipedetailscontent = document.querySelector(".recipe-details-content");
const recipeclosebtn = document.querySelector(".recipe-close-btn");
const container = document.getElementById('main'); // Corrected selector

const handleIcons = (scrollVal) => {
    let maxScrollableWidth = tabsBox.scrollWidth - tabsBox.clientWidth;
    arrowIcons[0].parentElement.style.display = scrollVal <= 0 ? "none" : "flex";
    arrowIcons[1].parentElement.style.display = maxScrollableWidth - scrollVal <= 1 ? "none" : "flex";
};

arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        let scrollWidth = tabsBox.scrollLeft += icon.id === "left" ? -340 : 340;
        handleIcons(scrollWidth);
    });
});

allTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const activeTab = tabsBox.querySelector(".active");
        if (activeTab) activeTab.classList.remove("active");
        tab.classList.add("active");
        fetchData(tab.dataset.query);
    });
});

async function fetchData(query) {
    container.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        fillData(data.meals);
    } catch (error) {
        container.innerHTML = "<h2>Error in fetching recipes</h2>";
    }
}

function fillData(allData) {
    container.innerHTML = "";
    allData.forEach((data) => {
        if (!data.strMealThumb) return;

        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("card");
        recipeDiv.innerHTML = `
            <div class="card-image">
                <img src="${data.strMealThumb}" alt="">
            </div>
            <div class="card-contain">
                <h3>${data.strMeal}</h3>
                <div class="description">A delightful <span>${data.strArea}</span> <span>${data.strCategory}</span> dish, perfect for any occasion with its balanced ingredients.</div>
                <button class="read-button" onclick="openrecipePopup(${JSON.stringify(data).replace(/"/g, '&quot;')})">View Recipe</button>
            </div>
        `;

        container.appendChild(recipeDiv);
    });
}

window.addEventListener('load', () => {
    fetchData('cake');
});

document.getElementById('search-button').addEventListener('click', (e) => {
    e.preventDefault();
    const searchValue = document.getElementById('search-input').value.trim();
    const activeTab = tabsBox.querySelector(".active");
    if (activeTab) activeTab.classList.remove("active");
    if (!searchValue) {
        container.innerHTML = `<h2>Type the meal in the search box</h2>`;
        return;
    }
    fetchData(searchValue);
});

const fetchIngredients = (meal) => {
    let ingredientslist = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientslist += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientslist;
};

const openrecipePopup = (meal) => {
    recipedetailscontent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instrucion:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;

    recipedetailscontent.parentElement.style.display = "block";
};

recipeclosebtn.addEventListener('click', () => {
    recipedetailscontent.parentElement.style.display = "none";
});
