class State {
    FLASK_ID = 0
    FLASKS_DATA = {

    }
    solution = []
    solution_idx = 0

    addFlask(height){
        let newFlask = new Flask(this.FLASK_ID, height, this);
        newFlask.render_html();
        this.FLASKS_DATA[this.FLASK_ID] = newFlask;
        this.FLASK_ID += 1;
        this.resetSolution()
        return newFlask
    }

    addFlaskFromPrompt(){
        // let userHeight = parseInt(prompt("Enter the new height"));
        let userHeight = 4;
        if (!isNaN(userHeight)){
            this.addFlask(userHeight)
        }
    }

    removeFlask(flaskID){
        let flask = this.FLASKS_DATA[flaskID]
        if(flask != null) {
            flask.remove()
            delete this.FLASKS_DATA[flaskID];
        }
        this.resetSolution()
    }

    asArray(){
        let new_flasks_array = [];
        Object.keys(this.FLASKS_DATA).forEach((elem) => {
            new_flasks_array.push([elem, this.FLASKS_DATA[elem].data]);
        })
        return new_flasks_array;
    }
    
    fromArray(array){
        Object.keys(this.FLASKS_DATA).forEach((elem) => {
            this.removeFlask(elem)
        })
        array.forEach(elem=>{
            let newFlask = this.addFlask(elem[1].length);
            newFlask.data = elem[1];
            newFlask.render_html()
        })
    }

    exportToLocalStorage(){
        
    }

    importFromLocalStorage(){

    }

    addRandomFlasks(){
        
        let howMany = prompt("How many random flasks [2-4] do you want?")
        if(isNaN(howMany)){
            return;
        }        
        Object.keys(this.FLASKS_DATA).forEach((elem) => {
            this.removeFlask(elem)
        })
        howMany = Math.min(howMany, 4)
        howMany = Math.max(howMany, 2)
        console.log("HOWMANY", howMany);
        let colors = ["red", "blue", "green", "yellow", "pink", "purple", "black"]
        colors = colors.slice(0, howMany)
        let allColors = [];
        colors.forEach(color=>{
            for(let i=0;i<4;i++)allColors.push(color)
        })
        
        for (let i = allColors.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = allColors[i];
            allColors[i] = allColors[j];
            allColors[j] = temp;
        }
        console.log(allColors);
        while (allColors.length) {
            let flask = this.addFlask(4)
            flask.data = allColors.slice(0, 4);
            allColors = allColors.slice(4, allColors.length);
            flask.render_html()
        }
        this.addFlask(4)
        this.addFlask(4)
    }

    setHead(text){
        document.getElementById("solution_text").innerText = text
    }

    appendSolutionButtons(){
        let solutionDiv = document.getElementById("solution");
        let nextBtn = document.createElement("button")
        nextBtn.onclick = ()=>{
            if (this.solution.length && this.solution_idx<this.solution.length) {
                let [src_flask_id, dst_flask_id] = this.solution[this.solution_idx];
                this.solution_idx += 1;
                let src_flask = this.FLASKS_DATA[src_flask_id]
                let dst_flask = this.FLASKS_DATA[dst_flask_id]
                let top_color = src_flask.get_top();
                let top_color_count = src_flask.get_top_count();
                src_flask.removeColor(top_color_count)
                dst_flask.addColor(top_color_count, top_color)
            }
        }
        nextBtn.innerText = "Next Move"
        solutionDiv.appendChild(nextBtn)
        let prevBtn = document.createElement("button")
        prevBtn.innerText = "Previous Move"
        prevBtn.onclick = () => {
            if (this.solution.length && this.solution_idx >= 0) {
                this.solution_idx -= 1;
                let [dst_flask_id, src_flask_id] = this.solution[this.solution_idx];
                let src_flask = this.FLASKS_DATA[src_flask_id]
                let dst_flask = this.FLASKS_DATA[dst_flask_id]
                let top_color = src_flask.get_top();
                let top_color_count = src_flask.get_top_count();
                src_flask.removeColor(top_color_count)
                dst_flask.addColor(top_color_count, top_color)
            }
        }
        solutionDiv.appendChild(prevBtn)
    }

    solve(){
        this.setHead("Started solving ... please wait")
        
        setTimeout(() => {
            let solution = _solve()
    
            if (solution == null) {
                this.resetSolution()
                this.setHead("INVALID OR UNSOLVABLE IN 10 MOVES")
            }
            else if (solution.length== 0) { 
                this.resetSolution()
                this.setHead("ALREADY IN SOLVED STATE")
            }else {
                let opt = "";
                solution.forEach(elem=>{
                    opt += `Flask {${elem[0]}} to Flask {${elem[1]}}, `
                })
                this.setHead(opt)
                this.appendSolutionButtons()
                this.solution = solution;
            }
        }, 2000);

    }

