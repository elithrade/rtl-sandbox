import { useCallback, useEffect, useState } from "react";
import useInterval from "react-useinterval";

export interface IQuote {
  _id: string;
  tags: string[];
  content: string;
  author: string;
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
}

const DELAY_MS = 5000; // ms

function Quote() {
  const getRandomQuote = useCallback(async (): Promise<IQuote> => {
    const res = await fetch("https://api.quotable.io/random");
    const json = await res.json();

    return json as IQuote;
  }, []);

  const [quote, setQuote] = useState<IQuote>();
  useEffect(() => {
    const fetchRandomQuote = async () => {
      setQuote(await getRandomQuote());
    };
    fetchRandomQuote();
  }, [getRandomQuote]);

  useInterval(async () => {
    const randomQuote = await getRandomQuote();
    console.log("useInterval");
    setQuote(randomQuote);
  }, DELAY_MS);

  return (
    <div>
      <p>{quote?.content}</p>
      <p>{quote?.author}</p>
    </div>
  );
}

export default Quote;
