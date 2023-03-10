//class Recipe
class Recipe {

    //Name, Ingredients -> properties
    constructor(name){
        this.name = name;
        
    }

}

//class Meal (Monday Lunch, Tuesday Dinner, etc)
class Meal{

    //id, name
    constructor(name, meal, dayOfTheWeek, id){
        if(id){
            this.id=id;
        }
        this.recipe_name = name;
        this.meal = meal;
        this.day = dayOfTheWeek;
        //array of recipes
        this.img;
    }

}

function alert(message){
    let main = document.getElementById('main')
    let container = document.getElementById('container')
    let alertDiv = document.createElement('div')
    alertDiv.className = "alert alert-primary alert-dismissible fade show"
    alertDiv.setAttribute('role','alert');
    alertDiv.innerHTML = `<strong>Oops!</strong> It seems that you're missing some important information. <strong>${message}</strong>`
    let btn = document.createElement('button');
    btn.className = 'btn-close';
    btn.setAttribute('data-bs-dismiss','alert');
    btn.setAttribute('aria-label','Close')
    alertDiv.appendChild(btn)
    main.insertBefore(alertDiv,container)
}

// AJAX Service for meals
class MealService {
    static dBurl = 'https://63befa87f5cfc0949b668e06.mockapi.io/api/MealPlanner/days';

    static getWeek(){
        return $.get(this.dBurl);
    }

    static getRecipes(url){
        return $.get(url)
    }

