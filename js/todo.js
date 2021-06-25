// Select the Elements
const clear = document.querySelector(".clear");
const sort=document.getElementById("sortIcon")
const date = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input-text");
const plus = document.getElementById("plus");
var time=document.getElementById("text-date")
var priority=document.getElementById("priority")

//select function
var $ = function(sel) {
    return document.querySelector(sel);
  };
var $All = function(sel) {
    return document.querySelectorAll(sel);
  };

// Classes names
const UP="sort-up";
const DOWN="sort-down";
const CL_EDITING = 'editing';
const CHECK = "checked";
const UNCHECK = "uncheck";
const LINE_THROUGH = "lineThrough";
const CL_SELECTED = 'selected';


// Variables
let LIST, id;

// get item from localstorage
let data = localStorage.getItem("TODO");

// check if data is not empty
if(data){
    LIST = JSON.parse(data);
    id = LIST.length; // set the id to the last one in the list
    loadList(LIST); // load the list to the user interface
}else{
    // if data isn't empty
    LIST = [];
    id = 0;
}

// load items to the user's interface
function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash, item.color);
    });
}

// clear the local storage
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
});

//click plus to add
plus.addEventListener("click", function(){
    const toDo = input.value;
    var pri = priority.options[priority.selectedIndex].value;
        // if the input isn't empty
        if(toDo){
            addToDo(toDo, id, false, false);
            
            LIST.push({
                name : toDo,
                id : id,
                done : false,
                trash : false,
                color:pri
            });
            
            // add item to localstorage 
            localStorage.setItem("TODO", JSON.stringify(LIST));
            
            id++;
        }
        input.value = "";
});

//Initialize filter
var filters = $All('.filters li a');
    for (var i = 0; i < filters.length; ++i) {
      (function(filter) {
        filter.addEventListener('click', function() {
          for (var j = 0; j < filters.length; ++j) {
            filters[j].classList.remove(CL_SELECTED);
          }
          filter.classList.add(CL_SELECTED);
          update();
        });
      })(filters[i])
    }
    

    function update() {
        var items=$All(".content li")
        var filter = $('.filters li a.selected').innerHTML;
        var leftNum = 0;
        var item, i, display;
      
        for (i = 0; i < items.length; ++i) {
          item = items[i];
          if (!item.firstElementChild.classList.contains(CHECK)) leftNum++;
      
          // filters
          display = 'none';
          if (filter == 'All' 
              || (filter == 'Active' && !item.firstElementChild.classList.contains(CHECK)) 
              || (filter == 'Completed' && item.firstElementChild.classList.contains(CHECK))
             ) {
            display = 'block';
          }
          item.style.display = display;
        }

      
        var completedNum = items.length - leftNum;
        var count = $('.todo-count');
        count.innerHTML = (leftNum || 'No') + (leftNum > 1 ? ' items' : ' item') + ' left';
      }


      function completeAll(){
        var items=$All(".content li");
        if(items.length>0){
            for (i = 0; i < items.length; ++i) {
                item = items[i];
                if (!item.firstElementChild.classList.contains(CHECK)) {
                    item.firstElementChild.classList.toggle(CHECK);
                    item.firstElementChild.classList.toggle(UNCHECK);
                    item.querySelector(".text").classList.toggle(LINE_THROUGH);
                }
            }    
            update();
        }

    }

    function resetAll(){
        var items=$All(".content li");
        if(items.length>0){
            for (i = 0; i < items.length; ++i) {
                item = items[i];
                if (item.firstElementChild.classList.contains(CHECK)) {
                    item.firstElementChild.classList.toggle(CHECK);
                    item.firstElementChild.classList.toggle(UNCHECK);
                    item.querySelector(".text").classList.toggle(LINE_THROUGH);
                }
            }    
            update();
        }
    }

    function removeAll(){
        var items=$All(".content li");
        if(items.length>0){
            for (i = 0; i < items.length; ++i) {
                item = items[i].firstElementChild;
                removeToDo(item);
            }    
        }
    }
// Show todays date
const options = {weekday : "long", month:"short", day:"numeric"};
const today = new Date();
date.innerHTML = today.toLocaleDateString("en-US", options);

//add default date
// var now = new Date(); 
// var day = ("0" + now.getDate()).slice(-2); 
// var month = ("0" + (now.getMonth() + 1)).slice(-2); 
// var getToday= now.getFullYear()+"-"+(month)+"-"+(day) ; 
// time.value=(getToday);


function addToDo(toDo, id, done, trash,color="0"){
    if(trash){ return; }
    
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";
    var pri = priority.options[priority.selectedIndex].value;
    if(color!="0"){
        pri=color;
    }
    var item = `<li class="item ${pri}">
                    <div class="${DONE}" job="complete" id="${id}"></div>
                    <div class="text ${LINE}" >${toDo}</div>
                    <div class="de" job="delete" id="${id}"></div>
                  </li>
                `;           
    const position = "beforeend";
    list.insertAdjacentHTML(position, item);
    update();
    addedit();
}
// 移动端双击事件
var clickid = 1;
var timer = null;

