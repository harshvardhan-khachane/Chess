function insertImages(){
    document.querySelectorAll('.box').forEach(image => {
        if(image.innerText.length !== 0){
            if(image.innerText == 'Wpawn' || image.innerText == 'Bpawn'){
                image.innerHTML = `${image.innerText} <img class='all-img all-pawn' src="${image.innerText}.png" alt="">`
                image.style.cursor = 'pointer'
            } else {
                image.innerHTML = `${image.innerText} <img class='all-img all-pawn' src="${image.innerText}.png" alt="">`
                image.style.cursor = 'pointer'
            }
        }
    }); 
}
insertImages();

function coloring(){
    const color = document.querySelectorAll('.box');

    color.forEach(color => {
        getId=color.id;
        arr = Array.from(getId);
        arr.shift();
        aside = eval(arr.pop());
        aup = eval(arr.shift());
        a = aside + aup;

        if(a%2==0){
            color.style.background = 'rgb(232 235 239)';
        }
        if(a%2 !== 0){
            color.style.background = 'rgb(125 135 150)'
        }
    })
}
coloring();
