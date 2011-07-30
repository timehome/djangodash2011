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
                this.closeButton = new Element('a', {'class': 'close-button'});
                this.closeButton.inject(this.element);
            }
        },

        show: function(tab) {
            if (tab) {
                this.showTab(tab);
            }
            this.element.fade('hide').fade('in');
        },

        hide: function() {
            this.element.fade('out');
        },

        hideTabs: function() {
            this.tabs.removeClass('show');
        },

        showTab: function(tab) {
            this.hideTabs();
            var tabElement = this.element.getElement('> .'+ tab);
            tabElement.addClass('show');
            this.fireEvent('tabChange', [tabElement, tab]);
        }
    });

}(this, document.id));
