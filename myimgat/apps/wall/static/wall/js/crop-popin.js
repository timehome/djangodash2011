(function(global, $){

    var CropPopin = global.CropPopin = new Class({
        Extends: Popin,

        show: function(tab) {
            if (tab) {
                this.showTab(tab);
            }
            this.element.addClass('show');
            return this;
        },

        hide: function() {
            this.element.removeClass('show');
            return this;
        }
    });

}(this, document.id));

