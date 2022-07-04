import './input.css';

import { default as view } from './countdown.js';
import { createClient } from "@liveblocks/client";

window.view = view;

// Create a liveblocks client 
const client = createClient({
    publicApiKey: "pk_live_FdgtaGsHdpopKSR8i8ccvgSr"
});



document.addEventListener("DOMContentLoaded", function(){
    view.actions.init();
    const queryParams = new URLSearchParams(window.location.search);
    var roomId = queryParams.get('sync-token');

    if(roomId){

        var currentState = view.actions.getRawState();
        var localChange = false;

        const room = client.enter(roomId, {
            initialPresence: { cursor: null },
            initialStorage: { state: currentState },
        });


        room.getStorage().then((storage) => {
            // successMessage is whatever we passed in the resolve(...) function above.
            // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
            
            view.actions.setRawState(storage.root.toObject().state);

            room.subscribe(storage.root, function (e) {
                
                console.log(!localChange, e[0].node.toObject().state)
                if(!localChange){
                    view.actions.setRawState(storage.root.toObject().state);
                    localChange = false;
                }
                
            
            }, { isDeep: true });

            document.addEventListener("state-change", (event) => {
                if(event.detail && event.detail){
                    if(event.detail['sync-token'] == view.attributes['sync-token']){
                        localChange = true;
                        storage.root.update({state: view.actions.getRawState()})
                        setTimeout(function(){
                            localChange = false;
                        }, 150)
                    }
                }
            }, false);
        });

    }

});


