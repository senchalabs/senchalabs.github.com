Ext.ns('Ext.ux');

/****************************************************
 * Carousel
 ****************************************************/
Ext.ux.Carousel = Ext.extend(Ext.util.Observable, {
	// constants
	KEY_LEFT: 37,
	KEY_UP: 38,
	KEY_RIGHT: 39,
	KEY_DOWN: 40,
	// slide options
    slideSelector: 'div.feature',
    slideMargin: -25,
	// preview options
	previewIsShowing: false,
	// controls
	controlLeftSelector: 'control-left',
	controlRightSelector: 'control-right',
	controlUpSelector: 'control-up',
	controlDownSelector: 'control-down',
    /**
     * Constructor
     * @param String id
     * @param Object config
     */
    constructor: function(id, config) {
        // set up config
        config = config || {};
        Ext.apply(this, config);

        // init super
        Ext.ux.Carousel.superclass.constructor.call(this, config);
        this.addEvents('complete');

        // grab elements
        this.container = Ext.get(id);
		this.previews = Ext.get('previews');
        this.slides  = this.container.select(this.slideSelector, false);
		this.controlLeft = Ext.get(this.controlLeftSelector);
		this.controlRight = Ext.get(this.controlRightSelector);
		this.controlUp = Ext.get(this.controlUpSelector);
		this.controlDown = Ext.get(this.controlDownSelector);

        // set dims
        this.slideWidth  = this.slides.item(0).getWidth() + this.slideMargin;
        this.totalWidth  = (this.slides.getCount() * this.slideWidth);
        this.container.setWidth(this.totalWidth);

		// set default slide
		this.activeIndex = Math.floor(this.slides.getCount()/2);
		
		// init
		this.initSlides();
		this.registerKeyPressEvents()
        this.goTo(this.activeIndex);
    },
	/**
	 * Initialize slides
	 */
	initSlides: function() {
		this.slides.each(function(el, t, i) {
			// set margin
            el.setStyle('marginRight', this.slideMargin + "px");
			// get the project title
			var title = el.select('h1').elements[0].innerHTML;
			// create the preview
			var pr = this.createPreview(el.getAttribute('data-preview'), title);
			// set click handler
            el.on('click', function(evt, an) {
                this.goTo(i);
            }, this);
            pr.on('click', function(evt, an) {
				this.hidePreviews();
                this.goTo(i);
            }, this);
        }, this);	
	},
	/**
	 * Create the project preview
	 * @return Element
	 */
	createPreview: function(p,t) {
		var preview = Ext.get(Ext.DomHelper.append(this.previews, { class: 'preview' }));
		preview.setStyle('backgroundImage', 'url("'+p+'")');
		Ext.DomHelper.append(preview, {
			tag: 'h2',
			html: t
		});
		return preview;
	},
	/**
	 * Register key press events
	 */
	registerKeyPressEvents: function() {
		Ext.EventManager.addListener(window, 'keydown', function(e,t) {
			if(e.keyCode == this.KEY_LEFT && !this.previewIsShowing) {
				this.onKeyLeft(e);
			}
			if(e.keyCode == this.KEY_RIGHT && !this.previewIsShowing) {
				this.onKeyRight(e);
			}
			if(e.keyCode == this.KEY_UP) {
				this.onKeyUp(e);
			}
			if(e.keyCode == this.KEY_DOWN) {
				this.onKeyDown(e);
			}
		}, this);
		this.controlLeft.on('click', this.onKeyLeft, this);
		this.controlRight.on('click', this.onKeyRight, this);
		this.controlUp.on('click', this.onKeyUp, this);
		this.controlDown.on('click', this.onKeyDown, this);
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
			this.container.setLeft(this.getXPos(index));
            this.activeIndex = index;
            this.onActivate();
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
	showPreviews: function() {
		this.onDeactivate();
		this.container.removeClass('active');
		this.previews.addClass('active');
		this.previewIsShowing = true;
	},
	hidePreviews: function() {
		this.onActivate();
		this.container.addClass('active');
		this.previews.removeClass('active');
		this.previewIsShowing = false;
	},
    /**
     * On project activate
     */
    onActivate: function() {
        this.slides.each(function(el, t, i) {
            if(i == this.activeIndex) {
                el.addClass('active');
				el.removeClass('inactive');
            } else {
	            el.removeClass('active');
				el.addClass('inactive');
			}
        }, this);
    },
	onDeactivate: function() {
		this.slides.each(function(el, t, i) {
            el.removeClass('active');
        }, this);
	},
	onKeyLeft: function(e) {
		this.prev();
		this.onKeyToggle(this.controlLeft);
	},
	onKeyRight: function(e) {
		this.next();
		this.onKeyToggle(this.controlRight);
	},
	onKeyUp: function(e) {
		this.showPreviews();
		this.onKeyToggle(this.controlUp);
	},
	onKeyDown: function(e) {
		this.hidePreviews();
		this.onKeyToggle(this.controlDown);
	},
	onKeyToggle: function(el) {
		el.addClass('active');
		setTimeout(function() {
			el.removeClass('active');
		}, 500);
	}
});

function toggleInfoBox(e) {
	var intro = Ext.get('intro');
	if(intro.hasClass('active')) {
		intro.removeClass('active');
	} else {
		intro.addClass('active');
	}
}

Ext.onReady(function() {
    var carousel = new Ext.ux.Carousel("container");
	var about = Ext.get('about');
	about.on('click', toggleInfoBox);
});