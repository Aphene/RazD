/**
 * PanelElement - Container element for Razd
 * Requires RazdElement.js
 */
class PanelElement extends RazdElement {
    constructor(x, y, width, height, name, text, style, parent, action, url) {
        super({
            x, y, width, height, name, text, style, parent, action, url,
            type: 'Panel'
        });
    }

    // Panels use the base draw method from RazdElement
    // Override if specific panel drawing behavior is needed
}

// Make the class globally available
if (typeof window !== 'undefined') {
    window.PanelElement = PanelElement;
}