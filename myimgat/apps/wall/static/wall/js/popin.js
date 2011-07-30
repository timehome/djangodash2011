(function(global, $){

    var Popin = global.Popin = new Class({
        Implements: [Options, Events],

        initialize: function(element) {
            this.element = $(element);
            this.element.fade('hide');
            this.tabs = this.element.getChildren();
        },

        show: function(tab) {
            if (tab) {
                this.showTab(tab);
            }
            this.element.fade('in');
        },

        hide: function() {
            this.element.fade('out');
        },

        hideTabs: function() {
            this.tabs.removeClass('show');
        },

        showTab: function(tab) {
            this.hideTabs();
            this.element.getElement('> .'+ tab).addClass('show');
        }
    });

}(this, document.id));
