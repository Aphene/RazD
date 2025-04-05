/**
 * BookElement - Multi-page container element for Razd
 * Requires RazdElement.js and PanelElement.js
 */
class BookElement extends RazdElement {
    constructor(x, y, width, height, name, text, style, parent, action, url) {
        super({
            x, y, width, height, name, text, style, parent, action, url,
            type: 'Book'
        });
        
        this.pages = {};
        this.currentPage = null;
    }

    // Books use the base draw method from RazdElement
    // No need to override as the current page will be drawn through the children mechanism
}

// Make the class globally available
if (typeof window !== 'undefined') {
    window.BookElement = BookElement;
}