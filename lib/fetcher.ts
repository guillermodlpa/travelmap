import { Fetcher } from 'swr';

// const fetcher: Fetcher<TravelMap[], string> = (url) => fetch(url).then((r) => r.json());

function getFetcher<T>() {
  const fetcher: Fetcher<T, string> = async (url) => {
    const res = await fetch(url);

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const errorResponse = await res.json();
      console.error('Error response', res.status, errorResponse);

      throw new Error(`An error occurred while fetching the data. HTTP ${res.status}.}`);
    }

    return res.json();
  };
  return fetcher;
}

export default getFetcher;
