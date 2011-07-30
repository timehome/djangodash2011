(function(global, $){

    var Popin = global.Popin = new Class({
        Implements: [Options, Events],

        initialize: function(element) {
            this.element = $(element);
            this.element.fade('hide');
            this.tabs = this.element.getChildren();
            this.createOverlay();
        },

        createOverlay: function() {
            this.overlay = new Element('div', {
                'class': 'overlay',
                events: {
                    click: this.hide.bind(this)
                }
            });
            this.overlay.fade('hide');
            $$('body').grab(this.overlay);
        },

        show: function(tab) {
            if (tab) {
                this.showTab(tab);
            }
            this.element.fade('in');
            this.overlay.fade('in');
        },

        hide: function() {
            this.element.fade('out');
            this.overlay.fade('out');
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