    static getRecipeByID(id){
        return $.get(`www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    }

    static getMeal(){
        return $.get(this.dBurl +`/${id}`);
    }

    static createMeal(meal){
        return $.post(this.dBurl, meal);
    }

    static updateMeal(meal){
        return $.ajax({
            url: this.dBurl + `/${meal.id}`,
            data: JSON.stringify(meal),
            contentType: 'application/json',
            type: 'PUT'
        })
    }

    static deleteMeal(id){
        return $.ajax({
            url: this.dBurl + `/${id}`,
            type: 'DELETE'
        })
    }
}


class DOMManager {
    static meals;
    static week = {
        "Monday":[], 
        "Tuesday":[], 
        "Wednesday":[],
        "Thursday":[],
        "Friday":[],
        "Saturday":[],
        "Sunday":[]
    }
    static showMore;
    static searchResults

    static searchRecipe(searchTerm, isSearchTermIngredient){
        let searchMethod = (isSearchTermIngredient) ? 'filter.php?i' : 'search.php?s';
        let parsedTerm = searchTerm.split(" ").join("_")
        let url = `https://www.themealdb.com/api/json/v1/1/${searchMethod}=${searchTerm}`
        
        MealService.getRecipes(url)
            .then((meals) => { 
                this.searchResults = meals.meals;
                if(this.searchResults.length>5){
                    this.showMore = this.searchResults.splice(5)
                }
                console.log(this.searchResults)
                console.log(this.showMore)
                this.showFiveRecipes()
            });
       
    }

    static showFiveRecipes(){
        $('#search-div').append(`<div id="search-results" class="row" ></div>`)
        this.searchResults.map(recipe => {
            console.log(recipe)
            $('#search-results').append(`
            <div id="search-results-${recipe.idMeal}" class="search-results card col-sm m-1 justify-content text-center">
                <h4 class="p-1">${recipe.strMeal}</h4>
                <div class="card-body">
                    <img class="img-fluid" src="${recipe.strMealThumb}/preview">
                    <p></p>
                </div>
            </div>`)
            document.getElementById(`search-results-${recipe.idMeal}`).addEventListener("click", DOMManager.chooseMealAndDay(`${recipe.idMeal}`),false)
        })
        $('#search-results').append(`<div id="search-results-not-found" class="search-results card col-sm m-1 justify-content text-center">
        <h4 class="p-1">${$('#recipe-name').val()}</h4>
        <div class="card-body">
            
            <p>or search again with your recipe name</p>
        </div>
    </div>`)
        document.getElementById('search-results-not-found').addEventListener("click", DOMManager.chooseMealAndDay(false),false)
    }

    

    static chooseMealAndDay(id){
        console.log("choose")
        $('.search-results').not(`#search-results-${id}`).remove();
        $('.search-results').off('click')
        $('.search-results').append(
`<div class="row">
    <div class="col-sm">
        <select id="input-day" class="form-select form-control" aria-label="Day of the Week" required>
            <option selected disabled value="">Day of the Week</option>
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option> 
        </select>
    </div>

    <div class="col-sm">
        <select id="input-meal" class="form-select form-control" aria-label="Meal of the Day" required>
            <option selected disabled value="">Meal of the Day</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Brunch">Brunch</option>
            <option value="Lunch">Lunch</option>
            <option value="Supper">Dinner</option>
        </select>
    </div>

    <div class="col-sm p-1">
        <button class="btn btn-dark form-control" onclick="DOMManager.submitMeal(${id})">Create Meal</button>
    </div>
</div>`
    )

    }


    static getAllMeals(){
        MealService.getWeek().then(meals => {
            this.render(meals)
        });
    }

    static parseDays(meals){
        let week = {
            "Monday":[], 
            "Tuesday":[], 
            "Wednesday":[],
            "Thursday":[],
            "Friday":[],
            "Saturday":[],
            "Sunday":[]
        }

        let mealsOfTheDay = ["Breakfast","Brunch","Second Breakfast","Lunch","Supper","Dinner"]
        let mealsIndex = []
        
        for(let meal of meals){
            console.log(meal)
            switch(meal.day){
                case "Monday":
                    week.Monday.push(meal)
                    break;
                case "Tuesday":
                    week.Tuesday.push(meal)
                    break;
                case "Wednesday":
                    week.Wednesday.push(meal)
                    break;
                case "Thursday":
                    week.Thursday.push(meal)
                    break;
                case "Friday":
                    week.Friday.push(meal)
                    break;
                case "Saturday":
                    week.Saturday.push(meal)
                    break;
                case "Sunday":
                    week.Sunday.push(meal)
                    break;
            }
        }
        for(let day in week){
            week[day].sort((a,b)=> {
                const mealA = a.meal;
                const mealB = b.meal;
                if(mealA < mealB) {
                    return -1;
                }
                if(mealA > mealB) {
                    return 1;
                }

                return 0;
            })
            console.log(week[day])
        }
        return week;
    }

    static showModal(id){
        console.log(id)
        let meal
        for(let index in this.meals){
            if(this.meals[index].id == id){
                meal = this.meals[index]
            }
        }
        
        
        console.log("viewing meal", meal)
        $('#edit-div').toggleClass('card')
        $('#edit-div').append(`
            <h3 class="w-80 text-center py-2">${meal.day}'s ${meal.meal}</h3>
            <p>
                <img class="img-fluid" src="${meal.img}">
                <strong>${meal.recipe_name}</strong>
                <select id="edit-day-${meal.id}" class="form-select form-control" aria-label="Day of the Week">
                                <option selected value="${meal.day}">${meal.day}</option>
                                <option value="Sunday">Sunday</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option> 
                            </select>
                            <select id="edit-meal-${meal.id}" class="form-select form-control" aria-label="Meal of the Day" required>
                                <option selected value="${meal.meal}">${meal.meal}</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Brunch">Brunch</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Supper">Dinner</option>
                            </select>
                <button class="btn btn-primary form-control py-0" onclick="DOMManager.updateMeal('${meal.id}')">Save</button>
                <button class="btn btn-danger form-control py-0" onclick="DOMManager.deleteMeal('${meal.id}')">Delete</button>
            </p>
            
            
        `)
        let editModal = new bootstrap.Modal($('#edit-div'))
        // editModal.show();
        setInterval(5000);
        console.log("hiding")
        editModal.hide();
        
        
    }

    static submitMeal(id) {
        if(id){
            MealService.getRecipeByID(id)
                .then((recipe) =>{
                    let recipeName = recipe.strMeal;
                    
                })
        }else{
            let recipeName = $('#recipe-name').val();

            let day = $('#input-day').val();
            let meal = $('#input-meal').val();
        }
        MealService.createMeal(new Meal(recipeName, meal, day, id))
            .then(() => {
                console.log("Creating meal...")
                console.log("...updating list...")
                return this.getAllMeals();
            })
    }

    static deleteMeal(id) {
        MealService.deleteMeal(id)
            .then(() => {
                return this.getAllMeals()
            })
    }

    static updateMeal(id){
        let meal
        for(let index in this.meals){
            if(this.meals[index].id == id){
                meal = this.meals[index]
            }
        }
        console.log(meal, "before edit")
        meal.day =  $(`#edit-day-${meal.id}`).val();
        meal.meal = $(`#edit-meal-${meal.id}`).val();
        console.log(meal, "before update")
        MealService.updateMeal(meal)
            .then(() => {
                return this.getAllMeals();
            })
    }

    static searchModal(){
        
        
    }

    

    static selectedMealModal(){
                    `<div class="row">
                        <div class="col-sm">
                            <select id="input-day" class="form-select form-control" aria-label="Day of the Week" required>
                                <option selected disabled value="">Day of the Week</option>
                                <option value="Sunday">Sunday</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option> 
                            </select>
                        </div>
                        
                        <div class="col-sm">
                            <select id="input-meal" class="form-select form-control" aria-label="Meal of the Day" required>
                                <option selected disabled value="">Meal of the Day</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Brunch">Brunch</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Supper">Dinner</option>
                            </select>
                        </div>

                        <div class="col-sm">
                            <button class="btn btn-dark form-control" onclick="DOMManager.submitMeal()">Create Meal</button>
                        </div>
                    </div>`
    }


    static render(meals){
        let i = 0;
        this.meals = meals;
        console.log(meals)
        $('#app').empty();
        const week = this.parseDays(meals)
        this.week = week;
        console.log(week)
        $('#app').prepend(
            `<div id="input-div" class="card">
                <div class="card-body">
                    <input type="search" id="recipe-name" class="form-control my-1" placeholder="Recipe Name" required>
                    <div class="row">
                        
                        <div class="col-lg my-1">
                            <button class="btn btn-dark form-control" onclick="DOMManager.searchRecipe($('#recipe-name').val(),false)">Search by Recipe Name</button>
                        </div>
                        <div class="col-lg my-1">
                            <button class="btn btn-dark form-control" onclick="DOMManager.searchRecipe($('#recipe-name').val(),true)">Search by Ingredient</button>
                        </div>
                        <div class="col-lg my-1">
                            <button class="btn btn-dark form-control" onclick="DOMManager.randomRecipe()">Anything, I'm so hungry!</button>
                        </div>
                        <div class="col-lg my-1">    
                            <button class="btn btn-dark form-control" onclick="DOMManager.randomRecipe($('#recipe-name').val())">Random Recipe by Ingredient</button>
                        </div>
                    </div>
                </div>    
            </div><br>

            <div id="search-div">
            </div>

            <div id="edit-div">
            </div>

            <div id="week-div" class="row overflow-auto">
            </div>
            `
        )
        for(let day in week){
            
            if(week[day].length>0){
                $('#week-div').append(
                    `<div id="${day}" class="card col-lg m-1">
                        <div class="card-header text-center">
                            <h4>${day}</h4>
                        </div>

                        <div class="card-body">
                            
                                <div id="${day}-row" class="row">
                                
                                </div>
                            
                        </div>
                    </div>
                    `
                )
                for(let meal of week[day]){
                    if(meal.meal == "Supper"){
                    meal.meal = "Dinner"
                    }
                    console.log(meal)
                    $(`#${day}-row`).append(`
                        <div id="${meal.id}" class="col-sm">
                            <p>
                                <span id="meal-${meal.id}"><strong>${meal.meal}</strong></span>
                                <span id="recipe-${meal.id}"><strong>${meal.recipe_name}</strong></span>
                                <div class="container">
                                    <span id="image-${meal.id}"><img class="img-fluid" src="<!--https://loremflickr.com/320/240/food?random=${i++}-->"</span>
                                    <button id="edit-btn-${meal.id}" class="btn btn-primary form-control py-0" data-bs-toggle="edit-div" data-bs-target="edit-div" onclick="DOMManager.showModal('${meal.id}')">Edit</button>
                                </div>
                            </p>
                        </div>
                    `)
                }
            }
        }
        
    }
}

DOMManager.getAllMeals();

//TODO Finish the meal titles and update spans
