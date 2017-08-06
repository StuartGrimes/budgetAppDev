var budgetController = (function () {

    var income = function (id, desc, val) {
        this.id = id,
            this.desc = desc,
            this.val = val
    }

    var expense = function (id, desc, val) {
        this.id = id,
            this.desc = desc,
            this.val = val
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function (type, desc, val) {
            var id, newItem;
            //create a new id for the object so we can add it properly to the data structure.
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            //figure out if we have an income or exp
            //call the correct constructor function
            if (type === 'exp') {
                newItem = new expense(id, desc, val);
            } else if (type === 'inc') {
                newItem = new income(id, desc, val);
            }
            // add the new object to the data structure
            data.allItems[type].push(newItem);
            //return the new element
            return newItem;
        }
    }
})();

var UIController = (function () {

    var domSelectors = {
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(domSelectors.type).value,
                description: document.querySelector(domSelectors.description).value,
                value: document.querySelector(domSelectors.value).value
            }
        },
        addListItem: function (obj, type) {
            var element, newHtml, html;
            if (type === 'inc') {
                element = domSelectors.incomeContainer;
            html = '<div class="item clearfix" id="income-%id%">\n' +
                '<div class="item__description">%description%</div>\n' +
                '<div class="right clearfix">\n' +
                '<div class="item__value">%value%</div>\n' +
                '<div class="item__delete">\n' +
                '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                '</div>\n' +
                '</div>\n' +
                '</div>';
            } else if (type === 'exp') {
                element = domSelectors.expenseContainer;
               html = '<div class="item clearfix" id="expense-%id%">\n' +
                   '<div class="item__description">%description%</div>\n' +
                   '<div class="right clearfix">\n' +
                   '<div class="item__value">%value%</div>\n' +
                   '<div class="item__percentage">21%</div>\n' +
                   '<div class="item__delete">\n' +
                   '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                   '</div>\n' +
                   '</div>\n' +
                   '</div>';
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', obj.val);

            //now put in the newHtml element into the html page

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        }
    }
})();

var Controller = (function (budgetCtrl, UICtrl) {
    var setupEventListeners = function () {
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    }

    //captue the users input
    var ctrlAddItem = function () {
        var input, addItem;
        input = UICtrl.getInput();
        //add the new item to our data strucutre and return it
        addItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //update our UI with the new item
        UICtrl.addListItem(addItem, input.type);
    }

    return {
        init: function () {
            console.log('App started');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

Controller.init();