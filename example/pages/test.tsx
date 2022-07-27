import { useEffect, useState } from "react";
import { ApiTestGET } from "../shared/responseTypes";
import { StandardErrorResponse } from "../server/types/responses";
import { useRouter } from "next/router";

const TestPage = () => {
  const [data, setData] = useState<ApiTestGET | StandardErrorResponse | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const id = router.query.id;

    const controller = new AbortController();
    fetch(`/api/test${id ? "?id=" + id : ""} `, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {});

    return () => controller.abort();
  }, [router]);

  return (
    <div>
      <p>Testing the client</p>
      {data ? (
        <div>
          <h1>Success = {JSON.stringify(data.success)}</h1>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {data && (
        <>
          <p>{data.success ? "Success:" : "Error:"}</p>
          <pre>{JSON.stringify(data, null, 4)}</pre>
        </>
      )}
    </div>
  );
};

export default TestPage;
