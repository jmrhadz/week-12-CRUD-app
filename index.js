//class Recipe  (not currently used)
class Recipe {

    //Name, Ingredients -> properties
    constructor(name){
        this.name = name;
        
    }

}

//class Meal (Monday Lunch, Tuesday Dinner, etc)
class Meal{

    //id, name
    constructor(name, meal, dayOfTheWeek){
        this.id;
        this.recipe_name = name;
        this.meal = meal;
        this.day = dayOfTheWeek;
        //array of recipes
        this.img;
    }

}


// alert function is not currently being used
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

    //takes the meals and splits them into days of the week, then sorts them by time of day
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
        // the dropdown menu's options  (deprecated)
        // let mealsOfTheDay = ["Breakfast","Brunch","Second Breakfast","Lunch","Supper","Dinner"]
        // let mealsIndex = []
        

        //loop through the meals list and put each one in its day
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

        //loop through days and sort meals alphabetically (note: dinner is called supper until it is rendered in the dom.  didn't want to get into historical or linguistic arguments)
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

    //display div for editing meal's day and time
    static showModal(id){           //note//TODO: this div was originally intended to be a modal that displays over the DOM
        console.log(id)
        let meal

        //loop through meal and match id
        for(let index in this.meals){
            if(this.meals[index].id == id){
                meal = this.meals[index]
            }
        }
        
        
        console.log("viewing meal", meal)
        //turn edit-div into a card and append the day and meal dropdowns with save and delete buttons
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
                <button class="btn btn-warning form-control py-0" onclick="DOMManager.updateMeal('${meal.id}')">Save</button>
                <button class="btn btn-danger form-control py-0" onclick="DOMManager.deleteMeal('${meal.id}')">Delete</button>
            </p>
        `)  //note: the default option (shown) and its value are the current values for the meal, so the user only has to touch one thing if they want
       
        
    }

    //validate input and create meal if valid
    static submitMeal() {
        let recipe = $('#recipe-name').val();

        let day = $('#input-day').val();
        let meal = $('#input-meal').val();
        if(recipe && day && meal){
            MealService.createMeal(new Meal(recipe, meal, day))
                .then(() => {
                    console.log("Creating meal...")
                    console.log("...updating list...")
                    return this.getAllMeals();
            })}
    }

    //delete meal by id
    static deleteMeal(id) {
        MealService.deleteMeal(id)
            .then(() => {
                return this.getAllMeals()
            })
    }

    //update meal by id using values from drop downs
    static updateMeal(id){
        let meal

        //match meal id with passed id
        for(let index in this.meals){
            if(this.meals[index].id == id){
                meal = this.meals[index]
            }
        }
        console.log(meal, "before edit")

        //change values based on input
        meal.day =  $(`#edit-day-${meal.id}`).val();
        meal.meal = $(`#edit-meal-${meal.id}`).val();
        console.log(meal, "before update")

        //PUT meal with changes
        MealService.updateMeal(meal)
            .then(() => {
                return this.getAllMeals();
            })
    }

    // render the DOM
    static render(meals){
        let i = 0;  //iterator for loremflickr images
        this.meals = meals;
        console.log(meals)

        //empty the app div
        $('#app').empty();

        //parse the meals into days
        const week = this.parseDays(meals)
        this.week = week;
        console.log(week)

        //add the create meal div with inputs to the top of the app div
        $('#app').prepend(
            `<div id="input-div" class="card">
                <form class="card-body">
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
                                <option value="Lunch">Lunch</option>
                                <option value="Supper">Dinner</option>
                            </select>
                        </div>

                        <div class="col-sm">
                            <button class="btn btn-dark form-control" onclick="DOMManager.submitMeal()">Create Meal</button>
                        </div>
                    </div>
                </form>    
            </div><br>

            <div id="edit-div">
            </div>

            <div id="week-div" class="row overflow-auto">
            </div>
            `
        )

        // display day divs only if they have meals
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
                // add meal as column to row in day card
                for(let meal of week[day]){
                    if(meal.meal == "Supper"){  //changes supper to dinner for order purposes: see note in parseDays method
                    meal.meal = "Dinner"
                    }
                    console.log(meal)

                    //add the meal info and corresponding edit button to the day
                    $(`#${day}-row`).append(`
                        <div id="${meal.id}" class="col-sm text-center justify-content-center">
                            <p>
                                <span id="meal-${meal.id}"><strong>${meal.meal}</strong></span><br>
                                <span id="recipe-${meal.id}"><strong>${meal.recipe_name}</strong></span>
                                <div class="container">
                                    <span id="image-${meal.id}"><img class="img-fluid" src=https://loremflickr.com/320/240/food?random=${i++}>"</span>
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
