import $ from 'jquery';

class Handlers {
    constructor(chatContainer, fileContainer){
        this.chatContainer = $('.chat-output');
        this.fileContainer = $('#file-container');
    }

    //Show Room Url
    showRoomURL(roomid, roomPassword) {
        const roomQueryStringURL = `${window.location}?roomid=${roomid}&password=${roomPassword}`;
        const html = `<button class="url-room button button--antiman button--inverted button--border-thin button--text-thick button--size-m" data-clipboard-text="${roomQueryStringURL}"><span class="fa fa-share-alt"></span> Share Room</button>`;
        $('.room-urls').append(html);
        $('.share-url').attr('data-clipboard-text', roomQueryStringURL);
    }

    //Create Overlay on close
    overlayRemote(ctx){
        const closeSessionOverlay = $('.overlay-closed-session');
        let reconnect = `<a href="${window.location}" class="reconnect">Reconnect</a>`;
        $(ctx).find('.closed-session', closeSessionOverlay).append(reconnect);
        $(ctx).find(closeSessionOverlay).fadeIn();
    }

    //Cam Controls
    addCamControls (ctx, pseudo, event) {
        const camControls = document.createElement('div');
        camControls.className = 'cam-controls';
        camControls.innerHTML = ` 
                <button class="mute">
                    <span class="mic-on fa fa-microphone"></span>
                    <span class="mic-off fa fa-microphone-slash"></span>
                </button>
                <button class="cam-off">
                    <span class="vid-on fa fa-video-camera"></span>
                    <span class="vid-off fa fa-stop"></span>
                </button>
            `;
        if(event.type === 'local'){
            ctx.append(camControls);
        }
        ctx.append(pseudo);

        let muted = false;
        let camOffed = false;
        const mute = $('.mute');
        const camOff = $('.cam-off');
        mute.on('click', function() {
            if(!muted){
                console.log('muted');
                $(this).addClass('muted');
                connection.attachStreams[0].mute('audio');
                muted = true;
            }else{
                console.log('unmuted');
                $(this).removeClass('muted');
                connection.attachStreams[0].unmute('audio');
                muted = false;
            }
        });
        camOff.on('click', function() {

            if(!camOffed){
                $(this).addClass('muted');
                connection.attachStreams[0].mute('both');
                camOffed = true;
            }else{
                $(this).removeClass('muted');
                connection.attachStreams[0].unmute('both');
                camOffed = false;
            }
        });
    }
}



export default Handlers;