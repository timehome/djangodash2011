describe('Header', function(){

    describe('default options', function(){
        it('should have a scrollingClassName option', function(){
            expect(Header.prototype.options.scrollingClassName).toEqual('scrolling');
        });
    });

    describe('header reactToScroll method', function(){
        beforeEach(function(){
            this.header = new Header(new Element('div'));
        });

        describe('if no window scrolling', function(){
            it('should not add the scrolling class on the header element', function(){
                expect(this.header.element.hasClass('scrolling')).toEqual(false);
            });
        });

        describe('on window scrolling', function(){
            beforeEach(function(){
                if (this.scrollCount == null){
                    this.scrollCount = 0;
                }
                this.scrollCount++;
                document.id(window).scrollTo(0, this.scrollCount);
                this.header.reactToScroll({target: window});
            });

            it('should add the scrolling class on the header element', function(){
                expect(this.header.element.hasClass('scrolling')).toEqual(true);
            });
        });
    });

});


