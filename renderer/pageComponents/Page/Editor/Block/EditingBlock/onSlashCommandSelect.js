import { position as caretPosition} from 'caret-pos';
import { format } from 'date-fns';
import last from 'lodash/last';

export const onSlashCommandSelect = (selectedCommand, textareaRef) => {
  const textareaCaretPos = caretPosition(textareaRef.current);
  let caretPos = textareaCaretPos.pos;
  let value = textareaRef.current.value || '';

  let valueBeforeCaret = value.substring(0, caretPos);
  let valueAfterCaret = value.substring(caretPos, value.length);

  const parts = valueBeforeCaret.split('/');
  if (parts && parts.length) {
    const searchKey = last(parts);
    valueBeforeCaret = value.substring(0, valueBeforeCaret.length - searchKey.length - 1) // 1 is for the slash itself;
    console.log('Before', caretPos);
    caretPos = caretPos - searchKey.length - 1;
    console.log('After', caretPos);
  }

  let newCaretPos;
  switch(selectedCommand.id) {
    case 'todo': {
      textareaRef.current.value = '[ ] ' + valueBeforeCaret + valueAfterCaret;
      newCaretPos = caretPos + 4;
      break;
    }
    case 'bold': {
      textareaRef.current.value = valueBeforeCaret + '****' + valueAfterCaret;
      newCaretPos = caretPos + 2;
      break;
    }
    case 'italic': {
      textareaRef.current.value = valueBeforeCaret + '**' + valueAfterCaret;
      newCaretPos = caretPos + 1;
      break;
    }
    case 'highlight': {
      textareaRef.current.value = valueBeforeCaret + '====' + valueAfterCaret;
      newCaretPos = caretPos + 2;
      break;
    }
    case 'strikethrough': {
      textareaRef.current.value = valueBeforeCaret + '~~~~' + valueAfterCaret;
      newCaretPos = caretPos + 2;
      break;
    }
    case 'currenttime' : {
      textareaRef.current.value = valueBeforeCaret + `${format(new Date(), "HH:mm")} ` + valueAfterCaret;
      newCaretPos = caretPos + 6;
      break;
    }
    case 'today' : {
      let today = new Date();
      let todayTitle = `[[${format(today, "d MMMM yyyy")}]]`;
      textareaRef.current.value = valueBeforeCaret + `${todayTitle} ` + valueAfterCaret;
      newCaretPos = caretPos + todayTitle.length + 1;
      break;
    }
    case 'yesterday' : {
      let today = new Date();
      let yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1);
      let yesterdayTitle = `[[${format(yesterday, "d MMMM yyyy")}]]`;
      textareaRef.current.value = valueBeforeCaret + `${yesterdayTitle} ` + valueAfterCaret;
      newCaretPos = caretPos + yesterdayTitle.length + 1;
      break;
    }
    case 'tomorrow' : {
      let today = new Date();
      let tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1);
      let tomorrowTitle = `[[${format(tomorrow, "d MMMM yyyy")}]]`;
      textareaRef.current.value = valueBeforeCaret + `${tomorrowTitle} ` + valueAfterCaret;
      newCaretPos = caretPos + tomorrowTitle.length + 1;
      break;
    }
  }

  textareaRef.current.selectionStart = newCaretPos;
  textareaRef.current.selectionEnd = newCaretPos;
};