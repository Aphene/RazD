/**
 * Razd.js - CSP-friendly implementation of the Razd Framework
 * This is the core file that works with the modular structure
 */

/**
 * RazD - Main class for the framework
 */
class RazD {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.initialized = false;
    this.app = null;
    
    // Global element storage
    window.global = window.global || {};
    window.global.elements = [];
    window.global.elementTable = {};
  }

  /**
   * Initialize the RazD framework
   * @returns {Object} The application object
   */
  init() {
    if (this.initialized) return this.app;
    
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.width = 500;
    this.canvas.height = 500;
    document.body.appendChild(this.canvas);
    
    // Get 2D context
    this.ctx = this.canvas.getContext('2d');
    
    // Initialize the app object
    this.app = {
      draw: () => this.draw(),
      onStart: () => {}
    };
    
    // Create default style
    this.app.defaultStyle = new Style({
      backgroundColor: 'white',
      foregroundColor: 'black',
      borderColor: 'black',
      fontSize: 14,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      alignment: 'center',
      borderWidth: 1,
      borderCurvature: 5
    });
    
    // Setup the global reference to Razd
    window.Razd = this;
    
    // Register element classes with Razd
    if (typeof RazdElement !== 'undefined') this.RazdElement = RazdElement;
    if (typeof TextElement !== 'undefined') this.TextElement = TextElement;
    if (typeof ButtonElement !== 'undefined') this.ButtonElement = ButtonElement;
    if (typeof PanelElement !== 'undefined') this.PanelElement = PanelElement;
    if (typeof BookElement !== 'undefined') this.BookElement = BookElement;
    if (typeof GridElement !== 'undefined') this.GridElement = GridElement;
    if (typeof TextInputElement !== 'undefined') this.TextInputElement = TextInputElement;
    if (typeof PasswordInputElement !== 'undefined') this.PasswordInputElement = PasswordInputElement;
    if (typeof ImageElement !== 'undefined') this.ImageElement = ImageElement;
    
    // Create the root element (a Book)
    const root = this.CreateElement({
      type: 'Book',
      x: 0,
      y: 0,
      width: 500,
      height: 500,
      name: 'root',
      text: '',
      style: this.app.defaultStyle,
      parent: null
    });
    
    // Add the root to the app object
    this.app.root = root;
    
    // Add the first page to the root book
    this.AddPage(root, 'Page1');
    
    // Set up alias for easier access in code ($ shorthand)
    this.setupAliases();
    
    // Add event listeners
    this.setupEventListeners();
    
    this.initialized = true;
    
    // Call onStart when ready
    setTimeout(() => {
      if (typeof this.app.onStart === 'function') {
        this.app.onStart();
      }
    }, 0);
    
    return this.app;
  }
  
  /**
   * Set up $ shortcuts for elements
   */
  setupAliases() {
    // Add app properties to window with $ prefix
    for (const key in this.app) {
      if (this.app.hasOwnProperty(key)) {
        window['$' + key] = this.app[key];
      }
    }
    
    // Set up a proxy to handle new properties
    const appHandler = {
      set: (target, prop, value) => {
        target[prop] = value;
        window['$' + prop] = value;
        return true;
      }
    };
    
    this.app = new Proxy(this.app, appHandler);
  }
  
  /**
   * Set up event listeners for user interactions
   */
  setupEventListeners() {
    const canvas = this.canvas;
    
    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      
      // Get coordinates
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Find the topmost element at this position
      const element = this.getElementAtPosition(x, y);
      
      if (element) {
        // Handle action if defined
        if (typeof element.action === 'function') {
          element.action(element);
        }
        
        // Dispatch the event
        this.dispatchEvent(element, 'pointerdown', { x, y });
      }
    });

    // Mouse move event
    canvas.addEventListener('mousemove', (e) => {
      e.preventDefault();
      
      // Get coordinates
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Find the topmost element at this position
      const element = this.getElementAtPosition(x, y);
      
      if (element) {
        // Dispatch the event
        this.dispatchEvent(element, 'pointermove', { x, y });
      }
    });

    // Mouse up event
    canvas.addEventListener('mouseup', (e) => {
      e.preventDefault();
      
      // Get coordinates
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Find the topmost element at this position
      const element = this.getElementAtPosition(x, y);
      
      if (element) {
        // Dispatch the event
        this.dispatchEvent(element, 'pointerup', { x, y });
      }
    });
  }
  
  /**
   * Dispatch an event to an element
   */
  dispatchEvent(element, eventType, data) {
    const eventHandlerName = 'on' + eventType;
    if (typeof element[eventHandlerName] === 'function') {
      element[eventHandlerName](data);
    }
  }
  
  /**
   * Get the topmost element at a given position
   */
  getElementAtPosition(x, y) {
    // Iterate from last (top) to first (bottom)
    for (let i = global.elements.length - 1; i >= 0; i--) {
      const element = global.elements[i];
      
      // Skip invisible elements
      if (!element.visible) continue;
      
      // Get absolute position including parent offsets
      const absPos = this.getAbsolutePosition(element);
      
      // Check if point is within element bounds
      if (
        x >= absPos.x && 
        x <= absPos.x + element.width && 
        y >= absPos.y && 
        y <= absPos.y + element.height
      ) {
        return element;
      }
    }
    
    return null;
  }
  
  /**
   * Get absolute position of an element
   */
  getAbsolutePosition(element) {
    let x = element.x;
    let y = element.y;
    let parent = element.parent;
    
    while (parent) {
      x += parent.x;
      y += parent.y;
      parent = parent.parent;
    }
    
    return { x, y };
  }
  
  /**
   * Create a new element
   */
  CreateElement(options) {
    const {
      type,
      x = 0,
      y = 0,
      width = 0,
      height = 0,
      name,
      text = '',
      style,
      parent,
      action,
      url
    } = options;
    
    // Resolve style reference if it's a string
    let styleObj = style;
    if (typeof style === 'string') {
      styleObj = this.app[style] || this.app.defaultStyle;
    }
    
    // Resolve parent reference if it's a string
    let parentObj = parent;
    if (typeof parent === 'string') {
      parentObj = this.app[parent] || this.app.root;
    }
    
    // Create the appropriate element type
    let element;
    switch (type.toLowerCase()) {
      case 'text':
        element = new TextElement(x, y, width, height, name, text, styleObj, parentObj, action, url);
        break;
      case 'button':
        element = new ButtonElement(x, y, width, height, name, text, styleObj, parentObj, action, url);
        break;
      case 'image':
        element = new ImageElement(x, y, width, height, name, text, styleObj, parentObj, action, url);
        break;
      case 'textinput':
        element = new TextInputElement(x, y, width, height, name, text, styleObj, parentObj, action, url);
        break;
      case 'passwordinput':
        element = new PasswordInputElement(x, y, width, height, name, text, styleObj, parentObj, action, url);
        break;
      case 'panel':
        element = new PanelElement(x, y, width, height, name, text, styleObj, parentObj, action, url);
        break;
      case 'book':
        element = new BookElement(x, y, width, height, name, text, styleObj, parentObj, action, url);
        break;
      case 'grid':
        element = new GridElement(x, y, width, height, name, text, styleObj, parentObj, action, url);
        break;
      default:
        element = new RazdElement({
          x, y, width, height, name, text, style: styleObj, parent: parentObj, action, url
        });
    }
    
    // Add the element to the app for easy access
    if (name) {
      this.app[name] = element;
      window['$' + name] = element; // Set up $ shortcut
    }
    
    return element;
  }
  
  /**
   * Create multiple elements from an array of element definitions
   */
  CreateElements(elements) {
    if (typeof elements === 'string') {
      // If it's a URL, fetch the JSON
      fetch(elements)
        .then(response => response.json())
        .then(data => {
          data.forEach(element => this.CreateElement(element));
          this.draw();
        })
        .catch(error => console.error('Error loading elements:', error));
      return;
    }
    
    // If it's an array, create each element
    if (Array.isArray(elements)) {
      elements.forEach(element => this.CreateElement(element));
    }
  }
  
  /**
   * Convenience method to create a Text element
   */
  CreateText(x, y, width, height, name, text, style, parent, action, url) {
    return this.CreateElement({
      type: 'Text',
      x, y, width, height, name, text, style, parent, action, url
    });
  }
  
  /**
   * Convenience method to create a Button element
   */
  CreateButton(x, y, width, height, name, text, style, parent, action, url) {
    return this.CreateElement({
      type: 'Button',
      x, y, width, height, name, text, style, parent, action, url
    });
  }
  
  /**
   * Convenience method to create a TextInput element
   */
  CreateTextInput(x, y, width, height, name, text, style, parent, action, url) {
    return this.CreateElement({
      type: 'TextInput',
      x, y, width, height, name, text, style, parent, action, url
    });
  }
  
  /**
   * Convenience method to create a Panel element
   */
  CreatePanel(x, y, width, height, name, text, style, parent, action, url) {
    return this.CreateElement({
      type: 'Panel',
      x, y, width, height, name, text, style, parent, action, url
    });
  }
  
  /**
   * Convenience method to create a Book element
   */
  CreateBook(x, y, width, height, name, text, style, parent, action, url) {
    return this.CreateElement({
      type: 'Book',
      x, y, width, height, name, text, style, parent, action, url
    });
  }
  
  /**
   * Convenience method to create a Grid element
   */
  CreateGrid(x, y, width, height, name, text, style, parent, action, url) {
    return this.CreateElement({
      type: 'Grid',
      x, y, width, height, name, text, style, parent, action, url
    });
  }
  
  /**
   * Add a template panel to a grid
   */
  AddTemplateToGrid(grid, templatePanel) {
    if (!grid || grid.type !== 'Grid') {
      console.error('AddTemplateToGrid: First argument must be a Grid element');
      return;
    }
    
    if (!templatePanel || templatePanel.type !== 'Panel') {
      console.error('AddTemplateToGrid: Second argument must be a Panel element');
      return;
    }
    
    grid.templatePanel = templatePanel;
  }
  
  /**
   * Add a page to a book
   */
  AddPage(book, pageName) {
    if (!book || book.type !== 'Book') {
      console.error('AddPage: First argument must be a Book element');
      return;
    }
    
    const page = new PanelElement(0, 0, book.width, book.height, pageName, '', book.style, book, null, null);
    book.pages = book.pages || {};
    book.pages[pageName] = page;
    
    // Set as current page if it's the first page
    if (Object.keys(book.pages).length === 1) {
      this.SetCurrentPage(book, pageName);
    }
    
    return page;
  }
  
  /**
   * Set the current page of a book
   */
  SetCurrentPage(book, pageName) {
    if (!book || book.type !== 'Book') {
      console.error('SetCurrentPage: First argument must be a Book element');
      return;
    }
    
    if (!book.pages || !book.pages[pageName]) {
      console.error(`SetCurrentPage: Page "${pageName}" not found in book`);
      return;
    }
    
    // Hide all pages
    for (const pageKey in book.pages) {
      book.pages[pageKey].visible = false;
    }
    
    // Show the selected page
    book.pages[pageName].visible = true;
    book.currentPage = pageName;
  }
  
  /**
   * CSP-friendly Populate a grid with data
   * Avoids using eval() or Function() constructors
   */
  PopulateGrid(grid, data, populateCallback) {
    if (!grid || grid.type !== 'Grid') {
      console.error('PopulateGrid: First argument must be a Grid element');
      return;
    }
    
    if (!grid.templatePanel) {
      console.error('PopulateGrid: Grid has no template panel');
      return;
    }
    
    // Store data reference
    grid.data = data;
    
    // Remove existing list elements
    const childrenToKeep = [];
    for (let i = 0; i < grid.children.length; i++) {
      const child = grid.children[i];
      if (child !== grid.templatePanel) {
        // Remove from global elements
        const index = global.elements.indexOf(child);
        if (index !== -1) {
          global.elements.splice(index, 1);
        }
        
        // Remove from global elementTable
        if (child.id && global.elementTable[child.id]) {
          delete global.elementTable[child.id];
        }
      } else {
        childrenToKeep.push(child);
      }
    }
    
    // Reset children to just the template
    grid.children = childrenToKeep;
    
    // Hide the template
    grid.templatePanel.visible = false;
    
    // Clone template for each data item
    const templateY = grid.templatePanel.y;
    
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      
      // Use the grid's cloneTemplate method
      const listItem = grid.cloneTemplate(item, i);
      
      // Update y position
      listItem.y = templateY + (i * grid.templatePanel.height);
      
      // Add to parent
      listItem.parent = grid;
      grid.children.push(listItem);
      
      // Add to app reference
      this.app[listItem.name] = listItem;
      window['$' + listItem.name] = listItem;
      
      // Call populate callback if provided
      if (typeof populateCallback === 'function') {
        populateCallback({
          element: listItem,
          data: item,
          gridIndex: i
        });
      }
    }
    
    // Trigger a redraw
    this.draw();
  }
  
  /**
   * Draw all visible elements
   */
  draw() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw all visible elements starting from root
    this.drawElement(this.app.root);
  }
  
  /**
   * Draw a specific element and its children
   */
  drawElement(element) {
    if (!element || !element.visible) return;
    
    // Get absolute position
    const pos = this.getAbsolutePosition(element);
    
    // Draw the element
    element.draw(this.ctx, pos.x, pos.y);
    
    // Draw children
    if (element.children && element.children.length > 0) {
      for (let i = 0; i < element.children.length; i++) {
        this.drawElement(element.children[i]);
      }
    }
  }
  
  /**
   * Get element by ID
   */
  getElementById(id) {
    return global.elementTable[id] || null;
  }
  
  /**
   * Add an element to the global elements array
   */
  addElement(element) {
    if (element && !global.elements.includes(element)) {
      global.elements.push(element);
      if (element.id) {
        global.elementTable[element.id] = element;
      }
    }
  }
  
  /**
   * Set focus to an element
   */
  setFocus(element) {
    // Blur currently focused element
    for (let i = 0; i < global.elements.length; i++) {
      if (global.elements[i].isFocused) {
        global.elements[i].blur();
      }
    }
    
    // Focus new element
    if (element) {
      element.focus();
    }
  }
  
  /**
   * Update state (for reactive updates)
   */
  setState(newState) {
    if (!this.state) {
      this.state = {};
    }
    
    // Merge new state with existing state
    Object.assign(this.state, newState);
    
    // Trigger redraw
    this.draw();
    
    return this.state;
  }
}

