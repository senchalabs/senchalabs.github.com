Ext.ns('Ext.ux');

/****************************************************
 * Carousel
 ****************************************************/
Ext.ux.Carousel = Ext.extend(Ext.util.Observable, {
	KEY_LEFT: 37,
	KEY_UP: 38,
	KEY_RIGHT: 39,
	KEY_DOWN: 40,
    slideSelector: 'div',
    slideEasing: 'easeOut',
    slideDuration: 0.5,
    slideMargin: 4,
    slideOpacity: 0.35,
    /**
     * Constructor
     * @param String id
     * @param Object config
     */
    constructor: function(id, config) {
        
        config = config || {};
        Ext.apply(this, config);
        
        Ext.ux.Carousel.superclass.constructor.call(this, config);
        this.addEvents('complete');
        
        this.element = Ext.get(id);
        this.slides  = this.element.select(this.slideSelector, false);
        
        this.slides.each(function(el, t, i) {
            el.setStyle('marginRight', this.slideMargin + "px");
            el.on('click', function(evt, an) {
                this.goTo(i);
            }, this);
        }, this);
        
        this.slideWidth  = this.slides.item(0).getWidth() + this.slideMargin;
        this.totalWidth  = (this.slides.getCount() * this.slideWidth);
        
        this.activeIndex = Math.floor(this.slides.getCount()/2);
        this.element.setWidth(this.totalWidth);
        this.goTo(this.activeIndex);

		Ext.EventManager.addListener(window, 'keydown', function(e,t) {
			if(e.keyCode == this.KEY_LEFT) {
				this.onKeyLeft(e);
			}
			if(e.keyCode == this.KEY_RIGHT) {
				this.onKeyRight(e);
			}
			if(e.keyCode == this.KEY_UP) {
				this.onKeyUp(e);
			}
			if(e.keyCode == this.KEY_DOWN) {
				this.onKeyDown(e);
			}
		}, this);
    },
    /**
     * Get the left position of a specific slide
     * @param int index
     * @return int
     */
    getXPos: function(index) {
        return -(index * this.slideWidth);
    },
    /**
     * Go to a specific slide
     * @param int index
     */
    goTo: function(index) {
        if(index < this.slides.getCount() && index >= 0) {
            this.element.animate({
                    left: {to: this.getXPos(index)}
                },
                this.slideDuration,
                null,
                this.slideEasing
            );
            this.activeIndex = index;
            this.setClasses();
        }
    },
    /**
     * Go to the next slide
     */
    next: function() {
        this.activeIndex++;
        if(this.activeIndex >= this.slides.getCount()) {
            this.activeIndex = 0;
        }
        this.goTo(this.activeIndex);
    },
    /**
     * Go to the previous slide
     */
    prev: function() {
        this.activeIndex--;
        if(this.activeIndex < 0) {
            this.activeIndex = (this.slides.getCount()-1);
        }
        this.goTo(this.activeIndex);
    },
    /**
     * Set the slide opacity
     */
    setClasses: function() {
        this.slides.each(function(el, t, i) {
            el.removeClass('active');

            if(i == this.activeIndex) {
                el.addClass('active');
            }
        }, this);
    },
	onKeyLeft: function(e) {
		this.prev();
	},
	onKeyRight: function(e) {
		this.next();
	},
	onKeyUp: function(e) {
		// stub
	},
	onKeyDown: function(e) {
		// stub
	}
});

Ext.onReady(function() {
	Ext.get("container").show();
    var carousel = new Ext.ux.Carousel("container");
});