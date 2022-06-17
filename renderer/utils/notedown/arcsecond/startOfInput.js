import * as A from "arcsecond";

// Custom parser startOfInput
const updateError = (state, error) => ({ ...state, isError: true, error });
const startOfInput = new A.Parser((state) => {
  if (state.isError) return state;

  const { index } = state;

  if(index > 0) {
    return updateError(
      state,
      `ParseError 'startOfInput' (position ${index}): Expected start of input but got index '${index}'`
    )
  }

  return state;
});

export default startOfInput;