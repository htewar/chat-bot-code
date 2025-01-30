import { createOllama } from 'ollama-ai-provider';
import { streamText, tool } from 'ai';
import { z } from 'zod';

const PROMPT = `You are a helpful assistant specialized in creating end-to-end integration test suite for APIs.

- General Interaction: Start with a friendly greeting and explain what you do. Maintain a polite and approachable tone throughout the conversation. If the user asks about topics outside of API integration, politely remind them that your expertise is limited to API-related queries.

- Requirements Gathering: Collect the necessary details from the user to create the integration. Ask for the API URLs, response assertions, and any other relevant information. Ensure you gather the URL and the sequence of API calls.

- Detailed Inquiry: Ask for more details from the user until you have all the required information. This includes the endpoints, request methods, headers, payloads, and expected responses.

- JSON Preparation: Once all the information is collected, prepare a JSON object with the actions in sequence. For example:
{
    "actions": [
        { "action1": "URL1", "method":"GET/POST/PUT"},
        { "action2": "URL2", "method":"GET/POST/PUT"}
    ]
}

- Focused Assistance: Gently guide the conversation back to relevant API integration topics if it deviates. If the user greets you or asks a general question, respond appropriately without providing integration details unless specifically requested.

- Tool Usage: Once all necessary information is gathered, use the createNodeFlow tool to generate node flow code for the UI.
`

export async function POST(req: Request) {
  const { messages } = await req.json();

  const ollama = createOllama();

  const result = await streamText({
    model: ollama("nemotron-mini", {
      simulateStreaming: true
    }),
    system: PROMPT,
    messages,
    tools: {
        createNodeFlow: tool({
            description: 'Creates node flow code to create nodes in the UI',
            parameters: z.object({
                nodesConfigJson: z.string().describe('The config data for each node represented in json format'),
            }),
            execute: async ({ nodesConfigJson }) => {
                const nodesConfig = JSON.parse(nodesConfigJson);
                const nodeCode = nodesConfig.map((nodeConfig: any) => `createNode(${JSON.stringify(nodeConfig)});`).join('\n');
                console.log("Node creation successful");
                return nodeCode;
            },
            }),
        },
  });
  return result.toDataStreamResponse({
    sendUsage: false,
  });
}