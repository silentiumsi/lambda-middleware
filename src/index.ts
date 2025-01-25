import { handler } from "./handlers";

import { createEvent } from "./utils/create-event";
import { createContext } from "./utils/create-context";

const event = createEvent({
    body: JSON.stringify({ name: 'bobby', age: 30 })
});
const context = createContext();

const main = async () => {
    const result = await handler(event, context);
    console.log({ result })
}

main();