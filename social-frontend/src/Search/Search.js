import React, { useState } from 'react';

import Input from '../shared/components/FormElements/Input';
import SearchList from './SearchList';

const Search = (props) => {
  const [input, setInput] = useState('');

  return (
    <div>
      <Input
        onChange={(event) => setInput(event.target.value.toLowerCase())}
        type="text"
        withoutLabel
        placeholder="Search ..."
      />
      <SearchList input={input} />
    </div>
  );
};

export default Search;
