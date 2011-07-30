(function(global, $){

    var Popin = global.Popin = new Class({
        Implements: [Options, Events],

        initialize: function(element) {
            this.element = $(element);
            this.tabs = this.element.getChildren();
            this.element.fade('hide');
        },

        hideOthers: function() {
            this.tabs.removeClass('show');
        },

        show: function(tab) {
            this.element.fade('in');
            if (tab) {
                this.showTab(tab);
            }
        },

        hide: function() {
            this.element.fade('out');
        },

        showTab: function(tab) {
            this.element.getElement('> .'+ tab).addClass('show');
        }
    });

}(this, document.id));
