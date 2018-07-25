'use strict';

const STORE = {
    items:[
      {name: "apples", checked: false, editable: false},
      {name: "oranges", checked: false, editable: false},
      {name: "milk", checked: true, editable: false},
      {name: "bread", checked: false, editable: false}
      ],
    showItemLevel: 3,
    filteredItems:[]
};


function generateItemElement(item, itemIndex, template) {
  let filterClass = '';
  if ((item.checked && STORE.showItemLevel === 1) || (!item.checked && STORE.showItemLevel === 2)) {
    filterClass = 'hidden';
  } else {
    filterClass="";
  }

  if (item.editable === true){
    return `
    <li class="js-item-index-element" ${filterClass} data-item-index="${itemIndex}">
      <input name="shopping-entry-name" class="js-shopping-entry-name" placeholder="e.g., cat food">
      <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
      </button>
      </div>
    </li>`;
  } else {
  return `
    <li class="js-item-index-element" ${filterClass} data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
  }
}

function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join("");
}
function renderShoppingList(type='full') {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  console.log(`STORE.filteredItems.length: ${STORE.filteredItems.length}`);
  if (type === 'filtered')  {
    console.log(`rendering ${type} list`);  
    let shoppingListItemsString = generateShoppingItemsString(STORE.filteredItems);
    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
    } else {
      console.log(`rendering ${type} list`);  
      let shoppingListItemsString = generateShoppingItemsString(STORE.items);
    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
  }

}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function replItemInShoppingList(newItemName, itemIndex) {
  console.log(`Replacing #"${itemIndex}" in shopping list`);
  STORE.items[itemIndex].name = newItemName;
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    const matchItemIdx = $('.js-shopping-list-entry').index;
    console.log(`matchItemIdx: ${matchItemIdx}`);
    addItemToShoppingList(newItemName);
    renderShoppingList();
    $('.js-shopping-list-entry').val('');
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function toggleItemNameInput(itemIndex) {
  console.log("Toggling name to editable for item at index " + itemIndex);
  STORE.items[itemIndex].editable = !STORE.items[itemIndex].editable;
}



$('input.js-shopping-entry-name').keyup(function(e){
  console.log(`e.keycode: ${e.keycode}`);
});
function handleItemNameClicked() {
  $('.js-shopping-list').on('click', `.js-shopping-item`, event => {
    console.log('`handleItemNameClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleItemNameInput(itemIndex);
    renderShoppingList();
    $('.js-shopping-list input').focus();
  });
  $('.js-shopping-list').on('blur, focusout', `input.js-shopping-entry-name`, event => {
    console.log('`focusout` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);      
    let newInput = $('input.js-shopping-entry-name').val();
    if (newInput) {
      if (newInput.length === 0 ) {
        STORE.items[itemIndex].editable = false;
      } else {
        let foundItem = searchItems(newInput);
        if (foundItem.length === 0) {
          STORE.items[itemIndex].name = newInput;
        }        
      }
    }
    STORE.items[itemIndex].editable = false;
    renderShoppingList();
  });
  // treat "enter" as 'Tab' for input
  $('.js-shopping-list').on('keypress', 'input.js-shopping-entry-name', event => {      
    if (event.keyCode == 13) {
      alert('enter key');
      $(this).trigger('focusout');
      //event.preventDefault();
    }
  });
}

function searchItems(searchItem){
  let items = STORE.items;
  console.log(`Function 'searchItems' ran`);
  return items.filter(item => item.name.includes(searchItem));
}

function handleKeySearch() {
  $('#dataInput').keyup(function(e){
    let searchInput = $('#dataInput').val();
    //retrieve the items that have the search string in the title
    if (searchInput.length > 0){
      //get all items that contain this string in the name or none at all
      STORE.filteredItems = searchItems(searchInput);
      //show items on shopping list that match string in name
      renderShoppingList('filtered') 
    } else {
      //return all items 
      renderShoppingList('full') 
    }
  });
}
function handleRadioButtonClicks(){
  $('.js-filter-switch').change(function() {
    if($('#showAll').prop('checked')) {
      //show all clicked
      STORE.showItemLevel = 3;
    } else {
      if($('#showChecked').prop('checked')) {
        console.log(`show checked clicked`);
        STORE.showItemLevel = 2;       
      } else {
        if($('#showUnchecked').prop('checked')) {
          console.log(`show unchecked clicked`);
          STORE.showItemLevel = 1;
        }
      }
    }
    renderShoppingList();
  });
}
function handleDeleteItemClicked() {
  console.log('`handleDeleteItemClicked` ran')
  $('.js-shopping-list').on('click', `.js-item-delete`, event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    STORE.items.splice(itemIndex, 1);
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleItemNameClicked();
  handleDeleteItemClicked();
  handleRadioButtonClicks();
  handleKeySearch();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);