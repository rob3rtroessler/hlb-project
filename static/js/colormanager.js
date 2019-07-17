
/* * * * * * * * * * * * * * * * * *
*                                  *
*         COLOR MANAGER            *
*                                  *
* * * * * * * * * * * * * * * * *  */



/* * * * * * * * * * * * * * * * * *
*         INITIALIZATION           *
* * * * * * * * * * * * * * * * *  */

// global, temporary color variable that is being used when assigning color to a word but NOT LOCKING IT.
let color ='';
let colorForUnselected = '#999999';
let colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'];
let selectedClasses = ['','','','','','','',''];



/* * * * * * * * * * * * * * * * * *
*        HELPER FUNCTIONS          *
* * * * * * * * * * * * * * * * *  */


// declare a lookup function that assigns color to a class
function ColorToClass(className) {

    // check if word is locked
    if (selectedClasses.includes(className)){
        console.log(className, "is currently locked -> no transitions need to be applied");
    }
    else {
        // if word is not locked find first color that is not used
        for (let i = 0; i < selectedClasses.length; ++i) {

            // as soon as we reached an unused slot
            if (selectedClasses[i] === ''){

                // assign color
                color = colors[i];

                // to according line
                $("." + className + '_line')
                    .css("stroke", color)
                    .css("stroke-width", "3px")
                    .css("background", color);

                // and to according bar
                $("." + className + '_bar')
                    .css("fill", color)
                    .css("background", color);

                // and to according circle
                $("." + className + '_circle')
                    .css("fill", color)
                    .css("background", color);

                // and transition
                enlargeSelectedCircle(className);

                break;
            }
        }
    }
}


// declare function that removes color from a class
function RemoveColorFromClass (className){

    if (selectedClasses.includes(className)){
        // console.log("word is still locked, won't remove the color", className);
    }
    else {
        // remove color from bars
        $("." + className + '_bar')
            .css("fill", colorForUnselected)
            .css("background", 'transparent');

        // remove color from lines
        $("." + className + '_line')
            .css("stroke", colorForUnselected)
            .css("stroke-width", "0.2px")
            .css("background", 'transparent');

        // remove color from circles
        $("." + className + '_circle')
            .css("fill", colorForUnselected)
            .css("background", 'transparent');

        // and transition back
        reduceSelectedCircle(className);
    }
}

// declare function that locks a color to a word
function lockColor (className){

    // console.log('locking color to', className);

    // check if word is locked, if so -> unlock
    if (selectedClasses.includes(className)){

        // find position of word in lockedWords and unlock the word & color
        for (let i = 0; i < selectedClasses.length; ++i) {
            if (selectedClasses[i]=== className){

                // unlock word -> reset word position in array
                selectedClasses[i] = '';

                // unlock color -> assign base color to class
                $("." + className + "_bar").css("fill", colorForUnselected);
                $("." + className + "_line").css("stroke", colorForUnselected);
                break;
            }
        }
    }

    // if not locked yet, lock word and assign color
    else {
        for (let i = 0; i < selectedClasses.length; ++i) {
            if (selectedClasses[i]===''){

                // assign color to class and lock the word
                ColorToClass(className);
                selectedClasses[i] = className;
                break;
            }
        }
    }
}


function lookUpColor (word){
    for (let i = 0; i < selectedClasses.length; ++i) {
        if (selectedClasses[i]=== word){
            return colors[i]
        }
    }
}
