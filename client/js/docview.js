import Home from "./docview"
import Register from "./register"
import Login from "./login"

function App() {
    return (
        <>
        <Router>
            <Route path="/" exact render={() => <Home/>} />
            <Route path="/register" exact render={() => <Register/>} />
            <Route path="/login" exact render={() => <Login/>} />
        </Router>
        </>
    );
};

export default App;

const left_list = document.getElementsByClassName("intro_list_item_link");
const right_panel_paragraph = document.getElementsByClassName("intro_paragraph")[0];

const arra = [
    "Some text as always need to be printed so be it. And looking forward to it",
    "I could say trivially that it is on the surface lying 4 days along and started",
    "disappearing in the ground inner.",
    "No matter what you do what you see, void of your code will come anyway",
];

for(let i = 0; i < left_list.length; i++)
{
    left_list[i].addEventListener("click", () => {
        return right_panel_paragraph.innerHTML = arra[0] + " " + arra[i];
    });
}

//--- Activate the sidebar tree view

// const toggler = document.getElementsByClassName("caret");
//
// for (let i = 0; i < toggler.length; i++) {
//     toggler[i].addEventListener("click", function() {
//         this.parentElement.querySelector(".nested").classList.toggle("active");
//         this.classList.toggle("caret-down");
//     });
// }



//--- Set the color of the active sidebar element
const sidebar_items = document.getElementsByClassName("sidebar_caption");

sidebar_items[0].style.backgroundColor = 'rgb(143, 201, 255)';
sidebar_items[0].style.color = 'rgb(0, 0, 0)';

for(elem of sidebar_items) {

    elem.addEventListener("click", (evt) => {

        for(let i = 0; i < evt.currentTarget.myCollection.length; ++i)
        {
            if(evt.currentTarget.myCollection[i] != evt.currentTarget)
            {
                evt.currentTarget.myCollection[i].style.color = "rgb(0, 0, 0)";
                evt.currentTarget.myCollection[i].style.backgroundColor = 'rgb(255, 255, 255)';
            }
        }
            evt.currentTarget.style.color = 'rgb(0, 0, 0)';
            evt.currentTarget.style.backgroundColor = 'rgb(143, 201, 255)';

    }, false);

    elem.myCollection = sidebar_items;
}
