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

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.val;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        },
        calculateBudget: function () {

            //calculate total income and expenses (create a private function here for this)
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate the budget (income minus expenses)
            data.budget = data.totals.inc - data.totals.exp;
            //calculate percentage of income spent (dont want it to happen if no income)
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function () {
            console.log(data);
        }
    }
})();

var UIController = (function () {

    var domSelectors = {
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(domSelectors.type).value,
                description: document.querySelector(domSelectors.description).value,
                value: parseInt(document.querySelector(domSelectors.value).value)
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
        },
        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(domSelectors.description + ', ' + domSelectors.value);
            //above code returns a list but we need an array...lets turn it into an array
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            document.querySelector(domSelectors.budgetLabel).textContent = obj.budget;
            document.querySelector(domSelectors.incomeLabel).textContent = obj.totalInc;
            document.querySelector(domSelectors.expensesLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {
                document.querySelector(domSelectors.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(domSelectors.percentageLabel).textContent = '---';
            }

        }
    }
})();

var Controller = (function (budgetCtrl, UICtrl) {
    var setupEventListeners = function () {
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    }
    var updateBudget = function () {
        var budget;
        //calculate the budget
        budgetCtrl.calculateBudget();
        //return the budget
        budget = budgetCtrl.getBudget();
        //Display the budget in the ui
        UICtrl.displayBudget(budget);
    }
    //captue the users input
    var ctrlAddItem = function () {
        var input, addItem;
        input = UICtrl.getInput();
        //test to see if there is content input before continuing
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //add the new item to our data strucutre and return it
            addItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //update our UI with the new item
            UICtrl.addListItem(addItem, input.type);
            //clear the input fields
            UICtrl.clearFields();
            //calculate and update budget
            updateBudget();
        }

    }

    return {
        init: function () {
            console.log('App started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

Controller.init();