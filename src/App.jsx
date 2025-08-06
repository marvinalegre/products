import { useFetcher, useLoaderData } from "react-router";
import { Button } from "@/components/ui/button";

function App() {
  const fetcher = useFetcher();
  const { username } = useLoaderData();
  const isLoggedIn = username ? true : false;

  return (
    <>
      <h1>home page</h1>
      {isLoggedIn && (
        <>
          <p>username: {username}</p>
          <fetcher.Form method="post" action="/logout">
            <Button>log out</Button>
          </fetcher.Form>
        </>
      )}
    </>
  );
}

export default App;
