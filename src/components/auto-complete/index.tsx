import './index.css'
import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "../../utility/debounce";

interface ResponsePartialModel {
  name: {
    common: string
  }
}

function AutoComplete() {
  const [input, setInput] = useState<string>("");
  const [suggestedArray, setSuggestedArray] = useState<Array<string>>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const ref = useRef(null);

  useEffect(() => {
    // Function to handle click events
    const handleClickOutside = (event) => {
      // Check if the click is outside the div
      if (ref.current && !ref.current.contains(event.target)) {
        setShowSuggestions(false); // Modify the state when clicked outside the div
      }
    };

    // Add event listener to the document
    document.addEventListener('click', handleClickOutside);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestions = async (value): Promise<void> => {
    try {
      // Abort the previous fetch request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current?.abort();
      }

      // Create a new AbortController instance
      abortControllerRef.current = new AbortController();

      // Perform the fetch request
      const res = await fetch(`https://restcountries.com/v3.1/name/${value}`, {
        signal: abortControllerRef.current?.signal
      });

      // Check if the response is successful
      if (res.status === 200) {
        const data = await res.json() as Array<ResponsePartialModel>;

        const suggestedArray = data.map(d => {
          return d.name.common
        });

        setSuggestedArray(suggestedArray);
      } else {
        // Handle non-200 response status
        console.error('Failed to fetch countries:', res.status);
        setSuggestedArray([]);
      }
    } catch (error) {
      // Check if the error is due to the request being aborted
      if (error.name === 'AbortError') {
        console.log('Fetch request aborted');
      } else {
        // Handle other fetch-related errors
        console.error('Fetch error:', error);
      }
    }
  }

  const fetchSuggestionsDebounced = useCallback(debounce(fetchSuggestions), [])

  return (
    <div id="auto-complete-container" ref={ref}>
      <input
        id="auto-complete-input-box"
        // type="search"
        value={input}
        placeholder="Search for a country"
        onChange={(e) => {
          setInput(e.target.value)
          const trimmedText = e.target.value.trim();
          fetchSuggestionsDebounced(trimmedText)
        }}
        onFocus={() => {
          setShowSuggestions(true)
        }}
      />
      {showSuggestions && suggestedArray.length > 0 && <ul id="suggested-list">
        {suggestedArray.map((suggestion, index) => {
          const matchIndex = suggestion.toLowerCase().indexOf(input.toLowerCase());
          const beforeMatch = suggestion.substring(0, matchIndex);
          const match = suggestion.substring(matchIndex, matchIndex + input.length);
          const afterMatch = suggestion.substring(matchIndex + input.length);

          if (matchIndex === -1) {
            return (
              <li
                key={index}
                onClick={() => {
                  setInput(suggestion);
                  setShowSuggestions(false);
                  setSuggestedArray([]);
                }}
              >
                {suggestion}
              </li>
            );
          }

          return (
            <li
              key={index}
              onClick={() => {
                setInput(suggestion);
                setShowSuggestions(false);
                setSuggestedArray([]);
              }}
            >
              {beforeMatch}
              <span style={{ fontWeight: 'bold' }}>{match}</span>
              {afterMatch}
            </li>
          );
        })}
      </ul>}
    </div>
  )
}

export default AutoComplete;
