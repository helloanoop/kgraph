import memoize from 'lodash/memoize';
import libslugify from 'slugify';
import urlSlug from 'url-slug';
import { isValid as isValidDate, parse } from 'date-fns';

/**
 * Slugify a string
 *
 * We use 'slugify', and then 'url-safe' to create a slug
 * @param  {string} str - The str to slugify
 * @return {string}
 */
const fnSlugify = (str) => {
  if(!str || !str.length || typeof str !== 'string') {
    return '';
  }

  const slugifyOpts = {
    replacement: '-',
    remove: /[*+~.()#'"!:@\^\[\]\&\/]/g,
    lower: true,
    strict: true
  };

  const slugifiedStr = libslugify(str, slugifyOpts);

  const urlSafed = urlSlug(slugifiedStr);

  return urlSafed;
}

export const slugify = memoize(fnSlugify);

export const isStringWithAtleastAChar = (str) => {
  if(!str || !str.length || typeof str !== 'string') {
    return false;
  }

  return str.trim().length > 0;
};

export const safeTrim = (str) => {
  if(isStringWithAtleastAChar(str)) {
    return str.trim();
  }

  return str;
};

export const isPageTitleADate = (title) => {
  let date = parse(title, 'dd MMMM yyyy', new Date());

  return isValidDate(date);
};