$('div').click(function() {
    if(clickid == 1) {
        startTime = new Date().getTime();
        clickid++;
        timer = setTimeout(function () {
            a(); // 单击事件触发
            clickid = 1;
        }, 300)
    }

    if(clickid == 2) {
        clickid ++ ;
    } else {
        var endTime = new Date().getTime();
        if ((endTime - startTime) < 300) {
            b(); // 双击事件
            clickid = 1;
            clearTimeout(timer);
        }
    }
})
//add edit module
function addedit(){
    var items=$All(".content li")
    var l=items.length;
    item=items[l-1];
    console.log(item)
    var label = item.querySelector('.text');
    console.log(label)
    label.addEventListener('click', function(event) {
        if(clickid == 1) {
            startTime = new Date().getTime();
            clickid++;
            timer = setTimeout(function () {
                clickid = 1;
            }, 300)
        }
        if(clickid == 2) {
            clickid ++ ;
        } else {
            var endTime = new Date().getTime();
            if ((endTime - startTime) < 300) {
                edit(event); // 双击事件
                clickid = 1;
                clearTimeout(timer);
            }
        }
    })

    function edit(event) {
      const element=event.target;
      tar=element.parentNode;
      element.parentNode.classList.add(CL_EDITING);
      var edit = document.createElement('input');
      var finished = false;
      edit.setAttribute('type', 'text');
      edit.setAttribute('class', 'edit');
      edit.setAttribute('value', label.innerHTML);
      var one=tar.children[0];
      var two=tar.children[1];
      var three=tar.children[2];
      one.style.display="none";
      two.style.display="none";
      three.style.display="none";

      function finish() {
        if (finished) return;
        finished = true;
        console.log("finish");
        tar.removeChild(edit);
        tar.classList.remove(CL_EDITING);
        one.style.display="block";
        two.style.display="block";
        three.style.display="block";
      }
  
      edit.addEventListener('blur', function() {
        finish();
      });
  
      edit.addEventListener('keyup', function(ev) {
        if (ev.keyCode == 27) { // Esc
          finish();
        } else if (ev.keyCode == 13) {
          label.innerHTML = this.value;
          finish();
        }
      });
  
      tar.appendChild(edit);
      edit.focus();
    }
    
}

sort.addEventListener("click",function(){
    if(sort.classList[0]=="sort-down")
    {
        upsort();
    }
    else downsort();
    sort.classList.toggle(UP);
    sort.classList.toggle(DOWN);
});
//sort by piority
function downsort(){

    var lis=list.getElementsByTagName("li");
    var newlist=[];
    var Len=lis.length;
    for(var i=0;i<Len;i++){
        newlist[i]=lis[i];
    }
    //turn letter into number to compete
    newlist.sort(function (li1,li2){
        var n1=li1.classList[1].charCodeAt(0);
        var n2=li2.classList[1].charCodeAt(0);
        return n1-n2; 
    })
    for(var j=0;j<Len;j++){
       list.appendChild(newlist[j]); 
    }
}
function upsort(){

    var lis=list.getElementsByTagName("li");
    var newlist=[];
    var Len=lis.length;
    for(var i=0;i<Len;i++){
        newlist[i]=lis[i];
    }
    //turn letter into number to compete
    newlist.sort(function (li1,li2){
        var n1=li1.classList[1].charCodeAt(0);
        var n2=li2.classList[1].charCodeAt(0);
        return n2-n1; 
    })
    for(var j=0;j<Len;j++){
       list.appendChild(newlist[j]); 
    }
}


// add an item to the list user the enter key
document.addEventListener("keyup",function(even){
    if(event.keyCode == 13){
        const toDo = input.value;
        
        // if the input isn't empty
        if(toDo){
            addToDo(toDo, id, false, false);
            
            LIST.push({
                name : toDo,
                id : id,
                done : false,
                trash : false
            });
            
            // add item to localstorage ( this code must be added where the LIST array is updated)
            localStorage.setItem("TODO", JSON.stringify(LIST));
            
            id++;
        }
        input.value = "";
    }
});


// complete to do
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    update();
    LIST[element.id].done = LIST[element.id].done ? false : true;

}

// remove to do
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    update();
    LIST[element.id].trash = true;
}


list.addEventListener("click", function(event){
    const element = event.target; // return the clicked element inside list
    
    if(element.classList.contains(CHECK)||element.classList.contains(UNCHECK)||element.classList.contains('de'))
    {
        const elementJob = element.attributes.job.value; // complete or delete
        if(elementJob == "complete"){
            completeToDo(element);
        }else if(elementJob == "delete"){
            removeToDo(element);
        }
    }
    // add item to localstorage ( this code must be added where the LIST array is updated)
    localStorage.setItem("TODO", JSON.stringify(LIST));
});

function selectcolor(selector){
    var pri = selector.options[selector.selectedIndex].value;
    //console.log(selector.style)
    if(pri=="A"){
        selector.style.color="rgb(255,19,73)";
    }
    else if(pri=="B"){
        selector.style.color="rgb(255, 129, 73)";
    }
    else if(pri=="C"){
        selector.style.color="rgb(255, 213, 73)";
    }
    else {
        selector.style.color="rgb(17,227,170)";
    }
}
















