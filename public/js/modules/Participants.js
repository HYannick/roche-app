import $ from 'jquery';
import Handlers from './Handlers';
class Participants extends Handlers{
    constructor(chatContainer, fileContainer){
        super(chatContainer, fileContainer);
    }

    //Get/Remove Participants Handler
    getParticipants(event){
        const username = event.extra.username;
        const shortenedUsername = username.slice(0,2);
        let participantsTpl = `
            <div class="participant" data-user="${username}">
                <span class="usn">${shortenedUsername}</span>
                <span class="tooltip-usn">${username}</span>
            </div>`;
        $('.participants').append(participantsTpl).hide().fadeIn();
    }

    removeParticipant(event){
        const username = event.extra.username;
        $('.participant').each(function(){
            const toRemove = $(this).data('user');
            if(username == toRemove){
                $(this).fadeOut().remove();
            }
        });
        $('.video-username').each(function(){
            const toRemove = $(this).data('username');
            if(username == toRemove){
                $(this).parent().fadeOut().remove();
            }
        });
    }
}



export default Participants;