//class Recipe
class Recipe {

    //Name, Ingredients -> properties
    constructor(name, ingredients){
        this.name = name;
        this.ingredients = ingredients;
    }

}

//class Meal (Monday Lunch, Tuesday Dinner, etc)
class Meal{

    //id, name
    constructor(id, time, dayOfTheWeek){
        this.id = id;
        this.time = time;
        this.day = dayOfTheWeek;
        //array of recipes
        this.recipes = [];

    }
    
    //method: addRecipe
    addRecipe(recipe){

        //add argument to recipes array
        this.recipes.push(recipe);

    }

    //method: deleteRecipe
    deleteRecipe(recipe){

    //find index of argument in recipes array
        let index = this.recipes.indexOf(recipe);
    //remove recipe from recipes array
        this.recipes.splice(index,1);

    }
}

function alert(message){
    let main = document.getElementById('main')
    let container = document.getElementById('container')
    let alertDiv = document.createElement('div')
    alertDiv.className = "alert alert-warning alert-dismissible fade show"
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
    static url = 'https://63befa87f5cfc0949b668e06.mockapi.io/api/MealPlanner/days';

    static getWeek(){
        return $.get(this.url);
    }

    static getMeal(){
        return $.get(this.url +`/${id}`);
    }

    static createMeal(meal){
        return $.post(this.url, meal);
    }

    static updateMeal(meal){
        return $.ajax({
            url: this.url + `/${meal.id}`,
            data: JSON.stringify(meal),
            contentType: 'application/json',
            type: 'PUT'
        })
    }

    static deleteMeal(id){
        return $.ajax({
            url: this.url + `/${id}`,
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
        let meal = this.meals[id]
        
        
        console.log("viewing meal", meal)
        $('#edit-div').toggleClass('card')
        $('#edit-div').append(`
            <h3 class="w-80">${meal.day}'s ${meal.meal}</h3>
            <p>
                <img class="img-fluid" src="${meal.img}">
                <strong>${meal.recipe_name}</strong>
                <input id="edit-day-${meal.id}" value="${meal.day}"><input id="edit-meal-${meal.id}" value="${meal.meal}">
                <button class="btn btn-warning form-control py-0" onclick="DOMManager.updateMeal('${meal.id}')">Save</button>
                <button class="btn btn-danger form-control py-0" onclick="DOMManager.deleteMeal('${meal.id}')">Delete</button>
            </p>
            
            
        `)
        let editModal = new bootstrap.Modal($('#edit-div'))
        // editModal.show();
        setInterval(5000);
        console.log("hiding")
        editModal.hide();
        
        
    }

    static submitMeal() {
        let recipe = $('#recipe-name').val();
        let day = $('#input-day').val();
        let meal = $('#input-meal').val();
        console.log(recipe, day, meal)
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
                    <input type="text" id="recipe-name" class="form-control" placeholder="Recipe Name" required>
                    <div class="row">
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
                                <option value="Second Breakfast">Second Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Supper">Supper</option>
                                <option value="Dinner">Dinner</option>
                            </select>
                        </div>

                        <div class="col-sm">
                            <button class="btn btn-dark form-control" onclick="DOMManager.submitMeal()">Create Meal</button>
                        </div>
                    </div>
                </div>    
            </div><br>

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
                                    <span id="image-${meal.id}"><img class="img-fluid" src="https://loremflickr.com/320/240/food?random=${i++}"</span>
                                    <button id="edit-btn-${meal.id}" class="btn btn-warning form-control py-0" data-bs-toggle="edit-div" data-bs-target="edit-div" onclick="DOMManager.showModal('${meal.id}')">Edit</button>
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
