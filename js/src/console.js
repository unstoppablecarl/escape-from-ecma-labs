(function(root) {
    'use strict';

    /**
    * Manages the display and history of console messages to the user.
    * "The troll hits you dealing 10 damage."
    * "You die."
    * @class Console
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    * @param {Number} [messageHistoryCount=5] - Number of messages to display at once.
    * @param {String} [elClassName='console'] - Css class name to assign to the console element.
    */
    var Console = function Console(game, messageHistoryCount, elClassName) {
        this.el = document.createElement('div');
        this.el.className = elClassName || 'console';
        this.messageHistoryCount = messageHistoryCount || this.messageHistoryCount;
        this.game = game;
    };

    Console.prototype = {
        constructor: Console,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * Element containing console messages.
        * Must be manually added to the DOM
        * @property el
        * @type HTMLElement
        */
        el: null,

        /**
        * Number of messages to display at once.
        * @property messageHistoryCount
        * @type Number
        */
        messageHistoryCount: 5,

        /**
         * The string prefix used before the message repeat count.
         * @type {String}
         */
        messageRepeatPrefix: ' &times; ',

        /**
         * The Element of the last message displayed.
         * @property lastEl
         * @type {HTMLElement}
         */
        lastEl: null,

        /**
         * The `innerHTML` of the last message displayed.
         * @property lastMessage
         * @type {String}
         */
        lastMessage: null,

        /**
         * The number of times the last message has been repeated.
         * @property lastRepeatCount
         * @type {Number}
         */
        lastRepeatCount: 0,

        /**
         * TextNode
         * @property lastRepeatTextNode
         * @type {TextNode}
         */
        lastRepeatTextNode: null,

        /**
        * Adds a message to the console.
        * @method log
        * @param {String} - Message to be added.
        */
        log: function(message){

            if(this.lastEl && this.lastMessage === message){
                this.incrementLastMessageEl();
                return;
            }

            var messageEl = this.addMessage(message);
            this.setLastMessage(messageEl);
            this.removeMessagesBeforeLatest();
        },

        /**
         * Creates a div containing `message` and appends it to `this.el`.
         * @method addMessage
         * @param {String} message
         * @return {HTMLElement} The created div.
         */
        addMessage: function(message){
            var messageEl = document.createElement('div');
            messageEl.innerHTML = message;
            this.el.appendChild(messageEl);
            return messageEl;
        },

        /**
         * Sets the last message.
         * @method setLastMessage
         * @param {HTMLElement} messageEl
         */
        setLastMessage: function(messageEl){
            this.lastMessage = messageEl.innerHTML;
            this.lastRepeatCount = 0;
            this.lastRepeatTextNode = null;
            this.lastEl = messageEl;
        },

        /**
         * Add or increment a number at the end of the last message to indicate that it has been repeated.
         * @method incrementLastMessageEl
         */
        incrementLastMessageEl: function(){
            if(!this.lastRepeatCount){
                this.lastEl.innerHTML += this.messageRepeatPrefix;
                this.lastRepeatCount = 1;
            }

            if(!this.lastRepeatTextNode){
                this.lastRepeatTextNode = document.createTextNode(' - ');
                this.lastEl.appendChild(this.lastRepeatTextNode);
            }
            this.lastRepeatCount++;
            this.lastRepeatTextNode.nodeValue = this.lastRepeatCount;
        },

        /**
         * Removes message elements before a number of the most recent messages.
         * @method removeMessagesBeforeLatest
         * @param {Number} messageCount - [messageCount=this.messageHistoryCount] The number of messages to keep.
         */
        removeMessagesBeforeLatest: function(messageCount){
            messageCount = messageCount || this.messageHistoryCount;
            while(this.el.children.length > messageCount - 1){
                var childEl = this.el.childNodes[0];
                childEl.remove();
            }
        },
    };

    root.RL.Console = Console;

}(this));