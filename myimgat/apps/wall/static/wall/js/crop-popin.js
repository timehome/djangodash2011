(function(global, $){

    var CropPopin = global.CropPopin = new Class({
        Extends: Popin,

        show: function(tab) {
            if (tab) {
                this.showTab(tab);
            }
            this.element.addClass('show');
        },

        hide: function() {
            this.element.removeClass('show');
        }
    });

}(this, document.id));

