let myTabs = []
const inputEl = document.getElementById("input-el")
// const inputBtn = document.getElementById("input-btn")
const deleteBtn = document.getElementById("delete-btn")
const tabsFromLocalStorage = JSON.parse( localStorage.getItem("myTabs") )
const tabBtn = document.getElementById("tab-btn")

const bod = document.getElementById("container")


console.log(bod)

if (tabsFromLocalStorage) {
    myTabs = tabsFromLocalStorage
    render(myTabs)
}
else
{
    myTabs = []
    render(myTabs)
}

function render(tabs) {
    if (tabs.length != 0)
    {
        let mainLinksList = document.createElement("ul")

        bod.innerHTML = ``
        for (let i = 0; i < tabs.length; i++) {
            let newLinkListItem = document.createElement("li")

            let linkHeader = document.createElement('div')
            linkHeader.classList.add("link-header")

            let linkText = document.createElement("a")
            linkText.target = "_blank"
            linkText.href = tabs[i][0]
            linkText.textContent = tabs[i][1]

            let linkDltBtn = document.createElement(`button`)
            linkDltBtn.textContent = "X"
            linkDltBtn.addEventListener('click', function(){
                myTabs.splice(i, 1)
                localStorage.setItem("myTabs", JSON.stringify(myTabs) )
                render(myTabs)
            })

            linkHeader.append(linkText)
            linkHeader.append(linkDltBtn)
            
            newLinkListItem.append(linkHeader)

            let notesItems = document.createElement("div")
            notesItems.classList.add("notes")
            if (tabs[i][2].length != 0)
            {
                notesItems = getNotesForLink(tabs, i)
            }
            let newNoteBtn = document.createElement(`button`)
            newNoteBtn.classList.add("new-note-btn")
            newNoteBtn.innerText = "+"
            newNoteBtn.onclick = function(){
                tabs[i][3] = !tabs[i][3]
                localStorage.setItem("myTabs", JSON.stringify(myTabs) )
                render(myTabs)
            }
            notesItems.append(newNoteBtn)
            newLinkListItem.append(notesItems)

            if (tabs[i][3])
            {
                let newNoteContainer = createNewNoteContainer(i)
                newLinkListItem.append(newNoteContainer)
            }

            mainLinksList.append(newLinkListItem)
        }
        bod.append(mainLinksList)
    }
    else
    {
        bod.innerHTML = ""
    }
    newTabContainer = document.createElement(`div`)
    newTabContainer.classList.add("new-tab-cont")
            
    let newTabLabel = document.createElement("label")
    newTabLabel.classList.add("new-tab-label")
    newTabLabel.textContent = "Save Current Tab"

    let newTabInput = document.createElement("input")
    newTabInput.type = "text"
    newTabInput.placeholder = "e.g. {Paper Name} by {Author Name}"

    let newTabBtn = document.createElement(`button`)
    newTabBtn.onclick = function(){
        if (newTabInput.value.replace(/\s/g, "").length){
            myTabs.push(["google.com", newTabInput.value, [], false])
            localStorage.setItem("myTabs", JSON.stringify(myTabs) )
            render(myTabs) 
        }
    }
    newTabBtn.textContent = "Save Tab"

    let newDltBtn = document.createElement(`button`)
    newDltBtn.onclick = deleteClick
    newDltBtn.textContent = "Clear All Tabs"
    newDltBtn.id = "clear-all-btn"

    newTabContainer.append(newTabLabel)
    newTabContainer.append(newTabInput)
    newTabContainer.append(newTabBtn)

    bod.append(newTabContainer)
    bod.append(newDltBtn)
     
}

function deleteClick(){
    localStorage.clear()
    myTabs = []
    render(myTabs)    
}

function createNewNoteContainer(i){
    let newNoteContainer = document.createElement(`div`)
    newNoteContainer.classList.add("new-note-cont")

    let newNoteInput = document.createElement("input")
    newNoteInput.type = "text"
    
    let newNoteBtn = document.createElement(`button`)
    newNoteBtn.onclick = function(){
        if (newNoteInput.value.replace(/\s/g, "").length){
            myTabs[i][2].push(newNoteInput.value)
            myTabs[i][3] = false
            localStorage.setItem("myTabs", JSON.stringify(myTabs) )
            render(myTabs) 
        }
    }
    newNoteBtn.textContent = "Add"

    let newNoteLabel = document.createElement("label")
    newNoteLabel.classList.add("new-note-label")
    newNoteLabel.textContent = "New Note"

    newNoteContainer.append(newNoteLabel)
    newNoteContainer.append(newNoteInput)
    newNoteContainer.append(newNoteBtn)

    return newNoteContainer
}

function getNotesForLink(tabs, i){
    let notesItems = document.createElement("div")
    notesItems.classList.add("notes")

    for (let j = 0; j < tabs[i][2].length; j++){
        let note = document.createElement("p")
        note.textContent = tabs[i][2][j]
        note.addEventListener("dblclick", function(){
            note.remove()
            myTabs[i][2].splice(j, 1)
            localStorage.setItem("myTabs", JSON.stringify(myTabs) )
            render(myTabs)
        })

        notesItems.append(note)
    }
    return notesItems
}

function createNewTabContainer()
{
    let newTabContainer = document.createElement(`div`)
    newTabContainer.classList.add("new-tab-cont")

    let newTabInput = document.createElement("input")
    newTabInput.type = "text"

    let newTabBtn = document.createElement(`button`)
    newTabBtn.onclick = function(){
        if (newInput.value.replace(/\s/g, "").length){
            myTabs.push(["google.com", newInput.value, [], false])
            localStorage.setItem("myTabs", JSON.stringify(myTabs) )
            render(myTabs) 
        }
    }
    newTabBtn.textContent = "Save Tab"

    newTabContainer.append(newTabInput)
    newTabContainer.append(newTabBtn)

}