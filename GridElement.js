/**
 * GridElement - Grid container for displaying lists of data
 * Requires RazdElement.js and PanelElement.js
 */
class GridElement extends RazdElement {
    constructor(x, y, width, height, name, text, style, parent, action, url) {
        super({
            x, y, width, height, name, text, style, parent, action, url,
            type: 'Grid'
        });
        
        this.templatePanel = null;
        this.data = [];
    }

    // Grids use the base draw method from RazdElement
    // The actual grid content is drawn through the children mechanism
    
    // Method to clone the template panel for each data item
    cloneTemplate(item, index) {
        if (!this.templatePanel) {
            console.error('No template panel set for grid:', this.name);
            return null;
        }
        
        // Create a deep clone of the template
        const clonedPanel = this._cloneElement(this.templatePanel);
        
        // Update properties for the new item
        clonedPanel.name = `${this.name}_${index}`;
        clonedPanel.y = this.templatePanel.y + (index * this.templatePanel.height);
        clonedPanel.gridIndex = index;
        clonedPanel.visible = true;
        
        // Replace template variables in text
        this._replaceTemplateVariables(clonedPanel, item);
        
        return clonedPanel;
    }
    
    // Helper method to recursively clone an element
    _cloneElement(sourceElement) {
        // Determine the appropriate constructor based on element type
        let ElementConstructor;
        switch (sourceElement.type) {
            case 'Text':
                ElementConstructor = TextElement;
                break;
            case 'Button':
                ElementConstructor = ButtonElement;
                break;
            case 'Image':
                ElementConstructor = ImageElement;
                break;
            case 'TextInput':
                ElementConstructor = TextInputElement;
                break;
            case 'PasswordInput':
                ElementConstructor = PasswordInputElement;
                break;
            case 'Panel':
                ElementConstructor = PanelElement;
                break;
            case 'Book':
                ElementConstructor = BookElement;
                break;
            case 'Grid':
                ElementConstructor = GridElement;
                break;
            default:
                ElementConstructor = RazdElement;
        }
        
        // Create a new element of the same type
        const clone = new ElementConstructor(
            sourceElement.x,
            sourceElement.y,
            sourceElement.width,
            sourceElement.height,
            sourceElement.name,
            sourceElement.text,
            sourceElement.style,
            null, // Don't set parent yet
            sourceElement.action,
            sourceElement.url
        );
        
        // Clone children recursively
        if (sourceElement.children && sourceElement.children.length > 0) {
            for (let i = 0; i < sourceElement.children.length; i++) {
                const childClone = this._cloneElement(sourceElement.children[i]);
                childClone.parent = clone;
                clone.children.push(childClone);
            }
        }
        
        return clone;
    }
    
    // Helper method to replace template variables in an element's text
    _replaceTemplateVariables(element, data) {
        // Replace template variables in text
        if (element.text) {
            for (const key in data) {
                const pattern = new RegExp(`\\{${key}\\}`, 'g');
                element.text = element.text.replace(pattern, data[key]);
            }
        }
        
        // Process children recursively
        if (element.children && element.children.length > 0) {
            for (let i = 0; i < element.children.length; i++) {
                this._replaceTemplateVariables(element.children[i], data);
            }
        }
    }
}

// Make the class globally available
if (typeof window !== 'undefined') {
    window.GridElement = GridElement;
}