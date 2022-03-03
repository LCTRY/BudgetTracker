//ELEMENTS - INPUT
const desc_ele = document.getElementById("desc_input")
const date_ele = document.getElementById("date_input")
const amount_ele = document.getElementById("amount_input")
const desc_edit_ele = document.getElementById("listEdit__desc")
const date_edit_ele = document.getElementById("listEdit__date")
const amount_edit_ele = document.getElementById("listEdit__amount")
const listEdit__type_ele = document.getElementById("listEdit__type")

//ELEMENTS - OUTPUT
const total_income_ele= document.getElementById("income_output")
const total_expense_ele= document.getElementById("expenses_output")
const total_balance_ele = document.getElementById("balance_output")
const budget_ele = document.getElementById("budget_div")
const edit_ele = document.getElementById("edit_div")
const errorMessage_ele = document.getElementById("errorMessage_output")
const Edit__title_ele = document.querySelector("#listEdit__title_h2")

//BUTTONS - INPUTS
const add_btn = document.getElementById("add_btn")
const expense_btn = document.getElementById("expense_input")
const income_btn = document.getElementById("income_input")
const remove_btn = document.querySelector(".budget_container")
const edit_btn = document.querySelector(".list__edit-container")

//DATA
let budgetItems = []
let budgetType = "expense"
let total = 0
let isAscDate = true
let isAscAmount = true
let isAscDesc = true

add_btn.addEventListener("click", addItem)
expense_btn.addEventListener("click", toggleType)
income_btn.addEventListener("click", toggleType)
remove_btn.addEventListener("click", handleEntry)
edit_btn.addEventListener("click", editEntry)

//dashboard - section
function updateTotals(){
    let incomeTotal = 0
    let expenseTotal = 0
    let balance = 0

    budgetItems.forEach((item)=>{
        if (item.type === "income") {
            incomeTotal += item.amount
        }
        if (item.type === "expense") {
            expenseTotal += item.amount
        }
    })
    balance = incomeTotal - expenseTotal
    total_income_ele.innerHTML =  `$${incomeTotal}`
    total_expense_ele.innerHTML =  `$${expenseTotal}`
    total_balance_ele.innerHTML = `$${balance}`
}


//entry - section

function toggleType(e){
    const thisButton = e.target

    income_btn.classList.remove("activeIncome")
    expense_btn.classList.remove("activeExpense")
    if (thisButton.classList[0] === "income__btn"){
        thisButton.classList.toggle("activeIncome")
    } else {
        thisButton.classList.toggle("activeExpense")
    }
    
    
    if (thisButton.classList[0] == "expense__btn") budgetType = "expense"
    if (thisButton.classList[0] == "income__btn") budgetType = "income"
}


// entry display - section
function createBudgetItemsList () {
    budget_ele.innerHTML = `<div class="list__header-container">
                                <h2 class="date_header"> Date <button onClick="sortByDate()"><i class="fa fa-sort" aria-hidden="true"></i></button></h2>
                                <h2 class="amount_header"> Amount <button onClick="sortByAmount()"><i class="fa fa-sort" aria-hidden="true"></i></button></h2>
                                <h2 class="desc_header"> Description <button onClick="sortByDesc()"><i class="fa fa-sort" aria-hidden="true"></i></button></h2>
                            </div>
                            `

    budgetItems.forEach((item, index) => {
        let entry_type = ""
        if (item.type === "income") entry_type = "income_green"
        if (item.type === "expense") entry_type = "expense_red"
  
        const entry_container = document.createElement("div")
        entry_container.classList.add("list__entry-container")
        entry_container.id = index
        budget_ele.appendChild(entry_container)

        const entry_date = document.createElement("p")
        entry_date.classList.add("list__date")
        entry_date.classList.add(`${entry_type}`)
        entry_date.innerHTML = `${item.date}`
        entry_container.appendChild(entry_date)

        const entry_amount = document.createElement("p")
        entry_amount.classList.add("list__amount")
        entry_amount.classList.add(`${entry_type}`)
        if (item.type === "income") {
            entry_amount.innerHTML = `$${item.amount}`
        } else {
            entry_amount.innerHTML = `-$${item.amount}`
        }
        entry_container.appendChild(entry_amount)

        const entry_desc = document.createElement("p")
        entry_desc.classList.add("list__desc")
        entry_desc.classList.add(`${entry_type}`)
        entry_desc.innerHTML = `${item.desc}`
        entry_container.appendChild(entry_desc)

        const btn_div = document.createElement("div")
        btn_div.classList.add("list__btn_container")
        entry_container.appendChild(btn_div)

        const edit_btn = document.createElement("button")
        edit_btn.classList.add("list__edit_btn")
        edit_btn.innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i>`
        btn_div.appendChild(edit_btn)

        const remove_btn = document.createElement("button")
        remove_btn.classList.add("list__remove_btn")
        remove_btn.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`
        btn_div.appendChild(remove_btn)
    })
}

