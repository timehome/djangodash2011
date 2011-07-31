(function(global, $){

    var Popin = global.Popin = new Class({
        Implements: [Options, Events],

        options: {
            closeButton: true
        },

        initialize: function(element, options) {
            this.setOptions(options);
            this.element = $(element);
            this.tabs = this.element.getChildren();
            this.createCloseButton();
        },

        createCloseButton: function() {
            if (this.options.closeButton) {
                this.closeButton = new Element('a', {
                    'href': '#close-popin',
                    'class': 'close-button',
                    events: {
                        'click': function(e){
                            e.preventDefault();
                            this.hide();
                        }.bind(this)
                    }
                });
                this.closeButton.inject(this.element);
            }
        },

        show: function(tab) {
            if (tab) {
                this.showTab(tab);
            }
            this.element.fade('hide').fade('in');
            return this;
        },

        hide: function() {
            this.element.fade('out');
            return this;
        },

        hideTabs: function() {
            this.tabs.removeClass('show');
            return this;
        },

        showTab: function(tab) {
            this.hideTabs();
            var tabElement = this.element.getElement('> .'+ tab);
            tabElement.addClass('show');
            this.fireEvent('tabChange', [tabElement, tab]);
            return this;
        }
    });

}(this, document.id));
