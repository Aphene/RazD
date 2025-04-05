/**
 * TextInputElement - Text input field for Razd
 * Requires RazdElement.js
 */
class TextInputElement extends RazdElement {
    constructor(x, y, width, height, name, text, style, parent, action, url) {
        super({
            x, y, width, height, name, text, style, parent, action, url,
            type: 'TextInput'
        });
        
        this.cursorPos = 0;
        this.showCursor = false;
        this.cursorBlinkRate = 500; // ms
        this.lastBlinkTime = 0;
        this.placeholder = '';
    }

    draw(ctx, x, y) {
        if (!this.visible) return;
        
        ctx.save();

        // Draw the base element (background and border)
        super.draw(ctx, x, y);

        // Draw text or placeholder
        const padding = 5;
        if (this.text && this.style) {
            // Draw text
            ctx.fillStyle = this.style.foregroundColor || 'black';
            ctx.font = `${this.style.fontWeight || 'normal'} ${this.style.fontSize || 14}px ${this.style.fontFamily || 'Arial'}`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, x + padding, y + this.height / 2);
            
            // Draw cursor if focused and visible
            if (this.isFocused && this.showCursor) {
                // Calculate cursor position based on text width
                const textBeforeCursor = this.text.substring(0, this.cursorPos);
                const textMetrics = ctx.measureText(textBeforeCursor);
                const cursorX = x + padding + textMetrics.width;
                
                ctx.fillStyle = this.style.foregroundColor || 'black';
                ctx.fillRect(cursorX, y + padding, 1, this.height - (padding * 2));
            }
        } else if (this.placeholder && !this.isFocused && this.style) {
            // Draw placeholder text
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Grayed out
            ctx.font = `${this.style.fontWeight || 'normal'} ${this.style.fontSize || 14}px ${this.style.fontFamily || 'Arial'}`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.placeholder, x + padding, y + this.height / 2);
        }

        ctx.restore();
    }

    update(deltaTime) {
        // Cursor blinking logic
        if (this.isFocused) {
            const now = performance.now();
            if (now - this.lastBlinkTime > this.cursorBlinkRate) {
                this.showCursor = !this.showCursor;
                this.lastBlinkTime = now;
                
                // Trigger redraw
                if (window.Razd) {
                    window.Razd.draw();
                }
            }
        } else {
            this.showCursor = false;
        }
    }
}

// Make the class globally available
if (typeof window !== 'undefined') {
    window.TextInputElement = TextInputElement;
}