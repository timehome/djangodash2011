(function(global, $){

    var CropPopin = global.CropPopin = new Class({
        Extends: Popin,

        show: function(tab) {
            this.fireEvent('show');
            if (tab) {
                this.showTab(tab);
            }
            this.element.addClass('show');
            return this;
        },

        hide: function() {
            this.fireEvent('hide').element.removeClass('show');
            return this;
        }
    });

}(this, document.id));

