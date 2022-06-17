export const getHeight = (event) => {
  return event.target.offsetHeight + (event.target.offsetTop) * 2;
};

export const getCaretPos = (event) => {
  let caretPos = 0;
  const selection = window.getSelection();
  if(selection && selection.rangeCount > 0) {
    const range = window.getSelection().getRangeAt(0);
    range.setStart(event.target, 0);
    caretPos = range.toString().length;
  }

  return caretPos;
};