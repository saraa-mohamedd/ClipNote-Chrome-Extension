let myTabs = []
const inputEl = document.getElementById("input-el")
// const inputBtn = document.getElementById("input-btn")
const deleteBtn = document.getElementById("delete-btn")

//tabsFromLocalStorage used to only intiially get the localstorage info
const tabsFromLocalStorage = JSON.parse( localStorage.getItem("myTabs") )
const theme = JSON.parse( localStorage.getItem("colorTheme") )
const tabBtn = document.getElementById("tab-btn")

const bod = document.getElementById("container")

if (!theme)
    localStorage.setItem("colorTheme", JSON.stringify({theme: "default"}))

setTheme()


if (tabsFromLocalStorage && tabsFromLocalStorage.length) {
    myTabs = tabsFromLocalStorage
    if (myTabs.length <= myTabs[0].lastClicked)
        myTabs[0].lastClicked = 0
    renderProjectTabs()
    document.getElementById('project-tabs').children[myTabs[0].lastClicked].classList.add('clicked')
    render(myTabs, myTabs[0].lastClicked)
}
else
{
    myTabs = [{
        lastClicked: 0,
        projectName: "Project1",
        tabs: []
    }]
    localStorage.setItem("myTabs", JSON.stringify(myTabs) )
    renderProjectTabs()
    document.getElementById('project-tabs').children[myTabs[0].lastClicked].classList.add('clicked')
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
        if (!myTabs.length){
            myTabs = [{
                lastClicked: 0,
                projectName: "Project1",
                tabs: []
            }]
        }
        localStorage.setItem("myTabs", JSON.stringify(myTabs))
        renderProjectTabs()
        document.getElementById('project-tabs').children[0].classList.add('clicked')
        render(myTabs, 0)
    }
    let trashIcon = createNewElement("i", ["fa-solid", "fa-trash-can"], "")
    newDltBtn.append(trashIcon)
    newDltBtn.innerHTML += "  Delete Project"
    newDltBtn.id = "clear-all-btn"

    bod.append(newDltBtn)
}

