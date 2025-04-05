/**
 * ImageElement - Image display element for Razd
 * Requires RazdElement.js
 */
class ImageElement extends RazdElement {
    constructor(x, y, width, height, name, text, style, parent, action, url) {
        super({
            x, y, width, height, name, text, style, parent, action, url,
            type: 'Image'
        });
        
        // Load image if URL provided
        if (url) {
            this.loadImage(url);
        }
    }

    loadImage(url) {
        this.image = new Image();
        this.image.src = url;
        // Trigger redraw when image loads
        this.image.onload = () => {
            if (window.Razd) {
                window.Razd.draw();
            }
        };
    }

    draw(ctx, x, y) {
        if (!this.visible) return;
        
        ctx.save();

        // Draw background and border if needed
        super.draw(ctx, x, y);

        // Draw the image if loaded
        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, x, y, this.width, this.height);
        }

        // Draw text overlay if specified
        if (this.text && this.style) {
            ctx.fillStyle = this.style.foregroundColor || 'black';
            ctx.font = `${this.style.fontWeight || 'normal'} ${this.style.fontSize || 14}px ${this.style.fontFamily || 'Arial'}`;
            ctx.textAlign = this.style.alignment || 'center';
            ctx.textBaseline = 'middle';
            
            // Calculate text position based on alignment
            let textX = x;
            if (ctx.textAlign === 'center') {
                textX += this.width / 2;
            } else if (ctx.textAlign === 'right') {
                textX += this.width;
            }
            
            ctx.fillText(this.text, textX, y + this.height / 2);
        }

        ctx.restore();
    }
}

// Make the class globally available
if (typeof window !== 'undefined') {
    window.ImageElement = ImageElement;
}