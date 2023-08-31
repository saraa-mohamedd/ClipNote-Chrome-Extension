let myTabs = []
const inputEl = document.getElementById("input-el")
// const inputBtn = document.getElementById("input-btn")
const deleteBtn = document.getElementById("delete-btn")
const tabsFromLocalStorage = JSON.parse( localStorage.getItem("myTabs") )
const tabBtn = document.getElementById("tab-btn")

const bod = document.getElementById("container")

// "myTabs" in localStorage is a double dimensional array: the first dimension represents the projects,
// and the second dimension represents the tabs within each project

// tabsFromLocalStorage = [
//     {
//         lastClicked: 0,
//         projectName: "First Pro",
//         tabs: [
//             {
//                 link: "google.com",
//                 name: "Google",
//                 notes: ["note1", "note2"],
//                 newNoteOpen: false
//             },
//             {
//                 link: "youtube.com",
//                 name: "Youtube",
//                 notes: ["note1", "note2"],
//                 newNoteOpen: false
//             }
//         ]//project 1 tabs
//     } //project 1
// ]


if (tabsFromLocalStorage) {
    myTabs = tabsFromLocalStorage
    console.log(myTabs)
    renderProjectTabs()
    if (!myTabs[myTabs[0].lastClicked])
        myTabs[0].lastClicked = 0
    document.getElementById('project-tabs').children[myTabs[0].lastClicked].classList.add('clicked')
    render(myTabs, myTabs[0].lastClicked)
}
else
{
    myTabs = [{
        projectName: "Project1",
        tabs: []
    }]
    render(myTabs, 0)
    // document.getElementById('project-tabs').children[0].classList.add('clicked')
}

