export const toggleCheckbox = (content = '') => {
  const hasUncheckedBox = /^\[ \]/.test(content);
  const hasCheckedBox = /^\[X\]/.test(content) || /^\[x\]/.test(content);

  if(!hasUncheckedBox && !hasCheckedBox) {
    return {
      transition: 'nothing->checked',
      content: `[ ] ${content}`
    };
  }

  if(hasCheckedBox) {
    let newContent = content.slice(3);
    return {
      transition: 'checked->nothing',
      content: newContent.trim()
    };
  }

  if(hasUncheckedBox) {
    let newContent = content.slice(3);
    return {
      transition: 'unchecked->checked',
      content: `[x] ${newContent.trim()}`
    };
  }
}