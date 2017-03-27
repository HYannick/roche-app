import $ from 'jquery';
import Handlers from './Handlers';
class CamHandler extends Handlers {
    constructor(chatContainer, fileContainer){
        super(chatContainer, fileContainer);
    }

    //Init Webcam
    createCam(cam,event){
        const camContainer = document.createElement('div');
        const pseudo = document.createElement('p');

        camContainer.className = 'video-div';
        camContainer.setAttribute('data-userid', event.streamid);
        camContainer.append(cam);

        pseudo.innerHTML = event.extra.username;
        pseudo.className = 'video-username';

        cam.removeAttribute('controls');
        pseudo.setAttribute('data-username',event.extra.username);
        connection.videosContainer.append(camContainer).hide().fadeIn();
        //From Handlers Class
        this.addCamControls(camContainer, pseudo, event);
    }
    //Init Screen Sharing
    createScreenShare(cam){
        const screenshare = document.createElement('div');
        cam.className= 'screenshared';
        screenshare.className = 'screenshare-bloc';
        screenshare.append(cam);
        cam.removeAttribute('controls');
        $('.screen-share').append(screenshare).hide().fadeIn();
    }

    //check remote user
    camIsRemote(cam, event){
        if(event.type === 'local'){
            cam.className = 'emitter-video';
        }else if(event.type === 'remote'){
            console.log('remote')
        }

    }
}



export default CamHandler;