function render(lclTabs, projectNum) {
    let tabs = []
    
    if (lclTabs && lclTabs[projectNum])
        tabs = lclTabs[projectNum].tabs

    if (tabs && tabs.length != 0)
    {
        let mainLinksList = document.createElement("ul")

        bod.innerHTML = ``
        for (let i = 0; i < tabs.length; i++) {
            //creating newLinkListItem (contains linkHeader and notes, essentially each one of these is
            //                          a link to a tab along with all its accompanying notes and optionally the 
            //                          ability to add a new note)
            let newLinkListItem = document.createElement("li")

            // creating linkHeader (contains icon, link to tab, and button to delete link)
            let listIcon = createNewElement("i", ["fa-solid", "fa-paperclip"], "")
            listIcon.style.color = '#e8a87c'

            let linkHeader = createNewElement("div", ["link-header"], "")

            let linkText = createNewElement("a", [], tabs[i].name)
            linkText.target = "_blank"
            linkText.href = tabs[i].link
            
            
            let linkDltBtn = createNewElement("button", [], "X")
            linkDltBtn.addEventListener('click', function(){
                myTabs[projectNum].tabs.splice(i, 1)
                localStorage.setItem("myTabs", JSON.stringify(myTabs) )
                render(myTabs, projectNum)
            })

            linkHeader.append(listIcon)
            linkHeader.append(linkText)
            linkHeader.append(linkDltBtn)

            newLinkListItem.append(linkHeader)

            //creating notesItems (contains all notes for a given link)
            let notesItems = createNewElement("div", ["notes"], "")
            if (tabs[i].notes.length != 0)
            {
                notesItems = getNotesForLink(projectNum, tabs, i)
            }

            let newNoteBtn = createNewElement("button", ["new-note-btn"], "+")
            newNoteBtn.onclick = function(){
                tabs[i].newNoteOpen = !tabs[i].newNoteOpen
                localStorage.setItem("myTabs", JSON.stringify(myTabs) )
                render(myTabs, projectNum)
            }

            notesItems.append(newNoteBtn)
            newLinkListItem.append(notesItems)

            //check if we've opened the new note container (so re-rendering doesn't close it)
            if (tabs[i].newNoteOpen)
            {
                let newNoteContainer = createNewNoteContainer(projectNum, i)
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

    let newTabContainer = createNewTabContainer(projectNum)
    bod.append(newTabContainer)
    
    //creating deleteAllBtn (button to delete all tabs)
    let newDltBtn = createNewElement("button", [], "")
    newDltBtn.onclick = function(){
        myTabs.splice(projectNum, 1)
        localStorage.setItem("myTabs", JSON.stringify(myTabs))
        renderProjectTabs()
        render(myTabs, 0)
    }
    newDltBtn.textContent = "🗑 Delete Project"
    newDltBtn.id = "clear-all-btn"

    bod.append(newDltBtn)
}

function deleteClick(){
    myTabs = []
    render(myTabs, 0)
}

function createNewNoteContainer(projectNum, i){
    let newNoteContainer = createNewElement("div", ["new-note-cont"], "")

    let newNoteInput = createNewElement("input", [], "")
    newNoteInput.type = "text"
    
    let newNoteBtn = createNewElement("button", [], "Add")
    newNoteBtn.onclick = function(){
        if (newNoteInput.value.replace(/\s/g, "").length){
            myTabs[projectNum].tabs[i].notes.push(newNoteInput.value)
            myTabs[projectNum].tabs[i].newNoteOpen = false
            localStorage.setItem("myTabs", JSON.stringify(myTabs) )
            render(myTabs, projectNum) 
        }
    }

    let newNoteLabel = createNewElement("label", ["new-note-label"], "New Note")

    newNoteContainer.append(newNoteLabel)
    newNoteContainer.append(newNoteInput)
    newNoteContainer.append(newNoteBtn)

    return newNoteContainer
}

function getNotesForLink(projectNum, tabs, i){
    let notesItems = createNewElement("div", ["notes"], "")

    for (let j = 0; j < tabs[i].notes.length; j++){
        let note = createNewElement("p", [], tabs[i].notes[j])
        note.addEventListener("dblclick", function(){
            note.remove()
            myTabs[projectNum].tabs[i].notes.splice(j, 1)
            localStorage.setItem("myTabs", JSON.stringify(myTabs) )
            render(myTabs, projectNum)
        })

        notesItems.append(note)
    }
    return notesItems
}

function createNewTabContainer(projectNum)
{
    let newTabContainer = createNewElement("div", ["new-tab-cont"], "")
            
    let newTabLabel = createNewElement("label", ["new-tab-label"], "Save Current Tab")

    let newTabInput = createNewElement("input", [], "")
    newTabInput.type = "text"
    newTabInput.placeholder = "e.g. {Paper Name} by {Author Name}"

    let newTabBtn = createNewElement("button", [], "Save Tab")
    newTabBtn.onclick = function(){
        if (newTabInput.value.replace(/\s/g, "").length){
            if (myTabs[projectNum] && myTabs[projectNum].tabs){
                myTabs[projectNum].tabs.push(
                    {
                        link: "google.com",
                        name: newTabInput.value, 
                        notes: [], 
                        newNoteOpen: false
                    })
            }
            else {
                myTabs.push(
                    [
                        {
                            link: "google.com",
                            name: newTabInput.value, 
                            notes: [], 
                            newNoteOpen: false
                        }
                    ])
            }
            
            localStorage.setItem("myTabs", JSON.stringify(myTabs) )
            render(myTabs, projectNum) 
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

document.getElementById('help-btn').addEventListener('click', function(){
    if (document.getElementById('help-modal').style.display == 'block')
        document.getElementById('help-modal').style.display = 'none'
    else
        document.getElementById('help-modal').style.display = 'block'
})


function addProject(){

    const addProjectBtn = document.getElementById('add-project-btn')
    let newProjectTab = document.createElement('button')
    newProjectTab.classList.add('project-tab')
    
    let projectTabs = document.getElementById('project-tabs')
    let newProjectText = document.createElement('span')

    let startindex = tabsFromLocalStorage.length + 1
    while (tabsFromLocalStorage.filter(item => item.projectName === `Project${startindex}`).length != 0)
        startindex++
    let tabTextContent = `Project${startindex}`
    newProjectText.textContent = tabTextContent
    newProjectText.contentEditable = true
    newProjectTab.append(newProjectText)
    
    newProjectTab.addEventListener('click', function(){
        let proIndex =  tabsFromLocalStorage.findIndex(item => item.projectName === newProjectText.textContent); 
        for (let j = 0; j < projectTabs.children.length; j++)
                projectTabs.children[j].classList.remove('clicked')
                        
        console.log(proIndex)
        newProjectTab.classList.add('clicked')
        for (tab of myTabs)
            tab.lastClicked = proIndex
        localStorage.setItem("myTabs", JSON.stringify(tabsFromLocalStorage) )
        render(myTabs, proIndex)
    })

    newProjectText.oninput = function(){
        console.log(newProjectText.textContent)
        let proIndex =  tabsFromLocalStorage.findIndex(item => item.projectName === tabTextContent);
        console.log(proIndex)
        tabsFromLocalStorage[proIndex].projectName = newProjectText.textContent
        tabTextContent = newProjectText.textContent
        localStorage.setItem("myTabs", JSON.stringify(tabsFromLocalStorage) )
        renderProjectTabs()
    }

    if (tabsFromLocalStorage.length >= 2)
    {
        document.getElementById('project-tabs').append(newProjectTab)
        document.getElementById('add-project-btn').style.display = 'none'
    }
    else
    {
        document.getElementById('project-tabs').removeChild(addProjectBtn)
        document.getElementById('project-tabs').append(newProjectTab)
        document.getElementById('project-tabs').append(addProjectBtn)
    }
    tabsFromLocalStorage.push({lastClicked: myTabs[0].lastClicked, projectName: newProjectTab.textContent, tabs: []})
    localStorage.setItem("myTabs", JSON.stringify(tabsFromLocalStorage) )
}

function renderProjectTabs(){
    let projectTabs = document.getElementById('project-tabs')
    let addProjectBtn = document.createElement('button')
    addProjectBtn.id = 'add-project-btn'
    addProjectBtn.textContent = '+'
    addProjectBtn.addEventListener('click', addProject)

    projectTabs.innerHTML = ""
    for (let i = 0; i < tabsFromLocalStorage.length; i++){
        let newProjectTab = document.createElement('button')
        newProjectTab.classList.add('project-tab')

        let newProjectText = document.createElement('span')
        let tabTextContent = tabsFromLocalStorage[i].projectName
        newProjectText.textContent = tabTextContent
        newProjectText.contentEditable = true
        
        newProjectTab.append(newProjectText)
        newProjectTab.addEventListener('click', function(){
            let proIndex =  tabsFromLocalStorage.findIndex(item => item.projectName === newProjectText.textContent);
            console.log(proIndex)
            for (let j = 0; j < projectTabs.children.length; j++)
                projectTabs.children[j].classList.remove('clicked')
                        
            for (tab of myTabs)
                tab.lastClicked = proIndex
            newProjectTab.classList.add('clicked')

            localStorage.setItem("myTabs", JSON.stringify(tabsFromLocalStorage) )
            render(myTabs, proIndex)
        })

        newProjectText.addEventListener('input', function(){
            console.log("changed")

            if (newProjectText.textContent.replace(/\s/g, "").length
                && tabsFromLocalStorage.filter(item => item.projectName === newProjectText.textContent).length != 1)
            {
                let proIndex =  tabsFromLocalStorage.findIndex(item => item.projectName === tabTextContent);
                tabsFromLocalStorage[proIndex].projectName = newProjectText.textContent
                tabTextContent = newProjectText.textContent
                localStorage.setItem("myTabs", JSON.stringify(tabsFromLocalStorage) )
            }
            else {
                newProjectText.textContent = tabTextContent
            }
            // renderProjectTabs()
        })


        projectTabs.append(newProjectTab)
    }

    if (tabsFromLocalStorage.length <= 2){
        projectTabs.append(addProjectBtn)
    }
}