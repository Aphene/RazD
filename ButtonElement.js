/**
 * ButtonElement - Interactive button element for Razd
 * Requires RazdElement.js
 */
class ButtonElement extends RazdElement {
    constructor(x, y, width, height, name, text, style, parent, action, url) {
        super({
            x, y, width, height, name, text, style, parent, action, url,
            type: 'Button'
        });
    }

    draw(ctx, x, y) {
        if (!this.visible) return;
        
        ctx.save();

        // Draw the base element (background and border)
        super.draw(ctx, x, y);

        // Draw text
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
    window.ButtonElement = ButtonElement;
}