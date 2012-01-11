Ext.ns('Ext.ux');

Ext.ux.Menu = Ext.extend(Ext.util.Observable, {
    menuSelector: 'projects',
    menuEasing: 'easeOut',
    menuDuration: 0.25,
    activeCls: 'active',
    /**
     * Constructor
     * @param String id
     * @param Object config
     */
    constructor: function(id, config) {
        
        config = config || {};
        Ext.apply(this, config);
        
        Ext.ux.Menu.superclass.constructor.call(this, config);
        
        this.addEvents('opened', 'closed');
        
        this.element = Ext.get(id);
        this.menuSelector = this.element.getAttribute('data-menu') || this.menuSelector;
        this.menu  = Ext.get(this.menuSelector, false);
        
        this.menu.hide();
        
        this.element.on('click', this.onClick, this);
    },
    /**
     * On trigger click
     * @param EventObject e
     */
    onClick: function(e) {
        if(this.menu.isVisible()) {
            this.close();
        } else {
            this.open();
        }
    },
    /**
     * Open menu
     */
    open: function() {
        this.element.toggleClass(this.activeCls);
        this.fireEvent('opened');
        this.menu.show();
    },
    /**
     * Close menu
     */
    close: function() {
        this.element.toggleClass(this.activeCls);
        this.fireEvent('closed');
        this.menu.hide();
    }
});

/****************************************************
 * Carousel
 ****************************************************/
Ext.ux.Carousel = Ext.extend(Ext.util.Observable, {
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
    },
    /**
     * Get the left position of a specific slide
     * @param int index
     * @return int
     */
    getXPos: function(index) {
        // Ext.fx.shift doesn't respect the containing element
        // so we have to look up the body offset to make sure
        // it aligns properly.
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
    }
});

Ext.onReady(function() {
	Ext.get("container").show();
    var carousel = new Ext.ux.Carousel("container");
    var select = new Ext.ux.Menu("select");
	
    var projects = Ext.get("projects").select('a');
    projects.on('click', function(e, t) {
        Ext.get('project-title').dom.innerHTML = t.innerHTML;
        carousel.goTo(t.getAttribute('data-project'));
        select.close();
    });
	
	Ext.EventManager.addListener(window, 'keydown', function(e,t) {
		if(e.keyCode == 37) {
			carousel.prev();
		}
		if(e.keyCode == 39) {
			carousel.next();
		}
	});
});