function handleEntry(e){
    var entry = e.target
    var entryParent = entry.parentElement
    var entryGrandParent = entryParent.parentElement
    var currentItem = budgetItems[entryGrandParent.id]

    if (entry.classList[0] === "list__remove_btn") {
        if (confirm("Want to delete?")) {
            entryGrandParent.remove()
            deleteEntry(entryGrandParent.id)
        }
    }
        
    if (entry.classList[0] === "list__edit_btn") {
        Edit__title_ele.innerHTML = `Editing: ${currentItem.desc}`
        Edit__title_ele.id = entryGrandParent.id
        desc_edit_ele.value = `${currentItem.desc}`
        date_edit_ele.value = `${currentItem.date}`
        amount_edit_ele.value = `${currentItem.amount}`
        listEdit__type_ele.value = `${currentItem.type}`
        toggleEditContainer()
    }
}

function deleteEntry(entry){
    budgetItems.splice(entry, 1);
    updateUI();
}

function toggleEditContainer(){
    document.body.classList.toggle("list__edit-container_open")
}

function editEntry(e){
    var item = e.target

    if (item.classList[0] === "listEdit__accept_edit_btn") {
        updateItem(Edit__title_ele.id, listEdit__type_ele.value, desc_edit_ele.value, date_edit_ele.value, amount_edit_ele.value)
        toggleEditContainer()
    } else if (item.classList[0] ==="listEdit__cancel_btn"){
        toggleEditContainer()
    }
}


// ** CRUD functions **
function updateUI(){
    createBudgetItemsList()
    updateTotals()
    if (budgetItems.length === 0) budget_ele.innerHTML = ``
}

function updateItem(index, type, desc, date, amount){
    budgetItems.splice(index, 1, {
        "type": type,
        "desc": desc,
        "date": date,
        "amount": parseInt(amount),
    })
     updateUI()
}

function addItem(){
    errorMessage_ele.innerHTML = ""

    var date = new Date().toLocaleString('en-US',{        
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
    });
 
    mdy = date.split('/');
    var month = mdy[0];
    var day = mdy[1];
    var year = mdy[2];
    
    var todayDefault = `${year}-${month}-${day}`

    if (!amount_ele.value) {
        errorMessage_ele.innerHTML = "Enter an amount"
        return
    } else if (amount_ele.value <= 0){
        errorMessage_ele.innerHTML = "Amount must be greater then 0"
        return
    } 

    if (!date_ele.value) date_ele.value = todayDefault

    budgetItems.push ({
        "type": budgetType,
        "desc": desc_ele.value,
        "date": date_ele.value,
        "amount": parseInt(amount_ele.value),
    })
    updateUI()
}

// *** sort functions ***
function sortByDate () {
    if (!isAscDate){
        budgetItems.sort((a, b)=> {
            if (a.date > b.date){
                return 1
            } else if (a.date < b.date) {
                return -1
            } else {
                return 0
            }
        })
        isAscDate = !isAscDate
    } else {
        budgetItems.sort((a, b)=> {
            if (a.date > b.date){
                return -1
            } else if (a.date < b.date) {
                return 1
            } else {
                return 0
            }
        })
        isAscDate = !isAscDate
    }
    updateUI()
}
function sortByAmount () {
    if (!isAscAmount){
        budgetItems.sort((a, b)=> {
            if (a.amount > b.amount){
                return 1
            } else if (a.amount < b.amount) {
                return -1
            } else {
                return 0
            }
        })
        isAscAmount = !isAscAmount
    } else {
        budgetItems.sort((a, b)=> {
            if (a.amount > b.amount){
                return -1
            } else if (a.amount < b.amount) {
                return 1
            } else {
                return 0
            }
        })
        isAscAmount = !isAscAmount
    }
    updateUI()
}
function sortByDesc () {
    if (!isAscDesc) {
        budgetItems.sort((a, b)=> {
            if (a.desc.toLowerCase() > b.desc.toLowerCase()){
                return 1
            } else if (a.desc.toLowerCase() < b.desc.toLowerCase()) {
                return -1
            } else {
                return 0
            }
        })
        isAscDesc = !isAscDesc
    } else {
        budgetItems.sort((a, b)=> {
            if (a.desc.toLowerCase() > b.desc.toLowerCase()){
                return -1
            } else if (a.desc.toLowerCase() < b.desc.toLowerCase()) {
                return 1
            } else {
                return 0
            }
        })
        isAscDesc = !isAscDesc
    }
    updateUI()
}