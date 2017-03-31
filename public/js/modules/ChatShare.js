import $ from 'jquery';
import Handlers from './Handlers';
import plyr from 'plyr';
class ChatShare extends Handlers {
    constructor(chatContainer, fileContainer){
        super(chatContainer, fileContainer);
        this.argumentary = $('.argumentary');
    }

    sendValue(input){
        connection.send(input);
        this.appendMsg(input);
        this.getToBottom('.chat-container');
        connection.videosContainer.addClass('cb-active');
    }
    //Append and Send messages
    appendMsg(event, username, loc) {
        const local = loc || 'remote';
        var username = username || connection.extra.username;
        //append new shared file
        const url = event.data || event;
        let template;
        var shortenedUsername = username.slice(0,2);
        $('.room-container').fadeOut();
        if(url.search(/jpg|jpeg/i) !== -1){
            template =
            `
                <div class="bloc-share">
                    <img class="shared-img" src="${url}">
                </div>
            `;
            this.fileContainer.html(template).hide().fadeIn();
        }else if(url.search(/pdf/i) !== -1){
            template =
            `
                <div class="bloc-share">
                    <div class="hide-download"></div>
                    <iframe class="shared-file-iframe" src="${url}#toolbar=0"></iframe>
                </div>
            `;
            this.fileContainer.html(template).hide().fadeIn();
        }else if(url.search(/mp4|mov/i) !== -1){

            template =
            `
                <div class="bloc-share">
                    <video width="100%" class="shared-file-video" src="${url}" autoplay controls ></video>
                </div>
            `;
            this.fileContainer.html(template).hide().fadeIn();
        }else if(url === 'empty') {
            template =
            `
                <div class="bloc-share">
                    <p class="empty-ctn"><img width="50%" src="/img/roche-logo-vector.png"</p>
                </div>
            `;
            this.fileContainer.html(template).hide().fadeIn();
        }else{
            template =
            `
                <li  data-usn="${local}">
                    <div class="msg-container">
                        <div class="author"><span>${shortenedUsername}</span></div>
                        <div class="msg">${url}</div>
                    </div>
                </li>
            `;
            this.chatContainer.append(template);
        }
    }

    sendData(toSend){
        this.fileContainer.find('div').remove();
        const src = $(toSend).data('src');
        connection.send(src);
        this.appendMsg(src);
    }

    //Chat Handler
    getToBottom(container){
        const ctxH = $(container).height();
        if(ctxH >= 450){
            $(container).addClass('scroll-init');
        }
        $(container).stop().animate({
            scrollTop: $(container)[0].scrollHeight
        }, 800);
    }


    returnFile(el) {
        const BASE_URL = '/shared-data.json';
        const emptyArg = $('.empty-arg');
        fetch(BASE_URL, {method: 'GET'})
            .then(res => res.json())
            .then(data => {
                let dataSrc = $(el).data('src');
                let re = /[^/]+$/;
                let res = re.exec(dataSrc)[0];
                let arr = [];
                let results = {};
                let template;
                if(dataSrc.search(/jpg/i) !== -1){
                    arr = data.pictures;
                }else if(dataSrc.search(/jpeg/i) !== -1){
                    arr = data.pictures;
                }else if(dataSrc.search(/pdf/i) !== -1){
                    arr = data.pdfFiles;
                }else if(dataSrc.search(/mp4/i) !== -1){
                    arr = data.videoFiles;
                }else if(dataSrc.search(/mov/i) !== -1){
                    arr = data.videoFiles;
                }

                arr.filter(function(item){
                    return item.src === res;
                }).map(function(src){
                    results = {
                        title : src.title,
                        text : src.text
                    };
                    return results;
                });
                emptyArg.fadeOut();
                template = '<p>' + results.text + '</p>';
                $('h3', this.argumentary).html(results.title);
                $('.txt-argumentary', this.argumentary).html(template);
            });
    }

    //closeFile function
    closeFile(){
        this.fileContainer.find('div').remove();
        const src = 'empty';
        connection.send(src);
        this.appendMsg(src);
        $('.txt-argumentary', this.argumentary).html('nothing to show');
        $('h3', this.argumentary).html('//');
    }
}



export default ChatShare;