    resetSolution(){
        this.solution = []
        this.solution_idx = 0
    }

}

class Flask {

    constructor(FLASK_ID, height, state) {
        this.height = height;
        this.state = state
        this.data = [];
        this.FLASK_ID = FLASK_ID;
        FLASK_ID += 1;
        for (let i = 0; i < this.height; i++) {
            this.data.push("#ffffff");
        }
    }

    remove () {
        let main_div = document.getElementById(`flask_${this.FLASK_ID}`);
        main_div.textContent = "";
        main_div.outerHTML = "";
    }

    render_html() {
        let app = document.getElementById("app");

        let main_div = document.getElementById(`flask_${this.FLASK_ID}`);
        // If flask_div not found, create it
        if (!main_div) {
            main_div = document.createElement("div");
            main_div.id = `flask_${this.FLASK_ID}`;
            main_div.style.display = "inline-block";
            main_div.style.paddingLeft = "100px"
            
            app.appendChild(main_div)
        }
        else {
            main_div.textContent = "";
        }

        let head = document.createElement("h3")
        head.innerText = this.FLASK_ID
        main_div.appendChild(head)

        for (let i = 0; i < this.height; i++) {
            let square = document.createElement("div");
            square.id = `square_${this.FLASK_ID}_${i}`;
            square.classList.add("square");
            square.style.backgroundColor = this.data[i];
            let color_input = document.createElement("input");
            color_input.type = "color";
            color_input.id = `square_${this.FLASK_ID}_${i}_input`;
            color_input.setAttribute("data-flask_id", this.FLASK_ID);
            color_input.setAttribute("data-square_id", i);
            color_input.hidden = true;
            color_input.value = this.data[i];
            color_input.onchange = (event) => {
                // console.log(this)
                let target = event.target;
                let color = target.value;
                let flask_id = target.getAttribute("data-flask_id");
                let square_id = target.getAttribute("data-square_id");
                let square = document.getElementById(`square_${flask_id}_${square_id}`);
                this.data[i] = color;
                square.style.backgroundColor = color;
                this.render_html();
            }
            square.onclick = () => {
                document.getElementById(color_input.id).click()
            };
            main_div.appendChild(square)
            square.appendChild(color_input)
            if (i == this.height - 1) {
                square.classList.add("rounded");
            }
        }
        let closeBtn = document.createElement("button")
        closeBtn.innerText = "X"
        closeBtn.onclick = (evt)=>{
            this.state.removeFlask(this.FLASK_ID)
        }
        main_div.appendChild(closeBtn)
    }

    is_valid() {
        let valid = true;
        let white_found = false;
        for (let i = this.height - 1; i >= 0; i--) {
            let item = this.data[i];
            if (white_found) {
                if (item != "#ffffff") {
                    valid = false;
                }
            } else {
                white_found = (item == "#ffffff");
            }
        }
        return valid;
    }

    remaining_size() {
        // if (this.is_valid()) {
            let count = 0;
            for (let i = this.height - 1; i >= 0; i--) {
                let item = this.data[i];
                if (item == "#ffffff") {
                    count += 1;
                }
            }
            return count;
        // }
        return 0;
    }

    get_top() {
        for (let idx = 0; idx < this.height; idx++) {
            if (this.data[idx] != "#ffffff") {
                return this.data[idx];
            }
        }
        return null;
    }

    get_top_count(){
        let top_color = this.get_top();
        let count = 0;
        for (let idx = 0; idx < this.height; idx++) {
            if (this.data[idx] == top_color) {
                count += 1
            }else if (this.data[idx]=="#ffffff"){
                continue
            }
            else {
                break
            }
        }
        return count;
    }

    fill(color, size) {
        let remaining = this.remaining_size();
        if (size > remaining) {
            return;
        }
        let top = this.get_top();
        // console.log("top", top);
        if (top == null || top == color) {
            
            let start_idx = remaining - size;
            for (let idx = start_idx; idx < remaining; idx++) {
                this.data[idx] = color;
            }
            this.render_html()
        }
    }
    
    addColor(size, color) {
        let remaining = this.remaining_size();
        let start_idx = remaining - size;
        for (let idx = start_idx; idx < remaining; idx++) {
            this.data[idx] = color;
        }
        this.render_html()
    }

    removeColor(size) {
        let start_idx = this.remaining_size();
        for (let idx = 0; idx < size ; idx++) {
            this.data[start_idx + idx] = "#ffffff";
        }
        this.render_html()
    }

    clone() {
        let new_flask = new Flask(0)
        FLASK_ID -= 1;
        new_flask.data = this.data.slice()
        return new_flask;
    }
}