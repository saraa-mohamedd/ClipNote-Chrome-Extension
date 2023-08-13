let myTabs = []
const inputEl = document.getElementById("input-el")
// const inputBtn = document.getElementById("input-btn")
const deleteBtn = document.getElementById("delete-btn")
const tabsFromLocalStorage = JSON.parse( localStorage.getItem("myTabs") )
const tabBtn = document.getElementById("tab-btn")

const bod = document.getElementById("container")


if (tabsFromLocalStorage) {
    myTabs = tabsFromLocalStorage
    render(myTabs)
}
else
{
    myTabs = [false]
    render(myTabs)
}

function render(tabs) {
    if (tabs.length != 1)
    {
        let mainLinksList = document.createElement("ul")

        bod.innerHTML = ``
        for (let i = 1; i < tabs.length; i++) {
            //creating newLinkListItem (contains linkHeader and notes, essentially each one of these is
            //                          a link to a tab along with all its accompanying notes and optionally the 
            //                          ability to add a new note)
            let newLinkListItem = document.createElement("li")

            // creating linkHeader (contains icon, link to tab, and button to delete link)
            let listIcon = createNewElement("i", ["fa-solid", "fa-paperclip"], "")
            listIcon.style.color = '#869d7a'

            let linkHeader = createNewElement("div", ["link-header"], "")

            let linkText = createNewElement("a", [], tabs[i][1])
            linkText.target = "_blank"
            linkText.href = tabs[i][0]
            
            
            let linkDltBtn = createNewElement("button", [], "X")
            linkDltBtn.addEventListener('click', function(){
                myTabs.splice(i, 1)
                localStorage.setItem("myTabs", JSON.stringify(myTabs) )
                render(myTabs)
            })

            linkHeader.append(listIcon)
            linkHeader.append(linkText)
            linkHeader.append(linkDltBtn)

            newLinkListItem.append(linkHeader)

            //creating notesItems (contains all notes for a given link)
            let notesItems = createNewElement("div", ["notes"], "")
            if (tabs[i][2].length != 0)
            {
                notesItems = getNotesForLink(tabs, i)
            }

            let newNoteBtn = createNewElement("button", ["new-note-btn"], "+")
            newNoteBtn.onclick = function(){
                tabs[i][3] = !tabs[i][3]
                localStorage.setItem("myTabs", JSON.stringify(myTabs) )
                render(myTabs)
            }

            notesItems.append(newNoteBtn)
            newLinkListItem.append(notesItems)

            //check if we've opened the new note container (so re-rendering doesn't close it)
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

    let newTabContainer = createNewTabContainer()
    bod.append(newTabContainer)
    
    //creating deleteAllBtn (button to delete all tabs)
    let newDltBtn = createNewElement("button", [], "")
    newDltBtn.onclick = deleteClick
    newDltBtn.textContent = "🗑 Clear All Tabs"
    newDltBtn.id = "clear-all-btn"

    bod.append(newDltBtn)
}

function deleteClick(){
    localStorage.clear()
    myTabs = []
    render(myTabs)    
}

function createNewNoteContainer(i){
    let newNoteContainer = createNewElement("div", ["new-note-cont"], "")

    let newNoteInput = createNewElement("input", [], "")
    newNoteInput.type = "text"
    
    let newNoteBtn = createNewElement("button", [], "Add")
    newNoteBtn.onclick = function(){
        if (newNoteInput.value.replace(/\s/g, "").length){
            myTabs[i][2].push(newNoteInput.value)
            myTabs[i][3] = false
            localStorage.setItem("myTabs", JSON.stringify(myTabs) )
            render(myTabs) 
        }
    }

    let newNoteLabel = createNewElement("label", ["new-note-label"], "New Note")

    newNoteContainer.append(newNoteLabel)
    newNoteContainer.append(newNoteInput)
    newNoteContainer.append(newNoteBtn)

    return newNoteContainer
}

function getNotesForLink(tabs, i){
    let notesItems = createNewElement("div", ["notes"], "")

    for (let j = 0; j < tabs[i][2].length; j++){
        let note = createNewElement("p", [], tabs[i][2][j])
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
    let newTabContainer = createNewElement("div", ["new-tab-cont"], "")
            
    let newTabLabel = createNewElement("label", ["new-tab-label"], "Save Current Tab")

    let newTabInput = createNewElement("input", [], "")
    newTabInput.type = "text"
    newTabInput.placeholder = "e.g. {Paper Name} by {Author Name}"

    let newTabBtn = createNewElement("button", [], "Save Tab")
    newTabBtn.onclick = function(){
        if (newTabInput.value.replace(/\s/g, "").length){
            myTabs[0] = false
            myTabs.push(["google.com", newTabInput.value, [], false])
            localStorage.setItem("myTabs", JSON.stringify(myTabs) )
            render(myTabs) 
        }
    }

    newTabContainer.append(newTabLabel)
    newTabContainer.append(newTabInput)
    newTabContainer.append(newTabBtn)

    return newTabContainer
}

function createNewElement(element, classes, text){
    let newElement = document.createElement(element)

    for (let i = 0; i < classes.length; i++){
        newElement.classList.add(classes[i])
    }
    newElement.textContent = text
    return newElement
}