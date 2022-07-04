const queryParams = new URLSearchParams(window.location.search);

let view = {
    attributes: {
        'autoplay': false,
        'sync-token': queryParams.get('sync-token') || null
    },
    models: {
        alarmSound: new Audio('Fire_pager-jason-1283464858.mp3'),
        tickSound: new Audio('Tick-DeepFrozenApps-397275646.mp3'),
        interval: null,
    },
    actions: {
        init: function(){
            view.actions.reset();
            if(view.attributes.autoplay){
                view.actions.resume(false);
            }
        },
        importState: function(state){
            var state = JSON.parse(decodeURI(state));
            state.autoplay = state.isPlaying;

            view.actions.setRawState(state);

        },
        exportState: function(){

            if(view.attributes['sync-token'] == null){
                delete view.attributes['sync-token'];
            }

            return encodeURI(JSON.stringify(view.actions.getRawState()));
        },
        getRawState: function(){
            return view.attributes;
        },
        setRawState: function(state){
            view.actions.pause(false);

            view.attributes = state;

            if(state.isPlaying){
                view.actions.resume(false);
            } else {
                view.actions.tick();
            }
        },
        getStateShareUrl: function(){
            
            var qp = new URLSearchParams();

            qp.append('autoplay', view.attributes.isPlaying);
            qp.append('time-elapsed-percent', view.attributes.timeElapsedPercent);

            qp = view.actions.addThemeToUrl(qp);

            if(view.attributes['sync-token']){
                qp.append('sync-token', view.attributes['sync-token'])
            }

            if(view.attributes.isPlaying){
                qp.append('target-time', view.attributes.targetTime);

                return [
                    document.location.origin,
                    document.location.pathname,
                    '?',
                    qp.toString()
                ].join('');
            } else {

                qp.append('days', view.attributes.days)
                qp.append('hours', view.attributes.hours)
                qp.append('minutes', view.attributes.minutes)
                qp.append('seconds', view.attributes.seconds)

                return [
                    document.location.origin,
                    document.location.pathname,
                    '?',
                    qp.toString()
                ].join('');
            }

        },
        addThemeToUrl: function(qp){
            qp.append('bg-color', view.attributes.bgColor);
            qp.append('text-color', view.attributes.textColor);
            qp.append('progress-color', view.attributes.progressColor);
            
            qp.append('bg-color-warning', view.attributes.bgColorWarning);
            qp.append('text-color-warning', view.attributes.textColorWarning);
            qp.append('progress-color-warning', view.attributes.progressColorWarning);

            qp.append('bg-color-alarm', view.attributes.bgColorAlarm);
            qp.append('text-color-alarm', view.attributes.textColorAlarm);
            qp.append('progress-color-alarm', view.attributes.progressColorAlarm);

            return qp;
        },
        recieveState: function(data){
            if(data['sync-token'] == view.attributes['sync-token']){
                view.action.importState(data.state)
            }
        },
        sendState: function(reason){
            if(view.attributes['sync-token']){
                document.dispatchEvent(new CustomEvent('state-change', { detail: {
                        'event': 'updated-state',
                        'reason': reason,
                        'sync-token': view.attributes['sync-token'],
                        'state': view.actions.exportState(),
                        'url': view.actions.getStateShareUrl()
                    }
                }));
            }
        },
        playOrPause: function(){
            if(view.models.interval ){
                view.actions.pause();
            } else {
                view.actions.resume();
            }
        },
        pause: function(sendState = true){
            view.attributes.isPlaying = false;
            view.attributes.isPaused = true;

            view.models.interval = clearInterval(view.models.interval);
            if(view.attributes.targetTime !== null){
                view.actions.tick();
            }
            view.attributes.targetTime = null;

            if(sendState){
                view.actions.sendState('paused');
            }
        },
        resume: function(sendState = true){
            if(view.attributes.targetTime == null){
                view.attributes.targetTime = view.actions.makeTargetTime();
            }

            view.attributes.isPlaying = true;
            view.attributes.isPaused = false;
            view.actions.tick();
            view.models.interval = setInterval(function(){
                view.actions.tick();
            }, view.attributes.updateInterval)

            if(sendState){
                view.actions.sendState('resumed');
            }
        },

        reloadUserEdits: function(){
            var qp = new URLSearchParams();

            qp = view.actions.addThemeToUrl(qp);

            if(view.attributes['sync-token']){
                qp.append('sync-token', view.attributes['sync-token'])
            }

            qp.append('hours', document.querySelector('input[name="hours"]').value)
            qp.append('minutes', document.querySelector('input[name="minutes"]').value)
            qp.append('seconds', document.querySelector('input[name="seconds"]').value)

            window.location =  [
                document.location.origin,
                document.location.pathname,
                '?',
                qp.toString()
            ].join('');

        },
        playAlarm: function(){
            view.models.alarmSound.play().then(_ => {}).catch(error => {});
        },
        playAudibleTick: function(){
            view.models.tickSound.play().then(_ => {}).catch(error => {});
        },
        tick: function(){
            view.attributes.now = Date.now() - 100;
            view.attributes.timeElapsed = view.attributes.timeElapsed + view.attributes.updateInterval;
            view.actions.updateTimer();
            view.actions.updateProgress();
            view.actions.updateStyles();
        },
        updateStyles: function(){
            var meta = document.querySelectorAll('.meta');
            meta.forEach(function(el){
                el.classList.toggle('opacity-50')
                el.classList.toggle('opacity-60')
            });

            if(view.attributes.isAlarm){
                document.body.style.background = view.attributes.bgColorAlarm;
                document.querySelectorAll('.progress').forEach(function(el){
                    el.style.background = view.attributes.progressColorAlarm;
                });
                document.querySelector('.timer-text').style.color = view.attributes.textColorAlarm;;
            } else if(view.attributes.isWarning){
                document.body.style.background = view.attributes.bgColorWarning;
                document.querySelectorAll('.progress').forEach(function(el){
                    el.style.background = view.attributes.progressColorWarning;
                });
                document.querySelector('.timer-text').style.color = view.attributes.textColorWarning;
            } else {
                document.body.style.background = view.attributes.bgColor;
                document.querySelectorAll('.progress').forEach(function(el){
                    el.style.background = view.attributes.progressColor;
                });
                document.querySelector('.timer-text').style.color = view.attributes.textColor;
            }
        },
        updateProgress: function(){
            var precentDone = view.attributes.timeElapsedPercent;

            var topProgressBar = Math.max(0, Math.min((precentDone-0) / 25, 1))*100;
            var rightProgressBar = Math.max(0, Math.min((precentDone-25) / 25, 1))*100;
            var bottomProgressBar = Math.max(0, Math.min((precentDone-50) / 25, 1))*100;
            var leftProgressBar = Math.max(0, Math.min((precentDone-75) / 25, 1))*100;

            

            var progressBarWidth = 1;

            if(view.attributes.timeRemaining <= 30 * 1000){
                progressBarWidth++;
            }
            if(view.attributes.timeRemaining <= 10 * 1000){
                progressBarWidth++;
            }
            if(view.attributes.timeRemaining <= 5 * 1000){
                progressBarWidth++;
            }
            if(view.attributes.timeRemaining <= 4 * 1000){
                progressBarWidth++;
            }
            if(view.attributes.timeRemaining <= 3 * 1000){
                progressBarWidth++;
            }
            if(view.attributes.timeRemaining <= 2 * 1000){
                progressBarWidth++;
            }
            if(view.attributes.timeRemaining <= 1 * 1000){
                progressBarWidth++;
            }

            document.querySelector('#top-progress-bar').classList.remove('h-1','h-2','h-3','h-4','h-5','h-6','h-7','h-8')
            document.querySelector('#top-progress-bar').classList.add('h-'+progressBarWidth);
            document.querySelector('#top-progress-bar .progress').style.width = topProgressBar+'%';

            document.querySelector('#right-progress-bar').classList.remove('w-1','w-2','w-3','w-4','w-5','w-6','w-7','w-8')
            document.querySelector('#right-progress-bar').classList.add('w-'+progressBarWidth);
            document.querySelector('#right-progress-bar .progress').style.height = rightProgressBar+'%';

            document.querySelector('#bottom-progress-bar').classList.remove('h-1','h-2','h-3','h-4','h-5','h-6','h-7','h-8')
            document.querySelector('#bottom-progress-bar').classList.add('h-'+progressBarWidth);
            document.querySelector('#bottom-progress-bar .progress').style.width = bottomProgressBar+'%';

            document.querySelector('#left-progress-bar').classList.remove('w-1','w-2','w-3','w-4','w-5','w-6','w-7','w-8')
            document.querySelector('#left-progress-bar').classList.add('w-'+progressBarWidth);
            document.querySelector('#left-progress-bar .progress').style.height = leftProgressBar+'%';
        },
        updateTimeElapsed: function(){
            if(view.attributes.timeElapsed + view.attributes.timeRemaining == 0){
                view.attributes.timeElapsed = 0;
                view.attributes.timeElapsedPercent = 0
            } else {
                var timeElapsed = view.attributes.timeElapsed;
                var timeRemaining = view.attributes.timeRemaining;

                view.attributes.timeElapsed = timeElapsed + view.attributes.updateInterval
                view.attributes.timeElapsedPercent = Math.round((view.attributes.timeElapsed / (view.attributes.timeElapsed + view.attributes.timeRemaining) ) * 1000) / 10
            }
        },
        updateTimer: function(){

            var timeRemaining = view.attributes.timeRemaining = (view.attributes.targetTime || view.actions.makeTargetTime()) - view.attributes.now;

            view.actions.updateTimeElapsed();

            var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            var hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            if (days == 0 && hours == 0 && minutes == 0 && seconds == 0){
                view.actions.playAlarm();
            } 
            if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0){
                view.attributes.isAlarm = true;
            } else {
                view.attributes.isAlarm = false;
            }

            if(seconds <= 10&& seconds > 0 && seconds !== view.attributes.seconds && minutes == 0 && hours == 0 && days == 0) {
                view.attributes.isWarning = true;
                view.actions.playAudibleTick();
            } else {
                view.attributes.isWarning = false;
            }

            view.actions.renderUnit('seconds', seconds);
            view.actions.renderUnit('minutes', minutes);
            view.actions.renderUnit('hours', hours);
            view.actions.renderUnit('days', days);

        },
        renderUnit: function(type, number) {
            var typeEl = document.querySelector('.'+type+'');
            var unitsEl = document.querySelector('.'+type+' .units');

            if(number < 0 && type != 'seconds'){
                number = number + 1;
            }

            view.attributes[type] = number;

            if(number != 0){
                typeEl.classList.remove('hidden')
            } else if(type != 'seconds'){
                typeEl.classList.add('hidden')
            }

            if(type == 'seconds' && number.toString().length == 1) {
                number = '0'+number
            }

            unitsEl.innerHTML = number;
        },
        makeTargetTime: function(){
            return Date.now() 
                    + Number(view.attributes.days) * 24 * 60 * 60 * 1000
                    + Number(view.attributes.hours) * 60 * 60 * 1000
                    + Number(view.attributes.minutes) * 60 * 1000 
                    + Number(view.attributes.seconds) * 1000;
        },
        reset: function(){
            view.attributes.now = Date.now();
            view.attributes.autoplay =  (queryParams.get('autoplay') == 'true') || false;
            view.attributes.targetTime = queryParams.get('target-time') || null;
            view.attributes.days = queryParams.get('days') || 0;
            view.attributes.hours = queryParams.get('hours') || 0;
            view.attributes.minutes = queryParams.get('minutes') || 10;
            view.attributes.seconds = queryParams.get('seconds') || 0;
            view.attributes.updateInterval = queryParams.get('update-interval') || 0;
            view.attributes.timeRemaining = queryParams.get('time-remaining') || 0;
            view.attributes.timeElapsed = queryParams.get('time-elapsed') || 0;
            view.attributes.timeElapsedPercent = queryParams.get('time-elapsed-percent') || 0;

            view.attributes.isPlaying = false;
            view.attributes.isPaused = false;
            view.attributes.isWarning = false;
            view.attributes.isAlarm = false;

            view.attributes.bgColor = queryParams.get('bg-color') || 'rgb(226, 232, 240)';
            view.attributes.textColor = queryParams.get('text-color') || 'rgb(0, 0, 0)';
            view.attributes.progressColor = queryParams.get('progress-color') || 'rgb(71, 85, 105)';
            
            view.attributes.bgColorWarning = queryParams.get('bg-color-warning') || '#fb923c';
            view.attributes.textColorWarning = queryParams.get('text-color-warning') || '#7c2d12';
            view.attributes.progressColorWarning = queryParams.get('progress-color-warning') || '#c2410c';

            view.attributes.bgColorAlarm = queryParams.get('bg-color-alarm') || '#f87171';
            view.attributes.textColorAlarm = queryParams.get('text-color-alarm') || '#7f1d1d';
            view.attributes.progressColorAlarm = queryParams.get('progress-color-alarm') || '#b91c1c';

            if(view.attributes.targetTime == null){
                view.attributes.targetTime = view.actions.makeTargetTime();
            }

            view.actions.updateTimer();
            view.actions.updateProgress();

            view.actions.pause(false);

            view.attributes.updateInterval = 500;

            document.querySelector('input[name="hours"]').value = view.attributes.hours;
            document.querySelector('input[name="minutes"]').value = view.attributes.minutes;
            document.querySelector('input[name="seconds"]').value = view.attributes.seconds;
            if(view.attributes['sync-token']){
                document.querySelector('input[name="sync-token"]').value = view.attributes['sync-token'];
            }
            
        },
    }
};

export default view;