/**
 * PasswordInputElement - Password input field for Razd
 * Requires RazdElement.js and TextInputElement.js
 */
class PasswordInputElement extends TextInputElement {
    constructor(x, y, width, height, name, text, style, parent, action, url) {
        super(x, y, width, height, name, text, style, parent, action, url);
        this.type = 'PasswordInput';
    }

    draw(ctx, x, y) {
        if (!this.visible) return;
        
        ctx.save();

        // Draw the base element (background and border)
        super.draw(ctx, x, y);

        // Override text drawing to show password mask
        const padding = 5;
        if (this.text && this.style) {
            // Create masked text (bullets)
            const maskedText = '•'.repeat(this.text.length);
            
            // Draw masked text
            ctx.fillStyle = this.style.foregroundColor || 'black';
            ctx.font = `${this.style.fontWeight || 'normal'} ${this.style.fontSize || 14}px ${this.style.fontFamily || 'Arial'}`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(maskedText, x + padding, y + this.height / 2);
            
            // Draw cursor if focused and visible
            if (this.isFocused && this.showCursor) {
                // Calculate cursor position based on masked text width
                const textBeforeCursor = maskedText.substring(0, this.cursorPos);
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
}

// Make the class globally available
if (typeof window !== 'undefined') {
    window.PasswordInputElement = PasswordInputElement;
}