function createNewNoteContainer(projectNum, i){
    let newNoteContainer = createNewElement("div", ["new-note-cont"], "")

    let newNoteInput = createNewElement("input", [], "")
    newNoteInput.type = "text"

    newNoteInput.addEventListener("keypress", function(event) {
        if (event.key == "Enter"){
            event.preventDefault()
            if (newNoteInput.value.replace(/\s/g, "").length){
                myTabs[projectNum].tabs[i].notes.push(newNoteInput.value)
                myTabs[projectNum].tabs[i].newNoteOpen = false
                localStorage.setItem("myTabs", JSON.stringify(myTabs) )
                render(myTabs, projectNum) 
            }
        }
    })
    
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

    newTabInput.addEventListener("keypress", function(event) {
        if (event.key == "Enter"){
            event.preventDefault()
            if (newTabInput.value.replace(/\s/g, "").length){
                if (myTabs[projectNum] && myTabs[projectNum].tabs){
                    chrome.tabs.query({active: true, currentWindow: true}, function(chrometabs){
                        myTabs[projectNum].tabs.push(
                            {
                                link: chrometabs[0].url,
                                name: newTabInput.value,
                                notes: [],
                                newNoteOpen: false
                            })
                        localStorage.setItem("myTabs", JSON.stringify(myTabs) )
                        render(myTabs, projectNum)
                    })
                }
            }
        }
    })
    let newTabBtn = createNewElement("button", [], "Save Tab")
    newTabBtn.onclick = function(){
            if (newTabInput.value.replace(/\s/g, "").length){
                if (myTabs[projectNum] && myTabs[projectNum].tabs){
                    chrome.tabs.query({active: true, currentWindow: true}, function(chrometabs){
                        myTabs[projectNum].tabs.push(
                            {
                                link: chrometabs[0].url,
                                name: newTabInput.value,
                                notes: [],
                                newNoteOpen: false
                            })
                        localStorage.setItem("myTabs", JSON.stringify(myTabs) )
                        render(myTabs, projectNum)
                    })
                }
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

    let startindex = myTabs.length + 1
    while (myTabs.filter(item => item.projectName === `Project${startindex}`).length != 0)
        startindex++
    let tabTextContent = `Project${startindex}`
    newProjectText.textContent = tabTextContent
    newProjectText.contentEditable = true
    newProjectText.spellcheck = false
    newProjectTab.append(newProjectText)
    
    newProjectTab.addEventListener('click', function(){
        let proIndex =  myTabs.findIndex(item => item.projectName === newProjectText.textContent); 
        for (let j = 0; j < projectTabs.children.length; j++)
                projectTabs.children[j].classList.remove('clicked')
                        
        newProjectTab.classList.add('clicked')
        for (tab of myTabs)
            tab.lastClicked = proIndex
        localStorage.setItem("myTabs", JSON.stringify(myTabs) )
        render(myTabs, proIndex)
    })

    newProjectText.oninput = function(){
        let proIndex =  myTabs.findIndex(item => item.projectName === tabTextContent);
        myTabs[proIndex].projectName = newProjectText.textContent
        tabTextContent = newProjectText.textContent
        localStorage.setItem("myTabs", JSON.stringify(myTabs) )
        // renderProjectTabs()
    }

    if (myTabs.length >= 2)
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
    myTabs.push({lastClicked: myTabs[0].lastClicked, projectName: newProjectTab.textContent, tabs: []})
    localStorage.setItem("myTabs", JSON.stringify(myTabs) )
}

function renderProjectTabs(){
    let projectTabs = document.getElementById('project-tabs')
    let addProjectBtn = document.createElement('button')
    addProjectBtn.id = 'add-project-btn'
    addProjectBtn.textContent = '+'
    addProjectBtn.addEventListener('click', addProject)

    const myTabs = JSON.parse( localStorage.getItem("myTabs") )
    projectTabs.innerHTML = ""
    for (let i = 0; i < myTabs.length; i++){
        let newProjectTab = document.createElement('button')
        newProjectTab.classList.add('project-tab')

        let newProjectText = document.createElement('span')
        let tabTextContent = myTabs[i].projectName
        newProjectText.textContent = tabTextContent
        newProjectText.contentEditable = true
        
        newProjectTab.append(newProjectText)
        newProjectTab.addEventListener('click', function(){
            let proIndex =  myTabs.findIndex(item => item.projectName === newProjectText.textContent);
            for (let j = 0; j < projectTabs.children.length; j++)
                projectTabs.children[j].classList.remove('clicked')
                        
            for (tab of myTabs)
                tab.lastClicked = proIndex
            newProjectTab.classList.add('clicked')

            localStorage.setItem("myTabs", JSON.stringify(myTabs) )
            render(myTabs, proIndex)
        })

        newProjectText.addEventListener('input', function(){

            if (newProjectText.textContent.replace(/\s/g, "").length
                && myTabs.filter(item => item.projectName === newProjectText.textContent).length != 1)
            {
                let proIndex =  myTabs.findIndex(item => item.projectName === tabTextContent);
                myTabs[proIndex].projectName = newProjectText.textContent
                tabTextContent = newProjectText.textContent

                // if (tabTextContent.length > 10)
                //     newProjectText.textContent = tabTextContent.slice(0, 10) + ".."
                localStorage.setItem("myTabs", JSON.stringify(myTabs) )
            }
            else {
                newProjectText.textContent = tabTextContent
            }
            // renderProjectTabs()
        })


        projectTabs.append(newProjectTab)
    }

    if (myTabs.length <= 2){
        projectTabs.append(addProjectBtn)
    }
}

function setTheme(){
    const theme = JSON.parse( localStorage.getItem("colorTheme") )
    if (theme.theme == "default")
    {
        document.documentElement.style.setProperty( '--bg-color', '#ffffff' );
        document.documentElement.style.setProperty( '--primary-color', '#41b3a3' );
        document.documentElement.style.setProperty( '--secondary-color', '#c38d9e' );
        document.documentElement.style.setProperty( '--secondary-color-diluted', '#c38d9eaa' );
        document.documentElement.style.setProperty( '--tertiary-color', '#e8a87c' );
        document.documentElement.style.setProperty( '--tertiary-color-diluted', '#e8a87caa' );
         document.documentElement.style.setProperty('--quaternary-color', '#FAC3C1');
        document.documentElement.style.setProperty( '--tab-color', '#82b3ac' );
        document.documentElement.style.setProperty('--note-text-color', 'white');
        document.documentElement.style.setProperty('--small-btn-color', 'rgb(247, 247, 247)');
        document.documentElement.style.setProperty('--modal-bg-color', 'rgba(255, 255, 255, 0.95)');
        document.documentElement.style.setProperty('--link-hover-color', '#38423B');
        document.documentElement.style.setProperty('--help-header-color', '#428b82');
        document.documentElement.style.setProperty('--note-cont-hover-color', '#886c78aa');
        document.documentElement.style.setProperty('--note-btn-hover-color', '#977680');
        document.documentElement.style.setProperty('--tab-cont-hover-color', '#456e69aa');
        document.documentElement.style.setProperty('--tab-btn-hover-color', '#407971');
        document.documentElement.style.setProperty('--gray-tone', 'lightgray');
        document.documentElement.style.setProperty('--red-tone', '#e27d60');
        document.documentElement.style.setProperty('--input-text-color', 'black');
        document.documentElement.style.setProperty('--focused-text-color', '#f0e2e7');
        document.documentElement.style.setProperty('--selected-text-color', '#976f7c');

    }
    else if (theme.theme == "dark")
    {
        document.documentElement.style.setProperty('--bg-color', '#2D2A3E')
        document.documentElement.style.setProperty('--primary-color', '#f9db6d');
        document.documentElement.style.setProperty('--secondary-color', '#B8D9DF');
        document.documentElement.style.setProperty('--secondary-color-diluted', '#B8D9DF');
        document.documentElement.style.setProperty('--tertiary-color', '#F79BBF');
        document.documentElement.style.setProperty('--tertiary-color-diluted', '#F79BBFaa');
        document.documentElement.style.setProperty('--tab-color', '#E6CE7A');
        document.documentElement.style.setProperty('--note-text-color', '#2D2A3E');
        document.documentElement.style.setProperty('--small-btn-color', '#3C3856');
        document.documentElement.style.setProperty('--modal-bg-color', '#2D2A3Ee8');
        document.documentElement.style.setProperty('--link-hover-color', '#ECE5C8');
        document.documentElement.style.setProperty('--help-header-color', '#E4D290');
        document.documentElement.style.setProperty('--quaternary-color', '#8784B8');
        document.documentElement.style.setProperty('--note-cont-hover-color', '#C0D6DA');
        document.documentElement.style.setProperty('--note-btn-hover-color', '#9AB8BD');
        document.documentElement.style.setProperty('--tab-cont-hover-color', '#E4D290aa');
        document.documentElement.style.setProperty('--tab-btn-hover-color', '#E2CF8B');
        document.documentElement.style.setProperty('--gray-tone', 'rgb(116, 116, 116)');
        document.documentElement.style.setProperty('--red-tone', '#D05F60');
        document.documentElement.style.setProperty('--input-text-color', 'whitesmoke');
        document.documentElement.style.setProperty('--focused-text-color', '#56526E');
        document.documentElement.style.setProperty('--selected-text-color', '#8C899B');

        
    }
}

function toggleTheme(){
    if (JSON.parse( localStorage.getItem("colorTheme") ).theme == "default")
        localStorage.setItem("colorTheme", JSON.stringify({theme: "dark"}) )
    else
        localStorage.setItem("colorTheme", JSON.stringify({theme: "default"}) )

    setTheme()
}

document.getElementById('palette-btn').addEventListener('click', toggleTheme)