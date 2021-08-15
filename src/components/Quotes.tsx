import { Scheduler } from "async-scheduler";
import { useCallback, useEffect, useState } from "react";
import useInterval from "react-useinterval";
import { IQuote } from "./Quote";

const DELAY_MS = 5000; // ms
const MAX_COUNT = 10;
const MAX_CONCURRENT_TASKS = 3;

const scheduler = new Scheduler(MAX_CONCURRENT_TASKS);

function Quotes() {
  const getRandomQuote = useCallback(async (): Promise<IQuote> => {
    const res = await fetch("https://api.quotable.io/random");
    const json = await res.json();

    return json as IQuote;
  }, []);

  const getRandomQuotes = useCallback(
    async (count: number): Promise<IQuote[]> => {
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(scheduler.enqueue(() => getRandomQuote()));
      }
      return Promise.all(promises);
    },
    [getRandomQuote]
  );

  const [quotes, setQuotes] = useState<IQuote[]>();

  useEffect(() => {
    const fetchRandomQuotes = async () => {
      setQuotes(await getRandomQuotes(MAX_COUNT));
    };
    fetchRandomQuotes();
  }, [getRandomQuotes]);

  useInterval(async () => {
    const randomQuotes = await getRandomQuotes(MAX_COUNT);
    setQuotes(randomQuotes);
  }, DELAY_MS);

  return (
    <div>
      {quotes?.map((quote: IQuote) => (
        <div>
          <p>{quote?.content}</p>
          <p>{quote?.author}</p>
        </div>
      ))}
    </div>
  );
}

export default Quotes;
