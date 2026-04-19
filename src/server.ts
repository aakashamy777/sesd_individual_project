import app from "./app";
import { env } from "./utils/env";

app.listen(env.port, () => {
  // Keep startup logging minimal for scaffold.
  console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
});
