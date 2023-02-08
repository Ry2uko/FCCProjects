// Hacked by Ry2uko :D
// edit recipe

$(document).ready(function(){
  const defaultRecipes = [
    {
      recipeName: 'Pesto Pasta with Chicken',
      recipeDescription: 'This chicken pesto pasta is easy and delicious. Serve with crusty bread and salad for a quick dinner. Use as much or as little pesto sauce as you like. Using homemade pesto will taste even better, but it adds to prep time. Enjoy!',
      ingredients: [
        '1 (16 ounce) package bow tie pasta',
        '1 tsp olive oil',
        '2 cloves garlic, minced',
        '2 skinless, boneless chicken breasts, cut into bite-sized pieces',
        '1 pinch crushed red pepper flakes, or to taste',
        '1/2 cup pesto sauce',
        '1/2 cup oil-packed sun-dried tomatoes, drained and cut into strips'
      ],
      directions: [
        'Bring a large pot of lightly salted water to a boil. Add pasta and cook until al dente, 8 to 10 minutes; drain. ',
        'Heat oil in a large skillet over medium heat. Sauté garlic until tender, then stir in chicken and season with red pepper flakes. Cook until chicken is golden and cooked through. ',
        'Combine pasta, chicken, pesto, and sun-dried tomatoes in a large bowl; toss to coat evenly. '
      ]
    },
    {
      recipeName: 'Garlic Chicken',
      recipeDescription: 'This garlic chicken is simple to make — just dip and bake. Garlicky goodness in a breaded chicken dish. Yum!',
      ingredients: [
        '3 tbsp butter',
        '1 tsp seasoning salt',
        '1 tsp onion powder',
        '14 skinless, boneless chicken breast halves',
        '2 tsp garlic powder'
      ],
      directions: [
        'Melt butter in a large skillet over medium high heat.',
        'Add chicken and sprinkle with garlic powder, seasoning salt and onion powder.',
       'Saute about 10 to 15 minutes on each side, or until chicken is cooked through juices run clear.'
      ],
    },
    {
      recipeName: 'Rib Eye Roast',
      recipeDescription: 'Make this rib-eye roast on the bone every time rib eyes are on sale. Easy and delicious; there are never any leftovers! We usually cook ours medium-rare.',
      ingredients: [
        '1 cup softened butter',
        '6 cloves garlic, minced',
        '1 (4 lbs) bone-in rib-eye roast',
        'sea salt and cracked black pepper to taste'
      ],
      directions: [
        'Preheat the oven to 500 degrees F (260 degrees C). ',
        'Beat butter and garlic together in a bowl.',
        'Poke several holes in rib eye with a sharp knife. Rub butter mixture all over meat and season with salt and pepper. Place rib eye fat-side up in a roasting pan. ',
        'Roast in the preheated oven for 20 minutes. ',
        'Reduce heat to 325 degrees F (165 degrees C) and continue cooking until rib eye is reddish-pink and juicy in the center, 1 1/2 to 2 hours. An instant-read thermometer inserted into the center will read 145 degrees F (63 degrees C) for medium. '
      ]
    },
  ];
  let storedRecipes = JSON.parse(localStorage.getItem('_username_recipes')) || [];
  if (storedRecipes.length < 1) {
    localStorage.setItem('_username_recipes', JSON.stringify(defaultRecipes));
    storedRecipes = defaultRecipes;
  }
  
  // Render stored recipes
  storedRecipes.forEach((recipe, index) => {
    $('#recipeList').append(`
      <li class="recipe ${index === 0 ? 'active' : ''}"><span class="recipeName">${recipe.recipeName}</span><button class="deleteRecipe" type="button"><i class="fa-regular fa-trash-can"></i></button></li>
    `);
  });
  
  // Render Recipe
  const renderRecipe = (recipeName, recipeDescription, ingredients, directions) => {
    $('#recipeTitle span').text(recipeName);
    $('#recipeDescription').text(recipeDescription);
    
    $('#ingredientsList').empty();
    ingredients.forEach(ingredient => {
      $('#ingredientsList').append(`<li class="ingredient">${ingredient}</li>`);
    });
    
    $('#directionsList').empty();
    directions.forEach(direction => {
      $('#directionsList').append(`<li class="ingredient">${direction}</li>`);
    });
  }
  
  renderRecipe( // render default recipe
    storedRecipes[0].recipeName, 
    storedRecipes[0].recipeDescription,
    storedRecipes[0].ingredients, 
    storedRecipes[0].directions
  ); 
  
  // toggle sortablejs
  const addRecipe_IngredientsList = $('#addIngredientsList')[0];
  const addRecipe_DirectionsList = $('#addDirectionsList')[0];
  const editRecipe_IngredientsList = $('#editIngredientsList')[0];
  const editRecipe_DirectionsList = $('#editDirectionsList')[0];
  
  // functions for resetting count for adding recipe ingredients / directions
  const resetIngredientCount = () => {
    $('.added-ingredient.ic-li').each(function(index){
      $(this).find('.number-count').text(index+1);
    });
  }
  const resetDirectionCount = () => {
    $('.added-direction.ic-li').each(function(index){
      $(this).find('.number-count').text(index+1);
    });
  }
  
  let sortable1 = new Sortable(addRecipe_IngredientsList, {
    animation: 300,
    onEnd: () => { resetIngredientCount(); }
  });
  let sortable2 = new Sortable(addRecipe_DirectionsList, {
    animation: 300,
    onEnd: () => { resetDirectionCount(); }
  });
  let sortable3 = new Sortable(editRecipe_IngredientsList, {
    animation: 300,
    onEnd: () => { resetIngredientCount(); }
  });
  let sortable4 = new Sortable(editRecipe_DirectionsList, {
    animation: 300,
    onEnd: () => { resetDirectionCount(); }
  });
  const invalidMessages = [
    'Missing recipe name',
    'bro, that recipe name longer than yours',
    'bro, don\'t describe your life there',
    'Missing ingredient(s)',
    'Missing direction(s)'
  ]
  
  // Modal Functions
  function openModal(dialog) {
    if (dialog === 'add') {
      $('#editRecipeDialog').css('display', 'none');
      $('#addRecipeDialog').css('display', 'block');
    } else if (dialog === 'edit') {
      $('#addRecipeDialog').css('display', 'none');
      $('#editRecipeDialog').css('display', 'block');
    }
    $('#editRecipeModal').modal('show');
  };
  function closeModal() {
    $('#editRecipeModal').modal('hide');
  }
  
  // callback after closing modal for smoother close
  $('#editRecipeModal').on('hidden.bs.modal', () => {
    $('.modal-dialog').css('display', 'none');
    // Clean up
    $('._inputcleanup1').val('');
    $('._inputcleanup2').empty().css('border', 'none');
    $('.invalid-message').text('').css('display', 'none');
  });
  
  $('#editRecipe').on('click', function() {
    let recipeObj;
    openModal('edit'); 
    
    storedRecipes.forEach(recipe => {
      if (recipe.recipeName === $('#recipeTitle span').text()) {
        recipeObj = recipe;
        return;
      }
    });
    
    let recipeName = recipeObj.recipeName, 
    recipeDescription = recipeObj.recipeDescription,
    recipeIngredients = recipeObj.ingredients, 
    recipeDirections = recipeObj.directions;
    
    $('#editRecipe_RecipeName').val(recipeName);
    $('#editRecipe_RecipeDescription').val(recipeDescription);
    
    recipeIngredients.forEach((ingredientName, ingredientCount) => {
      $('#editIngredientsList').append(`
        <li class="added-ingredient ic-li">
          <span class="number-count">${ingredientCount+1}</span>
          <span class="aicl-ingredient-name">${ingredientName}</span>
          <button type="button" class="addIngredient_RemoveIngredient ic-removebtn">
            <i class="fa-solid fa-minus"></i>
          </button>
        </li>
      `);
    });
    $('.addIngredient_RemoveIngredient').on('click', function(){
      $(this).parent('.added-ingredient.ic-li').remove();
      resetIngredientCount();
      if ($('.added-ingredient.ic-li').length < 1) $('#addIngredientsList').css('border', 'none');
    });
    
    recipeDirections.forEach((directionName, directionCount) => {
      $('#editDirectionsList').append(`
        <li class="added-direction ic-li">
          <span class="number-count">${directionCount+1}</span>
          <span class="aicl-direction-name">${directionName}</span>
          <button type="button" class="addDirection_RemoveDirection ic-removebtn">
            <i class="fa-solid fa-minus"></i>
          </button>
        </li>
      `);
    });
    $('.addDirection_RemoveDirection').on('click', function(){
      $(this).parent('.added-direction.ic-li').remove();
      resetDirectionCount();
      if ($('.added-direction.ic-li').length < 1) $('#addDirectionsList').css('border', 'none');
    });
    
  });
  $('#addRecipe').on('click', () => { openModal('add'); });
  $('#closeModalAdd').on('click', () => { closeModal(); });
  $('#closeModalEdit').on('click', () => { closeModal(); });
  
  // Recipe Ingredients
  const addIngredientClickFoo = dialog => {
    let inputId, listId;
    
    if (dialog === 'add') {
      inputId = '#addRecipe_IngredientName';
      listId = '#addIngredientsList';
    } else if (dialog === 'edit') {
      inputId = '#editRecipe_IngredientName';
      listId = '#editIngredientsList';
    }
    
    if (!$(inputId).val()) return;
    
    const ingredientName = $(inputId).val(),
          ingredientCount = $(`${listId} li.added-ingredient`).length + 1;
    
    if (ingredientCount === 1) $(listId).css('border', '1px solid #ced4da');
    
    $(listId).append(`
      <li class="added-ingredient ic-li">
        <span class="number-count">${ingredientCount}</span>
        <span class="aicl-ingredient-name">${ingredientName}</span>
        <button type="button" class="addIngredient_RemoveIngredient ic-removebtn">
          <i class="fa-solid fa-minus"></i>
        </button>
      </li>
    `);
    $(inputId).val('').focus();
    
    $('.addIngredient_RemoveIngredient').on('click', function(){
      $(this).parent('.added-ingredient.ic-li').remove();
      resetIngredientCount();
      if ($('.added-ingredient.ic-li').length < 1) $('#addIngredientsList').css('border', 'none');
    });
  }
  $('#addRecipe_AddIngredient').on('click', () => { addIngredientClickFoo('add'); });
  $('#editRecipe_AddIngredient').on('click', () => { addIngredientClickFoo('edit'); });
  $('#editRecipe_IngredientName').on('keypress', e => {
    if (e.key === 'Enter') {
      $('#editRecipe_AddIngredient').click();
    }
  });
  $('#addRecipe_IngredientName').on('keypress', e => {
    if (e.key === 'Enter') {
      $('#addRecipe_AddIngredient').click();
    }
  });
  
  // Recipe Directions
  const addDirectionClickFoo = dialog => {
    let inputId, listId;
    
    if (dialog === 'add') {
      inputId = '#addRecipe_DirectionName';
      listId = '#addDirectionsList';
    } else if (dialog === 'edit') {
      inputId = '#editRecipe_DirectionName';
      listId = '#editDirectionsList';
    }
    
    if (!$(inputId).val()) return;
    
    const directionName = $(inputId).val(),
          directionCount = $(`${listId} li.added-direction`).length + 1;
    
    if (directionCount === 1) $(listId).css('border', '1px solid #ced4da');
    
    $(listId).append(`
      <li class="added-direction ic-li">
        <span class="number-count">${directionCount}</span>
        <span class="aicl-direction-name">${directionName}</span>
        <button type="button" class="addDirection_RemoveDirection ic-removebtn">
          <i class="fa-solid fa-minus"></i>
        </button>
      </li>
    `);
    $(inputId).val('').focus();
    $('.addDirection_RemoveDirection').on('click', function(){
      $(this).parent('.added-direction.ic-li').remove();
      resetDirectionCount();
      if ($('.added-direction.ic-li').length < 1) $('#addDirectionsList').css('border', 'none');
    });
  }
  $('#addRecipe_AddDirection').on('click', () => { addDirectionClickFoo('add'); });
  $('#editRecipe_AddDirection').on('click', () => { addDirectionClickFoo('edit'); });
  $('#editRecipe_DirectionName').on('keypress', e => {
    if (e.key === 'Enter') {
      $('#editRecipe_AddDirection').click();
    }
  });
  $('#addRecipe_DirectionName').on('keypress', e => {
    if (e.key === 'Enter') {
      $('#addRecipe_AddDirection').click();
    }
  });
  
  // Adding Recipe
  $('#modal_AddRecipe').on('click', () => {
    // Validation
    let invalidMessage = ''; 
    if ($('#addRecipe_RecipeName').val().length < 1) invalidMessage = invalidMessages[0];
    else if ($('#addRecipe_RecipeName').val().length > 100) invalidMessage = invalidMessages[1];
    else if ($('#addRecipe_RecipeDescription').val().length > 300) invalidMessage = invalidMessages[2];
    else if ($('#addIngredientsList .added-ingredient.ic-li').length < 1) invalidMessage = invalidMessages[3];
    else if ($('#addDirectionsList .added-direction.ic-li').length < 1) invalidMessage = invalidMessages[4];
    
    if (invalidMessage) {
      $('#addRecipeDialog .invalid-message').text(invalidMessage).css('display', 'block');
      return;
    }
    
    // Update Recipe Box
    const recipeName = $('#addRecipe_RecipeName').val(),
          recipeDescription = $('#addRecipe_RecipeDescription').val(),
          ingredientsArr = [],
          directionsArr = [];
            
    $('#addIngredientsList .aicl-ingredient-name').each(function(){
      ingredientsArr.push($(this).text());
    });
    $('#addDirectionsList .aicl-direction-name').each(function(){
      directionsArr.push($(this).text());
    });
    
    $('#recipeList').append(`
      <li class="recipe"><span class="recipeName">${recipeName}</span><button class="deleteRecipe" type="button"><i class="fa-regular fa-trash-can"></i></button></li>
    `);
    
    $('.recipe').on('click', function(){
      if ($(this).hasClass('active')) return;
      let recipeObj, recipeName = $(this).find('.recipeName').text();
    
      $('.recipe.active').removeClass('active');
      $(this).addClass('active');
    
      storedRecipes.forEach(recipe => {
        if (recipe.recipeName === recipeName) {
          recipeObj = recipe;
          return;
        }
      });

      renderRecipe(
        recipeName, 
        recipeObj.recipeDescription, 
        recipeObj.ingredients, 
        recipeObj.directions
      );
    });
    
    $('.deleteRecipe').on('click', function(){
      if ($(this).parent('.recipe').hasClass('active')) return;
      storedRecipes.forEach((recipe, index) => {
        if (recipe.recipeName === $(this).parent('.recipe').text()) {
          return storedRecipes.splice(index, 1);
        }
      });

      localStorage.setItem('_username_recipes', JSON.stringify(storedRecipes));
      $(this).parent('.recipe').remove();

    });
    
    storedRecipes.push({
      recipeName, recipeDescription, 
      ingredients: ingredientsArr,
      directions: directionsArr
    });
    
    localStorage.setItem('_username_recipes', JSON.stringify(storedRecipes));
    $('#editRecipeModal').modal('hide');
    
    // Clean up
    $('._inputcleanup1').val('');
    $('._inputcleanup2').empty().css('border', 'none');
    $('.invalid-message').text('').css('display', 'none');
  });
  $('#modal_EditRecipe').on('click', () => {
    // Validation
    let invalidMessage = ''; 
    if ($('#editRecipe_RecipeName').val().length < 1) invalidMessage = invalidMessages[0];
    else if ($('#editRecipe_RecipeName').val().length > 100) invalidMessage = invalidMessages[1];
    else if ($('#editRecipe_RecipeDescription').val().length > 300) invalidMessage = invalidMessages[2];
    else if ($('#editIngredientsList .added-ingredient.ic-li').length < 1) invalidMessage = invalidMessages[3];
    else if ($('#editDirectionsList .added-direction.ic-li').length < 1) invalidMessage = invalidMessages[4];
    
    if (invalidMessage) {
      $('#editRecipeDialog .invalid-message').text(invalidMessage).css('display', 'block');
      return;
    }
    
    // Update Recipe Box
    const recipeName = $('#editRecipe_RecipeName').val(),
          recipeDescription = $('#editRecipe_RecipeDescription').val(),
          ingredientsArr = [],
          directionsArr = [];
            
    $('#editIngredientsList .aicl-ingredient-name').each(function(){
      ingredientsArr.push($(this).text());
    });
    $('#editDirectionsList .aicl-direction-name').each(function(){
      directionsArr.push($(this).text());
    });
    
    $('.recipe').each(function(){
      if ($(this).find('.recipeName').text() === $('#recipeTitle span').text()) {
        $(this).find('.recipeName').text(recipeName);
        return;
      }
    });
    
    storedRecipes.forEach((recipe, index) => {
      if (recipe.recipeName === $('#recipeTitle span').text()) {
        storedRecipes.splice(index, 1, {
          recipeName, recipeDescription,
          ingredients: ingredientsArr,
          directions: directionsArr
        });
        return;
      }
    });
    
    renderRecipe(
      recipeName, 
      recipeDescription, 
      ingredientsArr,
      directionsArr
    );
    
    localStorage.setItem('_username_recipes', JSON.stringify(storedRecipes));
    $('#editRecipeModal').modal('hide');
    
    // Clean up
    $('._inputcleanup1').val('');
    $('._inputcleanup2').empty().css('border', 'none');
    $('.invalid-message').text('').css('display', 'none');    
  });
  
  // Deleting Recipe
  $('.deleteRecipe').on('click', function(){
    if ($(this).parent('.recipe').hasClass('active')) return;
    storedRecipes.forEach((recipe, index) => {
      if (recipe.recipeName === $(this).parent('.recipe').text()) {
        return storedRecipes.splice(index, 1);
      }
    });
    
    localStorage.setItem('_username_recipes', JSON.stringify(storedRecipes));
    $(this).parent('.recipe').remove();
    
  });
  
  // Opening a Recipe
  $('.recipe').on('click', function(){
      if ($(this).hasClass('active')) return;
      let recipeObj, recipeName = $(this).find('.recipeName').text();
    
      $('.recipe.active').removeClass('active');
      $(this).addClass('active');
    
      storedRecipes.forEach(recipe => {
        if (recipe.recipeName === recipeName) {
          recipeObj = recipe;
          return;
        }
      });

      renderRecipe(
        recipeName, 
        recipeObj.recipeDescription, 
        recipeObj.ingredients, 
        recipeObj.directions
      );
  });
});