/**
 * RazdElement - Base class for all Razd UI elements
 */
class RazdElement {
    constructor(options) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 0;
        this.height = options.height || 0;
        this.id = options.id || `razd-element-${Math.random().toString(36).substr(2, 9)}`;
        this.type = options.type || 'Element';
        this.name = options.name || '';
        this.text = options.text || '';
        this.style = options.style || null;
        this.action = options.action || null;
        this.url = options.url || null;
        this.options = options || {}; // Store all original options
        this.visible = options.visible !== undefined ? options.visible : true;
        this.children = [];

        // Add default handlers if provided in options
        this.onClick = options.onClick;
        this.onPointerDown = options.onPointerDown;
        this.onPointerUp = options.onPointerUp;
        this.onPointerMove = options.onPointerMove;
        this.onMouseEnter = options.onMouseEnter;
        this.onMouseLeave = options.onMouseLeave;
        this.onKeyDown = options.onKeyDown; 
        this.onFocus = options.onFocus;
        this.onBlur = options.onBlur;

        this.isHovering = false;
        this.isFocused = false;

        // Add to parent if provided
        if (options.parent) {
            this.parent = options.parent;
            options.parent.children.push(this);
        } else {
            this.parent = null;
        }
        
        // Add to global elements
        if (window.global && window.global.elements) {
            window.global.elements.push(this);
        }
        
        if (window.global && window.global.elementTable && this.id) {
            window.global.elementTable[this.id] = this;
        }
    }

    // Default draw method (basic rendering)
    draw(ctx, x, y) {
        if (!this.visible) return;

        // Base element just draws a rectangle
        if (this.style && this.style.backgroundColor !== 'transparent') {
            ctx.fillStyle = this.style.backgroundColor;
            
            // Check for gradient
            if (this.style.backgroundGradientColorA && this.style.backgroundGradientColorB) {
                const gradient = ctx.createLinearGradient(x, y, x, y + this.height);
                gradient.addColorStop(0, this.style.backgroundGradientColorA);
                gradient.addColorStop(1, this.style.backgroundGradientColorB);
                ctx.fillStyle = gradient;
            }
            
            // Draw with rounded corners
            const radius = this.style ? this.style.borderCurvature : 0;
            if (radius > 0) {
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + this.width - radius, y);
                ctx.quadraticCurveTo(x + this.width, y, x + this.width, y + radius);
                ctx.lineTo(x + this.width, y + this.height - radius);
                ctx.quadraticCurveTo(x + this.width, y + this.height, x + this.width - radius, y + this.height);
                ctx.lineTo(x + radius, y + this.height);
                ctx.quadraticCurveTo(x, y + this.height, x, y + this.height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.fillRect(x, y, this.width, this.height);
            }
        }
        
        // Draw border
        if (this.style && this.style.borderWidth > 0) {
            ctx.strokeStyle = this.style.borderColor;
            ctx.lineWidth = this.style.borderWidth;
            
            // Draw with rounded corners
            const radius = this.style ? this.style.borderCurvature : 0;
            if (radius > 0) {
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + this.width - radius, y);
                ctx.quadraticCurveTo(x + this.width, y, x + this.width, y + radius);
                ctx.lineTo(x + this.width, y + this.height - radius);
                ctx.quadraticCurveTo(x + this.width, y + this.height, x + this.width - radius, y + this.height);
                ctx.lineTo(x + radius, y + this.height);
                ctx.quadraticCurveTo(x, y + this.height, x, y + this.height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                ctx.stroke();
            } else {
                ctx.strokeRect(x, y, this.width, this.height);
            }
        }
        
        // Draw background image if specified
        if (this.url) {
            // Create image if not already created
            if (!this.backgroundImage) {
                this.backgroundImage = new Image();
                this.backgroundImage.src = this.url;
                this.backgroundImage.onload = () => window.Razd.draw();
            }
            
            // Draw the image
            if (this.backgroundImage && this.backgroundImage.complete) {
                ctx.drawImage(this.backgroundImage, x, y, this.width, this.height);
            }
        }
    }

    // Default update method (does nothing, override for animations/logic)
    update(deltaTime) { }

    // Default point collision detection
    isPointInside(x, y) {
        return this.visible &&
               x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }

    // Called when the element gains focus
    focus() {
        this.isFocused = true;
        if (typeof this.onFocus === 'function') {
            this.onFocus();
        }
    }

    // Called when the element loses focus
    blur() {
        this.isFocused = false;
        if (typeof this.onBlur === 'function') {
            this.onBlur();
        }
    }
}

// Make the class globally available
if (typeof window !== 'undefined') {
    window.RazdElement = RazdElement;
}