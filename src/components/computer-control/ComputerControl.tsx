import { useEffect, memo } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { computerControlDeclarations } from "../../tools/ComputerControl";
import { ToolCall } from "../../multimodal-live-types";

function ComputerControlComponent() {
  const { client, setConfig } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      systemInstruction: {
        parts: [
          {
            text: ' You are a Computer Control Agent, capable of controlling the mouse and keyboard. You can move the mouse, click, type text, and press hotkeys. Use the "mouse_move", "mouse_click", "keyboard_type", and "keyboard_hotkey" functions to control the computer, I am using Mac OS. Do not ask me to the coordinates of the mouse each time, You have to calculate based on the pixels and roughly start moving it, use trail and error method to reach the place exactly' +
            'You can make multiple function calls at the same time.You can also use the "keyboard_type" function to type text. The "keyboard_hotkey" function can be used to press a combination of keys. For example, to press "Command + C", you would pass ["Command", "C"] as the "keys" parameter.'+
            'The instrucitons will not be simple like move the cursor, it will be like an action, you have to decide what has to be done multiple times to reach the goal. For example, if I say "Copy the text", you have to decide to move the cursor to the text, select the text, and press the hotkey to copy the text. You have to decide the steps to reach the goal. ',
          },
        ],
      },
      tools: [{ functionDeclarations: computerControlDeclarations }],
    });
  }, [setConfig]);

  useEffect(() => {
    const executeToolCall = async (toolCall: ToolCall) => {
      for (const fc of toolCall.functionCalls) {
        try {
          // Convert function name to endpoint path
          const endpoint = fc.name.split('_').join('/');
          
          const queryParams = new URLSearchParams(fc.args as Record<string, string>).toString();
          const response = await fetch(`http://localhost:8000/${endpoint}?${queryParams}`, {
            method: 'POST',
            headers: { 
              'Accept': 'application/json'
            },
            mode: 'cors'
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          client.sendToolResponse({
            functionResponses: [{
              id: fc.id,
              response: { output: result }
            }]
          });
        } catch (error) {
          console.error('Tool call execution failed:', error);
          client.sendToolResponse({
            functionResponses: [{
              id: fc.id,
              response: { error: String(error) }
            }]
          });
        }
      }
    };

    client.on("toolcall", executeToolCall);
    return () => {
      client.off("toolcall", executeToolCall);
    };
  }, [client]);

  // This component doesn't render anything visible
  return null;
}

export const ComputerControl = memo(ComputerControlComponent);
