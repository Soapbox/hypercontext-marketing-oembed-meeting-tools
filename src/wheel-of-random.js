import './wheel-of-random.css';

import { createClient } from "@liveblocks/client";

// Create a liveblocks client 
const client = createClient({
    publicApiKey: "pk_live_FdgtaGsHdpopKSR8i8ccvgSr"
});

const queryParams = new URLSearchParams(window.location.search);
const roomId = queryParams.get('sync-token');
const colors = ['hsla(  0, 100%, 50%, 1)', 'hsla( 40, 100%, 50%, 1)', 'hsla( 80, 100%, 50%, 1)', 'hsla(120, 100%, 50%, 1)', 'hsla(160, 100%, 50%, 1)', 'hsla(200, 100%, 50%, 1)', 'hsla(240, 100%, 50%, 1)', 'hsla(280, 100%, 50%, 1)', 'hsla(320, 100%, 50%, 1)', ];

function randomNumber(size){
    return Math.floor(Math.random() * size);
}

function randomColor(){
    return colors[randomNumber(colors.length)];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function trapezoid(x,a,b,c,d) {

    return Math.max(
        Math.min(
            (x-a)/(b-a),
            1,
            (d-x)/(d-c)
        )
        ,
        0
    )
}


let spinningTimer = null;
let spinningAudioInterval = null

let view = {
    attributes: {
        'sync-token': queryParams.get('sync-token') || null,
        'question-heading-title': queryParams.get('question') || "Who should go first?",
        'spin-button-title': queryParams.get('spin-button-title') || "Spin",
        'serialized-options': queryParams.get('options') || null,
    },
    models: {
        carousel: null,
        cells: [],
        options: [],
        tickSound: new Audio('Tick-DeepFrozenApps-397275646.mp3'),
    },
    actions: {
        init: function(){

            view.models.carousel = document.querySelector('.carousel');
            view.attributes.selectedIndex = 0;
            view.attributes.isHorizontal = false;
            view.attributes.rotateFn = view.attributes.isHorizontal ? 'rotateY' : 'rotateX';
            view.attributes.radius = null;
            view.attributes.theta = null;
            view.attributes.cameraDistance = 1;
            view.attributes.isSpinning = false;
            view.attributes.rotationsPerSpin = 3;
            view.attributes.durationPerSpin = 7000; //ms

            if(view.attributes['serialized-options'] !== null && view.attributes['serialized-options'].length > 10){
                view.models.options = JSON.parse(view.attributes['serialized-options']);
            } else if(localStorage.getItem('options')){
                view.models.options = JSON.parse(localStorage.getItem('options'));
            }

            
            var prevButton = document.querySelector('.previous-button');
            prevButton.addEventListener( 'click', function() {
                view.attributes.selectedIndex--;
                view.actions.rotateCarousel(true, 300);
            });
            
            var nextButton = document.querySelector('.next-button');
            nextButton.addEventListener( 'click', function() {
                view.attributes.selectedIndex++;
                view.actions.rotateCarousel(true, 300);
            });

            var spinButton = document.querySelector('.spin-button');
            spinButton.addEventListener( 'click', function() {
                view.actions.spin();
            });

            var debounce = null;
            window.addEventListener('resize', function(){
                clearTimeout(debounce);
                debounce = setTimeout(function(){
                    view.actions.redrawCarousel();
                }, 150)
            });


            view.actions.setTitle(view.attributes['question-heading-title']);
            document.querySelector('.spin-button-title span').innerText = view.attributes['spin-button-title'];

            var updateOptionsButton = document.querySelector('.update-options');
            var optionsTextarea = document.querySelector('.options-textarea');
            if(view.models.options.length){
                var textareaContent = view.models.options.map(function(option){
                    return option.stringCode;
                }).join('\n');
                optionsTextarea.innerHTML=textareaContent;
            }
            updateOptionsButton.addEventListener('click', function(){

                view.actions.setTitle(document.querySelector('.question-input-title').value);

                var options = [];
                optionsTextarea.value.split('\n').forEach(function(value){
                    if(value.length){
                        var label = value;
                        var textColor = 'white';
                        var bgColor = randomColor();
                        var bgImg = '';
                        var background = bgColor;
                        var className = '';
                        var opts = value.split("|");
                        

                        if(opts.length == 3){
                            label = opts[0];
                            bgColor = opts[1];
                            bgImg = opts[2];
                            background = `${opts[1]} center / contain no-repeat url("${opts[2]}")`;
                            className = 'with-text-and-image';

                        } else if(opts.length == 2){
                            label = opts[0];
                            bgColor = opts[1];
                            background = bgColor;

                        } else if(value.match(/^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)($|\?.*$)/)){
                            label = '';
                            background = `center / cover repeat url("${value}")`;
                        }

                        options.push({
                            label: label,
                            text: textColor,
                            background: background,
                            className: className,
                            visible: true,
                            stringCode: `${value}`
                        });
                    }
                });

                view.models.options = options;
                localStorage.setItem('options', JSON.stringify(view.models.options));
                
                view.actions.reloadOptions();
                view.actions.redrawCarousel();

                var qp = new URLSearchParams;
                qp.append('question', view.attributes['question-heading-title']);
                qp.append('options', JSON.stringify(view.models.options));

                console.log(qp.toString());

                history.pushState({attributes: view.attributes, options: view.models.options}, '', 
                    [
                        document.location.origin,
                        document.location.pathname,
                        '?',
                        qp.toString()
                    ].join('')
                );
            });

            
            // set initials
            view.actions.reloadOptions();
            view.actions.redrawCarousel();
        },
        spin: function(){
            var winner = randomNumber(view.attributes.cellCount);
            var incrementBy = view.attributes.rotationsPerSpin * view.attributes.cellCount + winner;

            view.attributes.selectedIndex = view.attributes.selectedIndex + incrementBy;

            console.log(`${view.actions.currentWinner().label} will win`);

            view.actions.rotateCarousel(true, view.attributes.durationPerSpin);
        },
        currentWinner: function(){
            return view.models.options[view.attributes.selectedIndex % 360 % view.attributes.cellCount];
        },
        setTitle: function(title){
            view.attributes['question-heading-title'] = title;
            document.querySelector('.question-heading-title').innerText = view.attributes['question-heading-title'];
            document.querySelector('.question-input-title').value = view.attributes['question-heading-title'];
        },
        redrawCarousel: function(){
            view.attributes.cellWidth = view.models.carousel.offsetWidth;
            view.attributes.cellHeight = view.models.carousel.offsetHeight;
            view.actions.changeCarousel(false);
        },
        rotateCarousel: function(spin = true, spinDuration) {
            
            spinDuration = spinDuration || view.attributes.durationPerSpin;

            if(spin){
                view.models.carousel.classList.add('--spinning');
                view.attributes.isSpinning = true;

                view.models.tickSound.loop = true;
                view.models.tickSound.playbackRate = 0.25;
                view.models.tickSound.play();
            } else {
                spinDuration = 0;
            }

            var angle = view.attributes.theta * view.attributes.selectedIndex * -1;
            view.models.carousel.style.transform = 'translateZ(' + -(view.attributes.radius + view.attributes.cameraDistance) + 'px) ' + view.attributes.rotateFn + '(' + angle + 'deg)';
            view.models.carousel.style.transitionDuration = `${spinDuration}ms`;

            if(spin){
                clearTimeout(spinningTimer);
                spinningTimer = setTimeout(function(){
                    view.models.carousel.classList.remove('--spinning');
                    view.attributes.isSpinning = false;
                    view.models.tickSound.loop = false;
                }, spinDuration);

                var tickSteps = 0;
                var tickStepsNeeded = (spinDuration-100)/100
                
                clearInterval(spinningAudioInterval);
                spinningAudioInterval = setInterval(function(){
                    if(view.attributes.isSpinning) {
                        
                        

                        var percentComplete = (tickSteps / tickStepsNeeded) * 100
                        view.models.tickSound.playbackRate = Math.max(0.15,trapezoid(percentComplete, 0,10,50,100)*1.5);
                        if(view.models.tickSound.playbackRate < 0.25){
                            view.models.tickSound.loop = false;
                        } else {
                            view.models.tickSound.loop = true;
                        }

                        view.models.tickSound.volume = 0.5 + trapezoid(percentComplete, 0,10,50,100) * 0.5;

                        view.models.tickSound.play();


                        tickSteps++;
                    } else{
                        clearInterval(spinningAudioInterval);
                    }
                }, 100);
            }

        },
        changeCarousel: function(spin = true, spinDuration) {

            view.attributes.theta = 360 / view.attributes.cellCount;

            var cellSize = view.attributes.isHorizontal ? view.attributes.cellWidth : view.attributes.cellHeight;

            view.attributes.radius = Math.round( ( cellSize / 2) / Math.tan( Math.PI / view.attributes.cellCount ) );

            for ( var i=0; i < view.attributes.cellCount; i++ ) {
              var cell = view.models.cells[i];
              var option = view.models.options.at(i);
              if ( i < view.attributes.cellCount) {
                // visible cell
                var cellAngle = view.attributes.theta * i;
                cell.style.opacity = 1;
                cell.style.transform = view.attributes.rotateFn + '(' + cellAngle + 'deg) translateZ(' + (view.attributes.radius || 1) + 'px)';
                cell.style.transitionDuration = '0ms'
                if(option.className.length){
                    cell.classList.add(option.className);
                }
              } else {
                // hidden cell
                cell.style.opacity = 0;
                cell.style.transform = 'none';
              }
            }
          
            view.actions.rotateCarousel(spin, spinDuration);
        },
        shuffleOptions: function(){
            shuffleArray(view.models.options);
            view.actions.reloadOptions();
            view.actions.redrawCarousel();
        },
        reloadOptions: function(){
            var optionsArr = []
            view.models.options.forEach(function(option, index){
                if(option.visible){
                    var optionEl = document.createElement('div');
                    optionEl.className = 'carousel__cell group relative';
                    optionEl.innerHTML = `<div>
                        <div class="label">${option.label}</div>
                        <div class="option-hide-button hidden group-hover:block absolute cursor-pointer right-1 top-1 p-1 xs:px-2 xs:py-1 rounded-md transition-all border border-transparent hover:text-black hover:border-gray-400 hover:bg-gray-100 active:bg-gray-300 ">Hide Option</div>
                    </div>`;
                    optionEl.style.background = option.background;
                    optionEl.style.color = option.text;
                    optionEl.style.transitionDuration = '1000ms';

                    optionEl.querySelector('.option-hide-button').addEventListener('click', function(){
                        optionEl.style.opacity = 0.5;
                        setTimeout(function(){
                            var currentlySelectedJSONString = JSON.stringify(view.actions.currentWinner());
                            var currentlySelectedIndex = view.models.options.findIndex(function(value){
                                return JSON.stringify(value) == currentlySelectedJSONString
                            });


                            optionEl.remove();
                            view.models.options.splice(index, 1)

                            if(currentlySelectedIndex > index){
                                view.attributes.selectedIndex = currentlySelectedIndex - 1;
                            } else {
                                view.attributes.selectedIndex = currentlySelectedIndex;
                            }

                            //view.actions.reloadOptions();
                            view.actions.reloadOptions();
                            view.actions.redrawCarousel(true);

                        }, 500);
                    })

                    optionsArr.push(optionEl);
                }
            });

            view.models.carousel.innerHTML = '';
            view.models.carousel.append(...optionsArr);

            view.models.cells = view.models.carousel.querySelectorAll('.carousel__cell');
            view.attributes.cellCount = view.models.cells.length;

            view.attributes.cameraDistance = 1 * view.attributes.cellCount;

            document.querySelector('.stage').style.height = `${(2-Math.min(1.4, Math.max( view.attributes.cellCount/16, 0))) * 30}vh`
            view.attributes.cellWidth = view.models.carousel.offsetWidth;
            view.attributes.cellHeight = view.models.carousel.offsetHeight;
        }
    }
};

window.view = view;

document.addEventListener("DOMContentLoaded", function(){

    view.actions.init();
    

});


export default view;