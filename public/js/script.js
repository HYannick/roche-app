//External libraries
import $ from 'jquery';
//Copy to clipboard
import Clipboard from './vendors/clipboard.min';
//RTC Multiconnection assets
import './vendors/RTCMultiConnection.min'
import './vendors/FileBufferReader';
import './vendors/getScreenId';
//Animation behaviours
import anime from 'animejs';
import screenfull from 'screenfull';
import './reveal';

//Modules
import Handlers from './modules/Handlers';
import Participants from './modules/Participants';
import ChatShare from './modules/ChatShare';
import CamHandler from './modules/CamHandler';

let handlers = new Handlers();
let participants = new Participants();
let chatShare = new ChatShare();
let camHandler = new CamHandler();

//////////////////////////////////////////
$(function(){
    //Open and join Room Buttons
    const openRoom = $('#open-room');
    const joinRoom = $('#join-room');
    //RoomID and RoomPassword
    const roomPassword = $('#room-password');
    const roomId = $('#room-id');
    const clientEmail = $('#client-email');
    //ShareRoom controls
    const screenShare = $('.add-stream');
    const screenShareStop = $('.remove-stream');
    const closeSession = $('.close-session');
    //Containers
    const body = $('body');
    const mainWrapper = $('.content-wrap');
    const closeSessionOverlay = $('.overlay-closed-session');
    const argumentary = $('.argumentary');
    const toolbar = $('.toolbox-bar');
    const roomCtn = $('.room-container');
    const fileContainer = $('#file-container');
    //Main Form
    const form = $('.form-inputs');
    const inputsRoom = $('input.input__field');
    const btnChat = $('.btn-chatbox');
    //Toolbox
    const toolbox = $('.toolbox');
    const toolBtn = $('.tool');
    const share = $('.share-file');
    //Chatbox
    const sendMsg = $('#send');
    const inputChat = $('#input-text-chat');

    form.submit(e => {
        e.preventDefault();
    });

    body.addClass('loaded');
    //Handle opening the room
    openRoom.click(() => {
        let password = roomPassword.val();
        let roomName = roomId.val();
        let email = clientEmail.val();
        if(!roomName.length){
            alert('Please enter a room name.');
            return;
        }
        if(!password.length){
            alert('Please enter a room password.');
            return;
        }
        if(!roomName.length){
            alert('Please enter a room name.');
            return;
        }

        $('.room-name .r-name').html(roomName);
        connection.extra.username = document.getElementById('username').value || 'username';
        form.addClass('connected');
        connection.open(roomName, password);
        handlers.showRoomURL(roomName, password, email);

        //Clipboard.js
        //https://zenorocha.github.io/clipboard.js
        //Licensed MIT © Zeno Rocha

        const copyUrl = new Clipboard('.url-room', {
            text(trigger) {
                return trigger.getAttribute('data-clipboard-text');
            }

        });
        new Clipboard('.share-url', {
            text(trigger) {
                return trigger.getAttribute('data-clipboard-text');
            }
        });

        copyUrl.on('success', e => {
            $('.url-room').html('Copied');
            e.clearSelection();
        });

        copyUrl.on('error', e => {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    });



    // ......................................................
    // ..................RTCMultiConnection Code.............
    // ......................................................
    var connection = new RTCMultiConnection();
    window.connection = connection;
    // Using getScreenId.js to capture screen from any domain
    // You do NOT need to deploy Chrome Extension YOUR-Self!!
    connection.getScreenConstraints = function(callback) {
        getScreenConstraints(function(error, screen_constraints) {
            if (!error) {
                screen_constraints = connection.modifyScreenConstraints(screen_constraints);
                callback(error, screen_constraints);
                return;
            }
            throw error;
        });
    };
    // by default, socket.io server is assumed to be deployed on your own URL
    //connection.socketURL = '/';

    // comment-out below line if you do not have your own socket.io server
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    connection.socketMessageEvent = 'roche-password-protected-room';

    connection.extra = {
        username : 'username'
    };
    connection.session.data = true;
    connection.DetectRTC.load(function() {
        if (!connection.DetectRTC.hasMicrophone) {
            connection.mediaConstraints.audio = false;
            connection.session.audio = false;
            connection.session.data = true;
        }

        if (!connection.DetectRTC.hasWebcam) {
            connection.mediaConstraints.video = false;
            connection.session.video = false;
            connection.session.data = true;
        }
    });

    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    };
    connection.enableFileSharing = true;
    connection.setDefaultEventsForMediaElement = false;
    connection.videosContainer = $('.video-container');
    var rev = new RevealFx(document.querySelector('.logo'), {
        revealSettings : {
            bgcolor: '#0279c1',
            direction : 'lr',
            duration: 500,
            onStart: function(contentEl, revealerEl) {
                anime.remove(contentEl);
                contentEl.style.opacity = 0;
            },
            onCover: function(contentEl, revealerEl) {
                anime({
                    targets: contentEl,
                    duration: 800,
                    delay: 80,
                    easing: 'easeOutExpo',
                    translateX: [-20,0],
                    opacity: [0,1]
                });
            }
        }
    });
    rev.reveal();
    function removeToolbox(){
        toolBtn.removeClass('active').addClass('inactive');
        toolbox.removeClass('is-open');
        screenShare.removeClass('active').addClass('inactive');
    }


    function animeInit(){
        //Animate init
        if(connection.isInitiator){
            mainWrapper
                .addClass('initCon');
        }else{
            mainWrapper
                .addClass('initRemote');
        }
        var animateTools = anime.timeline();
        animateTools
            .add({
                targets: '.video-wrapper',
                opacity: 1,
                right: -250,
                duration: 100,
            })
            .add({
                targets: '.btn-chatbox',
                opacity: 1,
                right: -40,
                duration: 100,
                offset: '-=800'
            })
            .add({
                targets: '.toolbox-bar',
                right: 0,
                opacity: 1,
                duration: 100
            })
            .add({
                targets: '.tool-btn',
                translateY: [-10,0],
                opacity: [0,1],
                delay: function(el, i, l) {
                    return i * 100;
                }
            });
        setTimeout(() => {
            animateTools.play();
        },800)

    }

    //events on connection

    connection.onstream = event => {
        let video = event.mediaElement;
        console.log(event);
        //check if the cam id exists. If it does removes it
        if(document.getElementById(event.streamid)) {
            var existing = document.getElementById(event.streamid);
            existing.parentNode.parentNode.removeChild(existing.parentNode);
            $('.participant').each(function(){
                const toRemove = $(this).data('user');
                if(username == toRemove){
                    console.log(toRemove)

                }
            });
        }

        if(event.stream.isScreen){
            camHandler.createScreenShare(video, event);
        }else {
            camHandler.createCam(video, event);
            participants.getParticipants(event);
        }


        camHandler.camIsRemote(video, event);

        animeInit();

        //Init scroll if too many cameras
        if(connection.videosContainer.height() >= $(window).height()){
            connection.videosContainer.addClass('toScroll');
        }else{
            connection.videosContainer.removeClass('toScroll');
        }

        //init scroll if too many participants
        let participantContainer = $('.bloc-participants');
        if(participantContainer.find('.participants').width() >= 100){
            participantContainer.addClass('p-extend');
        }else{
            participantContainer.removeClass('p-extend');
        }
    };


    connection.videosContainer.on('click', '.video-div video', function() {
        if (screenfull.enabled) {
            screenfull.request(this);
        }
    });



    //On Open room event
    connection.onopen = () => {
        //if no audio nor video
        if(!(connection.session.video && connection.session.audio)){
            animeInit();
        }
        roomCtn.fadeOut();
        setTimeout(() => {
            fileContainer.addClass('activated');
        },1000);
        screenShare.removeClass('disabled');
    };


    //Closing session handler
    connection.autoCloseEntireSession = true;

    connection.onEntireSessionClosed = event => {
        if(!connection.isInitiator){
            handlers.overlayRemote('.remote-user');
        }else{
            $('p', closeSessionOverlay).html(`You have closed the room`);
            let reconnect = `<a href="/" class="reconnect">Create new room</a>`;
            $('.closed-session', closeSessionOverlay).append(reconnect);
            closeSessionOverlay.fadeIn();
        }
    };

    closeSession.click(() => {
        if(connection.isInitiator){
            connection.closeEntireSession();
        }else{
            connection.leave();
            handlers.overlayRemote('.remote-user');
        }
    });
    connection.onclose = event => {
        participants.removeParticipant(event);
    };
    connection.onleave = event => {
        participants.removeParticipant(event);
    };

    //Screensharing
    screenShare.click(function() {
        connection.addStream({
            screen: true,
            oneway: true
        });
        chatShare.closeFile();
        removeToolbox();
        $(this).addClass('active');
    });

    screenShareStop.click( function() {
        connection.removeStream({
            isScreen: true,  // it will remove all screen streams
            stop: true     // ask to stop old stream
        });
        $(this).removeClass('inactive').addClass('active')
    });


    //Password handling
    connection.onJoinWithPassword = remoteUserId => {
        let password = document.getElementById('room-password').value;
        connection.join(remoteUserId, password);
    };
    connection.onInvalidPassword = (remoteUserId, oldPassword) => {
        let password = prompt(remoteUserId + ' is password protected. Your entered wrong password (' + oldPassword + '). Please enter valid pasword:');
        connection.join(remoteUserId, password);
    };
    connection.onPasswordMaxTriesOver = remoteUserId => {
        alert(remoteUserId + ' is password protected. Your max password tries exceeded the limit.');
    };

    //Messaging handling
    connection.onmessage = event => {
        const extraInformation = event.extra.username || connection.extra.username;
        let loc = 'local';
        connection.videosContainer.addClass('cb-active');
        chatShare.appendMsg(event, extraInformation, loc);
        chatShare.getToBottom('.chat-container');
    };


    $('.close-file').on('click', () => {
        chatShare.closeFile();
    });

    // ......................................................
    // ................FileSharing/TextChat Code.............
    // ......................................................


    clientEmail.keyup(function(e){
        if (e.keyCode == 32) {
            this.value = this.value + ';'
        }
    });

    inputChat.keyup(function(e) {
        if (e.keyCode != 13) return;
        // removing trailing/leading whitespace
        this.value = this.value.replace(/^\s+|\s+$/g, '');
        if (!this.value.length) return;
        chatShare.sendValue(this.value);
        this.value = '';
    });

    sendMsg.click(() => {
        // removing trailing/leading whitespace
        const input = inputChat.val().replace(/^\s+|\s+$/g, '');
        if (!input.length) return;
        chatShare.sendValue(input);
        inputChat.val('');
    });

    share.click(function(){
        const self = $(this);
        chatShare.returnFile(self);
        chatShare.sendData(self);
    });


    inputsRoom.focus(function(){
        $(this).parent().toggleClass('input--filled');
    });

    inputsRoom.blur(function(){
        var inputVal = $(this).val();
        if(!inputVal){
            $(this).parent().removeClass('input--filled');
        }else{
            $(this).parent().addClass('input--filled');
        }
    });

    btnChat.click( () =>{
        $('span', this).toggleClass('opn');
        $('.bloc-chat').toggleClass('active');
    });



    toolBtn.on('click', function(){
        var dataTool = $(this).data('tool');
        var toToggle = $(`.toolbox[data-tabs="${dataTool}"]`);
        if(toToggle.hasClass('is-open')){
            toolbox.removeClass('is-open');
            screenShare.removeClass('inactive');
            toolBtn.removeClass('inactive');
            $(this).removeClass('active');
        }else{
            removeToolbox();
            $(this).addClass('active').removeClass('inactive');
            toToggle.addClass('is-open');
        }


    });


    $('.close-panel').click( () =>{
        removeToolbox();
        toolBtn.removeClass('inactive');
        screenShare.removeClass('inactive');
    });





    // ......................................................
    // ......................Handling Room-ID................
    // ......................................................

    //Function which search for params and set them in a params object.
    ((() => {
        const params = {};
        const r = /([^&=]+)=?([^&]*)/g;

        function d(s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        }
        let match;
        const search = window.location.search;
        while (match = r.exec(search.substring(1)))
            params[d(match[1])] = d(match[2]);
        window.params = params;
    }))();

    //Room name generation
    var roomid = '';
    if (localStorage.getItem(connection.socketMessageEvent)) {
        roomid = localStorage.getItem(connection.socketMessageEvent);
    } else {
        roomid = connection.token();
    }
    document.getElementById('room-id').value = roomid;
    document.getElementById('room-id').onkeyup = function() {
        localStorage.setItem(connection.socketMessageEvent, this.value);
    };

    var roomid = params.roomid;
    const password = params.password;
    if(roomid && roomid.length && password && password.length) {
        document.getElementById('room-id').value = roomid;
        localStorage.setItem(connection.socketMessageEvent, roomid);
        document.getElementById('room-password').value = password;

        joinRoom.click(() => {
            $('.room-name .r-name').html(roomId.val());
            connection.extra.username = document.getElementById('username').value || 'username';
            // Check if room exists
            (function reCheckRoomPresence() {
                connection.checkPresence(roomid, function(isRoomExists) {
                    if(isRoomExists) {
                        connection.join(roomid, password);
                    }else{
                        alert(`This room doesn't exist.`)
                    }
                });
            })();
        });

        openRoom.remove();
        console.log('remote');
        body.addClass('remote-user');
        joinRoom.removeClass('joinRoom').addClass('button button--antiman button--inverted button--border-thin button--text-thick button--size-m');
        $('.drop-text span').text('Waiting for content ~');
    }
});