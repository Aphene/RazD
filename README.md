# Razd Framework

A simple JavaScript canvas UI framework based on the RazD API description. This implementation provides a lightweight, easy-to-use library for creating canvas-based web applications.

## Overview

Razd is a framework for building JavaScript Canvas apps that provides a component-based architecture similar to traditional web UI frameworks but rendered entirely on the HTML5 Canvas element.

## Features

- Element-based architecture (similar to DOM)
- Component hierarchy with parent/child relationships
- Style system for visual customization
- Event handling for user interactions
- Grid system for displaying lists of data
- Book/page navigation for multi-screen applications
- Form input elements (TextInput, PasswordInput)

## Getting Started

1. Include the Razd scripts in your HTML:

```html
<script src="razd-core.js"></script>
<script src="razd-elements.js"></script>
```

2. Initialize the Razd framework:

```javascript
// Create a new instance of Razd
const razdInstance = new RazD();

// Initialize the framework
const app = razdInstance.init();

// Define app startup function
app.onStart = () => {
  // Your application code here
};
```

## Core Components

### Element

The base class for all visual components.

```javascript
Razd.CreateElement({
  type: "Element",
  x: 10,
  y: 10,
  width: 100,
  height: 30,
  name: "myElement",
  text: "Hello World",
  style: app.defaultStyle,
  parent: app.root,
  action: (element) => {
    console.log("Element clicked");
  }
});
```

### Text

For displaying text content.

```javascript
Razd.CreateText(
  10, 10, 100, 30,
  "myText", "Hello World",
  app.defaultStyle, app.root
);
```

### Button

Interactive button element.

```javascript
Razd.CreateButton(
  10, 10, 100, 30,
  "myButton", "Click Me",
  app.defaultStyle, app.root,
  (button) => {
    console.log("Button clicked");
  }
);
```

### TextInput

Text input field for user input.

```javascript
Razd.CreateTextInput(
  10, 10, 200, 30,
  "myInput", "",
  app.defaultStyle, app.root
);
```

### Panel

Container for other elements.

```javascript
Razd.CreatePanel(
  10, 10, 300, 200,
  "myPanel", "",
  app.defaultStyle, app.root
);
```

### Book

Container for multiple pages, with only one page visible at a time.

```javascript
const book = Razd.CreateBook(
  0, 0, 500, 500,
  "myBook", "",
  app.defaultStyle, app.root
);

// Add pages to the book
Razd.AddPage(book, "Page1");
Razd.AddPage(book, "Page2");

// Switch between pages
Razd.SetCurrentPage(book, "Page2");
```

### Grid

Container for displaying lists of data with a template.

```javascript
// Create grid
const grid = Razd.CreateGrid(
  10, 10, 300, 400,
  "myGrid", "",
  app.defaultStyle, app.root
);

// Create template panel
const template = Razd.CreatePanel(
  0, 0, 300, 40,
  "myTemplate", "",
  app.defaultStyle, grid
);

// Add elements to template (use {propertyName} for data binding)
Razd.CreateText(
  10, 10, 200, 20,
  "ItemText", "{text}",
  app.defaultStyle, template
);

// Add template to grid
Razd.AddTemplateToGrid(grid, template);

// Populate grid with data
const data = [
  { id: 1, text: "Item 1" },
  { id: 2, text: "Item 2" },
  { id: 3, text: "Item 3" }
];

Razd.PopulateGrid(grid, data, (e) => {
  // Optional callback for each item
  console.log("Item created:", e.element, e.data, e.gridIndex);
});
```

## Styling

Create and customize styles:

```javascript
// Create a new style based on the default style
const customStyle = app.defaultStyle.copy();
customStyle.backgroundColor = "#4CAF50";
customStyle.foregroundColor = "#FFFFFF";
customStyle.borderColor = "#45a049";
customStyle.fontSize = 16;
customStyle.fontWeight = "bold";
customStyle.alignment = "center";
customStyle.borderWidth = 2;
customStyle.borderCurvature = 10;

// Apply the style to an element
app.myElement.style = customStyle;
```

## Example Application

See the included `todoApp.html` for a simple Todo list application that demonstrates the core features of the Razd framework.

## License

This code is provided for educational purposes.