/**
 * Style class - Manages visual properties
 */
class Style {
  constructor(options = {}) {
    // Default values
    this.backgroundColor = options.backgroundColor || 'white';
    this.foregroundColor = options.foregroundColor || 'black';
    this.borderColor = options.borderColor || 'black';
    this.backgroundGradientColorA = options.backgroundGradientColorA || null;
    this.backgroundGradientColorB = options.backgroundGradientColorB || null;
    this.backgroundImageUrl = options.backgroundImageUrl || null;
    this.fontSize = options.fontSize || 14;
    this.fontFamily = options.fontFamily || 'Arial';
    this.fontWeight = options.fontWeight || 'normal';
    this.alignment = options.alignment || 'center';
    this.borderWidth = options.borderWidth !== undefined ? options.borderWidth : 1;
    this.borderCurvature = options.borderCurvature !== undefined ? options.borderCurvature : 5;
  }
  
  /**
   * Create a copy of this style
   */
  copy() {
    return new Style({
      backgroundColor: this.backgroundColor,
      foregroundColor: this.foregroundColor,
      borderColor: this.borderColor,
      backgroundGradientColorA: this.backgroundGradientColorA,
      backgroundGradientColorB: this.backgroundGradientColorB,
      backgroundImageUrl: this.backgroundImageUrl,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight,
      alignment: this.alignment,
      borderWidth: this.borderWidth,
      borderCurvature: this.borderCurvature
    });
  }
}