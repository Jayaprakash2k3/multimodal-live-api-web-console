import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";

export const computerControlDeclarations: FunctionDeclaration[] = [
  {
    name: "mouse_move",
    description: "Move the mouse cursor to specific coordinates",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        x: { type: SchemaType.INTEGER, description: "X coordinate" },
        y: { type: SchemaType.INTEGER, description: "Y coordinate" },
        duration: { 
          type: SchemaType.NUMBER, 
          description: "Duration of movement in seconds",
        }
      },
      required: ["x", "y"]
    }
  },
  {
    name: "mouse_click",
    description: "Click the mouse at current or specified position",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        x: { type: SchemaType.INTEGER, description: "Optional X coordinate" },
        y: { type: SchemaType.INTEGER, description: "Optional Y coordinate" },
        button: { 
          type: SchemaType.STRING, 
          description: "Mouse button to click (left/right)",
        }
      }
    }
  },
  {
    name: "keyboard_type",
    description: "Type text using keyboard",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        text: { type: SchemaType.STRING, description: "Text to type" },
        interval: { 
          type: SchemaType.NUMBER, 
          description: "Interval between keystrokes in seconds",
        }
      },
      required: ["text"]
    }
  },
  {
    name: "keyboard_hotkey",
    description: "Press a combination of keys",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        keys: { 
          type: SchemaType.ARRAY, 
          items: { type: SchemaType.STRING },
          description: "Array of keys to press together"
        }
      },
      required: ["keys"]
    }
  }
];
