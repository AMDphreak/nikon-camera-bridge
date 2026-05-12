import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main class="page prose">
      <Title>Not found</Title>
      <HttpStatusCode code={404} />
      <h1>Page not found</h1>
      <p>
        <A href="/">Back to home</A>
      </p>
    </main>
  );
}
