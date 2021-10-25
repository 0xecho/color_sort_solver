function _solve() {
    let count = 0;

    let max_depth = 10;

    let initial_state = main_state.asArray();
    FLASK_ID = initial_state.length;
    
    let possibles = [
        [[], initial_state, 0],
    ];
    console.log(JSON.stringify(initial_state))

    let biggestDEPTH = 0;

    while (possibles.length) {
        let [moves, current_state, depth] = possibles.shift();
        if (is_solved(current_state)) {
            console.log("SOLVED WITH", JSON.stringify(moves));
            return moves
        }
        if (depth > max_depth) {
            continue;
        }
        if(depth > biggestDEPTH){
            biggestDEPTH = depth;
            console.log(biggestDEPTH);
        }

        for (let fidx = 0; fidx < current_state.length; fidx++) {
            let [flask_id, data] = current_state[fidx];
            let top_color = null;
            let top_count = 0;
            for (let idx = 0; idx < data.length; idx++) {
                let color = data[idx]
                if (color == "#ffffff") continue;
                if (top_color == null) {
                    top_color = color;
                    top_count += 1;
                } else {
                    if (top_color == color) {
                        top_count += 1;
                    } else {
                        break;
                    }
                }
            }
            for (let ofidx = 0; ofidx < current_state.length; ofidx++) {
                if (ofidx == fidx) continue;
                let [target_flask_id, target_data] = current_state[ofidx];
                let target_top_color = null;
                for (let idx = 0; idx < target_data.length; idx++) {
                    let color = target_data[idx];
                    if (color == "#ffffff") continue;
                    target_top_color = color; break;
                }
                let remaining = remaining_size(target_data);
                // console.log(data);
                // console.log(target_data);
                // console.log(top_color, target_top_color);
                // console.log();
                if (((top_color == target_top_color) || (target_top_color == null)) && top_count <= remaining) {
                    // CREATE NEW POSSIBLE STATE
                    let new_move = [flask_id, target_flask_id];
                    let new_state = [];
                    // console.log(new_move);
                    for (let i = 0; i < FLASK_ID; i++) { //loop 
                        if (i == ofidx) {
                            let current_flask_state = [i];
                            // console.log("FILLED", target_data, top_color, top_count, remaining)
                            current_flask_state.push(fill(target_data.slice(), top_color, top_count, remaining));
                            // console.log("AFTER", current_flask_state);
                            new_state.push(
                                current_flask_state
                            );
                        } else if (i == fidx) {
                            let current_flask_state = [i];
                            // console.log("UNFILLED", data, top_count)
                            current_flask_state.push(unfill(data.slice(), top_count));
                            // console.log("AFTER", current_flask_state);
                            new_state.push(
                                current_flask_state
                            );
                        } else {
                            new_state.push(
                                [i, current_state[i][1].slice()]
                            );
                        }
                    }
                    count ++;
                    if(count%100==0)console.log('.');
                    let new_moves = moves.slice();
                    new_moves.push(new_move);
                    possibles.push([new_moves, new_state, depth + 1]);
                    // console.log("NEWS", JSON.stringify([new_moves, new_state, depth+1]));
                }
            }
        }
    }
    return null;
}

function is_valid(data) {
    let valid = true;
    let white_found = false;
    for (let i = data.length - 1; i >= 0; i--) {
        let item = data[i];
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

function remaining_size(data) {
    if (is_valid(data)) {
        let count = 0;
        for (let i = data.length - 1; i >= 0; i--) {
            let item = data[i];
            if (item == "#ffffff") {
                count += 1;
            }
        }
        return count;
    }
    return 0;
}

function fill(data, color, size, remaining) {
    let start_idx = remaining - size;
    // console.log("start_idx", start_idx);
    for (let idx = start_idx; idx < remaining; idx++) {
        data[idx] = color;
    }
    return data;
}

function unfill(data, size) {
    let remaining = size;
    for (let idx = 0; idx < data.length; idx++) {
        if (data[idx] != "#ffffff") {
            remaining -= 1;
        }
        if (remaining >= 0) data[idx] = "#ffffff";

    }
    return data;
}

function get_copy(state) {
    let new_state = [];
    for (let i = 0; i < state.length; i++) {
        new_state.push(state[i].slice());
    }
    return new_state;
}

function is_solved(data) {
    for (let idx = 0; idx < data.length; idx++) {
        let [flask_id, flask_data] = data[idx];
        // console.log("D2",data[idx]);
        // console.log("D",flask_data);
        let flask_color = null;
        for (let ridx = 0; ridx < flask_data.length; ridx++) {
            if (flask_data[ridx] == "#ffffff") continue;
            if (flask_color == null) {
                flask_color = flask_data[ridx];
                continue
            }
            else if (flask_color == flask_data[ridx]) continue;
            return false
        }
    }
    return true;
}